import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { productsData, patentsData } from '@/data/mockData';
import { FileText, Award } from 'lucide-react';
import { API_URLS, API_BASE_URL } from '@/config/api';

interface Product {
  id: string;
  name: string;
  description: string;
  image?: string;
  features?: string;
  specs?: string;
  category?: string;
  patentCount?: number;
}

interface Patent {
  id: string;
  name: string;
  patentNumber: string;
  type: string;
  date: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [patents, setPatents] = useState<Patent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [productsRes, patentsRes] = await Promise.all([
          fetch(API_URLS.products),
          fetch(API_URLS.patents)
        ]);
        const productsResult = await productsRes.json();
        const patentsResult = await patentsRes.json();
        
        if (productsResult.success && productsResult.data.length > 0) {
          const formattedProducts = productsResult.data.map((p: any) => ({
            ...p,
            image: p.image ? `${API_BASE_URL}${p.image}` : p.image,
            patentCount: p.patentCount || 0
          }));
          setProducts(formattedProducts);
        } else {
          setProducts(productsData);
        }
        setPatents(patentsResult.success && patentsResult.data.length > 0 
          ? (patentsResult.data as Patent[]) 
          : patentsData);
      } catch (error) {
        setProducts(productsData);
        setPatents(patentsData);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-secondary font-medium">产品中心</span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
              核心产品
            </h1>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              创新技术驱动，打造高品质产品
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-secondary font-medium">知识产权</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
              专利技术
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              我们拥有多项核心技术专利，持续创新引领行业发展
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patents.map((patent) => (
              <div
                key={patent.id}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-secondary" />
                  </div>
                  <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                    {patent.type}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{patent.name}</h3>
                <div className="flex items-center space-x-2 text-gray-500 text-sm">
                  <FileText className="w-4 h-4" />
                  <span>{patent.patentNumber}</span>
                </div>
                <p className="text-gray-400 text-sm mt-2">{patent.date}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-secondary mb-2">10+</div>
              <div className="text-white/80">核心产品</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary mb-2">50+</div>
              <div className="text-white/80">专利技术</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary mb-2">500+</div>
              <div className="text-white/80">服务客户</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary mb-2">98%</div>
              <div className="text-white/80">客户满意度</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
