import { createCrmRecord, deleteCrmRecord, getCrmData, updateCrmRecord } from '../../../src/server/crm-data.js';

const noStore = { 'Cache-Control': 'no-store' };

export async function GET() {
  try {
    return Response.json({ data: await getCrmData() }, { headers: noStore });
  } catch (error) {
    return Response.json({ error: error.message || 'CRM 数据读取失败' }, { status: error.status || 503 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const record = await createCrmRecord(body.resource, body.record, body.actor);
    return Response.json({ resource: body.resource, record }, { status: 201, headers: noStore });
  } catch (error) {
    return Response.json({ error: error.message || 'CRM 记录创建失败' }, { status: error.status || 503 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const record = await updateCrmRecord(body.resource, body.id, body.patch, body.actor);
    return Response.json({ resource: body.resource, record }, { headers: noStore });
  } catch (error) {
    return Response.json({ error: error.message || 'CRM 记录更新失败' }, { status: error.status || 503 });
  }
}

export async function DELETE(request) {
  try {
    const body = await request.json();
    await deleteCrmRecord(body.resource, body.id);
    return Response.json({ resource: body.resource, id: body.id, deleted: true }, { headers: noStore });
  } catch (error) {
    return Response.json({ error: error.message || 'CRM 记录删除失败' }, { status: error.status || 503 });
  }
}
