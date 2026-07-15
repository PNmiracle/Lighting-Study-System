let workerEnvPromise;

export async function bindings() {
  if (!workerEnvPromise) {
    workerEnvPromise = import('cloudflare:workers')
      .then(module => module.env)
      .catch(() => globalThis.process?.env || {});
  }
  return workerEnvPromise;
}

export function envValue(name, fallback = '') {
  const value = globalThis.process?.env?.[name];
  return value || fallback;
}

export async function runtimeValue(name, fallback = '') {
  const env = await bindings();
  return env?.[name] || envValue(name, fallback);
}
