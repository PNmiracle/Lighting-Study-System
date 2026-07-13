import { getVikaFields } from '../../../../src/server/vika.js';

export async function GET() {
  try {
    return Response.json(await getVikaFields());
  } catch (error) {
    return Response.json({ error: error.message || 'Vika 字段读取失败' }, { status: 502 });
  }
}
