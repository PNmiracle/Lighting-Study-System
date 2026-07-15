import { promises as fs } from 'node:fs';
import path from 'node:path';
import { bindings } from './runtime.js';

const MAX_FILE_SIZE = 25 * 1024 * 1024;
const LOCAL_META = path.join(process.cwd(), 'storage', 'files.json');
const LOCAL_FILES = path.join(process.cwd(), 'storage', 'files');
let schemaReady;
let localMutation = Promise.resolve();

async function storage() {
  const env = await bindings();
  return { db: env.DB || null, bucket: env.FILES || null, remote: Boolean(env.DB && env.FILES) };
}

async function ensureSchema(db) {
  if (!schemaReady) {
    schemaReady = db.prepare(`
      CREATE TABLE IF NOT EXISTS files (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        object_key TEXT NOT NULL UNIQUE,
        size INTEGER NOT NULL,
        mime_type TEXT NOT NULL,
        case_id TEXT NOT NULL,
        uploaded_by TEXT NOT NULL,
        uploaded_at TEXT NOT NULL
      )
    `).run();
  }
  await schemaReady;
}

function publicFile(row) {
  return {
    id: row.id,
    name: row.name,
    size: row.size,
    mimeType: row.mime_type,
    caseId: row.case_id,
    uploadedBy: row.uploaded_by,
    uploadedAt: row.uploaded_at
  };
}

async function readLocalMeta() {
  try {
    const rows = JSON.parse(await fs.readFile(LOCAL_META, 'utf8'));
    return Array.isArray(rows) ? rows : [];
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    return [];
  }
}

async function writeLocalMeta(rows) {
  await fs.mkdir(path.dirname(LOCAL_META), { recursive: true });
  const temporary = `${LOCAL_META}.tmp`;
  await fs.writeFile(temporary, JSON.stringify(rows, null, 2), 'utf8');
  await fs.rename(temporary, LOCAL_META);
}

function mutateLocal(operation) {
  const run = localMutation.then(operation, operation);
  localMutation = run.then(() => undefined, () => undefined);
  return run;
}

export async function listFiles(caseId) {
  const current = await storage();
  if (current.remote) {
    await ensureSchema(current.db);
    const query = caseId
      ? current.db.prepare('SELECT id, name, size, mime_type, case_id, uploaded_by, uploaded_at FROM files WHERE case_id = ? ORDER BY uploaded_at DESC').bind(caseId)
      : current.db.prepare('SELECT id, name, size, mime_type, case_id, uploaded_by, uploaded_at FROM files ORDER BY uploaded_at DESC');
    const result = await query.all();
    return (result.results || []).map(publicFile);
  }

  await localMutation;
  const rows = await readLocalMeta();
  return rows.filter(row => !caseId || row.case_id === caseId).sort((a, b) => b.uploaded_at.localeCompare(a.uploaded_at)).map(publicFile);
}

export async function uploadFile(request) {
  const formData = await request.formData();
  const file = formData.get('file');
  if (!file || typeof file.arrayBuffer !== 'function') throw new Error('缺少 file 文件字段');
  if (file.size > MAX_FILE_SIZE) {
    const error = new Error('单个文件不能超过 25MB');
    error.status = 413;
    throw error;
  }

  const id = crypto.randomUUID();
  const name = String(file.name || '未命名文件').split('/').pop().slice(0, 180) || '未命名文件';
  const objectKey = `files/${id}`;
  const caseId = String(formData.get('caseId') || 'default').slice(0, 120);
  const uploadedBy = String(formData.get('uploadedBy') || '未标注上传人').slice(0, 120);
  const uploadedAt = new Date().toISOString();
  const bytes = await file.arrayBuffer();
  const row = { id, name, object_key: objectKey, size: file.size, mime_type: file.type || 'application/octet-stream', case_id: caseId, uploaded_by: uploadedBy, uploaded_at: uploadedAt };
  const current = await storage();

  if (current.remote) {
    await ensureSchema(current.db);
    await current.bucket.put(objectKey, bytes, { httpMetadata: { contentType: row.mime_type } });
    try {
      await current.db.prepare('INSERT INTO files (id, name, object_key, size, mime_type, case_id, uploaded_by, uploaded_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
        .bind(row.id, row.name, row.object_key, row.size, row.mime_type, row.case_id, row.uploaded_by, row.uploaded_at).run();
    } catch (error) {
      await current.bucket.delete(objectKey);
      throw error;
    }
    return publicFile(row);
  }

  return mutateLocal(async () => {
    await fs.mkdir(LOCAL_FILES, { recursive: true });
    const target = path.join(LOCAL_FILES, id);
    await fs.writeFile(target, new Uint8Array(bytes));
    try {
      const rows = await readLocalMeta();
      rows.push(row);
      await writeLocalMeta(rows);
    } catch (error) {
      await fs.rm(target, { force: true });
      throw error;
    }
    return publicFile(row);
  });
}

export async function downloadFile(id) {
  const current = await storage();
  if (current.remote) {
    await ensureSchema(current.db);
    const result = await current.db.prepare('SELECT id, name, object_key, mime_type FROM files WHERE id = ?').bind(id).first();
    if (!result) return null;
    const object = await current.bucket.get(result.object_key);
    if (!object) return null;
    return { result, object };
  }

  await localMutation;
  const rows = await readLocalMeta();
  const result = rows.find(row => row.id === id);
  if (!result) return null;
  try {
    const body = await fs.readFile(path.join(LOCAL_FILES, id));
    return { result, object: { body, size: body.length, httpMetadata: { contentType: result.mime_type } } };
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

export async function deleteFile(id) {
  const current = await storage();
  if (current.remote) {
    await ensureSchema(current.db);
    const result = await current.db.prepare('SELECT object_key FROM files WHERE id = ?').bind(id).first();
    if (!result) return false;
    await current.bucket.delete(result.object_key);
    await current.db.prepare('DELETE FROM files WHERE id = ?').bind(id).run();
    return true;
  }

  return mutateLocal(async () => {
    const rows = await readLocalMeta();
    const next = rows.filter(row => row.id !== id);
    if (next.length === rows.length) return false;
    await fs.rm(path.join(LOCAL_FILES, id), { force: true });
    await writeLocalMeta(next);
    return true;
  });
}
