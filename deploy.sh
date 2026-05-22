#!/bin/bash
# 赤海智能装备 - 企业官网部署脚本

set -e

echo "======================================"
echo "  赤海智能装备 - 部署脚本"
echo "======================================"

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}请使用 root 权限运行此脚本${NC}"
    echo "使用: sudo bash $0"
    exit 1
fi

# 1. 检查并安装 Nginx
echo ""
echo -e "${YELLOW}[1/7] 检查 Nginx...${NC}"
if ! command -v nginx &> /dev/null; then
    echo "正在安装 Nginx..."
    apt-get update
    apt-get install -y nginx
    echo -e "${GREEN}Nginx 安装完成${NC}"
else
    echo -e "${GREEN}Nginx 已安装${NC}"
fi

# 2. 检查并安装 Node.js 和 PM2
echo ""
echo -e "${YELLOW}[2/7] 检查 Node.js 和 PM2...${NC}"
if ! command -v node &> /dev/null; then
    echo "正在安装 Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
    echo -e "${GREEN}Node.js 安装完成${NC}"
else
    echo -e "${GREEN}Node.js 已安装${NC}"
fi

if ! command -v pm2 &> /dev/null; then
    echo "正在安装 PM2..."
    npm install -g pm2
    echo -e "${GREEN}PM2 安装完成${NC}"
else
    echo -e "${GREEN}PM2 已安装${NC}"
fi

# 3. 创建网站目录
echo ""
echo -e "${YELLOW}[3/7] 创建网站目录...${NC}"
mkdir -p /var/www/chihai
chown -R www-data:www-data /var/www/chihai
chmod -R 755 /var/www/chihai

# 创建后端目录
mkdir -p /var/www/chihai-backend/server/data
mkdir -p /var/www/chihai-backend/server/uploads
echo -e "${GREEN}目录已创建${NC}"
echo "  - /var/www/chihai (前端)"
echo "  - /var/www/chihai-backend (后端)"

# 4. 配置 Nginx
echo ""
echo -e "${YELLOW}[4/7] 配置 Nginx...${NC}"
if [ -f "/etc/nginx/sites-available/chihai" ]; then
    echo "备份现有配置..."
    cp /etc/nginx/sites-available/chihai /etc/nginx/sites-available/chihai.backup
fi

# 查找 nginx.conf 位置
NGINX_CONF=""
if [ -f "./nginx.conf" ]; then
    NGINX_CONF="./nginx.conf"
elif [ -f "/tmp/nginx.conf" ]; then
    NGINX_CONF="/tmp/nginx.conf"
fi

if [ -f "$NGINX_CONF" ]; then
    cp $NGINX_CONF /etc/nginx/sites-available/chihai
    echo -e "${GREEN}配置文件已复制${NC}"
else
    echo -e "${YELLOW}未找到 nginx.conf，创建默认配置...${NC}"
    cat > /etc/nginx/sites-available/chihai << 'EOF'
server {
    listen 80;
    server_name _;

    root /var/www/chihai;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }

    location /uploads/ {
        proxy_pass http://localhost:3001/uploads/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/x-javascript
        application/xml+rss
        application/javascript
        application/json
        image/svg+xml;

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
EOF
fi

# 启用站点
ln -sf /etc/nginx/sites-available/chihai /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# 5. 测试 Nginx 配置
echo ""
echo -e "${YELLOW}[5/7] 测试 Nginx 配置...${NC}"
if nginx -t; then
    echo -e "${GREEN}Nginx 配置测试通过${NC}"
else
    echo -e "${RED}Nginx 配置错误，请检查${NC}"
    exit 1
fi

# 6. 重启 Nginx
echo ""
echo -e "${YELLOW}[6/7] 重启 Nginx...${NC}"
if systemctl restart nginx; then
    echo -e "${GREEN}Nginx 重启成功${NC}"
else
    echo -e "${RED}Nginx 重启失败${NC}"
    exit 1
fi

# 7. 设置 PM2 开机自启
echo ""
echo -e "${YELLOW}[7/7] 配置 PM2 开机自启...${NC}"
pm2 startup systemd -u root --hp /root || true
pm2 save || true
echo -e "${GREEN}PM2 配置完成${NC}"

# 完成
echo ""
echo "======================================"
echo -e "${GREEN}  部署环境准备完成！${NC}"
echo "======================================"
echo ""
echo "下一步："
echo ""
echo "1. 上传前端文件（在本地电脑上运行）："
echo "   scp -r dist/* root@服务器IP:/var/www/chihai/"
echo ""
echo "2. 上传后端文件（在本地电脑上运行）："
echo "   scp server/index.js root@服务器IP:/var/www/chihai-backend/server/"
echo ""
echo "3. 在服务器上启动后端："
echo "   cd /var/www/chihai-backend/server"
echo "   pm2 start index.js --name chihai-backend"
echo ""
echo "4. 设置文件权限："
echo "   sudo chown -R www-data:www-data /var/www/chihai"
echo "   sudo chmod -R 755 /var/www/chihai"
echo "   sudo chown -R root:root /var/www/chihai-backend"
echo "   sudo chmod -R 755 /var/www/chihai-backend"
echo ""
echo "5. 访问网站：http://服务器IP"
echo ""
echo "或使用 WinSCP / FileZilla 工具上传文件"
echo ""
