const DEFAULT_TIMEOUT_MS = 15000;

export async function apiRequest(path, options = {}) {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, signal, ...requestOptions } = options;
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
