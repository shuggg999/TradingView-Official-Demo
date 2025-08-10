#!/bin/bash

echo "=== 调试VPS部署问题 ==="
echo "时间: $(date)"
echo "============================="

echo "1. 检查Docker服务状态..."
systemctl status docker --no-pager

echo -e "\n2. 检查容器状态..."
docker ps -a

echo -e "\n3. 检查容器日志..."
echo "--- App容器日志 ---"
docker logs cryptoalert-app --tail=50

echo -e "\n--- PostgreSQL容器日志 ---"
docker logs cryptoalert-postgres --tail=20

echo -e "\n--- Redis容器日志 ---"
docker logs cryptoalert-redis --tail=20

echo -e "\n4. 检查网络连接..."
echo "--- 容器内部连接测试 ---"
docker exec cryptoalert-app curl -f http://localhost:3000/api/health || echo "内部健康检查失败"

echo -e "\n--- 端口监听情况 ---"
netstat -tlnp | grep :3005

echo -e "\n5. 检查防火墙状态..."
ufw status

echo -e "\n6. 检查环境变量..."
docker exec cryptoalert-app env | grep -E "(DATABASE_URL|NODE_ENV|NEXTAUTH|REDIS)"

echo -e "\n7. 测试数据库连接..."
docker exec cryptoalert-postgres pg_isready -U cryptoalert

echo -e "\n8. 检查Next.js配置..."
docker exec cryptoalert-app ls -la /app
docker exec cryptoalert-app cat /app/package.json | grep -A5 -B5 '"scripts"'

echo -e "\n=== 调试完成 ==="