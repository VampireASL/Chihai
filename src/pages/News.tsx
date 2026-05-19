import NewsCard from '@/components/NewsCard';
import { news } from '@/data/mockData';
import { useState } from 'react';

const categories = ['全部', '企业荣誉', '产品发布', '合作动态', '企业动态'];

export default function News() {
  const [activeCategory, setActiveCategory] = useState('全部');

  const filteredNews = activeCategory === '全部'
    ? news
    : news.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-secondary font-medium">新闻动态</span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
              最新资讯
            </h1>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              关注我们的最新动态和行业资讯
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  activeCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {filteredNews.map((item) => (
              <NewsCard key={item.id} {...item} />
            ))}
          </div>

          {filteredNews.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">暂无相关新闻</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
