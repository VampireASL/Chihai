# 高德地图接入指南

## 📋 准备工作

### 1. 注册高德开发者账号
访问 [高德开放平台](https://lbs.amap.com/) 注册开发者账号

### 2. 创建应用获取Key
1. 登录后进入 [控制台](https://console.amap.com/)
2. 点击「应用管理」→「我的应用」
3. 点击「创建新应用」
4. 应用名称填写：`ChiHai官网`
5. 应用类型选择：`Web端(JS API)`
6. 点击「确定」
7. 点击「添加Key」
8. 选择服务平台：`Web端 (JS API)`
9. 填写名称：`ChiHai官网地图`
10. 域名白名单填写您的域名（开发阶段可留空或填 `*`）
11. 点击「提交」，获取到 Key

## 🚀 快速接入

### 方式一：直接在 index.html 中引入（推荐）

修改 `index.html`：
```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ChiHai - 企业官网</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <!-- 引入高德地图API -->
    <script type="text/javascript">
      window._AMapSecurityConfig = {
        securityJsCode: '您的安全密钥(Service Security)',
      };
    </script>
    <script type="text/javascript" src="https://webapi.amap.com/loader.js"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### 方式二：创建独立的地图组件

创建 `src/components/Amap.tsx`：

```tsx
import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

interface AmapProps {
  address: string;
  longitude?: number;
  latitude?: number;
  height?: string;
}

// 默认坐标：北京市朝阳区（根据实际地址调整）
const DEFAULT_POSITION = {
  longitude: 116.480881,
  latitude: 39.989410,
};

export default function Amap({ 
  address, 
  longitude = DEFAULT_POSITION.longitude, 
  latitude = DEFAULT_POSITION.latitude,
  height = '256px'
}: AmapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const loadMap = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 检查高德API是否已加载
        if (!window.AMap && !window.AMapLoader) {
          throw new Error('高德地图API未正确加载');
        }

        // 使用loader加载地图
        if (window.AMapLoader) {
          const AMap = await window.AMapLoader.load({
            key: '您的高德Key', // 替换为您的Key
            version: '2.0',
            plugins: ['AMap.Marker', 'AMap.Geocoder'],
          });

          // 创建地图实例
          const map = new AMap.Map(mapRef.current, {
            zoom: 15,
            center: [longitude, latitude],
            viewMode: '3D',
            pitch: 40,
          });

          // 添加标记点
          const marker = new AMap.Marker({
            position: [longitude, latitude],
            title: address,
            animation: 'AMAP_ANIMATION_DROP',
          });
          map.add(marker);

          // 添加信息窗体
          const infoWindow = new AMap.InfoWindow({
            content: `<div style="padding:10px;font-size:14px;color:#333;font-weight:bold;">${address}</div>`,
            offset: new AMap.Pixel(0, -30),
          });

          marker.on('click', () => {
            infoWindow.open(map, marker.getPosition());
          });

          // 自动调整视野
          map.setFitView();
        }
      } catch (err) {
        console.error('地图加载失败:', err);
        setError('地图加载失败，请检查网络或联系管理员');
      } finally {
        setIsLoading(false);
      }
    };

    // 延迟加载，确保DOM已渲染
    const timer = setTimeout(() => {
      loadMap();
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [address, longitude, latitude]);

  if (error) {
    return (
      <div className="w-full h-full bg-gray-100 rounded-lg flex flex-col items-center justify-center">
        <MapPin className="w-12 h-12 text-gray-400 mb-2" />
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-full bg-gray-100 rounded-lg flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-500">地图加载中...</p>
      </div>
    );
  }

  return <div ref={mapRef} style={{ width: '100%', height }} className="rounded-lg overflow-hidden" />;
}
```

## 🔧 类型声明

在项目中添加类型声明文件 `src/vite-env.d.ts` 或 `src/types/amap.d.ts`：

```typescript
/// <reference types="vite/client" />

interface Window {
  AMap?: any;
  AMapLoader?: {
    load: (config: any) => Promise<any>;
  };
  _AMapSecurityConfig?: {
    securityJsCode: string;
  };
}
```

## 📍 获取真实坐标

### 使用地理编码获取地址坐标

```tsx
// 在组件中添加地理编码功能
const getGeocode = async (address: string, AMap: any) => {
  const geocoder = new AMap.Geocoder();
  
  return new Promise((resolve, reject) => {
    geocoder.getLocation(address, (status: string, result: any) => {
      if (status === 'complete' && result.geocodes.length) {
        const location = result.geocodes[0].location;
        resolve([location.lng, location.lat]);
      } else {
        reject(new Error('未找到地址坐标'));
      }
    });
  });
};
```

### 常用北京坐标参考
| 地点 | 经度 | 纬度 |
|------|------|------|
| 天安门 | 116.403874 | 39.914885 |
| 朝阳区 | 116.480881 | 39.989410 |
| 中关村 | 116.322322 | 39.983621 |

## 🎨 地图样式配置

```tsx
const map = new AMap.Map(mapRef.current, {
  zoom: 15,
  center: [longitude, latitude],
  viewMode: '3D',
  pitch: 40,
  rotation: 0,
  mapStyle: 'amap://styles/normal', // 标准风格
  // mapStyle: 'amap://styles/whitesmoke', // 清新风格
  // mapStyle: 'amap://styles/dark', // 暗黑风格
  // mapStyle: 'amap://styles/light', // 简约风格
});
```

## ⚠️ 安全注意事项

1. **不要将Key提交到公共仓库**
   - 使用环境变量管理Key
   - 在 `.env` 中配置

2. **配置域名白名单**
   - 在高德控制台配置允许访问的域名
   - 开发阶段可用 `*` 临时允许所有

3. **生产环境使用安全密钥**
   - 配置 `securityJsCode`
   - 使用服务端代理方式请求

## 🔄 使用环境变量

创建 `.env.local` 文件：
```env
VITE_AMAP_KEY=您的高德Key
VITE_AMAP_SECURITY_CODE=您的安全密钥
```

在代码中使用：
```typescript
const AMap = await window.AMapLoader.load({
  key: import.meta.env.VITE_AMAP_KEY,
  version: '2.0',
  plugins: ['AMap.Marker', 'AMap.Geocoder'],
});
```

## 📚 更多功能

- [自定义标记图标](https://lbs.amap.com/api/jsapi-v2/guide/map/markers)
- [添加路线规划](https://lbs.amap.com/api/jsapi-v2/guide/transfer/route/)
- [添加POI搜索](https://lbs.amap.com/api/jsapi-v2/guide/services/search/)
- [自定义地图样式](https://lbs.amap.com/api/jsapi-v2/guide/map/map-style/)
