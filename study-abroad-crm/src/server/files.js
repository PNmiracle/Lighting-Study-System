import { bindings } from './runtime.js';

const MAX_FILE_SIZE = 25 * 1024 * 1024;
let schemaReady;

async function database() {
  const env = await bindings();
  if (!env.DB) throw new Error('D1 数据库未绑定');
  return env.DB;
}

async function bucket() {
  const env = await bindings();
  if (!env.FILES) throw new Error('R2 文件存储未绑定');
  return env.FILES;
}

async function ensureSchema() {
  if (!schemaReady) {
    schemaReady = database().then(db => db.prepare(`
      CREATE TABLE IF NOT EXISTS files (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        object_key TEXT NOT NULL UNIQUE,
        size INTEGER NOT NULL,
        mime_type TEXT NOT NULL,
        case_id TEXT NOT NULL,
        uploaded_by TEXT NOT NULL,
        uploaded_at TEXT NOT NULL
      )
    `).run());
  }
  await schemaReady;
}

function publicFile(row) {
  return {
    id: row.id,
    name: row.name,
    size: row.size,
    mimeType: row.mime_type,
    caseId: row.case_id,
    uploadedBy: row.uploaded_by,
    uploadedAt: row.uploaded_at
  };
}

export async function listFiles(caseId) {
  await ensureSchema();
  const db = await database();
  const query = caseId
    ? db.prepare('SELECT id, name, size, mime_type, case_id, uploaded_by, uploaded_at FROM files WHERE case_id = ? ORDER BY uploaded_at DESC').bind(caseId)
    : db.prepare('SELECT id, name, size, mime_type, case_id, uploaded_by, uploaded_at FROM files ORDER BY uploaded_at DESC');
  const result = await query.all();
  return (result.results || []).map(publicFile);
}

export async function uploadFile(request) {
  await ensureSchema();
  const db = await database();
  const files = await bucket();
  const formData = await request.formData();
  const file = formData.get('file');
  if (!file || typeof file.arrayBuffer !== 'function') throw new Error('缺少 file 文件字段');
  if (file.size > MAX_FILE_SIZE) {
    const error = new Error('单个文件不能超过 25MB');
    error.status = 413;
    throw error;
  }
  const id = crypto.randomUUID();
  const name = String(file.name || '未命名文件').split('/').pop().slice(0, 180) || '未命名文件';
  const objectKey = `files/${id}/${name}`;
  const caseId = String(formData.get('caseId') || 'default').slice(0, 120);
  const uploadedBy = String(formData.get('uploadedBy') || '未标注上传人').slice(0, 120);
  const uploadedAt = new Date().toISOString();
  await files.put(objectKey, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type || 'application/octet-stream' }
  });
  const row = { id, name, object_key: objectKey, size: file.size, mime_type: file.type || 'application/octet-stream', case_id: caseId, uploaded_by: uploadedBy, uploaded_at: uploadedAt };
  await db.prepare('INSERT INTO files (id, name, object_key, size, mime_type, case_id, uploaded_by, uploaded_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(row.id, row.name, row.object_key, row.size, row.mime_type, row.case_id, row.uploaded_by, row.uploaded_at).run();
  return publicFile(row);
}

export async function downloadFile(id) {
  await ensureSchema();
  const db = await database();
  const files = await bucket();
  const result = await db.prepare('SELECT id, name, object_key, mime_type FROM files WHERE id = ?').bind(id).first();
  if (!result) return null;
  const object = await files.get(result.object_key);
  if (!object) return null;
  return { result, object };
}
