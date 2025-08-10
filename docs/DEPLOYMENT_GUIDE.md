# CryptoAlert Baby - 部署指南

## 🎯 部署概述

本指南将帮助您将 CryptoAlert Baby 应用程序部署到生产环境中。

### 系统要求

- **服务器**: Ubuntu 20.04+ 或类似的 Linux 发行版
- **内存**: 最少 2GB RAM (推荐 4GB+)
- **存储**: 最少 20GB 可用空间
- **网络**: 公网 IP 地址
- **域名**: cryptoalert.baby (已配置)

### 必需软件

- Docker 24.0+
- Docker Compose 2.0+
- Git
- Nginx (或已包含在 Docker 配置中)

## 📋 部署前准备

### 1. 服务器准备

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# 安装 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 重新登录以应用用户组更改
newgrp docker
```

### 2. 项目部署

```bash
# 克隆项目到服务器
git clone <your-repo-url> /opt/cryptoalert-baby
cd /opt/cryptoalert-baby

# 复制环境变量配置
cp .env.production.example .env.production

# 编辑生产环境变量
sudo nano .env.production
```

### 3. 环境变量配置

编辑 `.env.production` 文件，设置以下关键变量：

```bash
# 数据库配置 (使用强密码)
POSTGRES_PASSWORD=your_very_secure_database_password_here

# Redis 配置 (使用强密码)
REDIS_PASSWORD=your_very_secure_redis_password_here

# NextAuth 配置 (生成32位随机字符串)
NEXTAUTH_SECRET=your_super_secret_nextauth_key_here_minimum_32_chars
NEXTAUTH_URL=https://cryptoalert.baby

# 邮件配置 (使用您的 Zoho 邮箱凭据)
SMTP_USER=business@cryptoalert.baby
SMTP_PASS=your_zoho_mail_password
EMAIL_FROM=business@cryptoalert.baby
```

## 🚀 部署步骤

### 1. 自动部署 (推荐)

```bash
# 运行部署脚本
./scripts/deploy.sh
```

### 2. 手动部署

```bash
# 构建并启动服务
docker-compose -f docker-compose.production.yml up -d --build

# 查看服务状态
docker-compose -f docker-compose.production.yml ps

# 查看日志
docker-compose -f docker-compose.production.yml logs -f
```

### 3. 数据库初始化

```bash
# 运行数据库迁移
docker-compose -f docker-compose.production.yml exec app npx prisma migrate deploy

# 生成 Prisma 客户端
docker-compose -f docker-compose.production.yml exec app npx prisma generate

# (可选) 填充初始数据
docker-compose -f docker-compose.production.yml exec app npx prisma db seed
```

## 🌐 域名和 SSL 配置

### 1. DNS 配置

确保您的域名 `cryptoalert.baby` 指向服务器的公网 IP：

```bash
# 检查 DNS 解析
nslookup cryptoalert.baby
```

### 2. SSL 证书配置 (Let's Encrypt)

```bash
# 安装 Certbot
sudo apt install snapd
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot

# 创建 SSL 目录
sudo mkdir -p /opt/cryptoalert-baby/nginx/ssl

# 获取 SSL 证书
sudo certbot certonly --standalone -d cryptoalert.baby -d www.cryptoalert.baby

# 复制证书到 nginx 目录
sudo cp /etc/letsencrypt/live/cryptoalert.baby/fullchain.pem /opt/cryptoalert-baby/nginx/ssl/
sudo cp /etc/letsencrypt/live/cryptoalert.baby/privkey.pem /opt/cryptoalert-baby/nginx/ssl/

# 设置证书权限
sudo chown -R 1000:1000 /opt/cryptoalert-baby/nginx/ssl/

# 重启 nginx 服务
docker-compose -f docker-compose.production.yml restart nginx
```

### 3. 自动续期设置

```bash
# 添加自动续期任务
sudo crontab -e

# 添加以下行 (每月1日凌晨2点检查续期)
0 2 1 * * /usr/bin/certbot renew --quiet && docker-compose -f /opt/cryptoalert-baby/docker-compose.production.yml restart nginx
```

## 🔍 监控和维护

### 1. 健康检查

```bash
# 检查应用健康状态
curl -f https://cryptoalert.baby/api/health

# 检查所有服务状态
docker-compose -f docker-compose.production.yml ps

# 查看实时日志
docker-compose -f docker-compose.production.yml logs -f app
```

### 2. 数据库备份

```bash
# 手动备份
docker-compose -f docker-compose.production.yml exec postgres pg_dump -U cryptoalert cryptoalert_db > backup_$(date +%Y%m%d).sql

# 设置自动备份 (每日凌晨3点)
sudo crontab -e

# 添加备份任务
0 3 * * * cd /opt/cryptoalert-baby && docker-compose -f docker-compose.production.yml exec -T postgres pg_dump -U cryptoalert cryptoalert_db > /opt/backups/db_backup_$(date +\%Y\%m\%d).sql
```

### 3. 日志管理

```bash
# 查看应用日志
docker-compose -f docker-compose.production.yml logs app

# 查看 nginx 日志
docker-compose -f docker-compose.production.yml logs nginx

# 查看数据库日志
docker-compose -f docker-compose.production.yml logs postgres

# 清理旧日志
docker system prune -f
```

## 🔧 故障排除

### 常见问题

1. **应用无法启动**
   ```bash
   # 检查端口占用
   sudo netstat -tlnp | grep 3000
   
   # 检查 Docker 服务
   sudo systemctl status docker
   
   # 重新构建镜像
   docker-compose -f docker-compose.production.yml build --no-cache app
   ```

2. **数据库连接失败**
   ```bash
   # 检查数据库容器状态
   docker-compose -f docker-compose.production.yml ps postgres
   
   # 查看数据库日志
   docker-compose -f docker-compose.production.yml logs postgres
   
   # 测试数据库连接
   docker-compose -f docker-compose.production.yml exec app npx prisma db status
   ```

3. **SSL 证书问题**
   ```bash
   # 检查证书文件
   sudo ls -la /opt/cryptoalert-baby/nginx/ssl/
   
   # 测试 SSL 配置
   sudo nginx -t
   
   # 重新获取证书
   sudo certbot renew --force-renewal
   ```

## 📈 性能优化

### 1. 系统优化

```bash
# 增加文件描述符限制
echo "fs.file-max = 65536" | sudo tee -a /etc/sysctl.conf

# 优化 TCP 设置
echo "net.core.somaxconn = 65536" | sudo tee -a /etc/sysctl.conf
echo "net.ipv4.tcp_max_syn_backlog = 65536" | sudo tee -a /etc/sysctl.conf

# 应用设置
sudo sysctl -p
```

### 2. Docker 优化

```bash
# 限制日志大小
sudo tee /etc/docker/daemon.json > /dev/null <<EOF
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOF

# 重启 Docker
sudo systemctl restart docker
```

## 🔐 安全设置

### 1. 防火墙配置

```bash
# 启用 UFW
sudo ufw enable

# 允许必要端口
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS

# 检查状态
sudo ufw status
```

### 2. 安全更新

```bash
# 设置自动安全更新
sudo apt install unattended-upgrades
sudo dpkg-reconfigure unattended-upgrades
```

## 📞 支持和联系

如果在部署过程中遇到问题，请：

1. 检查日志文件获取错误信息
2. 参考故障排除部分
3. 联系技术支持：business@cryptoalert.baby

---

**最后更新**: 2025年8月10日  
**版本**: v1.0.0