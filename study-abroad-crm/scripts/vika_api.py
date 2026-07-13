import json
import os
import re
import uuid
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from email.parser import BytesParser
from email.policy import default
from pathlib import Path
from urllib.parse import parse_qs, urlencode, urlparse
from urllib.request import Request, urlopen

API_BASE = "https://api.vika.cn/fusion/v1"
DATASHEET_ID = os.environ.get("VIKA_DATASHEET_ID", "dstiK28rZa2GsEm7BR")
VIEW_ID = os.environ.get("VIKA_VIEW_ID", "viwtwGOy6pNXn")
TOKEN = os.environ.get("VIKA_TOKEN")
UPLOAD_DIR = Path(__file__).resolve().parent.parent / "storage" / "uploads"
FILE_INDEX = UPLOAD_DIR.parent / "files.json"


def text_value(value):
    if isinstance(value, list):
        return "、".join(str(item) for item in value if item)
    if isinstance(value, dict):
        return str(value.get("text") or value.get("title") or "")
    return "" if value is None else str(value)


def mentor_from_record(record, index, linked_schools=None):
    source = record.get("fields", {})
    linked_schools = linked_schools or {}
    preference = text_value(source.get("选导意向（点击选择）"))
    feedback = text_value(source.get("你的反馈（具体原因）"))
    remark = text_value(source.get("备注"))
    topic = text_value(source.get("导师研究领域")) or remark or "研究方向待补充"
    status = text_value(source.get("状态"))
    qs_rank = text_value(source.get("QS排名"))
    usnews_rank = text_value(source.get("美国USNEWS排名"))
    non_us_id = (source.get("非美国地区学校") or [None])[0]
    us_id = (source.get("美国地区学校") or [None])[0]
    school_data = linked_schools.get(non_us_id) or linked_schools.get(us_id) or {}
    school = text_value(school_data.get("学校")) or text_value(school_data.get("英文")) or text_value(school_data.get("中文名"))
    return {
        "id": index + 1,
        "recordId": record.get("recordId"),
        "name": text_value(source.get("导师")).strip() or "未命名导师",
        "school": school or "院校关联待补全",
        "dept": text_value(source.get("Department")) or "院系信息待补充",
        "ranking": {"qs": qs_rank, "usnews": usnews_rank},
        "topic": topic,
        "fit": 96 if preference == "优先套磁" else 88 if preference == "第二批套磁" else 82,
        "open": status or "招生信息待确认",
        "reason": feedback or remark or "已从 Vika 导师库同步，等待选导老师补充推荐说明。",
        "tags": [value for value in [preference or "未选择", status or "待确认"] if value],
        "source": {
            "preference": preference,
            "feedback": feedback,
            "remark": remark,
            "homepage": text_value(source.get("导师主页")),
            "phdInfo": text_value(source.get("博士申请信息")),
            "otherInfo": text_value(source.get("其他导师信息")),
            "email": text_value(source.get("导师联系方式")),
            "location": text_value(source.get("Location")),
            "updatedAt": record.get("updatedAt"),
        },
        "rawFields": source,
    }


def vika_get(path, params=None, datasheet_id=None):
    token = TOKEN
    if not token:
        raise RuntimeError("VIKA_TOKEN 未配置")
    query = f"?{urlencode(params)}" if params else ""
    request = Request(
        f"{API_BASE}/datasheets/{datasheet_id or DATASHEET_ID}{path}{query}",
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
    )
    with urlopen(request, timeout=30) as response:
        payload = json.loads(response.read())
    if not payload.get("success", False):
        raise RuntimeError(payload.get("message", "Vika API 请求失败"))
    return payload.get("data", {})


