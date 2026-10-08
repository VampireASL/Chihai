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
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

const loadSettings = () => {
  const filePath = path.join(DATA_DIR, 'siteSettings.json');
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
};

const defaultSettings = {
  hero: {
    title: '创新驱动未来',
    subtitle: '赤海智能装备 - 引领行业变革，创造卓越价值',
    description: '专业从事自动化设备的研发、设计、制造及电阻焊设备制造，引进日本欧美先进技术，积累二十多年丰富经验',
    ctaText: '了解更多',
    bgImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20technology%20corporate%20building%20with%20glass%20facade%20at%20sunset%20professional%20architecture&image_size=landscape_16_9'
  },
  features: [
    { id: '1', icon: 'Lightbulb', title: '创新研发', description: '持续投入研发，保持技术领先，推动行业创新发展' },
    { id: '2', icon: 'Shield', title: '品质保障', description: '严格的质量控制体系，确保产品品质始终如一' },
    { id: '3', icon: 'Users', title: '客户至上', description: '以客户需求为导向，提供优质的服务和解决方案' },
    { id: '4', icon: 'Award', title: '行业领先', description: '荣获多项行业认证和荣誉，树立行业标杆' }
  ],
  // 首页各section配置
  homeSections: {
    featuresSection: {
      title: '核心优势',
      subtitle: '为什么选择我们',
      description: '我们致力于提供卓越的产品和服务，为客户创造更大价值',
      bgImage: ''
    },
    productsSection: {
      title: '核心产品',
      subtitle: '产品中心',
      description: '创新技术驱动，打造高品质产品',
      bgImage: ''
    },
    newsSection: {
      title: '最新资讯',
      subtitle: '新闻动态',
      description: '关注我们的最新动态和行业资讯',
      bgImage: ''
    },
    clientsSection: {
      title: '行业客户',
      subtitle: '合作伙伴',
      description: '我们的产品广泛应用于以下行业领域，与众多优质客户建立了长期稳定的合作关系',
      bgImage: ''
    }
  },
  // 首页行业客户展示
  clients: [
    { id: 'client-1', name: '汽车制造', icon: 'Car' },
    { id: 'client-2', name: '电梯制造', icon: 'Building2' },
    { id: 'client-3', name: '家用电器', icon: 'Tv' },
    { id: 'client-4', name: '低压电器', icon: 'Zap' },
    { id: 'client-5', name: '金属网片', icon: 'Grid3x3' },
    { id: 'client-6', name: '机箱机柜', icon: 'Box' },
    { id: 'client-7', name: '五金制品', icon: 'Wrench' },
    { id: 'client-8', name: '不锈钢制品', icon: 'Layers' },
    { id: 'client-9', name: '电器元件', icon: 'Cpu' },
    { id: 'client-10', name: '铝制品', icon: 'Gem' },
    { id: 'client-11', name: '航天航空', icon: 'Plane' },
    { id: 'client-12', name: '更多行业', icon: 'MoreHorizontal' }
  ],
  companyInfo: {
    introduction: '赤海智能装备科技（徐州）有限公司专业从事各种自动化设备的研发、设计、制造及电阻焊设备制造的生产企业，引进日本，欧美最先进的技术及生产工艺，集众多经验丰富的高级技术人才，积累二十多年的丰富经验，为智能制造奠定坚实基础，大步迈向智慧制造的创新领域。',
    applications: '公司产品被广泛应用于汽车制造行业、电梯制造行业、家用电器、低压电器、金属网片、机箱机柜、五金制品、不锈钢制品、电器元件、铝制品、航天航空等领域。',
    philosophy: '社会的发展、市场的需求造就了上海赤海公司的茁壮成长，新瞻公司将一如既往地秉承"诚信为本，创新为魂"的理念，洞悉科技前瞻，专注行业应用，为客户和社会创造价值。',
    mission: '致力于通过技术创新，为客户创造价值，推动行业进步',
    vision: '成为全球领先的科技创新企业',
    values: ['创新', '诚信', '责任', '共赢']
  },
  contactInfo: {
    address: '徐州经济技术开发区大庙街道办事处文化路1号501室',
    phone: '0516-83358899',
    email: 'contact@chihai.com',
    workingHours: '周一至周五 9:00-18:00'
  },
  timeline: [
    { id: 't1', year: '2024', title: '技术突破', description: '获得多项核心技术专利，产品远销海外市场' },
    { id: 't2', year: '2023', title: '快速发展', description: '完成A轮融资，公司规模扩大至200人' },
    { id: 't3', year: '2022', title: '产品上线', description: '首款核心产品正式发布，获得市场认可' },
    { id: 't4', year: '2019', title: '公司成立', description: '赤海智能装备科技(徐州)有限公司正式成立，专注于科技创新' }
  ],
  navLinks: [
    { name: '首页', path: '/' },
    { name: '关于我们', path: '/about' },
    { name: '产品专利', path: '/products' },
    { name: '新闻中心', path: '/news' },
    { name: '联系我们', path: '/contact' }
  ],
  footerLinks: [
    {
      title: '产品服务',
      links: [
        { name: '智能控制系统', path: '/products' },
        { name: '物联网传感器', path: '/products' },
        { name: '数据分析平台', path: '/products' },
        { name: '新能源解决方案', path: '/products' }
      ]
    },
    {
      title: '关于我们',
      links: [
        { name: '公司介绍', path: '/about' },
        { name: '发展历程', path: '/about' },
        { name: '企业文化', path: '/about' },
        { name: '新闻动态', path: '/news' }
      ]
    },
    {
      title: '支持',
      links: [
        { name: '帮助中心', path: '#' },
        { name: '技术文档', path: '#' },
        { name: '常见问题', path: '#' },
        { name: '联系我们', path: '/contact' }
      ]
    }
  ]
};

