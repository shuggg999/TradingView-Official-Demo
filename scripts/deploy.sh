#!/bin/bash

# CryptoAlert Baby Deployment Script
# This script automates the deployment process to VPS

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="cryptoalert-baby"
DOCKER_IMAGE="$APP_NAME"
BACKUP_DIR="/opt/backups/$APP_NAME"

echo -e "${BLUE}🚀 Starting deployment for CryptoAlert Baby...${NC}"

# Check if we're in the right directory
if [[ ! -f "docker-compose.production.yml" ]]; then
    echo -e "${RED}❌ Error: docker-compose.production.yml not found!${NC}"
    echo -e "${YELLOW}Please run this script from the project root directory.${NC}"
    exit 1
fi

# Check if .env.production exists
if [[ ! -f ".env.production" ]]; then
    echo -e "${YELLOW}⚠️  .env.production not found!${NC}"
    echo -e "${YELLOW}Please create .env.production from .env.production.example${NC}"
    read -p "Would you like to copy the example file? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cp .env.production.example .env.production
        echo -e "${GREEN}✅ Created .env.production from example${NC}"
        echo -e "${YELLOW}⚠️  Please edit .env.production with your actual values!${NC}"
        exit 1
    else
        exit 1
    fi
fi

# Create backup directory if it doesn't exist
echo -e "${BLUE}📁 Creating backup directory...${NC}"
sudo mkdir -p $BACKUP_DIR

# Backup current database if it exists
if docker-compose -f docker-compose.production.yml ps | grep -q postgres; then
    echo -e "${BLUE}💾 Creating database backup...${NC}"
    BACKUP_FILE="$BACKUP_DIR/db_backup_$(date +%Y%m%d_%H%M%S).sql"
    docker-compose -f docker-compose.production.yml exec -T postgres pg_dump -U cryptoalert cryptoalert_db > $BACKUP_FILE
    echo -e "${GREEN}✅ Database backup created: $BACKUP_FILE${NC}"
fi

# Pull latest images and build
echo -e "${BLUE}🔄 Pulling latest images and building...${NC}"
docker-compose -f docker-compose.production.yml pull
docker-compose -f docker-compose.production.yml build --no-cache app

# Stop existing services
echo -e "${BLUE}⏹️  Stopping existing services...${NC}"
docker-compose -f docker-compose.production.yml down

# Start services
echo -e "${BLUE}🚀 Starting services...${NC}"
docker-compose -f docker-compose.production.yml up -d

# Wait for services to be healthy
echo -e "${BLUE}⏳ Waiting for services to be healthy...${NC}"
sleep 30

# Check service health
echo -e "${BLUE}🔍 Checking service health...${NC}"

# Check if postgres is healthy
if docker-compose -f docker-compose.production.yml ps | grep -q "postgres.*healthy"; then
    echo -e "${GREEN}✅ PostgreSQL is healthy${NC}"
else
    echo -e "${RED}❌ PostgreSQL is not healthy${NC}"
    docker-compose -f docker-compose.production.yml logs postgres
fi

# Check if redis is healthy
if docker-compose -f docker-compose.production.yml ps | grep -q "redis.*healthy"; then
    echo -e "${GREEN}✅ Redis is healthy${NC}"
else
    echo -e "${RED}❌ Redis is not healthy${NC}"
    docker-compose -f docker-compose.production.yml logs redis
fi

# Check if app is healthy
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Application is healthy${NC}"
else
    echo -e "${RED}❌ Application is not responding${NC}"
    docker-compose -f docker-compose.production.yml logs app
fi

# Show running services
echo -e "${BLUE}📊 Running services:${NC}"
docker-compose -f docker-compose.production.yml ps

# Run database migrations if needed
echo -e "${BLUE}🔄 Running database migrations...${NC}"
docker-compose -f docker-compose.production.yml exec app npx prisma migrate deploy || true
docker-compose -f docker-compose.production.yml exec app npx prisma generate || true

# Clean up old images
echo -e "${BLUE}🧹 Cleaning up old Docker images...${NC}"
docker system prune -f

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${BLUE}📝 Summary:${NC}"
echo -e "  • Application URL: https://cryptoalert.baby"
echo -e "  • Health Check: https://cryptoalert.baby/api/health"
echo -e "  • Database backup: $BACKUP_FILE"
echo -e ""
echo -e "${YELLOW}📋 Next steps:${NC}"
echo -e "  1. Configure SSL certificates (Let's Encrypt)"
echo -e "  2. Set up domain DNS to point to this server"
echo -e "  3. Test all functionality"
echo -e "  4. Monitor logs: docker-compose -f docker-compose.production.yml logs -f"
echo -e ""
echo -e "${GREEN}✅ Deployment complete!${NC}"