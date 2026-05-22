// API 配置
const isProduction = import.meta.env.PROD;

// 生产环境使用相对路径，开发环境使用 localhost
export const API_BASE_URL = isProduction ? '' : 'http://localhost:3001';

export const API_URLS = {
  products: `${API_BASE_URL}/api/products`,
  news: `${API_BASE_URL}/api/news`,
  patents: `${API_BASE_URL}/api/patents`,
  submissions: `${API_BASE_URL}/api/submissions`,
  contact: `${API_BASE_URL}/api/contact`,
  health: `${API_BASE_URL}/api/health`,
};
