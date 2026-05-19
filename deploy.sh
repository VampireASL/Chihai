#!/bin/bash
# ChiHai 企业官网部署脚本

set -e

echo "======================================"
echo "  ChiHai 企业官网部署脚本"
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
echo -e "${YELLOW}[1/5] 检查 Nginx...${NC}"
if ! command -v nginx &> /dev/null; then
    echo "正在安装 Nginx..."
    apt-get update
    apt-get install -y nginx
    echo -e "${GREEN}Nginx 安装完成${NC}"
else
    echo -e "${GREEN}Nginx 已安装${NC}"
fi

# 2. 创建网站目录
echo ""
echo -e "${YELLOW}[2/5] 创建网站目录...${NC}"
mkdir -p /var/www/chihai
chown -R www-data:www-data /var/www/chihai
chmod -R 755 /var/www/chihai
echo -e "${GREEN}目录已创建: /var/www/chihai${NC}"

# 3. 配置 Nginx
echo ""
echo -e "${YELLOW}[3/5] 配置 Nginx...${NC}"
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
}
EOF
fi

# 启用站点
ln -sf /etc/nginx/sites-available/chihai /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# 4. 测试 Nginx 配置
echo ""
echo -e "${YELLOW}[4/5] 测试 Nginx 配置...${NC}"
if nginx -t; then
    echo -e "${GREEN}Nginx 配置测试通过${NC}"
else
    echo -e "${RED}Nginx 配置错误，请检查${NC}"
    exit 1
fi

# 5. 重启 Nginx
echo ""
echo -e "${YELLOW}[5/5] 重启 Nginx...${NC}"
if systemctl restart nginx; then
    echo -e "${GREEN}Nginx 重启成功${NC}"
else
    echo -e "${RED}Nginx 重启失败${NC}"
    exit 1
fi

# 完成
echo ""
echo "======================================"
echo -e "${GREEN}  部署环境准备完成！${NC}"
echo "======================================"
echo ""
echo "下一步："
echo "1. 上传 dist 文件夹内容到 /var/www/chihai"
echo "2. 访问 http://服务器IP 查看网站"
echo ""
echo "上传命令（在本地电脑上运行）："
echo "scp -r dist/* root@服务器IP:/var/www/chihai/"
echo ""
echo "或使用 WinSCP / FileZilla 工具上传"
echo ""