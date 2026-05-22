import { useState, useEffect } from 'react';
import NewsCard from '@/components/NewsCard';
import { newsData } from '@/data/mockData';
import { API_URLS, API_BASE_URL } from '@/config/api';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content?: string;
  image?: string;
  date: string;
  category?: string;
  author?: string;
}

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(API_URLS.news);
        const result = await response.json();
        if (result.success && result.data.length > 0) {
          const formattedNews = result.data.map((n: any) => ({
            ...n,
            image: n.image ? `${API_BASE_URL}${n.image}` : n.image
          }));
          setNews(formattedNews);
        } else {
          setNews(newsData);
        }
      } catch (error) {
        setNews(newsData);
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
            <span className="text-secondary font-medium">新闻动态</span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
              新闻中心
            </h1>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              关注我们的最新动态和行业资讯
            </p>
          </div>
          
          <div className="space-y-6">
            {news.map((item) => (
              <NewsCard key={item.id} {...item} />
            ))}
          </div>
          
          {news.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500">暂无新闻</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
