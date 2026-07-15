import { promises as fs } from 'node:fs';
import path from 'node:path';
import { additionalApplications, additionalStudents, additionalTasks, schoolCatalog, serviceItems, staffDirectory } from '../demo-data.js';
import { bindings } from './runtime.js';

const LOCAL_STORE = path.join(process.cwd(), 'storage', 'crm-data.json');
const LOCAL_SEED_VERSION = path.join(process.cwd(), 'storage', 'crm-seed-version');
const RESOURCES = ['students', 'applications', 'tasks', 'staff', 'schools', 'serviceItems'];
const CRM_SEED_VERSION = 5;

const DEFAULT_DATA = {
  students: [
    {id:1,name:'林知夏',initial:'林',target:'英国 · AI / HCI 博士',service:'博士申请全流程',stage:'选导中',progress:38,count:6,manager:'张晓彤',comms:'李卓',select:'叶雯',writing:'王老师',visa:'待分配',due:'今日 16:30',payment:'已付 50%',invite:'LINXIA2026'},
    {id:2,name:'周子墨',initial:'周',target:'美国 · 计算机视觉博士',service:'博士申请全流程',stage:'学生确认',progress:52,count:4,manager:'叶雯',comms:'李卓',select:'叶雯',writing:'王老师',visa:'待分配',due:'明日 10:00',payment:'已付清',invite:'ZIMO2026'},
    {id:3,name:'陈一诺',initial:'陈',target:'澳洲 · 商科研究型硕士',service:'研究型硕士申请',stage:'等待套磁',progress:66,count:8,manager:'李卓',comms:'张晓彤',select:'李卓',writing:'赵老师',visa:'签证准备',due:'周五 15:00',payment:'已付 80%',invite:'YINUO2026'},
    {id:4,name:'王雨桐',initial:'王',target:'英国 · 市场营销硕士',service:'硕士申请全流程',stage:'文书初稿',progress:72,count:3,manager:'张晓彤',comms:'张晓彤',select:'未分配',writing:'赵老师',visa:'待分配',due:'周五 18:00',payment:'已付清',invite:'YUTONG2026'},
    {id:5,name:'徐子涵',initial:'徐',target:'英国 · 金融硕士',service:'硕士申请全流程',stage:'录取确认',progress:89,count:2,manager:'李卓',comms:'李卓',select:'李卓',writing:'王老师',visa:'签证材料',due:'下周一',payment:'已付清',invite:'ZIHAN2026'},
    ...additionalStudents,
    {id:16,name:'俞哲轩',initial:'俞',target:'全球 · 青少年心理健康博士',service:'博士申请全流程',stage:'导师初筛',progress:28,count:121,manager:'张晓彤',comms:'李卓',select:'叶雯',writing:'王老师',visa:'待分配',due:'本周完成选导定稿',payment:'待确认',invite:'YUZHEXUAN2027',mentorSource:'yuzhexuan',mentorShareUrl:'https://vika.cn/share/shrTzS4oK9drnKBRsf0r8/dstZnUUzHafFYQXoZT/viwtwGOy6pNXn'}
  ],
  applications: [
    {id:1,stage:'prep',name:'李想',school:'多伦多大学',program:'MSc Management',intake:'2025年秋季',owner:'张晓彤',progress:60,email:'lixiang@email.com',phone:'138****6621',priority:true},
    {id:2,stage:'prep',name:'王雨桐',school:'曼彻斯特大学',program:'MSc Marketing',intake:'2025年秋季',owner:'李卓',progress:75},
    {id:3,stage:'prep',name:'陈子涵',school:'悉尼大学',program:'Master of IT',intake:'2026年春季',owner:'叶雯',progress:40},
    {id:4,stage:'prep',name:'刘昊然',school:'新南威尔士大学',program:'MSc Engineering',intake:'2025年秋季',owner:'张晓彤',progress:55},
    {id:5,stage:'submitted',name:'赵晨曦',school:'香港大学',program:'MSc Economics',intake:'2025年秋季',owner:'叶雯',progress:100},
    {id:6,stage:'submitted',name:'孙一航',school:'伦敦国王学院',program:'MSc Data Science',intake:'2025年秋季',owner:'张晓彤',progress:100},
    {id:7,stage:'submitted',name:'周子墨',school:'墨尔本大学',program:'Master of IT',intake:'2026年春季',owner:'李卓',progress:100},
    {id:8,stage:'review',name:'胡景行',school:'帝国理工学院',program:'MSc EEE',intake:'2025年秋季',owner:'李卓',progress:100},
    {id:9,stage:'review',name:'林心如',school:'卡内基梅隆大学',program:'MSc CS',intake:'2025年秋季',owner:'叶雯',progress:100},
    {id:10,stage:'review',name:'高子轩',school:'加州大学圣地亚哥分校',program:'MSc CS',intake:'2025年秋季',owner:'张晓彤',progress:100},
    {id:11,stage:'offer',name:'徐子涵',school:'伦敦政治经济学院',program:'MSc Finance',intake:'2025年秋季',owner:'李卓',progress:100},
    {id:12,stage:'offer',name:'黄天宇',school:'新加坡国立大学',program:'MSc Computer Eng',intake:'2025年秋季',owner:'张晓彤',progress:100},
    {id:13,stage:'offer',name:'蒋文博',school:'不列颠哥伦比亚大学',program:'MSc Vantage',intake:'2026年春季',owner:'叶雯',progress:100},
    ...additionalApplications
  ],
  tasks: [
    {id:1,time:'09:30',title:'跟进推荐信提交',detail:'孙一航 · KCL MSc Data Science',level:'高',done:false},
    {id:2,time:'10:00',title:'签证材料检查',detail:'刘昊然 · UNSW MSc Engineering',level:'中',done:false},
    {id:3,time:'11:00',title:'更新申请状态',detail:'陈子涵 · 悉尼大学 Master of IT',level:'中',done:false},
    {id:4,time:'14:00',title:'电话沟通',detail:'李想 · 多伦多大学',level:'中',done:false},
    {id:5,time:'15:30',title:'文书初稿反馈',detail:'王雨桐 · 曼彻斯特大学',level:'中',done:false},
    {id:6,time:'16:30',title:'录取确认跟进',detail:'徐子涵 · LSE MSc Finance',level:'高',done:false},
    ...additionalTasks
  ],
  staff: staffDirectory.map(member => ({ id: member.name, ...member })),
  schools: schoolCatalog,
  serviceItems
};

