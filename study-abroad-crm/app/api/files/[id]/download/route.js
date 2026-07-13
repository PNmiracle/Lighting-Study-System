import { downloadFile } from '../../../../../src/server/files.js';

export async function GET(_request, { params }) {
  try {
    const file = await downloadFile(params.id);
    if (!file) return Response.json({ error: '文件不存在' }, { status: 404 });
    const headers = new Headers();
    headers.set('Content-Type', file.result.mime_type || file.object.httpMetadata?.contentType || 'application/octet-stream');
    headers.set('Content-Disposition', `attachment; filename="${file.result.name.replace(/["]+/g, '')}"`);
    if (file.object.size != null) headers.set('Content-Length', String(file.object.size));
    return new Response(file.object.body, { headers });
  } catch (error) {
    return Response.json({ error: error.message || '文件下载失败' }, { status: 503 });
  }
}
