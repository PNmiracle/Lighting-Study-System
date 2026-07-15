const baseUrl = (process.argv[2] || process.env.CRM_BASE_URL || 'http://localhost:4180').replace(/\/$/, '');
const resources = ['students', 'applications', 'tasks', 'staff', 'schools', 'serviceItems'];

async function json(path) {
  const response = await fetch(`${baseUrl}${path}`, { headers: { Accept: 'application/json' } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`${path} returned ${response.status}: ${body.error || 'unknown error'}`);
  return body;
}

const health = await json('/api/health');
if (health.status !== 'ok') throw new Error(`health status is ${health.status}`);

const crmResponse = await json('/api/crm');
const crm = crmResponse.data || crmResponse;
for (const resource of resources) {
  if (!Array.isArray(crm[resource])) throw new Error(`${resource} is missing from /api/crm`);
  if (health.counts?.[resource] !== crm[resource].length) {
    throw new Error(`${resource} count mismatch: health=${health.counts?.[resource]} crm=${crm[resource].length}`);
  }
}

console.log(JSON.stringify({
  baseUrl,
  storage: health.storage,
  seedVersion: health.seedVersion,
  counts: health.counts
}, null, 2));
