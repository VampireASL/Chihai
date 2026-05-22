const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;

const DATA_DIR = path.join(__dirname, 'data');
const IMAGES_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });

const loadData = (filename) => {
  const filePath = path.join(DATA_DIR, filename);
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return [];
  }
};

const saveData = (filename, data) => {
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

const initializeCleanData = () => {
  console.log('🧹 正在清空所有数据...');
  saveData('submissions.json', []);
  saveData('products.json', []);
  saveData('news.json', []);
  saveData('patents.json', []);
};

initializeCleanData();

let submissions = [];
let products = [];
let newsItems = [];
let patents = [];

const setCORSHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

const sendJSON = (res, statusCode, data) => {
  setCORSHeaders(res);
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};

const parseJSONBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
    req.on('error', reject);
  });
};

const parseMultipart = (req) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    
    req.on('end', () => {
      try {
        const buffer = Buffer.concat(chunks);
        const contentType = req.headers['content-type'] || '';
        const boundaryMatch = contentType.match(/boundary=(.+)/);
        
        if (!boundaryMatch) {
          resolve({ fields: {}, files: {} });
          return;
        }
        
        const boundary = '--' + boundaryMatch[1];
        const boundaryBuffer = Buffer.from(boundary);
        
        const result = { fields: {}, files: {} };
        
        // 简单方法：直接用字符串处理
        const dataStr = buffer.toString('binary');
        const parts = dataStr.split(boundary);
        
        console.log(`找到 ${parts.length} 个 part`);
        
        // 跳过第一个和最后一个part
        for (let i = 1; i < parts.length - 1; i++) {
          const part = parts[i];
          
          // 跳过开头的 \r\n
          let content = part.replace(/^(\r\n|\n|\r)/, '');
          
          // 找到 header 和 body 的分隔
          const headerEnd = content.indexOf('\r\n\r\n');
          if (headerEnd === -1) continue;
          
          const headerStr = content.substring(0, headerEnd);
          const bodyStr = content.substring(headerEnd + 4);
          
          // 去掉 body 末尾的 \r\n
          let cleanBody = bodyStr.replace(/(\r\n|\n|\r)$/, '');
          
          // 解析 name
          const nameMatch = headerStr.match(/name="([^"]+)"/);
          if (!nameMatch) continue;
          
          const name = nameMatch[1];
          const filenameMatch = headerStr.match(/filename="([^"]+)"/);
          
          if (filenameMatch && filenameMatch[1]) {
            // 文件
            const filename = filenameMatch[1];
            const ext = path.extname(filename).toLowerCase();
            const safeExt = ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext) ? ext : '.jpg';
            const newFilename = Date.now() + '-' + Math.random().toString(36).substring(2, 8) + safeExt;
            const filepath = path.join(IMAGES_DIR, newFilename);
            
            // 用二进制方式写
            const bodyBuffer = Buffer.from(cleanBody, 'binary');
            fs.writeFileSync(filepath, bodyBuffer);
            
            result.files[name] = { filename, path: '/uploads/' + newFilename };
            console.log(`  文件 ${name} = ${filename}`);
          } else {
            // 普通字段
            const value = cleanBody;
            result.fields[name] = value;
            console.log(`  字段 ${name} = "${value}"`);
          }
        }
        
        console.log('✅ 解析完成:', { fields: result.fields, files: Object.keys(result.files) });
        
        resolve(result);
      } catch (error) {
        console.error('❌ 解析错误:', error);
        reject(error);
      }
    });
    
    req.on('error', reject);
  });
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  console.log(`📥 ${method} ${pathname}`);

  if (method === 'OPTIONS') {
    setCORSHeaders(res);
    res.writeHead(200);
    res.end();
    return;
  }

  try {
    if (pathname === '/' && method === 'GET') {
      setCORSHeaders(res);
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>赤海智能装备 后端管理系统</title><style>body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:1200px;margin:0 auto;padding:40px 20px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);min-height:100vh;color:#333;}.container{background:white;border-radius:16px;padding:48px;box-shadow:0 25px 80px rgba(0,0,0,0.25);}.header{text-align:center;margin-bottom:40px;}h1{color:#667eea;margin-bottom:10px;font-size:2.5rem;}.status{display:inline-block;background:#10b981;color:white;padding:8px 20px;border-radius:25px;font-size:14px;margin-bottom:20px;}.stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px;margin-bottom:40px;}.stat-card{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;padding:24px;border-radius:12px;text-align:center;}.stat-number{font-size:2.5rem;font-weight:bold;margin-bottom:8px;}.stat-label{opacity:0.9;}a{color:#667eea;text-decoration:none;}a:hover{text-decoration:underline;}</style></head><body><div class="container"><div class="header"><h1>🚀 赤海智能装备 后端管理系统</h1><div class="status">✅ 服务运行中</div><p>欢迎使用企业官网管理后台</p></div><div class="stats-grid"><div class="stat-card"><div class="stat-number">${submissions.length}</div><div class="stat-label">联系表单提交</div></div><div class="stat-card"><div class="stat-number">${products.length}</div><div class="stat-label">产品数量</div></div><div class="stat-card"><div class="stat-number">${newsItems.length}</div><div class="stat-label">新闻数量</div></div><div class="stat-card"><div class="stat-number">${patents.length}</div><div class="stat-label">专利数量</div></div></div><div style="margin-top:40px;padding:20px;background:#f0fdf4;border-radius:8px;"><strong>💡 提示：</strong>前端网站请访问: <a href="http://localhost:5173/" target="_blank">http://localhost:5173/</a></div></div></body></html>`);
      return;
    }

    if (pathname.startsWith('/uploads/') && method === 'GET') {
      const filename = pathname.split('/')[2];
      const filepath = path.join(IMAGES_DIR, filename);
      if (fs.existsSync(filepath)) {
        const ext = path.extname(filename).toLowerCase();
        const mimeTypes = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.gif': 'image/gif', '.webp': 'image/webp' };
        const mimeType = mimeTypes[ext] || 'application/octet-stream';
        const data = fs.readFileSync(filepath);
        res.writeHead(200, { 'Content-Type': mimeType });
        res.end(data);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('File not found');
      }
      return;
    }

    if (pathname === '/api/contact' && method === 'POST') {
      const body = await parseJSONBody(req);
      const { name, email, phone, subject, message } = body;
      if (!name || !email || !message) {
        return sendJSON(res, 400, { success: false, error: '请填写必填项' });
      }
      const submission = { id: Date.now(), name, email, phone: phone || '', subject: subject || '未设置主题', message, timestamp: new Date().toISOString(), read: false };
      submissions.unshift(submission);
      saveData('submissions.json', submissions);
      return sendJSON(res, 200, { success: true, message: '提交成功！我们会尽快与您联系。', data: { id: submission.id } });
    }

    if (pathname === '/api/submissions' && method === 'GET') {
      return sendJSON(res, 200, { success: true, data: submissions, total: submissions.length });
    }

    if (pathname.startsWith('/api/submissions/') && pathname.endsWith('/read') && method === 'PUT') {
      const id = parseInt(pathname.split('/')[3]);
      const submission = submissions.find(s => s.id === id);
      if (!submission) return sendJSON(res, 404, { success: false, error: '记录不存在' });
      submission.read = true;
      saveData('submissions.json', submissions);
      return sendJSON(res, 200, { success: true, data: submission });
    }

    if (pathname.startsWith('/api/submissions/') && method === 'DELETE') {
      const id = parseInt(pathname.split('/')[3]);
      const index = submissions.findIndex(s => s.id === id);
      if (index === -1) return sendJSON(res, 404, { success: false, error: '记录不存在' });
      submissions.splice(index, 1);
      saveData('submissions.json', submissions);
      return sendJSON(res, 200, { success: true, message: '删除成功' });
    }

    if (pathname === '/api/products' && method === 'GET') {
      return sendJSON(res, 200, { success: true, data: products, total: products.length });
    }

    if (pathname === '/api/products' && method === 'POST') {
      const contentType = req.headers['content-type'] || '';
      
      if (contentType.includes('multipart/form-data')) {
        const { fields, files } = await parseMultipart(req);
        const data = { id: 'prod-' + Date.now(), name: fields.name || '', description: fields.description || '', features: fields.features || '', specs: fields.specs || '', image: files.image ? files.image.path : '', createdAt: new Date().toISOString() };
        console.log('📦 创建产品:', data);
        products.push(data);
        saveData('products.json', products);
        return sendJSON(res, 200, { success: true, message: '产品添加成功', data });
      } else {
        const data = await parseJSONBody(req);
        data.id = 'prod-' + Date.now();
        data.createdAt = new Date().toISOString();
        products.push(data);
        saveData('products.json', products);
        return sendJSON(res, 200, { success: true, message: '产品添加成功', data });
      }
    }

    if (pathname.startsWith('/api/products/') && method === 'GET') {
      const id = pathname.split('/').pop();
      const product = products.find(p => p.id === id);
      if (!product) return sendJSON(res, 404, { success: false, error: '产品不存在' });
      return sendJSON(res, 200, { success: true, data: product });
    }

    if (pathname.startsWith('/api/products/') && method === 'PUT') {
      const id = pathname.split('/').pop();
      const index = products.findIndex(p => p.id === id);
      if (index === -1) return sendJSON(res, 404, { success: false, error: '产品不存在' });
      
      const contentType = req.headers['content-type'] || '';
      
      if (contentType.includes('multipart/form-data')) {
        const { fields, files } = await parseMultipart(req);
        const updateData = { ...products[index] };
        
        if (fields.name !== undefined) updateData.name = fields.name;
        if (fields.description !== undefined) updateData.description = fields.description;
        if (fields.features !== undefined) updateData.features = fields.features;
        if (fields.specs !== undefined) updateData.specs = fields.specs;
        
        if (files.image) updateData.image = files.image.path;
        
        products[index] = updateData;
        saveData('products.json', products);
        return sendJSON(res, 200, { success: true, message: '产品更新成功', data: products[index] });
      } else {
        const jsonBody = await parseJSONBody(req);
        products[index] = { ...products[index], ...jsonBody };
        saveData('products.json', products);
        return sendJSON(res, 200, { success: true, message: '产品更新成功', data: products[index] });
      }
    }

    if (pathname.startsWith('/api/products/') && method === 'DELETE') {
      const id = pathname.split('/').pop();
      const index = products.findIndex(p => p.id === id);
      if (index === -1) return sendJSON(res, 404, { success: false, error: '产品不存在' });
      products.splice(index, 1);
      saveData('products.json', products);
      return sendJSON(res, 200, { success: true, message: '产品删除成功' });
    }

    if (pathname === '/api/news' && method === 'GET') {
      return sendJSON(res, 200, { success: true, data: newsItems, total: newsItems.length });
    }

    if (pathname === '/api/news' && method === 'POST') {
      const contentType = req.headers['content-type'] || '';
      
      if (contentType.includes('multipart/form-data')) {
        const { fields, files } = await parseMultipart(req);
        const data = { id: 'news-' + Date.now(), title: fields.title || '', summary: fields.summary || '', content: fields.content || '', category: fields.category || '', date: fields.date || new Date().toISOString().split('T')[0], image: files.image ? files.image.path : '', createdAt: new Date().toISOString() };
        console.log('📰 创建新闻:', data);
        newsItems.push(data);
        saveData('news.json', newsItems);
        return sendJSON(res, 200, { success: true, message: '新闻添加成功', data });
      } else {
        const data = await parseJSONBody(req);
        data.id = 'news-' + Date.now();
        data.createdAt = new Date().toISOString();
        newsItems.push(data);
        saveData('news.json', newsItems);
        return sendJSON(res, 200, { success: true, message: '新闻添加成功', data });
      }
    }

    if (pathname.startsWith('/api/news/') && method === 'GET') {
      const id = pathname.split('/').pop();
      const newsItem = newsItems.find(n => n.id === id);
      if (!newsItem) return sendJSON(res, 404, { success: false, error: '新闻不存在' });
      return sendJSON(res, 200, { success: true, data: newsItem });
    }

    if (pathname.startsWith('/api/news/') && method === 'PUT') {
      const id = pathname.split('/').pop();
      const index = newsItems.findIndex(n => n.id === id);
      if (index === -1) return sendJSON(res, 404, { success: false, error: '新闻不存在' });
      
      const contentType = req.headers['content-type'] || '';
      
      if (contentType.includes('multipart/form-data')) {
        const { fields, files } = await parseMultipart(req);
        const updateData = { ...newsItems[index] };
        
        if (fields.title !== undefined) updateData.title = fields.title;
        if (fields.summary !== undefined) updateData.summary = fields.summary;
        if (fields.content !== undefined) updateData.content = fields.content;
        if (fields.category !== undefined) updateData.category = fields.category;
        if (fields.date !== undefined) updateData.date = fields.date;
        
        if (files.image) updateData.image = files.image.path;
        
        newsItems[index] = updateData;
        saveData('news.json', newsItems);
        return sendJSON(res, 200, { success: true, message: '新闻更新成功', data: newsItems[index] });
      } else {
        const jsonBody = await parseJSONBody(req);
        newsItems[index] = { ...newsItems[index], ...jsonBody };
        saveData('news.json', newsItems);
        return sendJSON(res, 200, { success: true, message: '新闻更新成功', data: newsItems[index] });
      }
    }

    if (pathname.startsWith('/api/news/') && method === 'DELETE') {
      const id = pathname.split('/').pop();
      const index = newsItems.findIndex(n => n.id === id);
      if (index === -1) return sendJSON(res, 404, { success: false, error: '新闻不存在' });
      newsItems.splice(index, 1);
      saveData('news.json', newsItems);
      return sendJSON(res, 200, { success: true, message: '新闻删除成功' });
    }

    if (pathname === '/api/patents' && method === 'GET') {
      return sendJSON(res, 200, { success: true, data: patents, total: patents.length });
    }

    if (pathname === '/api/patents' && method === 'POST') {
      const contentType = req.headers['content-type'] || '';
      
      if (contentType.includes('multipart/form-data')) {
        const { fields, files } = await parseMultipart(req);
        const data = {
          id: 'patent-' + Date.now(),
          name: fields.name || '',
          patentNumber: fields.patentNumber || '',
          type: fields.type || '',
          date: fields.date || '',
          image: files.image ? files.image.path : '',
          createdAt: new Date().toISOString()
        };
        console.log('📄 创建专利:', data);
        patents.push(data);
        saveData('patents.json', patents);
        return sendJSON(res, 200, { success: true, message: '专利添加成功', data });
      } else {
        const data = await parseJSONBody(req);
        data.id = 'patent-' + Date.now();
        data.createdAt = new Date().toISOString();
        patents.push(data);
        saveData('patents.json', patents);
        return sendJSON(res, 200, { success: true, message: '专利添加成功', data });
      }
    }

    if (pathname.startsWith('/api/patents/') && method === 'PUT') {
      const id = pathname.split('/').pop();
      const index = patents.findIndex(p => p.id === id);
      if (index === -1) return sendJSON(res, 404, { success: false, error: '专利不存在' });
      
      const contentType = req.headers['content-type'] || '';
      
      if (contentType.includes('multipart/form-data')) {
        const { fields, files } = await parseMultipart(req);
        const updateData = { ...patents[index] };
        
        if (fields.name !== undefined) updateData.name = fields.name;
        if (fields.patentNumber !== undefined) updateData.patentNumber = fields.patentNumber;
        if (fields.type !== undefined) updateData.type = fields.type;
        if (fields.date !== undefined) updateData.date = fields.date;
        
        if (files.image) updateData.image = files.image.path;
        
        patents[index] = updateData;
        saveData('patents.json', patents);
        return sendJSON(res, 200, { success: true, message: '专利更新成功', data: patents[index] });
      } else {
        const updateData = await parseJSONBody(req);
        patents[index] = { ...patents[index], ...updateData };
        saveData('patents.json', patents);
        return sendJSON(res, 200, { success: true, message: '专利更新成功', data: patents[index] });
      }
    }

    if (pathname.startsWith('/api/patents/') && method === 'DELETE') {
      const id = pathname.split('/').pop();
      const index = patents.findIndex(p => p.id === id);
      if (index === -1) return sendJSON(res, 404, { success: false, error: '专利不存在' });
      patents.splice(index, 1);
      saveData('patents.json', patents);
      return sendJSON(res, 200, { success: true, message: '专利删除成功' });
    }

    if (pathname === '/api/health' && method === 'GET') {
      return sendJSON(res, 200, { success: true, message: 'Server is running', timestamp: new Date().toISOString(), stats: { submissions: submissions.length, products: products.length, news: newsItems.length, patents: patents.length } });
    }

    sendJSON(res, 404, { success: false, error: '接口不存在' });

  } catch (error) {
    console.error('错误:', error);
    sendJSON(res, 500, { success: false, error: '服务器内部错误: ' + error.message });
  }
});

server.listen(PORT, () => {
  console.log('✅ 后端服务已启动: http://localhost:' + PORT);
  console.log('📁 数据目录:', DATA_DIR);
  console.log('🖼️ 图片目录:', IMAGES_DIR);
  console.log('');
  console.log('📋 API 端点:');
  console.log('  POST /api/contact - 提交联系表单');
  console.log('  GET/POST /api/products - 产品管理');
  console.log('  GET/POST /api/news - 新闻管理');
  console.log('  GET/POST /api/patents - 专利管理');
  console.log('  GET /api/submissions - 获取提交记录');
  console.log('  GET /api/health - 健康检查');
});
