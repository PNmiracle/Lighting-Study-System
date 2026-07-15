import { syncVika } from '../../../../src/server/vika.js';

export async function GET(request) {
  try {
    const params = new URL(request.url).searchParams;
    const force = params.get('force') === '1';
    return Response.json(await syncVika({ force, studentId: params.get('studentId'), source: params.get('source') }));
  } catch (error) {
    return Response.json({ error: error.message || 'Vika 同步失败' }, { status: 502 });
  }
}
