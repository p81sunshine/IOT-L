# 使用官方的 Node 镜像作为基础镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 将 package.json 和 package-lock.json 复制到工作目录
COPY package*.json ./

# 安装依赖
RUN npm install

# 将应用程序代码复制到工作目录
COPY . .


# 暴露前端应用端口
EXPOSE 3000

# 启动前端应用
CMD ["npm", "run", "dev"]
