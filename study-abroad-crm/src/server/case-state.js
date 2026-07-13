import { promises as fs } from 'node:fs';
import path from 'node:path';
import { bindings } from './runtime.js';

const LOCAL_STORE = path.join(process.cwd(), 'storage', 'case-state.json');
const EMPTY_STATE = {
  notes: {},
  feedback: {},
  feedbackNotes: {},
  studentNote: '',
  selectedMentorIds: [1, 2],
  sent: false,
  updatedAt: null,
  updatedBy: null
};

let schemaReady;

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
    feedbackNotes: { ...(current.feedbackNotes || {}) }
  };

  if (patch.notes && typeof patch.notes === 'object') next.notes = { ...next.notes, ...patch.notes };
  if (patch.feedback && typeof patch.feedback === 'object') next.feedback = { ...next.feedback, ...patch.feedback };
  if (patch.feedbackNotes && typeof patch.feedbackNotes === 'object') {
    next.feedbackNotes = Object.fromEntries(Object.entries({ ...next.feedbackNotes, ...patch.feedbackNotes }).map(([mentorId, value]) => [mentorId, String(value || '').slice(0, 4000)]));
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

export async function getCaseState(caseId) {
  const db = await database();
  if (db) {
    await ensureSchema(db);
    const row = await db.prepare('SELECT state_json FROM case_states WHERE case_id = ?').bind(caseId).first();
    return { ...EMPTY_STATE, ...(row ? JSON.parse(row.state_json) : {}) };
  }

  const store = await readLocalStore();
  return { ...EMPTY_STATE, ...(store[caseId] || {}) };
}

export async function updateCaseState(caseId, patch, actor) {
  const current = await getCaseState(caseId);
  const next = mergeState(current, patch, actor);
  const db = await database();

  if (db) {
    await ensureSchema(db);
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

  const store = await readLocalStore();
  store[caseId] = next;
  await writeLocalStore(store);
  return next;
}
