import { syncVika } from '../../../../src/server/vika.js';

export async function GET() {
  try {
    return Response.json(await syncVika());
  } catch (error) {
    return Response.json({ error: error.message || 'Vika 同步失败' }, { status: 502 });
  }
}
