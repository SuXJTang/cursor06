import axios from 'axios';

// 创建axios实例，配置默认参数
const service = axios.create({
  // 确保所有API请求都包含正确的基础URL
  baseURL: '/api',  // 修改为'/api'，确保请求路径正确
  // 请求超时时间
  timeout: 20000,
  // 请求头设置
  headers: {
    'Content-Type': 'application/json',
  }
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 从localStorage获取token并添加到请求头
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  // 请求成功的处理
  response => {
    // 直接返回响应数据
    return response.data;
  },
  // 请求失败的处理
  error => {
    console.error('响应错误:', error);
    
    // 根据状态码处理不同错误
    if (error.response) {
      const status = error.response.status;
      
      // 处理401未授权错误
      if (status === 401) {
        console.log('登录已过期，请重新登录');
        // 可以在这里添加重定向到登录页的逻辑
      }
      
      // 处理404错误
      if (status === 404) {
        console.error(`请求的资源不存在: ${error.config.url}`);
      }
      
      // 处理500服务器错误
      if (status >= 500) {
        console.error('服务器错误，请稍后重试');
      }
    } else if (error.request) {
      // 请求发送但没有收到响应
      console.error('网络连接问题，无法连接到服务器');
    } else {
      // 请求设置出现问题
      console.error('请求配置错误:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default service; 