FROM node:20-alpine AS builder

WORKDIR /app

# 复制 package 文件
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# 安装依赖
RUN npm install

# 复制源码
COPY . .

# 生成 Prisma Client
RUN npx prisma generate

# 编译 TypeScript
RUN npm run build

# ==================== 生产阶段 ====================
FROM node:20-alpine

WORKDIR /app

# 复制编译产物和依赖
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["npm", "start"]
