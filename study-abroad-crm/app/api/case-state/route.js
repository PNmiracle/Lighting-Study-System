import { getCaseState, updateCaseState } from '../../../src/server/case-state.js';

export async function GET(request) {
  const caseId = new URL(request.url).searchParams.get('caseId');
  if (!caseId) return Response.json({ error: '缺少 caseId' }, { status: 400 });

  try {
    return Response.json({ caseId, state: await getCaseState(caseId) }, {
      headers: { 'Cache-Control': 'no-store' }
    });
  } catch (error) {
    return Response.json({ error: error.message || '服务项目状态读取失败' }, { status: 503 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const caseId = String(body.caseId || '').trim();
    if (!caseId) return Response.json({ error: '缺少 caseId' }, { status: 400 });
    const state = await updateCaseState(caseId, body.patch || {}, body.actor || '未标注');
    return Response.json({ caseId, state }, {
      headers: { 'Cache-Control': 'no-store' }
    });
  } catch (error) {
    return Response.json({ error: error.message || '服务项目状态保存失败' }, { status: 503 });
  }
}
