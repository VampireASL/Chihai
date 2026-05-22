import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Share2, Calendar, FileText } from 'lucide-react';
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

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [itemRes, listRes] = await Promise.all([
          fetch(`${API_URLS.news}/${id}`),
          fetch(API_URLS.news)
        ]);
        
        const itemResult = await itemRes.json();
        const listResult = await listRes.json();
        
        setNewsItem(itemResult.success ? (itemResult.data as NewsItem) : null);
        setNewsList(listResult.success && listResult.data.length > 0 
          ? (listResult.data as NewsItem[]) 
          : newsData);
      } catch (error) {
        const localNews = newsData.find(n => n.id === id);
        setNewsItem(localNews || null);
        setNewsList(newsData);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleShare = () => {
    if (navigator.share && newsItem) {
      navigator.share({
        title: newsItem.title,
        text: newsItem.summary,
        url: window.location.href
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!newsItem) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">新闻不存在</p>
          <button
            onClick={() => navigate('/news')}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primaryLight"
          >
            返回新闻列表
          </button>
        </div>
      </div>
    );
  }

  const currentIndex = newsList.findIndex(n => n.id === newsItem.id);
  const prevNews = currentIndex > 0 ? newsList[currentIndex - 1] : null;
  const nextNews = currentIndex < newsList.length - 1 ? newsList[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/news"
            className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回新闻列表</span>
          </Link>
          <button
            onClick={handleShare}
            className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
          >
            <Share2 className="w-5 h-5" />
            <span>分享</span>
          </button>
        </div>

        <article className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="aspect-video bg-gray-100">
            {newsItem.image ? (
              <img
                src={`${API_BASE_URL}${newsItem.image}`}
                alt={newsItem.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <FileText className="w-16 h-16" />
              </div>
            )}
          </div>

          <div className="p-6 md:p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center space-x-2 text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>{newsItem.date}</span>
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              {newsItem.title}
            </h1>

            <p className="text-gray-600 text-lg mb-6">{newsItem.summary}</p>

            {newsItem.content && (
              <div className="prose prose-lg max-w-none">
                {newsItem.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-600 mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </div>
        </article>

        <div className="mt-8 flex justify-between items-center">
          {prevNews ? (
            <Link
              to={`/news/${prevNews.id}`}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <div className="text-left">
                <p className="text-sm text-gray-500">上一篇</p>
                <p className="font-medium text-gray-800">{prevNews.title}</p>
              </div>
            </Link>
          ) : (
            <div className="w-48"></div>
          )}

          {nextNews ? (
            <Link
              to={`/news/${nextNews.id}`}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="text-right">
                <p className="text-sm text-gray-500">下一篇</p>
                <p className="font-medium text-gray-800">{nextNews.title}</p>
              </div>
              <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <div className="w-48"></div>
          )}
        </div>
      </div>
    </div>
  );
}
