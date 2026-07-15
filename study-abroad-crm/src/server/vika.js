import { runtimeValue } from './runtime.js';

const API_BASE = 'https://api.vika.cn/fusion/v1';
const DEFAULT_DATASHEET_ID = 'dstiK28rZa2GsEm7BR';
const DEFAULT_VIEW_ID = 'viwtwGOy6pNXn';
const PUBLIC_SHARE_ID = 'shrTzS4oK9drnKBRsf0r8';
const PUBLIC_DATASHEET_ID = 'dstZnUUzHafFYQXoZT';
const PUBLIC_VIEW_ID = 'viwtwGOy6pNXn';
const PUBLIC_SHARE_URL = `https://vika.cn/share/${PUBLIC_SHARE_ID}/${PUBLIC_DATASHEET_ID}/${PUBLIC_VIEW_ID}`;
const PUBLIC_DATA_PACK_URL = `https://vika.cn/nest/v1/shares/${PUBLIC_SHARE_ID}/datasheets/${PUBLIC_DATASHEET_ID}/dataPack`;
const CACHE_TTL_MS = 60 * 1000;
const syncCache = new Map();
const syncInFlight = new Map();

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
  const school = textValue(source['学校名字']) || textValue(schoolData['学校']) || textValue(schoolData['英文']) || textValue(schoolData['中文名']);
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

function snapshotFieldValue(value, field, linkedRecords = {}) {
  if (value == null) return '';
  const options = field?.property?.options || [];
  const optionMap = new Map(options.map(option => [option.id, option.name]));
  if (field?.type === 3) {
    const values = Array.isArray(value) ? value : [value];
    return values.map(item => optionMap.get(item) || textValue(item)).filter(Boolean).join('、');
  }
  if (field?.type === 26) {
    const values = Array.isArray(value) ? value : [value];
    return values.map(recordId => linkedRecords[recordId] || textValue(recordId)).filter(Boolean).join('、');
  }
  return textValue(value);
}

function foreignRecordDetails(foreignDatasheetMap = {}) {
  const details = {};
  for (const foreign of Object.values(foreignDatasheetMap)) {
    const snapshot = foreign?.snapshot || {};
    const fieldMap = snapshot.meta?.fieldMap || {};
    for (const record of Object.values(snapshot.recordMap || {})) {
      const values = {};
      for (const [fieldId, value] of Object.entries(record.data || {})) {
        const field = fieldMap[fieldId];
        if (field) values[field.name] = snapshotFieldValue(value, field);
      }
      details[record.id] = {
        name: values['学校全称'] || values['学校中文名'] || values['学校英文缩写'] || Object.values(values).find(Boolean) || record.id,
        fields: values
      };
    }
  }
  return details;
}

async function syncPublicShare() {
  const response = await fetch(PUBLIC_DATA_PACK_URL, { headers: { Accept: 'application/json' } });
  const body = await response.json();
  if (!response.ok || body.success === false) throw new Error(body.message || `Vika 公开表 ${response.status}`);
  const payload = body.data || {};
  const snapshot = payload.snapshot || {};
  const fieldMap = snapshot.meta?.fieldMap || {};
  const fields = Object.entries(fieldMap).map(([id, field]) => ({ id, name: field.name, type: field.type, property: field.property || {} }));
  const linkedRecords = foreignRecordDetails(payload.foreignDatasheetMap);
  const linkedRecordNames = Object.fromEntries(Object.entries(linkedRecords).map(([recordId, detail]) => [recordId, detail.name]));
  const view = (snapshot.meta?.views || []).find(item => item.id === PUBLIC_VIEW_ID);
  const recordMap = snapshot.recordMap || {};
  const recordIds = view?.rows?.map(row => row.recordId).filter(recordId => recordMap[recordId]) || Object.keys(recordMap);
  const records = recordIds.map(recordId => {
    const source = recordMap[recordId] || {};
    const recordFields = {};
    for (const [fieldId, value] of Object.entries(source.data || {})) {
      const field = fieldMap[fieldId];
      if (field) recordFields[field.name] = snapshotFieldValue(value, field, linkedRecordNames);
    }
    const schoolField = Object.entries(fieldMap).find(([, field]) => field.name === '学校名字')?.[0];
    const linkedSchoolId = schoolField ? source.data?.[schoolField]?.[0] : '';
    const schoolFields = linkedRecords[linkedSchoolId]?.fields || {};
    if (!recordFields['Location']) recordFields['Location'] = schoolFields['国家/地区'] || schoolFields['所在大洲'] || '';
    if (!recordFields['QS排名']) recordFields['QS排名'] = schoolFields['2027年QS排名'] || schoolFields['2026年QS排名'] || schoolFields['2025年QS排名'] || '';
    if (!recordFields['美国USNEWS排名']) recordFields['美国USNEWS排名'] = schoolFields['2025年USNews排名'] || '';
    return {
      recordId,
      fields: recordFields,
      updatedAt: source.updatedAt ? new Date(source.updatedAt).toISOString() : ''
    };
  });
  return {
    syncedAt: new Date().toISOString(),
    total: records.length,
    fields,
    mentors: records.map((record, index) => toMentor(record, index)),
    readOnly: true,
    source: 'public-share',
    sourceName: payload.datasheet?.name || '俞哲轩-Supervisor List',
    sourceUrl: PUBLIC_SHARE_URL
  };
}

