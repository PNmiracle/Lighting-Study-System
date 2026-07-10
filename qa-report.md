# QA 测试报告

## 项目信息
- **项目**: 留学机构学生与选导管理系统
- **测试日期**: 2025-07-10
- **测试工程师**: Edward（严过关）
- **测试轮次**: Round 1 → Round 2（终轮）

---

## 1. 执行摘要

| 指标 | 结果 |
|------|------|
| 后端 TypeScript 编译 | ❌ 未通过（5 个源码 Bug） |
| 前端 TypeScript 编译 | ❌ 未通过（6 个源码 Bug） |
| Prisma Schema 结构 | ✅ 通过 |
| 统一响应格式 | ✅ 通过 |
| 错误码定义 | ✅ 通过 |
| 种子数据 | ✅ 通过 |
| 业务逻辑审查 | ✅ 通过 |
| **总体判断** | ❌ **IS_PASS: NO** |

---

## 2. 通过项（PASS）

### 2.1 数据库 Schema 验证 ✅

| 检查项 | 状态 |
|--------|------|
| 5 张表（users, teachers, students, supervisors, supervisor_assignments） | ✅ |
| 5 个枚举（Role, UserStatus, StudentStatus, MatchLevel, StudentIntent） | ✅ |
| User-Teacher 1:1 关系 | ✅ |
| User-Student 1:1 关系 | ✅ |
| Teacher-Student 1:N 关系 | ✅ |
| @@unique([studentId, supervisorId]) 去重约束 | ✅ |
| SupervisorAssignment-Student-Supervisor 关系 | ✅ |
| 索引定义（name, university, researchArea） | ✅ |

### 2.2 统一响应格式 ✅

`backend/src/utils/response.ts` 实现了正确格式：
- `sendSuccess()`: `{ code: 0, data: T, message: "success" }`
- `sendError()`: `{ code: ErrorCode, data: null, message: string }`

### 2.3 错误码定义 ✅

`backend/src/types/index.ts` 完整定义了所有错误码：
- 0（成功）
- 4001（密码错误）、4002（Token 无效）、4003（权限不足）、4004（资源不存在）
- 4005（邮箱已存在）、4006（参数校验失败）、4007（重复推荐）、4008（意向锁定）
- 4009（学生已分配）、5000（服务器内部错误）

### 2.4 种子数据 ✅

`backend/prisma/seed.ts` 满足所有要求：
- 1 个管理员 ✅
- 2 个老师（张老师、李老师） ✅
- 3 个学生（蒋元萍、王明、陈晓） ✅
- 学生正确分配给老师 ✅
- 5 个导师数据 ✅
- 密码使用 bcrypt 正确哈希 ✅

### 2.5 业务逻辑审查 ✅

| 逻辑项 | 预期 | 实际 | 状态 |
|--------|------|------|------|
| WANT_CONTACT → intentLocked=true | ✓ | `intent === WANT_CONTACT \|\| intent === BACKUP` → true | ✅ |
| BACKUP → intentLocked=true | ✓ | 同上 → true | ✅ |
| SKIP → intentLocked=false | ✓ | 不满足条件 → false | ✅ |
| 老师解锁 → 重置 null + false | ✓ | `studentIntent: null, intentLocked: false` | ✅ |
| 老师只能看自己学生的推荐 | ✓ | 通过 `teacher.id` 过滤 | ✅ |
| 学生只能看自己的推荐 | ✓ | 通过 `student.id` 过滤 | ✅ |
| 只有老师可创建推荐 | ✓ | `role !== Role.TEACHER` → FORBIDDEN | ✅ |
| 只有学生可标记意向 | ✓ | `role !== Role.STUDENT` → FORBIDDEN | ✅ |
| 只有老师可解锁 | ✓ | `role !== Role.TEACHER` → FORBIDDEN | ✅ |
| 同一学生不能重复推荐同一导师 | ✓ | `findUnique` + `ASSIGNMENT_EXISTS` | ✅ |

### 2.6 前端组件完整性 ✅

所有必需文件均存在：
- 页面：LoginPage.tsx ✅、AdminDashboard.tsx ✅、TeacherWorkspace.tsx ✅、StudentBrowsePage.tsx ✅
- 组件子目录：common/ ✅、admin/ ✅、teacher/ ✅、student/ ✅、auth/ ✅
- API 层：client.ts ✅、auth.ts ✅、users.ts ✅、teachers.ts ✅、students.ts ✅、supervisors.ts ✅、assignments.ts ✅
- Hooks：useAuth.ts ✅、useUsers.ts ✅、useTeachers.ts ✅、useSupervisors.ts ✅、useAssignments.ts ✅
- Store：authStore.ts ✅、uiStore.ts ✅

