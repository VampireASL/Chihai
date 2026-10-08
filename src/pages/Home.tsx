import { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import FeatureCard from '@/components/FeatureCard';
import ProductCard from '@/components/ProductCard';
import { features as defaultFeatures, productsData, clientsData } from '@/data/mockData';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Car, Building2, Tv, Zap, Grid3x3, Box, Wrench, Layers, Cpu, Gem, Plane, MoreHorizontal
} from 'lucide-react';
import { API_URLS, API_BASE_URL } from '@/config/api';

// 行业客户图标映射
const clientIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Car, Building2, Tv, Zap, Grid3x3, Box, Wrench, Layers, Cpu, Gem, Plane, MoreHorizontal
};

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  category?: string;
  patentCount?: number;
}

interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface HeroData {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  bgImage?: string;
}

interface SectionConfig {
  title: string;
  subtitle: string;
  description: string;
  bgImage?: string;
}

interface HomeSections {
  featuresSection: SectionConfig;
  productsSection: SectionConfig;
  clientsSection: SectionConfig;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [heroData, setHeroData] = useState<HeroData>({
    title: '创新驱动未来',
    subtitle: '赤海智能装备 - 引领行业变革，创造卓越价值',
    description: '专业从事自动化设备的研发、设计、制造及电阻焊设备制造，引进日本欧美先进技术，积累二十多年丰富经验',
    ctaText: '了解更多',
    bgImage: '',
  });
  const [features, setFeatures] = useState<Feature[]>(defaultFeatures);
  const [homeSections, setHomeSections] = useState<HomeSections>({
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
    clientsSection: {
      title: '行业客户',
      subtitle: '合作伙伴',
      description: '我们的产品广泛应用于以下行业领域，与众多优质客户建立了长期稳定的合作关系',
      bgImage: ''
    }
  });
  const [clients, setClients] = useState(clientsData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [settingsRes, productsRes] = await Promise.all([
          fetch(API_URLS.settings),
          fetch(API_URLS.products)
        ]);
        const settingsResult = await settingsRes.json();
        const productsResult = await productsRes.json();

        if (settingsResult.success) {
          setHeroData(settingsResult.data.hero);
          setFeatures(settingsResult.data.features || defaultFeatures);
          if (settingsResult.data.homeSections) {
            setHomeSections(settingsResult.data.homeSections);
          }
          setClients(settingsResult.data.clients || clientsData);
        }

        if (productsResult.success && productsResult.data.length > 0) {
          const formattedProducts = productsResult.data.slice(0, 4).map((p: any) => ({
            ...p,
            image: p.image ? `${API_BASE_URL}${p.image}` : p.image,
            patentCount: p.patentCount || 0
          }));
          setProducts(formattedProducts);
        } else {
          setProducts(productsData.slice(0, 4));
        }
      } catch (error) {
        setProducts(productsData.slice(0, 4));
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Hero
        title={heroData.title}
        subtitle={heroData.subtitle}
        description={heroData.description}
        ctaText={heroData.ctaText}
        bgImage={heroData.bgImage}
      />

      <section id="features" className="py-20 bg-gray-50 relative overflow-hidden">
        {homeSections.featuresSection.bgImage && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-10"
            style={{ backgroundImage: `url('${homeSections.featuresSection.bgImage}')` }}
          />
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <span className="text-secondary font-medium">{homeSections.featuresSection.subtitle}</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
              {homeSections.featuresSection.title}
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              {homeSections.featuresSection.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <FeatureCard
                key={feature.id}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white relative overflow-hidden">
        {homeSections.productsSection.bgImage && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-5"
            style={{ backgroundImage: `url('${homeSections.productsSection.bgImage}')` }}
          />
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <span className="text-secondary font-medium">{homeSections.productsSection.subtitle}</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
              {homeSections.productsSection.title}
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              {homeSections.productsSection.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
              />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/products"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primaryLight transition-colors"
            >
              <span>查看全部产品</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <span className="text-secondary font-medium">{homeSections.clientsSection.subtitle}</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
              {homeSections.clientsSection.title}
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              {homeSections.clientsSection.description}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {clients.map((client) => {
              const IconComp = clientIcons[client.icon] || MoreHorizontal;
              return (
                <div
                  key={client.id}
                  className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-secondary/30 transition-all flex flex-col items-center justify-center py-6 px-4"
                >
                  {client.logo ? (
                    <img
                      src={client.logo}
                      alt={client.name}
                      className="h-12 max-w-full object-contain"
                      onError={(e) => {
                        // logo 加载失败时隐藏，显示占位图标
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          const fallback = parent.querySelector('.client-fallback');
                          if (fallback) fallback.classList.remove('hidden');
                        }
                      }}
                    />
                  ) : null}
                  <div className={`client-fallback ${client.logo ? 'hidden' : ''} w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3 group-hover:bg-secondary/10 transition-colors`}>
                    <IconComp className="w-6 h-6 text-gray-400 group-hover:text-secondary transition-colors" />
                  </div>
                  <span className="text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
                    {client.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
