#!/bin/bash

echo "=== 修复VPS部署问题 ==="
echo "时间: $(date)"
echo "========================"

# 1. 开放防火墙端口
echo "1. 配置防火墙..."
ufw allow 3005/tcp
ufw reload
echo "端口3005已开放"

# 2. 停止现有容器
echo -e "\n2. 停止现有容器..."
docker-compose -f docker-compose.production.yml down

# 3. 清理旧镜像和容器
echo -e "\n3. 清理Docker资源..."
docker system prune -f
docker volume prune -f

# 4. 检查环境变量文件
echo -e "\n4. 检查环境变量..."
if [ ! -f .env.production ]; then
    echo "创建.env.production文件..."
    cp .env.production.example .env.production
fi

# 5. 重新构建和启动
echo -e "\n5. 重新构建和启动应用..."
docker-compose -f docker-compose.production.yml up -d --build

# 6. 等待容器启动
echo -e "\n6. 等待容器启动..."
sleep 30

# 7. 检查容器状态
echo -e "\n7. 检查容器状态..."
docker ps -a

# 8. 测试连接
echo -e "\n8. 测试连接..."
echo "--- 内部测试 ---"
docker exec cryptoalert-app curl -f http://localhost:3000/ || echo "内部连接失败"

echo -e "\n--- 外部测试 ---"
curl -I http://localhost:3005/ || echo "外部连接失败"

# 9. 显示日志
echo -e "\n9. 应用日志..."
docker logs cryptoalert-app --tail=20

echo -e "\n=== 修复完成 ==="
echo "请访问 http://107.175.35.121:3005 测试应用"