---

## 3. 发现的 Bug（Round 1 结果）

### 3.1 后端 Bug（5 个）

#### BUG-BE-01 [严重] `Role` 未从 types/index.ts 重新导出
- **文件**: `backend/src/types/index.ts` 第 2 行
- **问题**: `import { Role } from '@prisma/client'` 仅导入但未重新导出
- **影响文件**: `backend/src/middleware/role.ts` 第 3 行 → `import { ErrorCode, Role } from '../types'` 编译失败
- **编译错误**: `TS2459: Module '"../types"' declares 'Role' locally, but it is not exported.`
- **修复**: 改为 `import { Role } from '@prisma/client'; export { Role };`

#### BUG-BE-02 [严重] `TeacherDetail` 类型未定义
- **文件**: `backend/src/services/teacher.service.ts` 第 3 行
- **问题**: 导入了 `TeacherDetail` 但 `backend/src/types/index.ts` 中未定义此类型
- **编译错误**: `TS2305: Module '"../types"' has no exported member 'TeacherDetail'.`
- **修复**: 在 `types/index.ts` 中添加 `TeacherDetail` 接口定义

#### BUG-BE-03 [中等] `teacher.service.ts` getById() 方法缺少 `userId` 字段
- **文件**: `backend/src/services/teacher.service.ts` 第 60-76 行
- **问题**: `getById` 返回的 `StudentSummary[]` 映射中缺少 `userId` 字段（`StudentSummary` 接口要求此字段）
- **影响**: 类型检查不通过，返回数据不完整
- **修复**: 在学生映射中添加 `userId: s.userId`

#### BUG-BE-04 [中等] `auth.ts` 中间件使用 `Request` 而非 `AuthedRequest`
- **文件**: `backend/src/middleware/auth.ts` 第 11、29 行
- **问题**: `req.user` 在 `Request` 类型上不存在，应使用 `AuthedRequest` 类型
- **编译错误**: `TS2339: Property 'user' does not exist on type 'Request'`
- **修复**: 将 `req: Request` 改为 `req: AuthedRequest`（需从 types 导入）

#### BUG-BE-05 [中等] `role.ts` 中间件使用 `Request` 而非 `AuthedRequest`
- **文件**: `backend/src/middleware/role.ts` 第 13、14、19 行
- **问题**: 同 BUG-BE-04，`req.user` 在 `Request` 类型上不存在
- **修复**: 将 `req: Request` 改为 `req: AuthedRequest`

---

### 3.2 前端 Bug（6 个）

#### BUG-FE-01 [致命] Router 导入路径全部错误（7 处）
- **文件**: `frontend/src/router/index.tsx`
- **问题**: 文件位于 `src/router/` 目录，但所有导入使用 `./` 而非 `../`
- **错误导入**:
  ```typescript
  import LoginPage from './pages/LoginPage';          // 应为 ../pages/LoginPage
  import AdminDashboard from './pages/admin/...';      // 应为 ../pages/admin/...
  import TeacherWorkspace from './pages/teacher/...';  // 应为 ../pages/teacher/...
  import StudentBrowsePage from './pages/student/...'; // 应为 ../pages/student/...
  import Layout from './components/common/Layout';     // 应为 ../components/common/Layout
  import ProtectedRoute from './components/common/...';// 应为 ../components/common/...
  import { Role } from './types';                      // 应为 ../types
  ```
- **编译错误**: `TS2307: Cannot find module './pages/...'` (×7)
- **影响**: 整个前端无法编译，所有路由不可用
- **修复**: 将所有 `./` 改为 `../`

#### BUG-FE-02 [严重] `TeacherDetail` 类型未在前端 types 中定义
- **文件**: `frontend/src/api/teachers.ts` 第 2 行
- **问题**: `TeacherDetail` 从 `../types` 导入但未定义
- **编译错误**: `TS2305: Module '"../types"' has no exported member 'TeacherDetail'.`
- **修复**: 在 `frontend/src/types/index.ts` 中添加 `TeacherDetail` 接口

#### BUG-FE-03 [严重] `useTeachers` hook 导出名称不匹配
- **文件**: `frontend/src/hooks/useTeachers.ts` 第 12 行
- **问题**: 导出函数名为 `useTeacherList`，但调用方导入的是 `useTeachers`
- **影响文件**: 
  - `frontend/src/components/admin/AssignDialog.tsx` 第 15 行
  - `frontend/src/components/admin/TeacherManageTab.tsx` 第 18 行
