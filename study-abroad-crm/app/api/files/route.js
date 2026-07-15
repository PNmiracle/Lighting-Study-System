import { deleteFile, listFiles, uploadFile } from '../../../src/server/files.js';

export async function GET(request) {
  try {
    const caseId = new URL(request.url).searchParams.get('caseId');
    return Response.json({ files: await listFiles(caseId) });
  } catch (error) {
    return Response.json({ error: error.message || '文件列表读取失败' }, { status: 503 });
  }
}

export async function POST(request) {
  try {
    return Response.json({ file: await uploadFile(request) }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message || '文件上传失败' }, { status: error.status || 503 });
  }
}

export async function DELETE(request) {
  try {
    const body = await request.json();
    const id = String(body.id || '').trim().slice(0, 120);
    if (!id) return Response.json({ error: '缺少文件 id' }, { status: 400 });
    if (!await deleteFile(id)) return Response.json({ error: '文件不存在' }, { status: 404 });
    return Response.json({ id, deleted: true });
  } catch (error) {
    return Response.json({ error: error.message || '文件删除失败' }, { status: error.status || 503 });
  }
}
