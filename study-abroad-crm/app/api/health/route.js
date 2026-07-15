import { getCrmHealth } from '../../../src/server/crm-data.js';

export async function GET() {
  try {
    return Response.json(await getCrmHealth(), {
      headers: { 'Cache-Control': 'no-store' }
    });
  } catch (error) {
    return Response.json({
      status: 'error',
      error: error.message || '服务健康检查失败',
      checkedAt: new Date().toISOString()
    }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}
