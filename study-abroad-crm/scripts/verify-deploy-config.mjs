const placeholderDatabaseId = '00000000-0000-4000-8000-000000000000';
const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID;
const databaseName = process.env.CLOUDFLARE_D1_DATABASE_NAME || 'study-abroad-crm';
const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'study-abroad-crm-files';

if (!databaseId || databaseId === placeholderDatabaseId) {
  throw new Error('CLOUDFLARE_D1_DATABASE_ID 未配置，请先创建 D1 数据库并导出真实 database_id');
}

if (!/^[0-9a-f-]{36}$/i.test(databaseId)) {
  throw new Error('CLOUDFLARE_D1_DATABASE_ID 格式无效');
}

console.log(JSON.stringify({ databaseName, databaseId, bucketName }, null, 2));
