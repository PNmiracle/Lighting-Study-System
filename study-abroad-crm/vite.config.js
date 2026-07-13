import { defineConfig } from 'vite';
import vinext from 'vinext';
import { cloudflare } from '@cloudflare/vite-plugin';
import hostingConfig from './.openai/hosting.json' with { type: 'json' };
import { sites } from './build/sites-vite-plugin.js';

const { d1, r2 } = hostingConfig;

export default defineConfig({
  plugins: [
    vinext(),
    sites(),
    cloudflare({
      viteEnvironment: { name: 'rsc', childEnvironments: ['ssr'] },
      config: {
        main: './worker/index.js',
        compatibility_flags: ['nodejs_compat'],
        d1_databases: d1 ? [{ binding: d1, database_name: 'study-abroad-crm', database_id: '00000000-0000-4000-8000-000000000000' }] : [],
        r2_buckets: r2 ? [{ binding: r2, bucket_name: 'study-abroad-crm-files' }] : []
      }
    })
  ]
});
