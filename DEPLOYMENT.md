# Nginx 直接部署指南

## 📋 部署步骤

### 第一步：准备服务器

#### 1. 连接到阿里云服务器
```bash
ssh root@your-server-ip
```

#### 2. 上传部署文件
将以下文件上传到服务器的 `/tmp` 目录：
- `nginx.conf`
- `deploy.sh`

在本地 PowerShell 运行：
```powershell
scp d:\Doc\HBuilderProjects\ChiHai\nginx.conf root@your-server-ip:/tmp/
scp d:\Doc\HBuilderProjects\ChiHai\deploy.sh root@your-server-ip:/tmp/
```

### 第二步：运行部署脚本

在服务器上执行：

```bash
# 进入 tmp 目录
cd /tmp

# 给脚本执行权限
chmod +x deploy.sh

# 运行部署脚本
sudo bash deploy.sh
```

### 第三步：上传网站文件

在本地 PowerShell 运行：

```powershell
# 上传 dist 文件夹内容
scp -r d:\Doc\HBuilderProjects\ChiHai\dist\* root@your-server-ip:/var/www/chihai/
```

或者使用工具：
- **WinSCP**：拖拽 `dist` 文件夹内容到 `/var/www/chihai/`
- **FileZilla**：通过 SFTP 连接上传

### 第四步：验证部署

在浏览器访问：
```
http://your-server-ip
```

---

## 🎯 详细操作步骤

### 方法 A：使用脚本一键部署（推荐）

```bash
# 1. 连接服务器
ssh root@your-server-ip

# 2. 下载脚本（如果没有直接上传）
wget -O /tmp/deploy.sh https://raw.githubusercontent.com/.../deploy.sh
wget -O /tmp/nginx.conf https://raw.githubusercontent.com/.../nginx.conf

# 3. 运行脚本
chmod +x /tmp/deploy.sh
sudo bash /tmp/deploy.sh
```

### 方法 B：手动部署

#### 1. 安装 Nginx
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y nginx

# CentOS/RHEL
sudo yum install -y nginx
```

#### 2. 创建网站目录
```bash
sudo mkdir -p /var/www/chihai
sudo chown -R www-data:www-data /var/www/chihai
sudo chmod -R 755 /var/www/chihai
```

#### 3. 配置 Nginx
```bash
# 创建配置文件
sudo nano /etc/nginx/sites-available/chihai
```

粘贴 `nginx.conf` 的内容，保存退出。

```bash
# 启用站点
sudo ln -s /etc/nginx/sites-available/chihai /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

---

## 🔧 配置自定义域名

### 1. 在阿里云控制台配置 DNS
- 域名 A 记录指向服务器 IP

### 2. 更新 Nginx 配置
```bash
sudo nano /etc/nginx/sites-available/chihai
```

修改 `server_name` 行：
```nginx
server_name your-domain.com www.your-domain.com;
```

重启 Nginx：
```bash
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🔒 配置 HTTPS（Let's Encrypt）

### 1. 安装 Certbot
```bash
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx
```

### 2. 获取证书
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### 3. 自动续期
```bash
sudo certbot renew --dry-run
```

---

## 📂 文件上传参考

### 使用 SCP（命令行）
```powershell
# 上传单个文件
scp file.txt root@your-server-ip:/path/

# 上传整个文件夹
scp -r dist/ root@your-server-ip:/var/www/chihai/
```

### 使用 WinSCP（图形界面）
1. 下载 WinSCP: https://winscp.net/
2. 连接信息：
   - 协议：SFTP
   - 主机名：服务器 IP
   - 端口：22
   - 用户名：root
   - 密码：您的服务器密码
3. 左侧导航到：`d:\Doc\HBuilderProjects\ChiHai\dist`
4. 右侧导航到：`/var/www/chihai`
5. 拖拽所有文件上传

### 使用 FileZilla（图形界面）
1. 下载 FileZilla: https://filezilla-project.org/
2. 连接信息同 WinSCP
3. 上传 `dist` 文件夹内容到 `/var/www/chihai`

---

## 🛠️ 常用命令

### Nginx 管理
```bash
# 启动
sudo systemctl start nginx

# 停止
sudo systemctl stop nginx

# 重启
sudo systemctl restart nginx

# 重新加载配置
sudo systemctl reload nginx

# 查看状态
sudo systemctl status nginx

# 查看访问日志
sudo tail -f /var/log/nginx/access.log

# 查看错误日志
sudo tail -f /var/log/nginx/error.log
```

### 文件权限
```bash
# 设置正确权限
sudo chown -R www-data:www-data /var/www/chihai
sudo chmod -R 755 /var/www/chihai

# 如果使用 root 用户上传
sudo chown -R www-data:www-data /var/www/chihai
```

---

## 🔍 故障排查

### 网站无法访问
```bash
# 检查防火墙
sudo ufw status
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# 检查 Nginx 状态
sudo systemctl status nginx

# 检查端口监听
sudo netstat -tlnp | grep nginx
```

### 403 Forbidden
```bash
# 检查文件权限
ls -la /var/www/chihai

# 修复权限
sudo chown -R www-data:www-data /var/www/chihai
sudo chmod -R 755 /var/www/chihai
```

### 500 Internal Server Error
```bash
# 查看错误日志
sudo tail -f /var/log/nginx/error.log
```

---

## 📝 更新网站

### 更新步骤
1. 在本地重新构建：
```powershell
npm run build
```

2. 上传新文件到服务器：
```powershell
scp -r dist/* root@your-server-ip:/var/www/chihai/
```

3. 重启 Nginx（可选）：
```bash
sudo systemctl reload nginx
```

---

## 🎉 部署检查清单

- [ ] 服务器可通过 SSH 连接
- [ ] Nginx 已安装并运行
- [ ] 网站文件已上传到 /var/www/chihai
- [ ] Nginx 配置已设置
- [ ] 防火墙已开放 80（和 443）端口
- [ ] 域名已解析（如使用域名）
- [ ] HTTPS 已配置（可选但推荐）
- [ ] 网站可正常访问

---

## 💡 提示

1. **备份数据**：部署前先备份现有文件
2. **测试环境**：先在测试环境验证后再生产部署
3. **监控日志**：定期检查 Nginx 日志
4. **安全加固**：配置防火墙，定期更新系统

---

如有问题，请查看：
- Nginx 日志：`/var/log/nginx/`
- 系统日志：`/var/log/syslog`
