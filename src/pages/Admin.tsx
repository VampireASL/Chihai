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
  FileText,
  Settings,
  Home,
  Info,
  Phone,
  Menu
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

type TabType = 'products' | 'news' | 'patents' | 'submissions' | 'settings';
type SettingsSubTab = 'hero' | 'homeSections' | 'features' | 'company' | 'contact' | 'timeline' | 'nav' | 'footer';

interface HeroData {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  bgImage: string;
}

interface FeatureItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface CompanyInfo {
  introduction: string;
  applications: string;
  philosophy: string;
  mission: string;
  vision: string;
  values: string[];
}

interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  workingHours: string;
}

interface TimelineItem {
  id: string;
  year: string;
  title: string;
  description: string;
}

interface NavLinkItem {
  name: string;
  path: string;
}

interface FooterLink {
  name: string;
  path: string;
}

interface FooterLinkSection {
  title: string;
  links: FooterLink[];
}

interface SectionConfig {
  title: string;
  subtitle: string;
  description: string;
  bgImage?: string;
}

interface ClientItem {
  id: string;
  name: string;
  icon: string;
  logo?: string;
}

interface HomeSections {
  featuresSection: SectionConfig;
  productsSection: SectionConfig;
  clientsSection: SectionConfig;
}

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

  // 网站设置相关状态
  const [settingsSubTab, setSettingsSubTab] = useState<SettingsSubTab>('hero');
  const [, setSiteSettings] = useState<any>(null);
  const [heroForm, setHeroForm] = useState<HeroData>({ title: '', subtitle: '', description: '', ctaText: '', bgImage: '' });
  const [homeSectionsForm, setHomeSectionsForm] = useState<HomeSections>({
    featuresSection: { title: '', subtitle: '', description: '', bgImage: '' },
    productsSection: { title: '', subtitle: '', description: '', bgImage: '' },
    clientsSection: { title: '', subtitle: '', description: '', bgImage: '' }
  });
  const [clientsList, setClientsList] = useState<ClientItem[]>([]);
  const [featuresList, setFeaturesList] = useState<FeatureItem[]>([]);
  const [companyForm, setCompanyForm] = useState<CompanyInfo>({ introduction: '', applications: '', philosophy: '', mission: '', vision: '', values: [] });
  const [contactForm, setContactForm] = useState<ContactInfo>({ address: '', phone: '', email: '', workingHours: '' });
  const [timelineList, setTimelineList] = useState<TimelineItem[]>([]);
  const [navLinksList, setNavLinksList] = useState<NavLinkItem[]>([]);
  const [footerLinksList, setFooterLinksList] = useState<FooterLinkSection[]>([]);
  const [heroImagePreview, setHeroImagePreview] = useState<string>('');
  const [featuresSectionImagePreview, setFeaturesSectionImagePreview] = useState<string>('');
  const [productsSectionImagePreview, setProductsSectionImagePreview] = useState<string>('');

  useEffect(() => {
    if (activeTab === 'settings') {
      loadSettings();
    } else {
      loadData();
    }
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

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(API_URLS.settings);
      const result = await res.json();
      if (result.success) {
        const data = result.data;
        setSiteSettings(data);
        setHeroForm(data.hero || {});
        setHomeSectionsForm(data.homeSections || {
          featuresSection: { title: '', subtitle: '', description: '', bgImage: '' },
          productsSection: { title: '', subtitle: '', description: '', bgImage: '' },
          clientsSection: { title: '', subtitle: '', description: '', bgImage: '' }
        });
        setClientsList(data.clients || []);
        setFeaturesList(data.features || []);
        setCompanyForm(data.companyInfo || {});
        setContactForm(data.contactInfo || {});
        setTimelineList(data.timeline || []);
        setNavLinksList(data.navLinks || []);
        setFooterLinksList(data.footerLinks || []);
        setHeroImagePreview(data.hero?.bgImage || '');
        setFeaturesSectionImagePreview(data.homeSections?.featuresSection?.bgImage || '');
        setProductsSectionImagePreview(data.homeSections?.productsSection?.bgImage || '');
      }
    } catch (error) {
      console.error('加载设置失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (key: string, value: any) => {
    try {
      const res = await fetch(API_URLS.settings, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: value }),
      });
      const result = await res.json();
      if (result.success) {
        showMessage('保存成功', 'success');
        setSiteSettings(result.data);
      } else {
        showMessage(result.error || '保存失败', 'error');
      }
    } catch (error) {
      showMessage('保存失败', 'error');
    }
  };

  const handleHeroImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setHeroImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
      // 上传文件
      const uploadForm = new FormData();
      uploadForm.append('image', file);
      fetch(API_URLS.upload, { method: 'POST', body: uploadForm })
        .then(res => res.json())
        .then(result => {
          if (result.success) {
            setHeroForm({ ...heroForm, bgImage: `${API_BASE_URL}${result.data.path}` });
          }
        });
    }
  };

  const handleSaveHero = () => {
    saveSettings('hero', heroForm);
  };

  const handleSectionImageUpload = (section: 'featuresSection' | 'productsSection', file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (section === 'featuresSection') {
        setFeaturesSectionImagePreview(event.target?.result as string);
      } else {
        setProductsSectionImagePreview(event.target?.result as string);
      }
    };
    reader.readAsDataURL(file);
    
    const uploadForm = new FormData();
    uploadForm.append('image', file);
    fetch(API_URLS.upload, { method: 'POST', body: uploadForm })
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          setHomeSectionsForm({
            ...homeSectionsForm,
            [section]: {
              ...homeSectionsForm[section],
              bgImage: `${API_BASE_URL}${result.data.path}`
            }
          });
        }
      });
  };

  const handleSaveHomeSections = async () => {
    await saveSettings('homeSections', homeSectionsForm);
    await saveSettings('clients', clientsList);
  };

  const handleSaveCompany = () => {
    saveSettings('companyInfo', companyForm);
  };

  const handleSaveContact = () => {
    saveSettings('contactInfo', contactForm);
  };

  const handleSaveNav = () => {
    saveSettings('navLinks', navLinksList);
  };

  const handleSaveFooter = () => {
    saveSettings('footerLinks', footerLinksList);
  };

  // Feature 操作
  const handleAddFeature = () => {
    const newFeature: FeatureItem = {
      id: 'feat-' + Date.now(),
      icon: 'Star',
      title: '',
      description: '',
    };
    setFeaturesList([...featuresList, newFeature]);
  };

  const handleUpdateFeature = (index: number, field: keyof FeatureItem, value: string) => {
    const updated = [...featuresList];
    updated[index] = { ...updated[index], [field]: value };
    setFeaturesList(updated);
  };

  const handleDeleteFeature = (index: number) => {
    setFeaturesList(featuresList.filter((_, i) => i !== index));
  };

  const handleSaveFeatures = () => {
    saveSettings('features', featuresList);
  };

  // 行业客户操作
  const handleAddClient = () => {
    setClientsList([...clientsList, { id: 'client-' + Date.now(), name: '', icon: 'Car' }]);
  };

  const handleUpdateClient = (index: number, field: keyof ClientItem, value: string) => {
    const updated = [...clientsList];
    updated[index] = { ...updated[index], [field]: value };
    setClientsList(updated);
  };

  const handleDeleteClient = (index: number) => {
    setClientsList(clientsList.filter((_, i) => i !== index));
  };

  // 行业客户 logo 上传
  const handleClientLogoUpload = (index: number, file: File) => {
    const uploadForm = new FormData();
    uploadForm.append('image', file);
    fetch(API_URLS.upload, { method: 'POST', body: uploadForm })
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          const updated = [...clientsList];
          updated[index] = { ...updated[index], logo: `${API_BASE_URL}${result.data.path}` };
          setClientsList(updated);
          showMessage('Logo 上传成功，请点击保存', 'success');
        } else {
          showMessage(result.error || '上传失败', 'error');
        }
      })
      .catch(() => showMessage('上传失败', 'error'));
  };

  // Timeline 操作
  const handleAddTimeline = () => {
    const newItem: TimelineItem = {
      id: 'tl-' + Date.now(),
      year: '',
      title: '',
      description: '',
    };
    setTimelineList([...timelineList, newItem]);
  };

  const handleUpdateTimeline = (index: number, field: keyof TimelineItem, value: string) => {
    const updated = [...timelineList];
    updated[index] = { ...updated[index], [field]: value };
    setTimelineList(updated);
  };

  const handleDeleteTimeline = (index: number) => {
    setTimelineList(timelineList.filter((_, i) => i !== index));
  };

  const handleSaveTimeline = () => {
    saveSettings('timeline', timelineList);
  };

  // Nav 操作
  const handleAddNavLink = () => {
    setNavLinksList([...navLinksList, { name: '', path: '' }]);
  };

  const handleUpdateNavLink = (index: number, field: keyof NavLinkItem, value: string) => {
    const updated = [...navLinksList];
    updated[index] = { ...updated[index], [field]: value };
    setNavLinksList(updated);
  };

  const handleDeleteNavLink = (index: number) => {
    setNavLinksList(navLinksList.filter((_, i) => i !== index));
  };

  // Footer 操作
  const handleAddFooterSection = () => {
    setFooterLinksList([...footerLinksList, { title: '', links: [] }]);
  };

  const handleUpdateFooterSection = (sectionIndex: number, field: string, value: string) => {
    const updated = [...footerLinksList];
    (updated[sectionIndex] as any)[field] = value;
    setFooterLinksList(updated);
  };

  const handleDeleteFooterSection = (sectionIndex: number) => {
    setFooterLinksList(footerLinksList.filter((_, i) => i !== sectionIndex));
  };

  const handleAddFooterLink = (sectionIndex: number) => {
    const updated = [...footerLinksList];
    updated[sectionIndex].links.push({ name: '', path: '' });
    setFooterLinksList(updated);
  };

  const handleUpdateFooterLink = (sectionIndex: number, linkIndex: number, field: keyof FooterLink, value: string) => {
    const updated = [...footerLinksList];
    updated[sectionIndex].links[linkIndex] = { ...updated[sectionIndex].links[linkIndex], [field]: value };
    setFooterLinksList(updated);
  };

  const handleDeleteFooterLink = (sectionIndex: number, linkIndex: number) => {
    const updated = [...footerLinksList];
    updated[sectionIndex].links = updated[sectionIndex].links.filter((_, i) => i !== linkIndex);
    setFooterLinksList(updated);
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
    { id: 'settings' as TabType, label: '网站设置', icon: Settings },
  ];

  const settingsSubTabs = [
    { id: 'hero' as SettingsSubTab, label: '首页横幅', icon: Home },
    { id: 'homeSections' as SettingsSubTab, label: '首页模块', icon: Settings },
    { id: 'features' as SettingsSubTab, label: '核心优势', icon: Award },
    { id: 'company' as SettingsSubTab, label: '关于我们', icon: Info },
    { id: 'contact' as SettingsSubTab, label: '联系信息', icon: Phone },
    { id: 'timeline' as SettingsSubTab, label: '发展历程', icon: FileText },
    { id: 'nav' as SettingsSubTab, label: '导航菜单', icon: Menu },
    { id: 'footer' as SettingsSubTab, label: '页脚链接', icon: Menu },
  ];

  const renderSettingsContent = () => {
    if (settingsSubTab === 'hero') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">主标题</label>
            <input
              type="text"
              value={heroForm.title}
              onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">副标题</label>
            <input
              type="text"
              value={heroForm.subtitle}
              onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
            <textarea
              value={heroForm.description}
              onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">按钮文字</label>
            <input
              type="text"
              value={heroForm.ctaText}
              onChange={(e) => setHeroForm({ ...heroForm, ctaText: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">背景图片</label>
            <input
              type="text"
              value={heroForm.bgImage}
              onChange={(e) => setHeroForm({ ...heroForm, bgImage: e.target.value })}
              placeholder="输入图片URL或上传本地图片"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary mb-2"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleHeroImageChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            {heroImagePreview && (
              <img src={heroImagePreview} alt="预览" className="mt-2 max-h-40 rounded-lg" />
            )}
          </div>
          <button
            onClick={handleSaveHero}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primaryLight"
          >
            <Save className="w-4 h-4" />
            <span>保存</span>
          </button>
        </div>
      );
    }

    if (settingsSubTab === 'homeSections') {
      return (
        <div className="space-y-6">
          {/* 核心优势模块配置 */}
          <div className="p-4 border border-gray-200 rounded-lg space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">核心优势模块</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">模块标题</label>
              <input
                type="text"
                value={homeSectionsForm.featuresSection.title}
                onChange={(e) => setHomeSectionsForm({
                  ...homeSectionsForm,
                  featuresSection: { ...homeSectionsForm.featuresSection, title: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">副标题</label>
              <input
                type="text"
                value={homeSectionsForm.featuresSection.subtitle}
                onChange={(e) => setHomeSectionsForm({
                  ...homeSectionsForm,
                  featuresSection: { ...homeSectionsForm.featuresSection, subtitle: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
              <textarea
                value={homeSectionsForm.featuresSection.description}
                onChange={(e) => setHomeSectionsForm({
                  ...homeSectionsForm,
                  featuresSection: { ...homeSectionsForm.featuresSection, description: e.target.value }
                })}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">背景图片</label>
              <input
                type="text"
                value={homeSectionsForm.featuresSection.bgImage}
                onChange={(e) => setHomeSectionsForm({
                  ...homeSectionsForm,
                  featuresSection: { ...homeSectionsForm.featuresSection, bgImage: e.target.value }
                })}
                placeholder="输入图片URL或上传本地图片"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary mb-2"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleSectionImageUpload('featuresSection', file);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              {featuresSectionImagePreview && (
                <img src={featuresSectionImagePreview} alt="预览" className="mt-2 max-h-40 rounded-lg" />
              )}
            </div>
          </div>

          {/* 核心产品模块配置 */}
          <div className="p-4 border border-gray-200 rounded-lg space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">核心产品模块</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">模块标题</label>
              <input
                type="text"
                value={homeSectionsForm.productsSection.title}
                onChange={(e) => setHomeSectionsForm({
                  ...homeSectionsForm,
                  productsSection: { ...homeSectionsForm.productsSection, title: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">副标题</label>
              <input
                type="text"
                value={homeSectionsForm.productsSection.subtitle}
                onChange={(e) => setHomeSectionsForm({
                  ...homeSectionsForm,
                  productsSection: { ...homeSectionsForm.productsSection, subtitle: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
              <textarea
                value={homeSectionsForm.productsSection.description}
                onChange={(e) => setHomeSectionsForm({
                  ...homeSectionsForm,
                  productsSection: { ...homeSectionsForm.productsSection, description: e.target.value }
                })}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">背景图片</label>
              <input
                type="text"
                value={homeSectionsForm.productsSection.bgImage}
                onChange={(e) => setHomeSectionsForm({
                  ...homeSectionsForm,
                  productsSection: { ...homeSectionsForm.productsSection, bgImage: e.target.value }
                })}
                placeholder="输入图片URL或上传本地图片"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary mb-2"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleSectionImageUpload('productsSection', file);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              {productsSectionImagePreview && (
                <img src={productsSectionImagePreview} alt="预览" className="mt-2 max-h-40 rounded-lg" />
              )}
            </div>
          </div>

          {/* 行业客户模块配置 */}
          <div className="p-4 border border-gray-200 rounded-lg space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">行业客户模块</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">模块标题</label>
              <input
                type="text"
                value={homeSectionsForm.clientsSection.title}
                onChange={(e) => setHomeSectionsForm({
                  ...homeSectionsForm,
                  clientsSection: { ...homeSectionsForm.clientsSection, title: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">副标题</label>
              <input
                type="text"
                value={homeSectionsForm.clientsSection.subtitle}
                onChange={(e) => setHomeSectionsForm({
                  ...homeSectionsForm,
                  clientsSection: { ...homeSectionsForm.clientsSection, subtitle: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
              <textarea
                value={homeSectionsForm.clientsSection.description}
                onChange={(e) => setHomeSectionsForm({
                  ...homeSectionsForm,
                  clientsSection: { ...homeSectionsForm.clientsSection, description: e.target.value }
                })}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary resize-none"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">行业客户列表</label>
              {clientsList.map((client, index) => (
                <div key={client.id} className="flex items-center space-x-2">
                  <div className="w-12 h-12 shrink-0 border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden bg-white">
                    {client.logo ? (
                      <img src={client.logo} alt="logo" className="w-full h-full object-contain" />
                    ) : (
                      <ImageIcon className="w-4 h-4 text-gray-300" />
                    )}
                  </div>
                  <input
                    type="text"
                    value={client.name}
                    onChange={(e) => handleUpdateClient(index, 'name', e.target.value)}
                    placeholder="行业名称，如: 汽车制造"
                    className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <label className="shrink-0 p-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50" title="上传 logo">
                    <ImageIcon className="w-4 h-4 text-gray-600" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleClientLogoUpload(index, file);
                        e.target.value = '';
                      }}
                    />
                  </label>
                  <button
                    onClick={() => handleDeleteClient(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={handleAddClient}
                className="flex items-center space-x-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5"
              >
                <Plus className="w-4 h-4" />
                <span>添加行业客户</span>
              </button>
              <p className="text-xs text-gray-400">
                可上传客户 logo 图片；未上传时首页将按图标名显示占位图标（Car, Building2, Tv, Zap, Grid3x3, Box, Wrench, Layers, Cpu, Gem, Plane, MoreHorizontal）。上传或修改后请点击下方保存按钮。
              </p>
            </div>
          </div>

          <button
            onClick={handleSaveHomeSections}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primaryLight"
          >
            <Save className="w-4 h-4" />
            <span>保存所有模块配置</span>
          </button>
        </div>
      );
    }

    if (settingsSubTab === 'features') {
      return (
        <div className="space-y-4">
          {featuresList.map((feature, index) => (
            <div key={feature.id} className="p-4 border border-gray-200 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">优势 {index + 1}</span>
                <button
                  onClick={() => handleDeleteFeature(index)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">图标名称</label>
                  <input
                    type="text"
                    value={feature.icon}
                    onChange={(e) => handleUpdateFeature(index, 'icon', e.target.value)}
                    placeholder="如: Lightbulb, Shield, Users, Award"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">标题</label>
                  <input
                    type="text"
                    value={feature.title}
                    onChange={(e) => handleUpdateFeature(index, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">描述</label>
                <textarea
                  value={feature.description}
                  onChange={(e) => handleUpdateFeature(index, 'description', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                />
              </div>
            </div>
          ))}
          <div className="flex space-x-3">
            <button
              onClick={handleAddFeature}
              className="flex items-center space-x-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5"
            >
              <Plus className="w-4 h-4" />
              <span>添加优势</span>
            </button>
            <button
              onClick={handleSaveFeatures}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primaryLight"
            >
              <Save className="w-4 h-4" />
              <span>保存</span>
            </button>
          </div>
        </div>
      );
    }

    if (settingsSubTab === 'company') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">公司简介</label>
            <textarea
              value={companyForm.introduction}
              onChange={(e) => setCompanyForm({ ...companyForm, introduction: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">应用领域</label>
            <textarea
              value={companyForm.applications}
              onChange={(e) => setCompanyForm({ ...companyForm, applications: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">经营理念</label>
            <textarea
              value={companyForm.philosophy}
              onChange={(e) => setCompanyForm({ ...companyForm, philosophy: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">企业使命</label>
            <input
              type="text"
              value={companyForm.mission}
              onChange={(e) => setCompanyForm({ ...companyForm, mission: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">企业愿景</label>
            <input
              type="text"
              value={companyForm.vision}
              onChange={(e) => setCompanyForm({ ...companyForm, vision: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">核心价值观（逗号分隔）</label>
            <input
              type="text"
              value={companyForm.values.join(', ')}
              onChange={(e) => setCompanyForm({ ...companyForm, values: e.target.value.split(',').map(v => v.trim()).filter(Boolean) })}
              placeholder="如: 创新, 诚信, 责任, 共赢"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary"
            />
          </div>
          <button
            onClick={handleSaveCompany}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primaryLight"
          >
            <Save className="w-4 h-4" />
            <span>保存</span>
          </button>
        </div>
      );
    }

    if (settingsSubTab === 'contact') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">公司地址</label>
            <input
              type="text"
              value={contactForm.address}
              onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">联系电话</label>
            <input
              type="text"
              value={contactForm.phone}
              onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">电子邮箱</label>
            <input
              type="email"
              value={contactForm.email}
              onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">工作时间</label>
            <input
              type="text"
              value={contactForm.workingHours}
              onChange={(e) => setContactForm({ ...contactForm, workingHours: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary"
            />
          </div>
          <button
            onClick={handleSaveContact}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primaryLight"
          >
            <Save className="w-4 h-4" />
            <span>保存</span>
          </button>
        </div>
      );
    }

    if (settingsSubTab === 'timeline') {
      return (
        <div className="space-y-4">
          {timelineList.map((item, index) => (
            <div key={item.id} className="p-4 border border-gray-200 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">里程碑 {index + 1}</span>
                <button
                  onClick={() => handleDeleteTimeline(index)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">年份</label>
                  <input
                    type="text"
                    value={item.year}
                    onChange={(e) => handleUpdateTimeline(index, 'year', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">标题</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleUpdateTimeline(index, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">描述</label>
                <textarea
                  value={item.description}
                  onChange={(e) => handleUpdateTimeline(index, 'description', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                />
              </div>
            </div>
          ))}
          <div className="flex space-x-3">
            <button
              onClick={handleAddTimeline}
              className="flex items-center space-x-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5"
            >
              <Plus className="w-4 h-4" />
              <span>添加里程碑</span>
            </button>
            <button
              onClick={handleSaveTimeline}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primaryLight"
            >
              <Save className="w-4 h-4" />
              <span>保存</span>
            </button>
          </div>
        </div>
      );
    }

    if (settingsSubTab === 'nav') {
      return (
        <div className="space-y-4">
          {navLinksList.map((link, index) => (
            <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
              <div className="flex-1 grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={link.name}
                  onChange={(e) => handleUpdateNavLink(index, 'name', e.target.value)}
                  placeholder="名称"
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <input
                  type="text"
                  value={link.path}
                  onChange={(e) => handleUpdateNavLink(index, 'path', e.target.value)}
                  placeholder="路径，如 /about"
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <button
                onClick={() => handleDeleteNavLink(index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <div className="flex space-x-3">
            <button
              onClick={handleAddNavLink}
              className="flex items-center space-x-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5"
            >
              <Plus className="w-4 h-4" />
              <span>添加链接</span>
            </button>
            <button
              onClick={handleSaveNav}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primaryLight"
            >
              <Save className="w-4 h-4" />
              <span>保存</span>
            </button>
          </div>
        </div>
      );
    }

    if (settingsSubTab === 'footer') {
      return (
        <div className="space-y-6">
          {footerLinksList.map((section, sectionIndex) => (
            <div key={sectionIndex} className="p-4 border border-gray-200 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => handleUpdateFooterSection(sectionIndex, 'title', e.target.value)}
                  placeholder="分区标题"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium mr-3"
                />
                <button
                  onClick={() => handleDeleteFooterSection(sectionIndex)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2 ml-4">
                {section.links.map((link, linkIndex) => (
                  <div key={linkIndex} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={link.name}
                      onChange={(e) => handleUpdateFooterLink(sectionIndex, linkIndex, 'name', e.target.value)}
                      placeholder="链接名称"
                      className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                    />
                    <input
                      type="text"
                      value={link.path}
                      onChange={(e) => handleUpdateFooterLink(sectionIndex, linkIndex, 'path', e.target.value)}
                      placeholder="路径"
                      className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                    />
                    <button
                      onClick={() => handleDeleteFooterLink(sectionIndex, linkIndex)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => handleAddFooterLink(sectionIndex)}
                  className="text-sm text-primary hover:underline"
                >
                  + 添加链接
                </button>
              </div>
            </div>
          ))}
          <div className="flex space-x-3">
            <button
              onClick={handleAddFooterSection}
              className="flex items-center space-x-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5"
            >
              <Plus className="w-4 h-4" />
              <span>添加分区</span>
            </button>
            <button
              onClick={handleSaveFooter}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primaryLight"
            >
              <Save className="w-4 h-4" />
              <span>保存</span>
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

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

    if (activeTab === 'settings') {
      return (
        <div>
          <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
            {settingsSubTabs.map(subTab => {
              const Icon = subTab.icon;
              return (
                <button
                  key={subTab.id}
                  onClick={() => setSettingsSubTab(subTab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 font-medium whitespace-nowrap transition-colors ${
                    settingsSubTab === subTab.id
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{subTab.label}</span>
                </button>
              );
            })}
          </div>
          {renderSettingsContent()}
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
            <p className="text-gray-600 mt-2">管理产品、新闻、专利、表单提交和网站设置</p>
          </div>
          {activeTab !== 'submissions' && activeTab !== 'settings' && (
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">专利图片</label>
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