async function vikaGet(path, params, datasheetId) {
  const [token, configuredDatasheetId] = await Promise.all([
    runtimeValue('VIKA_TOKEN'),
    runtimeValue('VIKA_DATASHEET_ID', DEFAULT_DATASHEET_ID)
  ]);
  if (!token) throw new Error('VIKA_TOKEN 未配置');
  const targetDatasheetId = datasheetId || configuredDatasheetId;
  const query = params ? `?${new URLSearchParams(params).toString()}` : '';
  const response = await fetch(`${API_BASE}/datasheets/${targetDatasheetId}${path}${query}`, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
  });
  const body = await response.json();
  if (!response.ok || body.success === false) throw new Error(body.message || `Vika API ${response.status}`);
  return body.data || {};
}

export async function syncVika({ force = false, studentId, source } = {}) {
  const publicSource = source === 'yuzhexuan' || String(studentId || '') === '16';
  const cacheKey = publicSource ? 'yuzhexuan' : 'default';
  const now = Date.now();
  const cached = syncCache.get(cacheKey);
  if (!force && cached && now - cached.createdAt < CACHE_TTL_MS) return cached.data;
  if (syncInFlight.has(cacheKey)) return syncInFlight.get(cacheKey);

  const request = (async () => {
    if (publicSource) return syncPublicShare();
    const viewId = await runtimeValue('VIKA_VIEW_ID', DEFAULT_VIEW_ID);
    const [fieldData, recordData] = await Promise.all([
      vikaGet('/fields'),
      vikaGet('/records', { viewId, pageSize: '200', maxRecords: '200' })
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
    const linkedDatasheets = [...new Set(['非美国地区学校', '美国地区学校']
      .map(name => fieldMap[name]?.property?.foreignDatasheetId)
      .filter(Boolean))];
    const linkedResults = await Promise.all(linkedDatasheets.map(datasheetId => vikaGet('/records', { pageSize: '200', maxRecords: '200' }, datasheetId)));
    linkedResults.forEach(linkedData => {
      for (const record of linkedData.records || []) {
        if (linkIds.has(record.recordId)) linkedSchools[record.recordId] = record.fields || {};
      }
    });
    const data = {
      syncedAt: new Date().toISOString(),
      total: recordData.total || records.length,
      fields: (fieldData.fields || []).map(item => ({ id: item.id, name: item.name, type: item.type, property: item.property || {} })),
      mentors: records.map((record, index) => toMentor(record, index, linkedSchools)),
      readOnly: true
    };
    syncCache.set(cacheKey, { createdAt: Date.now(), data });
    return data;
  })();
  syncInFlight.set(cacheKey, request);

  try {
    const data = await request;
    syncCache.set(cacheKey, { createdAt: Date.now(), data });
    return data;
  } finally {
    syncInFlight.delete(cacheKey);
  }
}

export async function getVikaFields() {
  const data = await vikaGet('/fields');
  return { fields: data.fields || [] };
}

export async function getVikaStatus() {
  const [token, datasheetId, viewId] = await Promise.all([
    runtimeValue('VIKA_TOKEN'),
    runtimeValue('VIKA_DATASHEET_ID', DEFAULT_DATASHEET_ID),
    runtimeValue('VIKA_VIEW_ID', DEFAULT_VIEW_ID)
  ]);
  return {
    configured: Boolean(token),
    datasheetId,
    viewId
  };
}
