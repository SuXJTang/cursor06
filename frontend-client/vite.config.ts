import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')
  // 获取后端API地址，默认为localhost:8000
  const apiUrl = env.VITE_API_URL || 'http://localhost:8000'
  
  console.log(`前端开发服务器模式: ${mode}`)
  console.log(`使用后端API地址: ${apiUrl}`)
  
  return {
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      port: 5173,
      strictPort: false, // 如果端口被占用，尝试下一个可用端口
      host: true, // 监听所有地址，包括局域网和公网地址
      cors: true, // 允许跨域
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          configure: (proxy, options) => {
            // 设置超时 (使用任意字段)
            (proxy as any).timeout = 30000; // 30秒超时
            // 更详细的错误日志
            proxy.on('error', (err, req, res) => {
              console.error('代理错误:', err.message, req.url);
              console.error('代理目标:', apiUrl);
              console.error('详细错误:', err);
              
              // 提供错误响应，避免请求挂起
              if (!res.headersSent && res.writableEnded === false) {
                res.writeHead(500, {
                  'Content-Type': 'application/json'
                });
                res.end(JSON.stringify({ 
                  error: 'Proxy Error', 
                  message: err.message,
                  target: apiUrl,
                  path: req.url
                }));
              }
            });
            proxy.on('proxyReq', (proxyReq, req, res) => {
              console.log('发送代理请求:', req.method, req.url, '到', apiUrl);
            });
            proxy.on('proxyRes', (proxyRes, req, res) => {
              console.log('收到代理响应:', proxyRes.statusCode, req.url);
              // 跟踪CORS头
              if (proxyRes.headers['access-control-allow-origin']) {
                console.log('CORS允许源:', proxyRes.headers['access-control-allow-origin']);
              }
            });
          }
        },
        '/static': {
          target: apiUrl,
          changeOrigin: true,
          configure: (proxy, options) => {
            // 设置超时 (使用任意字段)
            (proxy as any).timeout = 30000; // 30秒超时
            // 更详细的错误日志
            proxy.on('error', (err, req, res) => {
              console.error('静态文件代理错误:', err.message, req.url);
            });
            proxy.on('proxyReq', (proxyReq, req, res) => {
              console.log('发送静态文件代理请求:', req.method, req.url, '到', apiUrl);
            });
            proxy.on('proxyRes', (proxyRes, req, res) => {
              console.log('收到静态文件代理响应:', proxyRes.statusCode, req.url);
            });
          }
        },
        '/v1': {
          target: apiUrl,
          changeOrigin: true,
          configure: (proxy, options) => {
            (proxy as any).timeout = 30000; // 30秒超时
            proxy.on('error', (err, req, res) => {
              console.error('V1 API代理错误:', err.message, req.url);
              console.error('代理目标:', apiUrl);
              console.error('详细错误:', err);
              
              if (!res.headersSent && res.writableEnded === false) {
                res.writeHead(500, {
                  'Content-Type': 'application/json'
                });
                res.end(JSON.stringify({ 
                  error: 'Proxy Error', 
                  message: err.message,
                  target: apiUrl,
                  path: req.url
                }));
              }
            });
            proxy.on('proxyReq', (proxyReq, req, res) => {
              console.log('发送V1 API代理请求:', req.method, req.url, '到', apiUrl);
            });
            proxy.on('proxyRes', (proxyRes, req, res) => {
              console.log('收到V1 API代理响应:', proxyRes.statusCode, req.url);
            });
          }
        },
        '/v2': {
          target: apiUrl,
          changeOrigin: true,
          configure: (proxy, options) => {
            (proxy as any).timeout = 30000; // 30秒超时
            proxy.on('error', (err, req, res) => {
              console.error('V2 API代理错误:', err.message, req.url);
              console.error('代理目标:', apiUrl);
              console.error('详细错误:', err);
              
              if (!res.headersSent && res.writableEnded === false) {
                res.writeHead(500, {
                  'Content-Type': 'application/json'
                });
                res.end(JSON.stringify({ 
                  error: 'Proxy Error', 
                  message: err.message,
                  target: apiUrl,
                  path: req.url
                }));
              }
            });
            proxy.on('proxyReq', (proxyReq, req, res) => {
              console.log('发送V2 API代理请求:', req.method, req.url, '到', apiUrl);
            });
            proxy.on('proxyRes', (proxyRes, req, res) => {
              console.log('收到V2 API代理响应:', proxyRes.statusCode, req.url);
            });
          }
        }
      }
    },
    build: {
      sourcemap: true
    }
  }
})