class Handler(BaseHTTPRequestHandler):
    @staticmethod
    def form_text(part):
        payload = part.get_payload(decode=True)
        if payload is not None:
            return payload.decode("utf-8", errors="replace").strip()
        return (part.get_content() or "").strip()

    def send_json(self, body, status=200):
        encoded = json.dumps(body, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(encoded)))
        self.end_headers()
        self.wfile.write(encoded)

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/files":
            self.send_json({"files": self.list_files(parse_qs(parsed.query).get("caseId", [None])[0])})
            return
        if parsed.path.startswith("/api/files/") and parsed.path.endswith("/download"):
            file_id = parsed.path.split("/")[3]
            record = next((item for item in self.list_files() if item.get("id") == file_id), None)
            if not record:
                self.send_json({"error": "文件不存在"}, 404)
                return
            file_path = UPLOAD_DIR / record["storedName"]
            if not file_path.exists():
                self.send_json({"error": "文件已丢失"}, 404)
                return
            payload = file_path.read_bytes()
            self.send_response(200)
            self.send_header("Content-Type", record.get("mimeType") or "application/octet-stream")
            self.send_header("Content-Length", str(len(payload)))
            self.send_header("Content-Disposition", f'attachment; filename="{record["name"]}"')
            self.end_headers()
            self.wfile.write(payload)
            return
        if not parsed.path.startswith("/api/vika/"):
            self.send_json({"error": "Not found"}, 404)
            return
        try:
            if parsed.path.endswith("/status"):
                self.send_json({"configured": bool(TOKEN), "datasheetId": DATASHEET_ID, "viewId": VIEW_ID})
                return
            if parsed.path.endswith("/fields"):
                data = vika_get("/fields")
                self.send_json({"fields": data.get("fields", [])})
                return
            if parsed.path.endswith("/sync"):
                field_data = vika_get("/fields")
                record_data = vika_get("/records", {"viewId": VIEW_ID, "pageSize": 200, "maxRecords": 200})
                records = record_data.get("records", [])
                field_map = {item.get("name"): item for item in field_data.get("fields", [])}
                linked_schools = {}
                link_ids = set()
                for record in records:
                    fields = record.get("fields", {})
                    for name in ("非美国地区学校", "美国地区学校"):
                        values = fields.get(name) or []
                        link_ids.update(values if isinstance(values, list) else [values])
                for name in ("非美国地区学校", "美国地区学校"):
                    foreign_id = (field_map.get(name, {}).get("property") or {}).get("foreignDatasheetId")
                    if not foreign_id:
                        continue
                    linked_data = vika_get("/records", {"pageSize": 200, "maxRecords": 200}, datasheet_id=foreign_id)
                    for linked_record in linked_data.get("records", []):
                        if linked_record.get("recordId") in link_ids:
                            linked_schools[linked_record["recordId"]] = linked_record.get("fields", {})
                self.send_json({
                    "syncedAt": datetime.now(timezone.utc).isoformat(),
                    "total": record_data.get("total", len(records)),
                    "fields": [{"id": item.get("id"), "name": item.get("name"), "type": item.get("type"), "property": item.get("property", {})} for item in field_data.get("fields", [])],
                    "mentors": [mentor_from_record(record, index, linked_schools) for index, record in enumerate(records)],
                    "readOnly": True,
                })
                return
            self.send_json({"error": "未知 Vika API 路径"}, 404)
        except Exception as error:
            self.send_json({"error": str(error)}, 502)

    def do_POST(self):
        if self.path != "/api/files":
            self.send_json({"error": "Not found"}, 404)
            return
        try:
            content_type = self.headers.get("Content-Type", "")
            content_length = int(self.headers.get("Content-Length", "0"))
            if content_length > 25 * 1024 * 1024:
                self.send_json({"error": "单个文件不能超过 25MB"}, 413)
                return
            body = self.rfile.read(content_length)
            message = BytesParser(policy=default).parsebytes(
                f"Content-Type: {content_type}\r\nMIME-Version: 1.0\r\n\r\n".encode() + body
            )
            # `iter_attachments()` skips form-data parts in some email policies;
            # walk the multipart payload so browser and curl uploads behave the same.
            file_part = next(
                (
                    part
                    for part in message.walk()
                    if part.get_content_disposition() == "form-data"
                    and part.get_param("name", header="Content-Disposition") == "file"
                ),
                None,
            )
            if file_part is None:
                self.send_json({"error": "缺少 file 文件字段"}, 400)
                return
            original_name = Path(file_part.get_filename() or "未命名文件").name
            extension = Path(original_name).suffix[:12]
            stored_name = f"{uuid.uuid4().hex}{extension}"
            UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
            payload = file_part.get_payload(decode=True) or b""
            (UPLOAD_DIR / stored_name).write_bytes(payload)
            fields = {}
            for part in message.walk():
                if part.get_content_disposition() != "form-data":
                    continue
                name = part.get_param("name", header="Content-Disposition")
                if name and name != "file":
                    fields[name] = self.form_text(part)
            record = {
                "id": uuid.uuid4().hex,
                "name": original_name,
                "storedName": stored_name,
                "size": len(payload),
                "mimeType": file_part.get_content_type(),
                "caseId": fields.get("caseId", "default"),
                "uploadedBy": fields.get("uploadedBy", "未标注上传人"),
                "uploadedAt": datetime.now(timezone.utc).isoformat(),
            }
            all_files = self.list_files()
            all_files.insert(0, record)
            FILE_INDEX.parent.mkdir(parents=True, exist_ok=True)
            FILE_INDEX.write_text(json.dumps(all_files, ensure_ascii=False, indent=2), encoding="utf-8")
            self.send_json({"file": {key: value for key, value in record.items() if key != "storedName"}}, 201)
        except Exception as error:
            self.send_json({"error": str(error)}, 400)

    @staticmethod
    def list_files(case_id=None):
        if not FILE_INDEX.exists():
            return []
        try:
            records = json.loads(FILE_INDEX.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            records = []
        return [item for item in records if not case_id or item.get("caseId") == case_id]

    def log_message(self, format, *args):
        return


if __name__ == "__main__":
    server = ThreadingHTTPServer(("127.0.0.1", int(os.environ.get("VIKA_API_PORT", "4175"))), Handler)
    print("Vika API proxy listening on http://127.0.0.1:4175")
    server.serve_forever()
