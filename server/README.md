# ChiHai 后端服务

## 快速开始

### 安装依赖

```bash
cd server
npm install
```

### 启动开发服务器

```bash
npm run dev
```

服务器将在 http://localhost:3001 启动

### 生产环境启动

```bash
npm start
```

## API 接口

### 提交联系表单

**POST** `/api/contact`

请求体：
```json
{
  "name": "姓名",
  "email": "邮箱",
  "phone": "电话（可选）",
  "subject": "主题",
  "message": "留言内容"
}
```

响应：
```json
{
  "success": true,
  "message": "提交成功！我们会尽快与您联系。",
  "data": { "id": 1 }
}
```

### 获取所有提交记录

**GET** `/api/submissions`

响应：
```json
{
  "success": true,
  "data": [...],
  "total": 10
}
```

### 获取单个提交记录

**GET** `/api/submissions/:id`

### 标记为已读

**PUT** `/api/submissions/:id/read`

### 健康检查

**GET** `/api/health`

## 前端配置

在前端项目的 `.env.local` 中添加：

```env
VITE_API_URL=http://localhost:3001/api
VITE_AMAP_KEY=你的高德地图API Key
```

## 数据存储

当前使用内存存储，重启服务器数据会丢失。生产环境建议使用数据库（MongoDB/PostgreSQL等）。

## 扩展功能

可以扩展添加：
- 邮件通知（nodemailer）
- 文件上传功能
- 管理员后台界面
- 数据持久化
