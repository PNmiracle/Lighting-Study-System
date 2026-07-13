import { listFiles, uploadFile } from '../../../src/server/files.js';

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