let schemaReady;
let localMutation = Promise.resolve();

async function database() {
  const env = await bindings();
  return env.DB || null;
}

async function ensureSchema(db) {
  if (!schemaReady) {
    schemaReady = (async () => {
      await db.prepare(`
        CREATE TABLE IF NOT EXISTS crm_records (
          resource TEXT NOT NULL,
          record_id TEXT NOT NULL,
          data_json TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          updated_by TEXT NOT NULL,
          PRIMARY KEY (resource, record_id)
        )
      `).run();
      await db.prepare(`
        CREATE TABLE IF NOT EXISTS crm_seed_meta (
          seed_name TEXT PRIMARY KEY,
          version INTEGER NOT NULL,
          applied_at TEXT NOT NULL
        )
      `).run();
    })();
  }
  await schemaReady;
}

function cloneDefaults() {
  return structuredClone(DEFAULT_DATA);
}

function appError(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function normalizeResource(resource) {
  const value = String(resource || '').trim();
  if (!RESOURCES.includes(value)) throw appError('不支持的数据类型');
  return value;
}

function text(value, max = 180, fallback = '') {
  const normalized = value == null ? fallback : String(value).trim();
  return normalized.slice(0, max);
}

function number(value, fallback = 0, min = 0, max = 100) {
  const normalized = Number(value);
  return Number.isFinite(normalized) ? Math.min(max, Math.max(min, normalized)) : fallback;
}

function textArray(value, maxItems = 20, itemMax = 120) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, maxItems).map(item => text(item, itemMax)).filter(Boolean);
}

function recordId(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const normalized = text(value, 120);
  if (!normalized) throw appError('记录缺少 id');
  return normalized;
}

function sanitizeStudent(input, current = {}) {
  const value = { ...current, ...input };
  const name = text(value.name, 80);
  if (!name) throw appError('学生姓名不能为空');
  return {
    id: recordId(value.id), name, initial: text(value.initial, 4, name.slice(0, 1)) || name.slice(0, 1),
    target: text(value.target, 240, '待确认'), service: text(value.service, 120, '留学申请全流程'),
    stage: text(value.stage, 60, '选导中'), progress: number(value.progress, 0), count: number(value.count, 0, 0, 999),
    manager: text(value.manager, 80, '待分配'), comms: text(value.comms, 80, '待分配'), select: text(value.select, 80, '待分配'),
    writing: text(value.writing, 80, '待分配'), visa: text(value.visa, 80, '待分配'), due: text(value.due, 100, '待确认'),
    payment: text(value.payment, 100, '待收款'), invite: text(value.invite, 40),
    mentorSource: text(value.mentorSource, 40), mentorShareUrl: text(value.mentorShareUrl, 500)
  };
}

function sanitizeApplication(input, current = {}) {
  const value = { ...current, ...input };
  const name = text(value.name, 80);
  if (!name) throw appError('申请学生不能为空');
  return {
    id: recordId(value.id), stage: text(value.stage, 40, 'prep'), name, school: text(value.school, 180, '待确认院校'),
    program: text(value.program, 180, '待确认专业'), intake: text(value.intake, 80, '待确认入学季'), owner: text(value.owner, 80, '待分配'),
    progress: number(value.progress, 0), email: text(value.email, 180), phone: text(value.phone, 80), priority: Boolean(value.priority)
  };
}

