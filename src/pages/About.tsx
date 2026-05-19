import Timeline from '@/components/Timeline';
import { companyInfo } from '@/data/mockData';
import { Target, Eye, Heart } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-secondary font-medium">关于我们</span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
              ChiHai科技
            </h1>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              致力于通过技术创新，为客户创造价值，推动行业进步
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">企业使命</h3>
              <p className="text-gray-600">{companyInfo.mission}</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">企业愿景</h3>
              <p className="text-gray-600">{companyInfo.vision}</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">核心价值观</h3>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {companyInfo.values.map((value) => (
                  <span
                    key={value}
                    className="px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-medium"
                  >
                    {value}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-secondary font-medium">发展历程</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
              公司里程碑
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              回顾我们的成长历程，见证每一个重要时刻
            </p>
          </div>
          
          <Timeline />
        </div>
      </section>
      
      <section className="py-16 bg-gradient-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            加入我们
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            我们正在寻找志同道合的伙伴，共同推动科技创新
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-8 py-3 bg-secondary text-primary font-semibold rounded-lg hover:bg-secondary/90 transition-colors"
          >
            联系我们
          </a>
        </div>
      </section>
    </div>
  );
}
