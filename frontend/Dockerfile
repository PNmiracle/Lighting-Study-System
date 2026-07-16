# ==================== 构建阶段 ====================
FROM node:20-alpine AS builder

WORKDIR /app

# 复制 package 文件
COPY package.json package-lock.json* ./

# 安装依赖
RUN npm install

# 复制源码
COPY . .

# 构建前端
RUN npm run build

# ==================== 生产阶段 ====================
FROM nginx:alpine

# 复制构建产物到 Nginx 静态目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