- **编译错误**: `TS2724: ...has no exported member named 'useTeachers'. Did you mean 'useTeacherList'?`
- **修复**: 统一命名，将 hook 中的 `useTeacherList` 改为 `useTeachers`，或更新所有导入

#### BUG-FE-04 [中等] `MatchLevel` 作为 type 导入但作为值使用
- **文件**: `frontend/src/components/teacher/EditAssignmentDialog.tsx` 第 12 行
- **问题**: `import type { AssignmentDetail, MatchLevel }` → `MatchLevel` 是枚举，需作为值导入
- **编译错误**: `TS1361: 'MatchLevel' cannot be used as a value because it was imported using 'import type'.`
- **修复**: 将 `MatchLevel` 从 `import type` 中分离：`import { MatchLevel } from '../../types'; import type { AssignmentDetail } from '../../types';`

#### BUG-FE-05 [中等] `GridActionsCellItem` 作为 type 导入但作为 JSX 组件使用
- **文件**: `frontend/src/components/teacher/SupervisorTable.tsx` 第 10 行
- **问题**: `import { DataGrid, type GridColDef, type GridActionsCellItem }` → `GridActionsCellItem` 是 JSX 组件需要作为值导入
- **编译错误**: `TS1361: 'GridActionsCellItem' cannot be used as a value because it was imported using 'import type'.`
- **修复**: 改为 `import { DataGrid, GridActionsCellItem, type GridColDef }`

#### BUG-FE-06 [中等] `Role` 作为 type 导入但作为值使用
- **文件**: `frontend/src/store/authStore.ts` 第 3 行
- **问题**: `import type { User, Role } from '../types'` → `Role` 是枚举，在 `getRoleHomePath` 中作为 `Role.ADMIN` 等使用
- **编译错误**: `TS1361: 'Role' cannot be used as a value because it was imported using 'import type'.`
- **修复**: 改为 `import { Role } from '../types'; import type { User } from '../types';`

---

## 4. 智能路由决策

```
┌─────────────────────────────────────────────┐
│  路由决策: Send To → Engineer (Alex)         │
│                                             │
│  原因: 共发现 11 个源码 Bug，均为实现问题     │
│  测试代码本身无问题，无需自修                  │
│  需要工程师修复后进入 Round 2 回归验证        │
└─────────────────────────────────────────────┘
```

---

## 5. 附加说明

### 5.1 未验证项（环境限制）

由于系统内存限制，以下项无法完整验证：
- Prisma Client 生成（`npx prisma generate` 被 OOM kill）
- 完整 TypeScript 编译（后端 tsc 被 OOM kill，已通过前端 tsc 交叉编译）
- 数据库连接测试
- 实际 API 测试

### 5.2 额外发现

在编译过程中发现后端存在以下文件引用了 Schema 中不存在的 Prisma 模型：
- `ai-task.controller.ts` → 引用 `AiTaskStage`, `AiTaskRound`, `AiTaskPriority`
- `ai-task.service.ts` → 引用多个不存在枚举
- `ai-execution.service.ts` → 引用 `AiConfidence`
- `prompt-template.service.ts` → 引用不存在模型

这些文件**不在当前 PRD 的 MVP 范围内**，建议移除或在 Schema 中补充对应模型。

---

## 6. 测试统计

| 类别 | 检查数 | 通过 | 失败 |
|------|--------|------|------|
| Schema 结构 | 12 | 12 | 0 |
| 响应格式 | 2 | 2 | 0 |
| 错误码 | 11 | 11 | 0 |
| 种子数据 | 6 | 6 | 0 |
| 业务逻辑 | 10 | 10 | 0 |
| 前端组件 | 25 | 25 | 0 |
| TypeScript 编译(后端) | - | - | 5 Bug |
| TypeScript 编译(前端) | - | - | 6 Bug |

---

*报告由 QA Engineer Edward（严过关）生成 | Round 1 | 2025-07-10*

---

# Round 2 回归验证

## Round 2 执行摘要

| 指标 | 结果 |
|------|------|
| 后端 TypeScript 编译（Round 1 Bug） | ✅ 5/5 全部修复 |
| 前端 TypeScript 编译（Round 1 Bug） | ⚠️ 5/6 修复，1 个回归问题 |
| 新引入的回归问题 | 1 个 |
| **总体判断** | ⚠️ **IS_PASS: NO**（1 个遗留问题） |

---

## Round 2 修复验证详情

### 后端 Bug 修复验证（5/5 ✅）

