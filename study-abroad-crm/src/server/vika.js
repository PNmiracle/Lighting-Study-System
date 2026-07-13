import { envValue } from './runtime.js';

const API_BASE = 'https://api.vika.cn/fusion/v1';
const DATASHEET_ID = envValue('VIKA_DATASHEET_ID', 'dstiK28rZa2GsEm7BR');
const VIEW_ID = envValue('VIKA_VIEW_ID', 'viwtwGOy6pNXn');

function textValue(value) {
  if (Array.isArray(value)) return value.filter(Boolean).map(item => textValue(item)).join('、');
  if (value && typeof value === 'object') return String(value.text || value.title || '');
  return value == null ? '' : String(value);
}

function toMentor(record, index, linkedSchools = {}) {
  const source = record.fields || {};
  const preference = textValue(source['选导意向（点击选择）']);
  const feedback = textValue(source['你的反馈（具体原因）']);
  const remark = textValue(source['备注']);
  const topic = textValue(source['导师研究领域']) || remark || '研究方向待补充';
  const status = textValue(source['状态']);
  const qs = textValue(source['QS排名']);
  const usnews = textValue(source['美国USNEWS排名']);
  const linkedNonUs = Array.isArray(source['非美国地区学校']) ? source['非美国地区学校'][0] : null;
  const linkedUs = Array.isArray(source['美国地区学校']) ? source['美国地区学校'][0] : null;
  const schoolData = linkedSchools[linkedNonUs] || linkedSchools[linkedUs] || {};
  const school = textValue(schoolData['学校']) || textValue(schoolData['英文']) || textValue(schoolData['中文名']);
  return {
    id: index + 1,
    recordId: record.recordId,
    name: textValue(source['导师']).trim() || '未命名导师',
    school: school || '院校关联待补全',
    dept: textValue(source['Department']) || '院系信息待补充',
    ranking: { qs, usnews },
    topic,
    fit: preference === '优先套磁' ? 96 : preference === '第二批套磁' ? 88 : 82,
    open: status || '招生信息待确认',
    reason: feedback || remark || '已从 Vika 导师库同步，等待选导老师补充推荐说明。',
    tags: [preference || '未选择', status || '待确认'].filter(Boolean),
    source: {
      preference,
      feedback,
      remark,
      homepage: textValue(source['导师主页']),
      phdInfo: textValue(source['博士申请信息']),
      otherInfo: textValue(source['其他导师信息']),
      email: textValue(source['导师联系方式']),
      location: textValue(source['Location']),
      updatedAt: record.updatedAt
    },
    rawFields: source
  };
}

async function vikaGet(path, params, datasheetId = DATASHEET_ID) {
  const token = envValue('VIKA_TOKEN');
  if (!token) throw new Error('VIKA_TOKEN 未配置');
  const query = params ? `?${new URLSearchParams(params).toString()}` : '';
  const response = await fetch(`${API_BASE}/datasheets/${datasheetId}${path}${query}`, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
  });
  const body = await response.json();
  if (!response.ok || body.success === false) throw new Error(body.message || `Vika API ${response.status}`);
  return body.data || {};
}

export async function syncVika() {
  const [fieldData, recordData] = await Promise.all([
    vikaGet('/fields'),
    vikaGet('/records', { viewId: VIEW_ID, pageSize: '200', maxRecords: '200' })
  ]);
  const records = recordData.records || [];
  const fieldMap = Object.fromEntries((fieldData.fields || []).map(item => [item.name, item]));
  const linkIds = new Set();
  for (const record of records) {
    for (const name of ['非美国地区学校', '美国地区学校']) {
      const values = record.fields?.[name] || [];
      for (const value of Array.isArray(values) ? values : [values]) if (value) linkIds.add(value);
    }
  }
  const linkedSchools = {};
  for (const name of ['非美国地区学校', '美国地区学校']) {
    const foreignId = fieldMap[name]?.property?.foreignDatasheetId;
    if (!foreignId) continue;
    const linkedData = await vikaGet('/records', { pageSize: '200', maxRecords: '200' }, foreignId);
    for (const record of linkedData.records || []) {
      if (linkIds.has(record.recordId)) linkedSchools[record.recordId] = record.fields || {};
    }
  }
  return {
    syncedAt: new Date().toISOString(),
    total: recordData.total || records.length,
    fields: (fieldData.fields || []).map(item => ({ id: item.id, name: item.name, type: item.type, property: item.property || {} })),
    mentors: records.map((record, index) => toMentor(record, index, linkedSchools)),
    readOnly: true
  };
}

export async function getVikaFields() {
  const data = await vikaGet('/fields');
  return { fields: data.fields || [] };
}

export function getVikaStatus() {
  return {
    configured: Boolean(envValue('VIKA_TOKEN')),
    datasheetId: DATASHEET_ID,
    viewId: VIEW_ID
  };
}
