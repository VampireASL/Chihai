import { useState, useEffect } from 'react';
import { 
  Package, 
  Newspaper, 
  Award, 
  Mail, 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  X,
  Save,
  Image as ImageIcon,
  FileText
} from 'lucide-react';
import { API_URLS, API_BASE_URL } from '@/config/api';

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  features: string;
  specs: string;
  createdAt?: string;
}

interface News {
  id: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  date: string;
  createdAt?: string;
}

interface Patent {
  id: string;
  name: string;
  patentNumber: string;
  type: string;
  date: string;
  image?: string;
  createdAt?: string;
}

interface Submission {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  timestamp: string;
  read: boolean;
}

type TabType = 'products' | 'news' | 'patents' | 'submissions';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<TabType>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [newsItems, setNewsItems] = useState<News[]>([]);
  const [patents, setPatents] = useState<Patent[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedItem, setSelectedItem] = useState<Product | News | Patent | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [imagePreview, setImagePreview] = useState<string>('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const url = activeTab === 'products' ? API_URLS.products :
                 activeTab === 'news' ? API_URLS.news :
                 activeTab === 'patents' ? API_URLS.patents :
                 activeTab === 'submissions' ? API_URLS.submissions : '';
      const response = await fetch(url);
      const result = await response.json();
      if (result.success) {
        if (activeTab === 'products') setProducts(result.data);
        else if (activeTab === 'news') setNewsItems(result.data);
        else if (activeTab === 'patents') setPatents(result.data);
        else if (activeTab === 'submissions') setSubmissions(result.data);
      }
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setModalMode('add');
    setSelectedItem(null);
    setFormData({});
    setImagePreview('');
    setShowModal(true);
  };

  const handleEdit = (item: Product | News | Patent) => {
    setModalMode('edit');
    setSelectedItem(item);
    setFormData({ ...item });
    setImagePreview(item.image ? `${API_BASE_URL}${item.image}` : '');
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除吗？')) return;
    try {
      const url = activeTab === 'products' ? API_URLS.products :
                 activeTab === 'news' ? API_URLS.news :
                 activeTab === 'patents' ? API_URLS.patents :
                 activeTab === 'submissions' ? API_URLS.submissions : '';
      const response = await fetch(`${url}/${id}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      if (result.success) {
        showMessage('删除成功', 'success');
        loadData();
      } else {
        showMessage(result.error || '删除失败', 'error');
      }
    } catch (error) {
      showMessage('删除失败', 'error');
    }
  };

  const handleMarkRead = async (id: number) => {
    try {
      await fetch(`${API_URLS.submissions}/${id}/read`, {
        method: 'PUT'
      });
      loadData();
    } catch (error) {
      console.error('标记失败:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    const formDataObj = new FormData(form);
    
    try {
      const baseUrl = activeTab === 'products' ? API_URLS.products :
                     activeTab === 'news' ? API_URLS.news :
                     activeTab === 'patents' ? API_URLS.patents :
                     activeTab === 'submissions' ? API_URLS.submissions : '';
      const url = modalMode === 'add' 
        ? baseUrl 
        : `${baseUrl}/${selectedItem?.id}`;
      
      const method = modalMode === 'add' ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        body: formDataObj
      });
      
      const result = await response.json();
      if (result.success) {
        showMessage(modalMode === 'add' ? '添加成功' : '更新成功', 'success');
        setShowModal(false);
        loadData();
      } else {
        showMessage(result.error || '操作失败', 'error');
      }
    } catch (error) {
      showMessage('操作失败', 'error');
    }
  };

  const showMessage = (msg: string, type: 'success' | 'error') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const tabs = [
    { id: 'products' as TabType, label: '产品管理', icon: Package },
    { id: 'news' as TabType, label: '新闻管理', icon: Newspaper },
    { id: 'patents' as TabType, label: '专利管理', icon: Award },
    { id: 'submissions' as TabType, label: '表单提交', icon: Mail },
  ];

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (activeTab === 'products') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-video bg-gray-100 relative">
                {product.image ? (
                  <img 
                    src={`${API_BASE_URL}${product.image}`} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <ImageIcon className="w-12 h-12" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2 truncate">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : ''}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="编辑"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="删除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>暂无产品数据</p>
            </div>
          )}
        </div>
      );
    }

    if (activeTab === 'news') {
      return (
        <div className="space-y-4">
          {newsItems.map(news => (
            <div key={news.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="w-32 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                {news.image ? (
                  <img 
                    src={`${API_BASE_URL}${news.image}`} 
                    alt={news.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <FileText className="w-8 h-8" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gray-400">{news.date}</span>
                </div>
                <h3 className="font-semibold text-gray-800 truncate">{news.title}</h3>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">{news.summary}</p>
              </div>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => handleEdit(news)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="编辑"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(news.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="删除"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {newsItems.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Newspaper className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>暂无新闻数据</p>
            </div>
          )}
        </div>
      );
    }

    if (activeTab === 'patents') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {patents.map(patent => (
            <div key={patent.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-secondary" />
                </div>
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                  {patent.type}
                </span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">{patent.name}</h3>
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                <FileText className="w-4 h-4" />
                <span>{patent.patentNumber}</span>
              </div>
              <p className="text-gray-400 text-sm">{patent.date}</p>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => handleEdit(patent)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="编辑"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(patent.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="删除"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {patents.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              <Award className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>暂无专利数据</p>
            </div>
          )}
        </div>
      );
    }

    if (activeTab === 'submissions') {
      return (
        <div className="space-y-4">
          {submissions.map(submission => (
            <div key={submission.id} className={`p-4 border rounded-lg ${
              submission.read ? 'border-gray-200 bg-white' : 'border-primary bg-primary/5'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-gray-800">{submission.name}</span>
                    <span className="text-gray-500 text-sm">{submission.email}</span>
                    {submission.phone && (
                      <span className="text-gray-500 text-sm">{submission.phone}</span>
                    )}
                    {!submission.read && (
                      <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full">
                        未读
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-gray-400">{new Date(submission.timestamp).toLocaleString()}</span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {submission.subject}
                    </span>
                  </div>
                  <p className="text-gray-600">{submission.message}</p>
                </div>
                <div className="flex flex-col space-y-2 ml-4">
                  <button
                    onClick={() => handleMarkRead(submission.id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="标记为已读"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(String(submission.id))}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="删除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {submissions.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Mail className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>暂无表单提交</p>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">管理后台</h1>
            <p className="text-gray-600 mt-2">管理产品、新闻、专利和表单提交</p>
          </div>
          {activeTab !== 'submissions' && (
            <button
              onClick={handleAdd}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primaryLight transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>添加新项</span>
            </button>
          )}
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center ${
            messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'text-primary border-b-2 border-primary bg-primary/5'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-6">
            {renderContent()}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                {modalMode === 'add' ? '添加' : '编辑'}
                {activeTab === 'products' ? '产品' : activeTab === 'news' ? '新闻' : '专利'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4" encType="multipart/form-data">
              {activeTab === 'products' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">产品名称 *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">产品图片</label>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    {imagePreview && (
                      <img src={imagePreview} alt="预览" className="mt-2 max-h-40 rounded-lg" />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">产品描述 *</label>
                    <textarea
                      name="description"
                      value={formData.description || ''}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">产品特性</label>
                    <textarea
                      name="features"
                      value={formData.features || ''}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary resize-none"
                      placeholder="每行一个特性"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">技术规格</label>
                    <textarea
                      name="specs"
                      value={formData.specs || ''}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary resize-none"
                      placeholder="技术规格信息"
                    />
                  </div>
                </>
              )}
              {activeTab === 'news' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">新闻标题 *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title || ''}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">新闻图片</label>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    {imagePreview && (
                      <img src={imagePreview} alt="预览" className="mt-2 max-h-40 rounded-lg" />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">日期</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">摘要 *</label>
                    <textarea
                      name="summary"
                      value={formData.summary || ''}
                      onChange={handleInputChange}
                      required
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">详细内容</label>
                    <textarea
                      name="content"
                      value={formData.content || ''}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary resize-none"
                    />
                  </div>
                </>
              )}
              {activeTab === 'patents' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">专利名称 *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">专利号 *</label>
                    <input
                      type="text"
                      name="patentNumber"
                      value={formData.patentNumber || ''}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">专利类型</label>
                    <select
                      name="type"
                      value={formData.type || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary"
                    >
                      <option value="">请选择类型</option>
                      <option value="发明专利">发明专利</option>
                      <option value="实用新型">实用新型</option>
                      <option value="外观设计">外观设计</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">申请日期</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary"
                    />
                  </div>
                </>
              )}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primaryLight"
                >
                  <Save className="w-4 h-4" />
                  <span>保存</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
