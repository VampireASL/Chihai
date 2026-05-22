import { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import FeatureCard from '@/components/FeatureCard';
import ProductCard from '@/components/ProductCard';
import NewsCard from '@/components/NewsCard';
import { features, productsData, newsData } from '@/data/mockData';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { API_URLS, API_BASE_URL } from '@/config/api';

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  category?: string;
  patentCount?: number;
}

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  image?: string;
  category?: string;
  date: string;
  content?: string;
  author?: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [productsRes, newsRes] = await Promise.all([
          fetch(API_URLS.products),
          fetch(API_URLS.news)
        ]);
        const productsResult = await productsRes.json();
        const newsResult = await newsRes.json();
        
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
        
        if (newsResult.success && newsResult.data.length > 0) {
          const formattedNews = newsResult.data.slice(0, 3).map((n: any) => ({
            ...n,
            image: n.image ? `${API_BASE_URL}${n.image}` : n.image
          }));
          setNews(formattedNews);
        } else {
          setNews(newsData.slice(0, 3));
        }
      } catch (error) {
        setProducts(productsData.slice(0, 4));
        setNews(newsData.slice(0, 3));
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
      <Hero />
      
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-secondary font-medium">核心优势</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
              为什么选择我们
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              我们致力于提供卓越的产品和服务，为客户创造更大价值
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
      
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-secondary font-medium">产品中心</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
              核心产品
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              创新技术驱动，打造高品质产品
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
      
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-secondary font-medium">新闻动态</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
              最新资讯
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              关注我们的最新动态和行业资讯
            </p>
          </div>
          
          <div className="space-y-6">
            {news.map((item) => (
              <NewsCard key={item.id} {...item} />
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link
              to="/news"
              className="inline-flex items-center space-x-2 px-6 py-3 border-2 border-primary text-primary font-medium rounded-lg hover:bg-primary hover:text-white transition-colors"
            >
              <span>查看更多新闻</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