function sanitizeTask(input, current = {}) {
  const value = { ...current, ...input };
  const title = text(value.title, 180);
  if (!title) throw appError('任务标题不能为空');
  const dueAt = text(value.dueAt, 40);
  if (dueAt && !Number.isFinite(Date.parse(dueAt))) throw appError('任务截止时间格式无效');
  return {
    id: recordId(value.id), time: text(value.time, 40, '待安排'), title, detail: text(value.detail, 240),
    level: ['高', '中', '低'].includes(value.level) ? value.level : '中', done: Boolean(value.done),
    owner: text(value.owner, 80, '张晓彤'), dueAt
  };
}

function sanitizeStaff(input, current = {}) {
  const value = { ...current, ...input };
  const name = text(value.name, 80);
  if (!name) throw appError('老师姓名不能为空');
  return {
    id: recordId(value.id || name), name,
    role: text(value.role, 100, '项目老师'), specialty: text(value.specialty, 180, '综合申请服务')
  };
}

function sanitizeSchool(input, current = {}) {
  const value = { ...current, ...input };
  const name = text(value.name, 120);
  if (!name) throw appError('院校名称不能为空');
  return {
    id: recordId(value.id || name), name, en: text(value.en, 180), country: text(value.country, 80, '待确认'),
    city: text(value.city, 80, '待确认'), ranking: number(value.ranking, 999, 1, 999), degrees: textArray(value.degrees, 8, 40),
    programs: textArray(value.programs, 20, 120), deadline: text(value.deadline, 40, '待确认'), intake: text(value.intake, 80, '待确认'),
    tuition: text(value.tuition, 80, '待确认'), tags: textArray(value.tags, 12, 60), website: text(value.website, 300)
  };
}

function sanitizeServiceItem(input, current = {}) {
  const value = { ...current, ...input };
  const student = text(value.student, 80);
  const subject = text(value.subject, 180);
  if (!student) throw appError('服务事项缺少学生');
  if (!subject) throw appError('服务事项内容不能为空');
  return {
    id: recordId(value.id), module: ['文书', '签证', '收款'].includes(value.module) ? value.module : '文书',
    student, subject, owner: text(value.owner, 80, '待分配'), status: text(value.status, 80, '待处理'),
    due: text(value.due, 80, '待确认'), priority: ['高', '中', '低'].includes(value.priority) ? value.priority : '中',
    amount: text(value.amount, 100)
  };
}

function sanitizeRecord(resource, input, current) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw appError('记录格式无效');
  if (resource === 'students') return sanitizeStudent(input, current);
  if (resource === 'applications') return sanitizeApplication(input, current);
  if (resource === 'tasks') return sanitizeTask(input, current);
  if (resource === 'staff') return sanitizeStaff(input, current);
  if (resource === 'schools') return sanitizeSchool(input, current);
  return sanitizeServiceItem(input, current);
}

async function readLocalStore() {
  try {
    const data = JSON.parse(await fs.readFile(LOCAL_STORE, 'utf8'));
    return Object.fromEntries(RESOURCES.map(resource => [resource, Array.isArray(data[resource]) ? data[resource] : []]));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    return cloneDefaults();
  }
}

async function writeLocalStore(store) {
  await fs.mkdir(path.dirname(LOCAL_STORE), { recursive: true });
  const temporary = `${LOCAL_STORE}.tmp`;
  await fs.writeFile(temporary, JSON.stringify(store, null, 2), 'utf8');
  await fs.rename(temporary, LOCAL_STORE);
}

function mutateLocal(operation) {
  const run = localMutation.then(operation, operation);
  localMutation = run.then(() => undefined, () => undefined);
  return run;
}

async function seedDatabase(db) {
  const seed = await db.prepare('SELECT version FROM crm_seed_meta WHERE seed_name = ?').bind('demo-data').first();
  if (Number(seed?.version || 0) >= CRM_SEED_VERSION) return;
  const updatedAt = new Date().toISOString();
  for (const resource of RESOURCES) {
    for (const record of DEFAULT_DATA[resource]) {
      await db.prepare('INSERT OR IGNORE INTO crm_records (resource, record_id, data_json, updated_at, updated_by) VALUES (?, ?, ?, ?, ?)')
        .bind(resource, String(record.id), JSON.stringify(record), updatedAt, '系统初始化').run();
    }
  }
  await db.prepare('INSERT OR REPLACE INTO crm_seed_meta (seed_name, version, applied_at) VALUES (?, ?, ?)')
    .bind('demo-data', CRM_SEED_VERSION, updatedAt).run();
}