let siteSettings = loadSettings();
if (!siteSettings) {
  console.log(' 初始化站点设置...');
  siteSettings = defaultSettings;
  saveData('siteSettings.json', siteSettings);
} else {
  // 合并新增的默认字段（如 clients、clientsSection），不影响已有配置
  const homeSections = { ...defaultSettings.homeSections, ...(siteSettings.homeSections || {}) };
  siteSettings = {
    ...defaultSettings,
    ...siteSettings,
    homeSections,
    clients: siteSettings.clients || defaultSettings.clients
  };
  saveData('siteSettings.json', siteSettings);
}

let submissions = loadData('submissions.json');
let products = loadData('products.json');
let newsItems = loadData('news.json');
let patents = loadData('patents.json');

// 默认数据
const defaultProducts = [
  { id: 'prod-1', name: '智能控制系统', description: '基于AI技术的智能控制系统，实现生产过程自动化', features: 'AI智能控制\n自动化生产\n实时监控', specs: '精度: ±0.01mm\n响应时间: <10ms\n兼容性: 支持主流PLC', image: '', createdAt: new Date().toISOString() },
  { id: 'prod-2', name: '物联网传感器', description: '高精度物联网传感器，实时监测环境数据', features: '高精度测量\n无线传输\n低功耗设计', specs: '精度: 0.1%\n传输距离: 100m\n电池寿命: 5年', image: '', createdAt: new Date().toISOString() },
  { id: 'prod-3', name: '数据分析平台', description: '大数据分析平台，助力企业数据驱动决策', features: '实时数据分析\n可视化报表\n智能预测', specs: '处理速度: 10万条/秒\n存储容量: 无限扩展\n支持格式: CSV/JSON/SQL', image: '', createdAt: new Date().toISOString() },
  { id: 'prod-4', name: '新能源解决方案', description: '绿色能源解决方案，推动可持续发展', features: '节能减排\n智能调度\n绿色认证', specs: '节能率: 30%\n碳排放减少: 50%\n投资回报期: 3年', image: '', createdAt: new Date().toISOString() }
];

const defaultNews = [
  { id: 'news-1', title: '赤海智能装备荣获年度创新企业奖', summary: '公司凭借在智能制造领域的突出贡献，荣获年度创新企业奖', content: '近日，赤海智能装备科技(徐州)有限公司凭借在智能制造领域的突出贡献，荣获年度创新企业奖。这一荣誉是对公司多年来坚持技术创新、品质至上的最好肯定。', category: '公司新闻', date: '2024-03-15', image: '', createdAt: new Date().toISOString() },
  { id: 'news-2', title: '新一代智能控制系统正式发布', summary: '公司最新研发的智能控制系统正式上线，性能提升50%', content: '经过两年的研发，公司最新一代智能控制系统正式发布。新系统采用先进的AI算法，性能较上一代提升50%，将为客户带来更高效的生产体验。', category: '产品发布', date: '2024-02-20', image: '', createdAt: new Date().toISOString() },
  { id: 'news-3', title: '公司与多家知名企业达成战略合作', summary: '赤海智能装备与多家行业龙头企业签署战略合作协议', content: '近日，赤海智能装备与多家行业龙头企业签署战略合作协议，将在智能制造、技术创新等领域展开深度合作，共同推动行业发展。', category: '合作动态', date: '2024-01-10', image: '', createdAt: new Date().toISOString() }
];

const defaultPatents = [
  { id: 'patent-1', name: '一种智能焊接控制系统', patentNumber: 'ZL202410001234.5', type: '发明专利', date: '2024-01-15', image: '', createdAt: new Date().toISOString() },
  { id: 'patent-2', name: '高精度传感器校准方法', patentNumber: 'ZL202310005678.9', type: '发明专利', date: '2023-11-20', image: '', createdAt: new Date().toISOString() },
  { id: 'patent-3', name: '自动化生产线优化系统', patentNumber: 'ZL202320009012.3', type: '实用新型', date: '2023-09-08', image: '', createdAt: new Date().toISOString() }
];