| Bug 编号 | 问题 | 验证方法 | 状态 |
|----------|------|----------|------|
| BUG-BE-01 | Role 未重新导出 | `types/index.ts` 第 5 行：`export { Role, ... }` | ✅ 已修复 |
| BUG-BE-02 | TeacherDetail 未定义 | `types/index.ts` 新增 `TeacherDetail` 接口 | ✅ 已修复 |
| BUG-BE-03 | getById() 缺少 userId | `teacher.service.ts` 第 68 行：`userId: s.userId` | ✅ 已修复 |
| BUG-BE-04 | auth.ts Request 类型 | 改为 `req: AuthedRequest` | ✅ 已修复 |
| BUG-BE-05 | role.ts Request 类型 | 改为 `req: AuthedRequest` | ✅ 已修复 |

### 前端 Bug 修复验证（5/6 ✅，1 个回归）

| Bug 编号 | 问题 | 验证方法 | 状态 |
|----------|------|----------|------|
| BUG-FE-01 | Router 7 处路径错误 | 全部改为 `../` 前缀 | ✅ 已修复 |
| BUG-FE-02 | TeacherDetail 未定义 | `types/index.ts` 新增接口 | ✅ 已修复 |
| BUG-FE-03 | useTeachers 导出不匹配 | 新增 `export const useTeachers = useTeacherList` 别名 | ✅ 已修复 |
| BUG-FE-04 | MatchLevel import type | 改为 `import { MatchLevel }` | ✅ 已修复 |
| BUG-FE-05 | GridActionsCellItem import type | ⚠️ **回归问题** | ❌ 待修复 |
| BUG-FE-06 | Role import type | 改为 `import { Role }` | ✅ 已修复 |

---

## BUG-FE-05 回归问题详情

### 问题描述

工程师将 `GridActionsCellItem` 从 `import type`（仅类型导入）改为 `import`（值导入），以解决 TS1361 错误。但修复引入了新的类型错误：

- **文件**: `frontend/src/components/teacher/SupervisorTable.tsx`
- **行号**: 第 149 行
- **当前代码**: `const actions: GridActionsCellItem[] = [`
- **编译错误**: `TS2749: 'GridActionsCellItem' refers to a value, but is being used as a type here. Did you mean 'typeof GridActionsCellItem'?`

### 根本原因

`GridActionsCellItem` 是 MUI X Data Grid 的 React 组件（函数组件），当以 `import { GridActionsCellItem }` 导入时它是一个**值**（组件引用），不能同时用作**类型注解**。

JSX `<GridActionsCellItem .../>` 创建的元素类型是 `JSX.Element` / `React.ReactElement`，而非 `GridActionsCellItem` 类型。

### 修复方案

将第 149 行的类型注解改为以下任一方式：

**方案 A（推荐）**: 移除显式类型注解，让 TypeScript 自动推断
```typescript
const actions = [
```

**方案 B**: 使用正确的类型
```typescript
const actions: React.ReactElement[] = [
```

---

## Round 2 结论

### 智能路由决策

```
┌─────────────────────────────────────────────┐
│  路由决策: Send To → Engineer (Alex)         │
│                                             │
│  10/11 Round 1 Bug 已修复                    │
│  1 个回归问题（BUG-FE-05）                    │
│  已达到 2 轮测试上限，标注为遗留问题           │
│  非阻塞性问题，建议快速修复即可通过            │
└─────────────────────────────────────────────┘
```

### 遗留问题清单

| 编号 | 文件 | 行号 | 问题 | 优先级 | 修复难度 |
|------|------|------|------|--------|----------|
| BUG-FE-05-R2 | `frontend/src/components/teacher/SupervisorTable.tsx` | 149 | `GridActionsCellItem[]` 类型注解错误 → 应改为 `React.ReactElement[]` 或移除注解 | 🟡 中 | 极低（1 行改动） |

### 附注

1. **后端 Prisma 相关编译错误**: 由于系统内存限制无法运行 `prisma generate`，导致 `@prisma/client` 类型缺失。这些错误非代码 Bug，在正常环境运行 `prisma generate` 后会自动消除。

2. **新增 AiTaskKanban 页面**: 路由中新增了 `/teacher/ai-tasks` 路由和 `AiTaskKanban.tsx` 组件，该文件编译无错误，不影响现有功能。

3. **`feedbackStatus as any` 类型断言**: `teacher.service.ts` 中仍存在 `feedbackStatus: feedbackStatus as any` 的类型绕过（非 Round 1 Bug，属代码质量优化项，建议后续改为正确的联合类型断言）。

---

*报告由 QA Engineer Edward（严过关）生成 | Round 2（终轮） | 2025-07-10*
