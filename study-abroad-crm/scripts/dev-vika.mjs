import { createServer } from 'vite';

const chunks = [];
for await (const chunk of process.stdin) chunks.push(chunk);
const token = Buffer.concat(chunks).toString().trim();
if (!token) throw new Error('stdin 中没有收到 Vika Token');
process.env.VIKA_TOKEN = token;

const server = await createServer({
  configFile: new URL('../vite.config.js', import.meta.url).pathname,
  server: { host: '127.0.0.1', port: Number(process.env.PORT || 4174) }
});
await server.listen();
server.printUrls();
