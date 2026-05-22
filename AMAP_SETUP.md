# 🚀 高德地图快速设置指南

## 📋 已完成的工作

✅ 创建了 `src/components/Amap.tsx` - 高德地图组件  
✅ 集成到了 `Contact.tsx` 页面  
✅ 添加了类型声明文件 `src/types/amap.d.ts`  
✅ 创建了配置示例文件 `.env.example`  
✅ 详细接入文档 `AMAP_GUIDE.md`

## 🔧 下一步操作（3步完成）

### 第1步：获取高德API Key

1. 访问 [高德开放平台](https://lbs.amap.com/)
2. 注册并登录
3. 进入「控制台」→「应用管理」→「我的应用」
4. 点击「创建新应用」，填写：
   - 应用名称：`ChiHai官网`
   - 应用类型：`Web端(JS API)`
5. 点击「添加Key」
6. 选择「Web端 (JS API)」，填写名称后获取Key

### 第2步：配置环境变量

创建 `.env.local` 文件：
```bash
# 复制 .env.example
cp .env.example .env.local
```

编辑 `.env.local`，填入您的Key：
```env
VITE_AMAP_KEY=您的高德Key
```

### 第3步：重启开发服务器

```bash
# 如果开发服务器正在运行，需要重启
# 停止后重新运行
npm run dev
```

## 📍 调整坐标（可选）

如果您的公司地址不是在朝阳区，请在 `src/pages/Contact.tsx` 中修改坐标：

```tsx
<Amap
  address={contactInfo.address}
  longitude={您的经度}   // 修改这里
  latitude={您的纬度}     // 修改这里
  height="256px"
/>
```

### 如何获取坐标？

方法一：使用高德地图拾取坐标
1. 访问 [地图坐标拾取](https://lbs.amap.com/tools/picker)
2. 搜索您的地址
3. 获取经纬度

方法二：修改 `mockData.ts` 中的地址并使用地理编码（进阶）

## 🎨 自定义地图样式

在 `src/components/Amap.tsx` 中可以修改样式：

```typescript
mapStyle: 'amap://styles/whitesmoke',  // ← 这里
// 可选：
// 'amap://styles/normal'      标准
// 'amap://styles/dark'        暗黑
// 'amap://styles/light'       简约
```

## ❓ 常见问题

**Q: 地图显示"请配置VITE_AMAP_KEY"?**  
A: 按照第2步创建 `.env.local` 文件并填入Key

**Q: 刷新后地图消失？**  
A: 修改环境变量后需要重启开发服务器

**Q: 部署到服务器后地图加载失败？**  
A: 在高德控制台配置域名白名单，添加您的域名

---

## 📚 更多文档

详细配置请参考：`AMAP_GUIDE.md`