// 如果数据为空，用默认数据初始化
if (products.length === 0) {
  products = defaultProducts;
  saveData('products.json', products);
  console.log(' 初始化默认产品数据...');
}
if (newsItems.length === 0) {
  newsItems = defaultNews;
  saveData('news.json', newsItems);
  console.log(' 初始化默认新闻数据...');
}
if (patents.length === 0) {
  patents = defaultPatents;
  saveData('patents.json', patents);
  console.log(' 初始化默认专利数据...');
}

const setCORSHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

const sendJSON = (res, statusCode, data) => {
  setCORSHeaders(res);
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
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
        
        const boundary = '--' + boundaryMatch[1].trim();
        const result = { fields: {}, files: {} };
        
        // 用 UTF-8 解码整个 buffer 来解析 header
        const fullStr = buffer.toString('utf8');
        const parts = fullStr.split(boundary);
        
        // 跳过第一个和最后一个part
        for (let i = 1; i < parts.length - 1; i++) {
          let part = parts[i];
          
          // 跳过开头的 \r\n
          part = part.replace(/^(\r\n|\n|\r)/, '');
          
          // 找到 header 和 body 的分隔
          const headerEnd = part.indexOf('\r\n\r\n');
          if (headerEnd === -1) continue;
          
          const headerStr = part.substring(0, headerEnd);
          let bodyStr = part.substring(headerEnd + 4);
          
          // 去掉 body 末尾的 \r\n
          bodyStr = bodyStr.replace(/(\r\n|\n|\r)$/, '');
          
          // 解析 name
          const nameMatch = headerStr.match(/name="([^"]+)"/);
          if (!nameMatch) continue;
          
          const name = nameMatch[1];
          const filenameMatch = headerStr.match(/filename="([^"]+)"/);
          
          if (filenameMatch && filenameMatch[1]) {
            // 文件 - 需要用原始 buffer 来提取文件内容（保持二进制）
            const filename = filenameMatch[1];
            const ext = path.extname(filename).toLowerCase();
            const safeExt = ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext) ? ext : '.jpg';
            const newFilename = Date.now() + '-' + Math.random().toString(36).substring(2, 8) + safeExt;
            const filepath = path.join(IMAGES_DIR, newFilename);
            
            // 从原始 buffer 中提取文件二进制内容
            // 找到这个 part 在原始 buffer 中的位置
            const headerStart = buffer.indexOf(Buffer.from(headerStr.substring(0, 50), 'utf8'));
            if (headerStart !== -1) {
              const bodyStart = headerStart + headerStr.length + 4; // +4 for \r\n\r\n
              const partEndStr = i < parts.length - 2 ? boundary : '';
              let bodyEnd;
              if (partEndStr) {
                bodyEnd = buffer.indexOf(Buffer.from('\r\n' + partEndStr), bodyStart);
                if (bodyEnd === -1) bodyEnd = buffer.indexOf(Buffer.from(partEndStr), bodyStart);
              } else {
                bodyEnd = buffer.length;
              }
              if (bodyEnd === -1) bodyEnd = buffer.length;
              
              const fileBuffer = buffer.subarray(bodyStart, bodyEnd);
              fs.writeFileSync(filepath, fileBuffer);
            } else {
              // fallback: 用 utf8 写入
              fs.writeFileSync(filepath, bodyStr, 'utf8');
            }
            
            result.files[name] = { filename, path: '/uploads/' + newFilename };
          } else {
            // 普通字段 - 使用 UTF-8 字符串
            result.fields[name] = bodyStr;
          }
        }
        
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

    // ========== 站点设置 API ==========
    if (pathname === '/api/settings' && method === 'GET') {
      return sendJSON(res, 200, { success: true, data: siteSettings });
    }

    if (pathname === '/api/settings' && method === 'PUT') {
      const updateData = await parseJSONBody(req);
      siteSettings = { ...siteSettings, ...updateData };
      saveData('siteSettings.json', siteSettings);
      return sendJSON(res, 200, { success: true, message: '设置更新成功', data: siteSettings });
    }

    // ========== 通用图片上传 API ==========
    if (pathname === '/api/upload' && method === 'POST') {
      const contentType = req.headers['content-type'] || '';
      if (!contentType.includes('multipart/form-data')) {
        return sendJSON(res, 400, { success: false, error: '请上传文件' });
      }
      const { files } = await parseMultipart(req);
      if (!files.image && !files.file) {
        return sendJSON(res, 400, { success: false, error: '未找到上传文件' });
      }
      const uploadedFile = files.image || files.file;
      return sendJSON(res, 200, { success: true, message: '上传成功', data: { path: uploadedFile.path } });
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
