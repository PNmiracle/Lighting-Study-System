const DEFAULT_TIMEOUT_MS = 15000;
const STATIC_DEMO = import.meta.env.VITE_STATIC_DEMO === 'true';

async function staticDemoRequest(path, requestOptions) {
  const method = String(requestOptions.method || 'GET').toUpperCase();
  const url = new URL(path, window.location.origin);

  if (url.pathname === '/api/vika/sync') {
    if (url.searchParams.get('studentId') === '16') {
      const response = await fetch(`${import.meta.env.BASE_URL}data/yuzhexuan-vika.json`);
      if (!response.ok) throw new Error('静态导师数据读取失败');
      return response.json();
    }
    return { mentors: [], fields: [], total: 0, readOnly: true, source: 'static-demo' };
  }
  if (url.pathname === '/api/crm') return { data: {} };
  if (url.pathname === '/api/case-state') return { state: {} };
  if (url.pathname === '/api/files' && method === 'GET') return { files: [] };
  if (url.pathname.startsWith('/api/')) return { ok: true, staticDemo: true };
  return null;
}

export async function apiRequest(path, options = {}) {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, signal, ...requestOptions } = options;
  if (STATIC_DEMO) {
    const staticResult = await staticDemoRequest(path, requestOptions);
    if (staticResult !== null) return staticResult;
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const abortRequest = () => controller.abort();

  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener('abort', abortRequest, { once: true });
  }

  try {
    const response = await fetch(path, { ...requestOptions, signal: controller.signal });
    const raw = await response.text();
    let body = {};

    if (raw) {
      try { body = JSON.parse(raw); }
      catch { body = { raw }; }
    }

    if (!response.ok) {
      const error = new Error(body?.error || `请求失败（${response.status}）`);
      error.status = response.status;
      error.body = body;
      throw error;
    }

    return body;
  } catch (error) {
    if (error.name === 'AbortError') {
      const timeoutError = new Error('请求超时，请稍后重试');
      timeoutError.status = 408;
      throw timeoutError;
    }
    throw error;
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', abortRequest);
  }
}
