import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { syncVika } from '../src/server/vika.js';

const output = resolve('public', 'data', 'yuzhexuan-vika.json');
const data = await syncVika({ studentId: 16, force: true });
await mkdir(dirname(output), { recursive: true });
await writeFile(output, JSON.stringify(data), 'utf8');
console.log(`Exported ${data.total} Vika records for GitHub Pages.`);
