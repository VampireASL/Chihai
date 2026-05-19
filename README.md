# ChiHai 企业官网

一个现代化的企业官网，用于展示企业文化、产品专利和企业形象。

## 技术栈

- **前端**: React 18 + TypeScript
- **框架**: Vite 6
- **样式**: Tailwind CSS 3
- **图标**: Lucide React
- **路由**: React Router DOM 6

## 项目结构

```
src/
├── components/          # 组件目录
│   ├── Header.tsx      # 导航头部
│   ├── Footer.tsx      # 页脚
│   ├── Hero.tsx        # 首页Hero区域
│   ├── FeatureCard.tsx # 核心优势卡片
│   ├── ProductCard.tsx # 产品卡片
│   ├── NewsCard.tsx    # 新闻卡片
│   ├── Timeline.tsx    # 时间轴组件
│   └── ContactForm.tsx # 联系表单
├── pages/              # 页面目录
│   ├── Home.tsx        # 首页
│   ├── About.tsx       # 关于我们
│   ├── Products.tsx    # 产品专利
│   ├── News.tsx        # 新闻中心
│   └── Contact.tsx     # 联系我们
├── data/               # 数据目录
│   └── mockData.ts     # Mock数据
├── App.tsx             # 主应用组件
├── main.tsx            # 入口文件
└── index.css           # 全局样式
```

## 功能特性

- **首页**: 企业形象展示、核心优势、产品亮点、新闻动态
- **关于我们**: 企业文化、使命愿景、发展历程时间轴
- **产品专利**: 产品展示、专利技术列表、数据统计
- **新闻中心**: 新闻列表、分类筛选
- **联系我们**: 联系表单、公司信息

## 安装和运行

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 生产构建
npm run build

# 预览构建结果
npm run preview
```

## 设计风格

- **主色调**: 深蓝色 (#1a365d) - 传递专业、信任、稳重
- **辅助色**: 金色 (#d4af37) - 传递品质、高端感
- **字体**: 思源黑体 (中文), Roboto (英文)
- **布局**: 简洁大气的卡片式布局

## 响应式设计

- 支持桌面端、平板端、移动端自适应布局
- 移动端汉堡菜单导航

## License

MIT