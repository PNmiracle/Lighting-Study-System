import { defineConfig, loadEnv } from 'vite';
import vinext from 'vinext';
import { cloudflare } from '@cloudflare/vite-plugin';
import hostingConfig from './.openai/hosting.json' with { type: 'json' };
import { sites } from './build/sites-vite-plugin.js';

const { d1, r2 } = hostingConfig;

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'CLOUDFLARE_');
  const databaseName = env.CLOUDFLARE_D1_DATABASE_NAME || 'study-abroad-crm';
  const databaseId = env.CLOUDFLARE_D1_DATABASE_ID || '00000000-0000-4000-8000-000000000000';
  const bucketName = env.CLOUDFLARE_R2_BUCKET_NAME || 'study-abroad-crm-files';
  return {
    plugins: [
      vinext(),
      sites(),
      cloudflare({
        viteEnvironment: { name: 'rsc', childEnvironments: ['ssr'] },
        config: {
          main: './worker/index.js',
          compatibility_flags: ['nodejs_compat'],
          d1_databases: d1 ? [{ binding: d1, database_name: databaseName, database_id: databaseId }] : [],
          r2_buckets: r2 ? [{ binding: r2, bucket_name: bucketName }] : []
        }
      })
    ]
  };
});
