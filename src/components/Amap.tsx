import { ExternalLink } from 'lucide-react';

interface AmapProps {
  address: string;
  longitude?: number;
  latitude?: number;
  height?: string;
}

// 默认坐标：北京市朝阳区
const DEFAULT_POSITION = {
  longitude: 116.480881,
  latitude: 39.989410,
};

export default function Amap({
  address,
  longitude = DEFAULT_POSITION.longitude,
  latitude = DEFAULT_POSITION.latitude,
  height = '256px',
}: AmapProps) {
  // 构建高德地图静态图片URL
  const staticMapUrl = `https://restapi.amap.com/v3/staticmap?location=${longitude},${latitude}&zoom=15&size=800*400&markers=mid,0xFF6B6B,A:${longitude},${latitude}&key=${import.meta.env.VITE_AMAP_KEY || ''}`;
  
  // 构建高德地图跳转链接
  const mapUrl = `https://uri.amap.com/marker?position=${longitude},${latitude}&name=${encodeURIComponent(address)}&coordinate=gaode&callnative=0`;

  return (
    <div 
      className="relative rounded-lg overflow-hidden shadow-sm cursor-pointer group"
      style={{ height }}
      onClick={() => window.open(mapUrl, '_blank')}
    >
      {/* 静态地图图片 */}
      <img
        src={staticMapUrl}
        alt={address}
        className="w-full h-full object-cover"
        onError={(e) => {
          // 如果静态图加载失败，显示占位图
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent) {
            const fallback = document.createElement('div');
            fallback.className = 'w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center';
            fallback.innerHTML = `
              <div class="text-center">
                <div class="mb-3">
                  <svg class="w-14 h-14 mx-auto text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p class="text-gray-600 font-medium">${address}</p>
                <p class="text-gray-400 text-sm mt-2">点击查看地图</p>
              </div>
            `;
            parent.appendChild(fallback);
          }
        }}
      />

      {/* 覆盖层 - 悬停显示 */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
          <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-gray-700">点击在高德地图打开</span>
          </div>
        </div>
      </div>

      {/* 标记点（静态图上也会有，但我们加个额外的装饰） */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full pointer-events-none">
        <div className="relative">
          <div className="w-8 h-8 bg-primary rounded-full border-4 border-white shadow-lg flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full" />
          </div>
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-primary" />
        </div>
      </div>
    </div>
  );
}
