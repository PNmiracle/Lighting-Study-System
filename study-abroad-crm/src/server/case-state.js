import { promises as fs } from 'node:fs';
import path from 'node:path';
import { bindings } from './runtime.js';

const LOCAL_STORE = path.join(process.cwd(), 'storage', 'case-state.json');
const EMPTY_STATE = {
  notes: {},
  feedback: {},
  feedbackNotes: {},
  interviewNotes: {},
  outreachStages: {},
  studentNote: '',
  selectedMentorIds: [1, 2],
  sent: false,
  updatedAt: null,
  updatedBy: null
};

let schemaReady;
let localMutation = Promise.resolve();
const OUTREACH_STAGES = new Set(['draft', 'sent', 'replied', 'interview']);

async function database() {
  const env = await bindings();
  return env.DB || null;
}

async function ensureSchema(db) {
  if (!db) return;
  if (!schemaReady) {
    schemaReady = db.prepare(`
      CREATE TABLE IF NOT EXISTS case_states (
        case_id TEXT PRIMARY KEY,
        state_json TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        updated_by TEXT NOT NULL
      )
    `).run();
  }
  await schemaReady;
}

function mergeState(current = {}, patch = {}, actor = '未标注') {
  const next = {
    ...EMPTY_STATE,
    ...current,
    notes: { ...(current.notes || {}) },
    feedback: { ...(current.feedback || {}) },
    feedbackNotes: { ...(current.feedbackNotes || {}) },
    interviewNotes: { ...(current.interviewNotes || {}) },
    outreachStages: { ...(current.outreachStages || {}) }
  };

  if (patch.notes && typeof patch.notes === 'object') {
    next.notes = Object.fromEntries(Object.entries({ ...next.notes, ...patch.notes }).map(([mentorId, value]) => [String(mentorId).slice(0, 120), String(value || '').slice(0, 4000)]));
  }
  if (patch.feedback && typeof patch.feedback === 'object') {
    next.feedback = Object.fromEntries(Object.entries({ ...next.feedback, ...patch.feedback }).map(([mentorId, value]) => [String(mentorId).slice(0, 120), String(value || '').slice(0, 40)]));
  }
  if (patch.feedbackNotes && typeof patch.feedbackNotes === 'object') {
    next.feedbackNotes = Object.fromEntries(Object.entries({ ...next.feedbackNotes, ...patch.feedbackNotes }).map(([mentorId, value]) => [mentorId, String(value || '').slice(0, 4000)]));
  }
  if (patch.interviewNotes && typeof patch.interviewNotes === 'object') {
    next.interviewNotes = Object.fromEntries(Object.entries({ ...next.interviewNotes, ...patch.interviewNotes }).map(([key, value]) => [key, String(value || '').slice(0, 4000)]));
  }
  if (patch.outreachStages && typeof patch.outreachStages === 'object') {
    next.outreachStages = Object.fromEntries(Object.entries({ ...next.outreachStages, ...patch.outreachStages }).map(([mentorId, value]) => {
      const stage = String(value || 'draft');
      return [String(mentorId).slice(0, 120), OUTREACH_STAGES.has(stage) ? stage : 'draft'];
    }));
  }
  if (typeof patch.studentNote === 'string') next.studentNote = patch.studentNote.slice(0, 4000);
  if (Array.isArray(patch.selectedMentorIds)) next.selectedMentorIds = patch.selectedMentorIds.filter(Number.isFinite).slice(0, 50);
  if (typeof patch.sent === 'boolean') next.sent = patch.sent;
  next.updatedAt = new Date().toISOString();
  next.updatedBy = String(actor || '未标注').slice(0, 120);
  return next;
}

async function readLocalStore() {
  try {
    return JSON.parse(await fs.readFile(LOCAL_STORE, 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    return {};
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

export async function getCaseState(caseId) {
  const db = await database();
  if (db) {
    await ensureSchema(db);
    const row = await db.prepare('SELECT state_json FROM case_states WHERE case_id = ?').bind(caseId).first();
    return { ...EMPTY_STATE, ...(row ? JSON.parse(row.state_json) : {}) };
  }

  await localMutation;
  const store = await readLocalStore();
  return { ...EMPTY_STATE, ...(store[caseId] || {}) };
}

export async function updateCaseState(caseId, patch, actor) {
  const db = await database();

  if (db) {
    await ensureSchema(db);
    const current = await getCaseState(caseId);
    const next = mergeState(current, patch, actor);
    await db.prepare(`
      INSERT INTO case_states (case_id, state_json, updated_at, updated_by)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(case_id) DO UPDATE SET
        state_json = excluded.state_json,
        updated_at = excluded.updated_at,
        updated_by = excluded.updated_by
    `).bind(caseId, JSON.stringify(next), next.updatedAt, next.updatedBy).run();
    return next;
  }

  return mutateLocal(async () => {
    const store = await readLocalStore();
    const next = mergeState({ ...EMPTY_STATE, ...(store[caseId] || {}) }, patch, actor);
    store[caseId] = next;
    await writeLocalStore(store);
    return next;
  });
}