async function seedLocalStore(store) {
  let version = 0;
  try { version = Number(await fs.readFile(LOCAL_SEED_VERSION, 'utf8')) || 0; } catch (error) { if (error.code !== 'ENOENT') throw error; }
  if (version >= CRM_SEED_VERSION) return store;
  for (const resource of RESOURCES) {
    const existing = new Set(store[resource].map(record => String(record.id)));
    for (const record of DEFAULT_DATA[resource]) if (!existing.has(String(record.id))) store[resource].push(structuredClone(record));
  }
  await writeLocalStore(store);
  await fs.writeFile(LOCAL_SEED_VERSION, String(CRM_SEED_VERSION), 'utf8');
  return store;
}

export async function getCrmData() {
  const db = await database();
  if (db) {
    await ensureSchema(db);
    await seedDatabase(db);
    const result = await db.prepare('SELECT resource, data_json FROM crm_records ORDER BY updated_at ASC').all();
    const data = Object.fromEntries(RESOURCES.map(resource => [resource, []]));
    for (const row of result.results || []) {
      if (!data[row.resource]) continue;
      try { data[row.resource].push(JSON.parse(row.data_json)); } catch {}
    }
    return data;
  }

  await localMutation;
  return mutateLocal(async () => seedLocalStore(await readLocalStore()));
}

export async function getCrmHealth() {
  const db = await database();
  const data = await getCrmData();
  return {
    status: 'ok',
    storage: db ? 'd1' : 'filesystem',
    seedVersion: CRM_SEED_VERSION,
    checkedAt: new Date().toISOString(),
    counts: Object.fromEntries(RESOURCES.map(resource => [resource, data[resource]?.length || 0]))
  };
}

export async function createCrmRecord(resourceName, input, actor = '未标注') {
  const resource = normalizeResource(resourceName);
  const record = sanitizeRecord(resource, input);
  const updatedAt = new Date().toISOString();
  const updatedBy = text(actor, 120, '未标注');
  const db = await database();
  if (db) {
    await ensureSchema(db);
    const existing = await db.prepare('SELECT 1 AS found FROM crm_records WHERE resource = ? AND record_id = ?').bind(resource, String(record.id)).first();
    if (existing) throw appError('记录已存在', 409);
    await db.prepare('INSERT INTO crm_records (resource, record_id, data_json, updated_at, updated_by) VALUES (?, ?, ?, ?, ?)')
      .bind(resource, String(record.id), JSON.stringify(record), updatedAt, updatedBy).run();
    return record;
  }

  return mutateLocal(async () => {
    const store = await readLocalStore();
    if (store[resource].some(item => String(item.id) === String(record.id))) throw appError('记录已存在', 409);
    store[resource].push(record);
    await writeLocalStore(store);
    return record;
  });
}

export async function updateCrmRecord(resourceName, id, patch, actor = '未标注') {
  const resource = normalizeResource(resourceName);
  const normalizedId = recordId(id);
  const updatedAt = new Date().toISOString();
  const updatedBy = text(actor, 120, '未标注');
  const db = await database();
  if (db) {
    await ensureSchema(db);
    const row = await db.prepare('SELECT data_json FROM crm_records WHERE resource = ? AND record_id = ?').bind(resource, String(normalizedId)).first();
    if (!row) throw appError('记录不存在', 404);
    const record = sanitizeRecord(resource, { ...patch, id: normalizedId }, JSON.parse(row.data_json));
    await db.prepare('UPDATE crm_records SET data_json = ?, updated_at = ?, updated_by = ? WHERE resource = ? AND record_id = ?')
      .bind(JSON.stringify(record), updatedAt, updatedBy, resource, String(normalizedId)).run();
    return record;
  }

  return mutateLocal(async () => {
    const store = await readLocalStore();
    const index = store[resource].findIndex(item => String(item.id) === String(normalizedId));
    if (index < 0) throw appError('记录不存在', 404);
    const record = sanitizeRecord(resource, { ...patch, id: normalizedId }, store[resource][index]);
    store[resource][index] = record;
    await writeLocalStore(store);
    return record;
  });
}

export async function deleteCrmRecord(resourceName, id) {
  const resource = normalizeResource(resourceName);
  const normalizedId = recordId(id);
  const db = await database();
  if (db) {
    await ensureSchema(db);
    const result = await db.prepare('DELETE FROM crm_records WHERE resource = ? AND record_id = ?').bind(resource, String(normalizedId)).run();
    if (!result.meta?.changes) throw appError('记录不存在', 404);
    return;
  }

  return mutateLocal(async () => {
    const store = await readLocalStore();
    const next = store[resource].filter(item => String(item.id) !== String(normalizedId));
    if (next.length === store[resource].length) throw appError('记录不存在', 404);
    store[resource] = next;
    await writeLocalStore(store);
  });
}
