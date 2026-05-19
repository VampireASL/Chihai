import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { contactInfo } from '@/data/mockData';

const footerLinks = [
  {
    title: '产品服务',
    links: [
      { name: '智能控制系统', path: '/products' },
      { name: '物联网传感器', path: '/products' },
      { name: '数据分析平台', path: '/products' },
      { name: '新能源解决方案', path: '/products' },
    ],
  },
  {
    title: '关于我们',
    links: [
      { name: '公司介绍', path: '/about' },
      { name: '发展历程', path: '/about' },
      { name: '企业文化', path: '/about' },
      { name: '新闻动态', path: '/news' },
    ],
  },
  {
    title: '支持',
    links: [
      { name: '帮助中心', path: '#' },
      { name: '技术文档', path: '#' },
      { name: '常见问题', path: '#' },
      { name: '联系我们', path: '/contact' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold text-lg">CH</span>
              </div>
              <span className="font-bold text-xl">ChiHai</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-sm">
              致力于通过技术创新，为客户创造价值，推动行业进步。我们专注于前沿技术研发，为全球客户提供高品质的产品和解决方案。
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-300">
                <MapPin className="w-5 h-5 text-secondary" />
                <span>{contactInfo.address}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Phone className="w-5 h-5 text-secondary" />
                <span>{contactInfo.phone}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Mail className="w-5 h-5 text-secondary" />
                <span>{contactInfo.email}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Clock className="w-5 h-5 text-secondary" />
                <span>{contactInfo.workingHours}</span>
              </div>
            </div>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-lg mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.path}
                      className="text-gray-300 hover:text-secondary transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-700 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} ChiHai科技. 保留所有权利.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-secondary text-sm transition-colors">
              隐私政策
            </a>
            <a href="#" className="text-gray-400 hover:text-secondary text-sm transition-colors">
              使用条款
            </a>
            <a href="#" className="text-gray-400 hover:text-secondary text-sm transition-colors">
              网站地图
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
