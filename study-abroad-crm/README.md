# Study Abroad CRM

留学机构全栈 CRM，包含老师工作台、学生服务项目、老师团队、院校库、选导、文书、签证、收款、任务和学生端门户。

## 本地启动

从当前工作区根目录启动，避免桌面运行环境把 Vika Token 从子目录命令中清理掉：

```bash
cd "/Users/chengxinzhi/Documents/轻学教育-ai投放"
python3 study-abroad-crm/scripts/dev_connected.py
```

打开 `http://127.0.0.1:4174/`。

服务启动后：

- 前端：`http://127.0.0.1:4174`
- Vika 只读 API 代理：`http://127.0.0.1:4175`
- Token 只在 Python API 进程内存中使用，不发送到浏览器，不写入项目文件。

## 当前接入范围

- 读取 Vika 字段定义。
- 读取选定视图中的导师记录，最多 200 条。
- 解析 `导师`、`导师研究领域`、`导师主页`、`博士申请信息`、`选导意向（点击选择）`、`状态`、`备注` 等字段。
- 解析 `非美国地区学校` / `美国地区学校` 关联表，把关联记录 ID 转换为学校名称。
- 选导工作台支持 `CRM视图` 与 `Vika多维表` 切换；Vika 表的全部字段会动态生成列、字段选择器和全文筛选，当前已接入 25 个字段 / 200 条记录。
- 保留 Vika 原始共享链接，支持手动同步和每 5 分钟自动同步；Vika 当前为只读来源，CRM 负责学生选择、推荐和后续流程。
- Vika 保持只读；学生反馈、推荐方案、申请和任务写入 CRM 自有数据层，不回写 Vika。

## CRM 数据持久化

- 学生、申请、任务、老师、院校和业务事项通过 `/api/crm` 统一读取与写入，刷新页面后会恢复。
- 本地开发自动使用 `storage/crm-data.json`；绑定 Cloudflare D1 后自动使用 `crm_records` 表。
- `/api/health` 返回当前存储模式、种子版本和五类资源数量，可供部署探针使用。
- 新建学生、新建申请、申请阶段变更和任务完成状态采用乐观更新，保存失败时界面会回滚并提示。
- 选导推荐、学生反馈、面试准备和套磁阶段继续按 `caseId` 写入 `case_states`，本地并发写入会串行处理。

## 验证与部署

```bash
npm run build
npx vinext check
npm run test:api -- http://localhost:4180
```

Cloudflare 正式部署前需要创建 D1 数据库与 R2 bucket，并导出资源配置。部署脚本会拒绝占位 D1 ID：

```bash
npx wrangler login
npx wrangler d1 create study-abroad-crm
npx wrangler r2 bucket create study-abroad-crm-files
export CLOUDFLARE_D1_DATABASE_ID="上一步返回的 database_id"
export CLOUDFLARE_D1_DATABASE_NAME="study-abroad-crm"
export CLOUDFLARE_R2_BUCKET_NAME="study-abroad-crm-files"
npm run deploy
```

不上传资源的部署包检查使用 `npm run deploy:dry`。

部署完成后执行生产冒烟测试：

```bash
npm run test:api -- https://your-worker.workers.dev
```

## 文件共享 Demo

- 老师端学生详情页和学生端门户都可以上传文件。
- 文件按 `caseId` 归属服务项目，双方读取同一份列表，上传后自动刷新。
- 本地 Demo 文件与元数据存储在 `storage/`，支持上传、下载和删除，单文件上限 25MB。
- 绑定 Cloudflare D1 与 R2 后，同一套接口会自动切换为数据库元数据和对象存储。

## 安全边界

Vika Token 通过 `VIKA_TOKEN` 环境变量提供。Vika 仍是只读导师资料来源；CRM 的学生、申请、任务、推荐、套磁和学生反馈由 CRM 数据层持久化。
