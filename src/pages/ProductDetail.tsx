import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Award, FileText, CheckCircle, Calendar } from 'lucide-react';
import { productsData, patentsData } from '@/data/mockData';
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

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [patents, setPatents] = useState<Patent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [productRes, productsRes, patentsRes] = await Promise.all([
          fetch(`${API_URLS.products}/${id}`),
          fetch(API_URLS.products),
          fetch(API_URLS.patents)
        ]);
        
        const productResult = await productRes.json();
        const productsResult = await productsRes.json();
        const patentsResult = await patentsRes.json();
        
        setProduct(productResult.success ? (productResult.data as Product) : null);
        setProducts(productsResult.success && productsResult.data.length > 0 
          ? (productsResult.data as Product[]) 
          : productsData);
        setPatents(patentsResult.success && patentsResult.data.length > 0 
          ? (patentsResult.data as Patent[]) 
          : patentsData);
      } catch (error) {
        const localProduct = productsData.find(p => p.id === id);
        setProduct(localProduct || null);
        setProducts(productsData);
        setPatents(patentsData);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">产品不存在</p>
          <button
            onClick={() => navigate('/products')}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primaryLight"
          >
            返回产品列表
          </button>
        </div>
      </div>
    );
  }

  const currentIndex = products.findIndex(p => p.id === product.id);
  const prevProduct = currentIndex > 0 ? products[currentIndex - 1] : null;
  const nextProduct = currentIndex < products.length - 1 ? products[currentIndex + 1] : null;

  const productPatents = patents.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <Link
            to="/products"
            className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回产品列表</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
            {product.image ? (
              <img
                src={`${API_BASE_URL}${product.image}`}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <FileText className="w-16 h-16" />
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                产品详情
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {product.name}
            </h1>
            <p className="text-gray-600 text-lg mb-6">{product.description}</p>

            {product.features && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  产品特性
                </h3>
                <ul className="space-y-2">
                  {product.features.split('\n').filter(f => f.trim()).map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.specs && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">技术规格</h3>
                <pre className="bg-gray-100 p-4 rounded-lg text-gray-600 whitespace-pre-wrap font-mono text-sm">
                  {product.specs}
                </pre>
              </div>
            )}
          </div>
        </div>

        {productPatents.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Award className="w-6 h-6 mr-2 text-secondary" />
              相关专利
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {productPatents.map((patent) => (
                <div
                  key={patent.id}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                      <Award className="w-5 h-5 text-secondary" />
                    </div>
                    <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                      {patent.type}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{patent.name}</h3>
                  <div className="flex items-center space-x-2 text-gray-500 text-sm">
                    <FileText className="w-4 h-4" />
                    <span>{patent.patentNumber}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400 text-sm mt-2">
                    <Calendar className="w-4 h-4" />
                    <span>{patent.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="mt-12 flex justify-between items-center">
          {prevProduct ? (
            <Link
              to={`/products/${prevProduct.id}`}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <div className="text-left">
                <p className="text-sm text-gray-500">上一篇</p>
                <p className="font-medium text-gray-800">{prevProduct.name}</p>
              </div>
            </Link>
          ) : (
            <div className="w-48"></div>
          )}

          {nextProduct ? (
            <Link
              to={`/products/${nextProduct.id}`}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="text-right">
                <p className="text-sm text-gray-500">下一篇</p>
                <p className="font-medium text-gray-800">{nextProduct.name}</p>
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
