<template>
  <div>
    <!-- 悬浮调试按钮 -->
    <div class="debug-float-button" @click="togglePanel" :class="{ 'expanded': !collapsed }">
      <div class="debug-icon">
        <svg v-if="!collapsed" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10 6l6 6-6 6"></path>
        </svg>
      </div>
      <span class="debug-float-text" v-if="!collapsed">收起面板</span>
      <span class="debug-float-text debug-icon-text" v-else>🛠️</span>
    </div>

    <!-- 调试面板 -->
    <div class="debug-panel" :class="{ 'collapsed': collapsed }">
      <div class="debug-tabs">
        <div class="tab-item" 
          v-for="(tab, index) in tabs" 
          :key="index" 
          :class="{ 'active': activeTab === index }"
          @click="activeTab = index">
          {{ tab.label }}
          <span v-if="tab.badge" class="tab-badge">{{ tab.badge }}</span>
        </div>
      </div>

      <div class="debug-content" v-show="!collapsed">
        <!-- 系统信息面板 -->
        <div v-if="activeTab === 0" class="tab-panel">
          <h3 class="panel-title">系统信息</h3>
          
          <div class="info-card">
            <div class="info-row">
              <div class="info-col">
                <div class="info-label">环境</div>
                <div class="info-value env-badge" :class="{ 'dev': env === 'development', 'prod': env === 'production' }">
                  {{ env }}
                </div>
              </div>
              <div class="info-col">
                <div class="info-label">版本</div>
                <div class="info-value">v0.1.0</div>
              </div>
            </div>
            <div class="info-row">
              <div class="info-col">
                <div class="info-label">浏览器</div>
                <div class="info-value">{{ browserInfo }}</div>
              </div>
              <div class="info-col">
                <div class="info-label">加载时间</div>
                <div class="info-value">{{ loadTime }}ms</div>
              </div>
            </div>
          </div>

          <div class="metrics-container">
            <div class="metric-item">
              <div class="metric-value">{{ Math.floor(perfMetrics.memory) }}MB</div>
              <div class="metric-label">内存使用</div>
            </div>
            <div class="metric-item">
              <div class="metric-value">{{ perfMetrics.cpu }}%</div>
              <div class="metric-label">CPU使用</div>
            </div>
            <div class="metric-item">
              <div class="metric-value">{{ perfMetrics.fps }}</div>
              <div class="metric-label">帧率</div>
            </div>
          </div>

          <h4 class="section-title">
            点击监测
            <div class="panel-actions">
              <button class="action-button" @click="clearClickEvents">
                <span class="action-icon">🗑️</span>
                清除记录
              </button>
            </div>
          </h4>
          <div class="click-events">
            <div v-for="(event, index) in clickEvents" :key="index" class="click-event">
              <div class="event-header">
                <span class="event-element">{{ event.element }}</span>
                <span class="event-time">{{ event.time }}</span>
              </div>
              <div class="event-details">
                <div class="event-dom-path" v-if="event.domPath">
                  <span class="detail-label">DOM路径:</span>
                  <span class="detail-value dom-path">{{ event.domPath }}</span>
                </div>
                <div class="event-path" v-if="event.path">
                  <span class="detail-label">路径:</span>
                  <span class="detail-value">{{ event.path }}</span>
                </div>
                <div class="event-target" v-if="event.target">
                  <span class="detail-label">内容:</span>
                  <span class="detail-value">{{ event.target }}</span>
                </div>
                <div class="event-position">
                  <span class="detail-label">位置:</span>
                  <span class="detail-value">({{ event.position.x }}, {{ event.position.y }})</span>
                </div>
                <div class="event-route" v-if="event.routeInfo">
                  <span class="detail-label">路由:</span>
                  <div class="route-details">
                    <div v-if="event.routeInfo.currentPath">当前路径: {{ event.routeInfo.currentPath }}</div>
                    <div v-if="event.routeInfo.href">点击链接: {{ event.routeInfo.href }}</div>
                    <div v-if="event.routeInfo.to">目标路由: {{ typeof event.routeInfo.to === 'object' ? JSON.stringify(event.routeInfo.to) : event.routeInfo.to }}</div>
                    <div v-if="event.routeInfo.query">查询参数: {{ JSON.stringify(event.routeInfo.query) }}</div>
                  </div>
                </div>
                <div class="event-data" v-if="event.data">
                  <span class="detail-label">附加数据:</span>
                  <pre class="detail-value">{{ JSON.stringify(event.data, null, 2) }}</pre>
                </div>
                <div class="event-attributes" v-if="event.attributes && Object.keys(event.attributes).length > 0">
                  <span class="detail-label">属性:</span>
                  <div class="attributes-list">
                    <div v-for="(value, key) in getFilteredAttributes(event.attributes)" :key="key" class="attribute-item">
                      {{ key }}: <span class="attribute-value">{{ value }}</span>
                    </div>
                  </div>
                </div>
                <div class="event-component" v-if="event.componentName">
                  <span class="detail-label">组件:</span>
                  <span class="detail-value">{{ event.componentName }}</span>
                </div>
              </div>
            </div>
            <div v-if="clickEvents.length === 0" class="empty-state">
              暂无点击记录
            </div>
          </div>
        </div>

        <!-- 网络请求面板 -->
        <div v-if="activeTab === 1" class="tab-panel">
          <h3 class="panel-title">
            网络请求
            <div class="panel-actions">
              <button class="action-button" @click="clearNetworkLogs">
                <span class="action-icon">🗑️</span>
                清除日志
              </button>
            </div>
          </h3>

          <div class="network-filter-container">
            <div class="search-box">
              <input type="text" v-model="networkSearch" placeholder="搜索请求路径..." />
            </div>
            <div class="filter-options">
              <select v-model="networkStatusFilter" class="status-filter">
                <option value="all">所有状态</option>
                <option value="success">成功 (2xx)</option>
                <option value="error">错误 (4xx/5xx)</option>
              </select>
              <select v-model="networkMethodFilter" class="method-filter">
                <option value="all">所有方法</option>
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
          </div>

          <div class="network-list">
            <div 
              v-for="(req, index) in filteredNetworkLogs" 
              :key="index" 
              class="network-item"
              :class="{ 
                'success': req.status >= 200 && req.status < 300, 
                'error': req.status >= 400,
                'expanded': expandedRequests[index]
              }"
              @click="toggleRequestDetails(index)"
            >
              <div class="network-item-summary">
                <div class="network-method" :class="req.method.toLowerCase()">{{ req.method }}</div>
                <div class="network-path" :title="req.path">{{ req.path }}</div>
                <div class="network-status">{{ req.status }}</div>
                <div class="network-time">{{ req.time }}ms</div>
                <div class="network-toggle">
                  <span>{{ expandedRequests[index] ? '▼' : '►' }}</span>
                </div>
              </div>
              
              <!-- 展开的请求详情 -->
              <div v-if="expandedRequests[index]" class="network-details">
                <div class="detail-section">
                  <div class="detail-header">基本信息</div>
                  <div class="detail-content">
                    <div class="detail-row">
                      <span class="detail-label">完整URL：</span>
                      <span class="detail-value">{{ req.path }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">请求方法：</span>
                      <span class="detail-value">{{ req.method }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">状态码：</span>
                      <span class="detail-value" :class="{ 
                        'status-success': req.status >= 200 && req.status < 300,
                        'status-error': req.status >= 400
                      }">{{ req.status }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">响应时间：</span>
                      <span class="detail-value">{{ req.time }}ms</span>
                    </div>
                    <div class="detail-row" v-if="req.error">
                      <span class="detail-label">错误：</span>
                      <span class="detail-value error-message">{{ req.error }}</span>
                    </div>
                  </div>
                </div>
                
                <div class="detail-section" v-if="req.requestHeaders">
                  <div class="detail-header">请求标头</div>
                  <div class="detail-content code-block">
                    <pre>{{ formatJSON(req.requestHeaders) }}</pre>
                  </div>
                </div>
                
                <div class="detail-section" v-if="req.requestBody">
                  <div class="detail-header">请求体</div>
                  <div class="detail-content code-block">
                    <pre>{{ formatJSON(req.requestBody) }}</pre>
                  </div>
                </div>
                
                <div class="detail-section" v-if="req.responseHeaders">
                  <div class="detail-header">响应标头</div>
                  <div class="detail-content code-block">
                    <pre>{{ formatJSON(req.responseHeaders) }}</pre>
                  </div>
                </div>
                
                <div class="detail-section" v-if="req.responseBody">
                  <div class="detail-header">响应体</div>
                  <div class="detail-content code-block">
                    <pre>{{ formatJSON(req.responseBody) }}</pre>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="filteredNetworkLogs.length === 0" class="empty-state">
              暂无网络请求记录
            </div>
          </div>
        </div>

        <!-- 路由面板 -->
        <div v-if="activeTab === 2" class="tab-panel">
          <h3 class="panel-title">
            路由历史
            <div class="panel-actions">
              <button class="action-button" @click="clearRouteHistory">
                <span class="action-icon">🗑️</span>
                清除记录
              </button>
            </div>
          </h3>
          
          <div class="route-history">
            <div v-for="(route, index) in routeHistory" :key="index" class="route-item">
              <div class="route-header">
                <span class="route-time">{{ route.time }}</span>
                <span class="route-badge" v-if="route.redirected">重定向</span>
              </div>
              <div class="route-content">
                <div class="route-path">
                  <span class="route-from">
                    <span class="detail-label">从:</span>
                    <span class="detail-value">{{ route.from }}</span>
                  </span>
                  <span class="route-arrow">→</span>
                  <span class="route-to">
                    <span class="detail-label">到:</span>
                    <span class="detail-value">{{ route.to }}</span>
                  </span>
                </div>
                <div class="route-redirect" v-if="route.redirected && route.redirectedFrom">
                  <span class="detail-label">重定向自:</span>
                  <span class="detail-value">{{ route.redirectedFrom }}</span>
                </div>
                <div class="route-params" v-if="route.params && Object.keys(route.params).length > 0">
                  <span class="detail-label">参数:</span>
                  <div class="param-list">
                    <div v-for="(value, key) in route.params" :key="key" class="param-item">
                      {{ key }}: {{ value }}
                    </div>
                  </div>
                </div>
                <div class="route-query" v-if="route.query && Object.keys(route.query).length > 0">
                  <span class="detail-label">查询:</span>
                  <div class="query-list">
                    <div v-for="(value, key) in route.query" :key="key" class="query-item">
                      {{ key }}: {{ value }}
                    </div>
                  </div>
                </div>
                <div class="route-hash" v-if="route.hash">
                  <span class="detail-label">哈希:</span>
                  <span class="detail-value">{{ route.hash }}</span>
                </div>
              </div>
            </div>
            <div v-if="routeHistory.length === 0" class="empty-state">
              暂无路由历史记录
            </div>
          </div>
        </div>

        <!-- 状态管理面板 -->
        <div v-if="activeTab === 3" class="tab-panel">
          <h3 class="panel-title">
            状态管理
            <div class="panel-actions">
              <button class="action-button" @click="refreshStores">
                <span class="action-icon">🔄</span>
                刷新
              </button>
            </div>
          </h3>

          <div class="stores-list">
            <div v-for="(store, name) in storeSnapshots" :key="name" class="store-item">
              <div class="store-header" @click="toggleStore(name)">
                <span class="store-name">{{ name }}</span>
                <span class="toggle-icon">{{ expandedStores[name] ? '▼' : '►' }}</span>
              </div>
              <div v-if="expandedStores[name]" class="store-content">
                <pre class="store-json">{{ JSON.stringify(store, null, 2) }}</pre>
              </div>
            </div>
            <div v-if="Object.keys(storeSnapshots).length === 0" class="empty-state">
              没有活跃的存储
            </div>
          </div>
        </div>

        <!-- 工具箱面板 -->
        <div v-if="activeTab === 4" class="tab-panel">
          <h3 class="panel-title">开发工具箱</h3>
          
          <div class="tools-grid">
            <div class="tool-card" @click="toggleLogging">
              <div class="tool-icon" :class="{ 'active': enableLogging }">📝</div>
              <div class="tool-name">请求日志</div>
              <div class="tool-status">{{ enableLogging ? '开启' : '关闭' }}</div>
            </div>
            
            <div class="tool-card" @click="clearCache">
              <div class="tool-icon">🗑️</div>
              <div class="tool-name">清除缓存</div>
              <div class="tool-status">{{ cacheInfo }}</div>
            </div>
            
            <div class="tool-card" @click="toggleSlowNetwork">
              <div class="tool-icon" :class="{ 'active': simulateSlowNetwork }">🐢</div>
              <div class="tool-name">模拟慢网络</div>
              <div class="tool-status">{{ simulateSlowNetwork ? '开启' : '关闭' }}</div>
            </div>
            
            <div class="tool-card" @click="forceMobileView">
              <div class="tool-icon">📱</div>
              <div class="tool-name">移动视图</div>
              <div class="tool-status">{{ isMobileView ? '开启' : '关闭' }}</div>
            </div>
          </div>

          <h4 class="section-title">路由操作</h4>
          <div class="route-tools">
            <select v-model="selectedRoute" class="route-select">
              <option value="">选择路由...</option>
              <option v-for="route in availableRoutes" :key="route.path" :value="route.path">
                {{ route.name || route.path }}
              </option>
            </select>
            <button class="route-button" @click="navigateToRoute" :disabled="!selectedRoute">
              导航
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

// 类型定义
interface NetworkLog {
  method: string;
  path: string;
  status: number;
  time: number;
  error?: string;
  requestHeaders?: Record<string, string>;
  requestBody?: any;
  responseHeaders?: Record<string, string>;
  responseBody?: any;
}

interface PerfMetrics {
  memory: number;
  cpu: number;
  fps: number;
}

interface Tab {
  label: string;
  badge: number | null;
}

// 添加点击事件接口
interface ClickEvent {
  element: string;
  path?: string;
  domPath?: string;
  position: { x: number; y: number; };
  time: string;
  target: string;
  attributes?: Record<string, string>;
  routeInfo?: any;
  componentName?: string;
  data?: any;
}

// 添加路由历史记录接口
interface RouteHistory {
  from: string;
  to: string;
  time: string;
  params?: Record<string, string>;
  query?: Record<string, string>;
  redirected?: boolean;
  redirectedFrom?: string;
  hash?: string;
}

// 扩展 XMLHttpRequest 类型
declare global {
  interface XMLHttpRequest {
    _debugMethod: string;
    _debugUrl: string;
    _debugStartTime: number;
  }
  
  interface Performance {
    memory?: {
      usedJSHeapSize: number;
      totalJSHeapSize: number;
      jsHeapSizeLimit: number;
    }
  }
}

// 路由和状态
const router = useRouter();
const route = useRoute();

// 主要状态
const collapsed = ref(true);
const activeTab = ref(0);
const enableLogging = ref(true);
const simulateSlowNetwork = ref(false);
const isMobileView = ref(false);
const selectedRoute = ref('');
const loadTime = ref(0);
const cacheInfo = ref('0 个项目');
const networkSearch = ref('');
const env = computed(() => {
  try {
    return typeof window !== 'undefined' && window.location.hostname === 'localhost' 
      ? 'development' 
      : 'production';
  } catch (e) {
    return 'development';
  }
});

// 性能指标
const perfMetrics = reactive<PerfMetrics>({
  memory: 0,
  cpu: 0,
  fps: 0
});

// 浏览器信息
const browserInfo = computed(() => {
  if (typeof window === 'undefined') return 'SSR';
  const ua = navigator.userAgent;
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Safari')) return 'Safari';
  if (ua.includes('Edge')) return 'Edge';
  return 'Unknown';
});

// 网络日志
const networkLogs = ref<NetworkLog[]>([]);
const networkStatusFilter = ref('all');
const networkMethodFilter = ref('all');
const expandedRequests = ref<Record<number, boolean>>({});
const filteredNetworkLogs = computed(() => {
  let filtered = networkLogs.value;
  
  // 路径过滤
  if (networkSearch.value) {
    filtered = filtered.filter(log => 
      log.path.toLowerCase().includes(networkSearch.value.toLowerCase())
    );
  }
  
  // 状态码过滤
  if (networkStatusFilter.value !== 'all') {
    filtered = filtered.filter(log => {
      if (networkStatusFilter.value === 'success') {
        return log.status >= 200 && log.status < 300;
      } else if (networkStatusFilter.value === 'error') {
        return log.status >= 400 || log.status === 0;
      }
      return true;
    });
  }
  
  // 请求方法过滤
  if (networkMethodFilter.value !== 'all') {
    filtered = filtered.filter(log => log.method === networkMethodFilter.value);
  }
  
  return filtered;
});

// 存储快照
const storeSnapshots = ref<Record<string, any>>({});
const expandedStores = reactive<Record<string, boolean>>({});

// 可用路由
const availableRoutes = computed(() => {
  if (!router || !router.options || !router.options.routes) return [];
  return router.options.routes;
});

// 添加路由历史记录数组
const routeHistory = ref<Array<{
  from: string;
  to: string;
  time: string;
  params?: Record<string, string>;
  query?: Record<string, string>;
  redirected?: boolean;
  redirectedFrom?: string;
  hash?: string;
}>>([]);

// 最大路由历史记录数
const MAX_ROUTE_HISTORY = 20;

// 标签页增加路由历史
const tabs = computed<Tab[]>(() => [
  { label: '系统', badge: null },
  { label: '网络', badge: networkLogs.value.length > 0 ? networkLogs.value.length : null },
  { label: '路由', badge: routeHistory.value.length > 0 ? routeHistory.value.length : null },
  { label: '状态', badge: null },
  { label: '工具', badge: null },
]);

// 添加点击事件记录数组
const clickEvents = ref<Array<{
  element: string;
  path?: string;
  domPath?: string;
  position: { x: number; y: number };
  time: string;
  target: string;
  attributes?: Record<string, string>;
  routeInfo?: any;
  componentName?: string;
  data?: any;
}>>([]);

// 最大记录数
const MAX_CLICK_EVENTS = 20;

// 获取过滤后的属性
const getFilteredAttributes = (attributes?: Record<string, string>) => {
  if (!attributes) return {};
  
  const filteredAttrs: Record<string, string> = {};
  const importantKeys = ['id', 'class', 'href', 'to', 'data-id', 'type', 'role'];
  
  for (const key of importantKeys) {
    if (attributes[key]) {
      filteredAttrs[key] = attributes[key];
    }
  }
  
  return filteredAttrs;
};

// 方法
const togglePanel = () => {
  collapsed.value = !collapsed.value;
  if (!collapsed.value) {
    // 面板展开时刷新数据
    updatePerfMetrics();
    refreshStores();
  }
};

const toggleLogging = () => {
  enableLogging.value = !enableLogging.value;
};

const toggleSlowNetwork = () => {
  simulateSlowNetwork.value = !simulateSlowNetwork.value;
  // 实现网络限制
  if (simulateSlowNetwork.value) {
    // 在真实环境中这里可以使用 Service Worker 或其他方式模拟慢网络
    console.log('已启用慢网络模拟');
  } else {
    console.log('已禁用慢网络模拟');
  }
};

const forceMobileView = () => {
  isMobileView.value = !isMobileView.value;
  if (isMobileView.value) {
    document.body.classList.add('debug-mobile-view');
  } else {
    document.body.classList.remove('debug-mobile-view');
  }
};

const clearNetworkLogs = () => {
  networkLogs.value = [];
};

const refreshStores = () => {
  // 在真实应用中，应该从 Pinia/Vuex 等获取存储状态
  try {
    // 示例存储数据
    storeSnapshots.value = {
      user: { id: 1, name: '测试用户', isLoggedIn: true },
      settings: { theme: 'light', language: 'zh-CN' },
      app: { isLoading: false, notifications: [] }
    };
  } catch (error) {
    console.error('获取存储快照失败:', error);
  }
};

const toggleStore = (storeName: string) => {
  expandedStores[storeName] = !expandedStores[storeName];
};

const updatePerfMetrics = () => {
  // 获取性能指标（示例数据）
  const memory = window.performance as any;
  perfMetrics.memory = (memory?.memory?.usedJSHeapSize / 1048576) || Math.random() * 100 + 50;
  perfMetrics.cpu = Math.floor(Math.random() * 30) + 10;
  perfMetrics.fps = Math.floor(Math.random() * 10) + 55;
};

const navigateToRoute = () => {
  if (!selectedRoute.value) return;
  router.push(selectedRoute.value);
};

const clearCache = () => {
  try {
    // 清除localStorage
    const storageKeys = Object.keys(localStorage);
    let count = 0;
    
    storageKeys.forEach(key => {
      if (key.startsWith('app_') || key.includes('cache')) {
        localStorage.removeItem(key);
        count++;
      }
    });
    
    // 清除sessionStorage
    const sessionKeys = Object.keys(sessionStorage);
    sessionKeys.forEach(key => {
      if (key.startsWith('app_') || key.includes('cache')) {
        sessionStorage.removeItem(key);
        count++;
      }
    });
    
    cacheInfo.value = `已清除 ${count} 项`;
    setTimeout(() => {
      cacheInfo.value = '0 个项目';
    }, 3000);
  } catch (error) {
    console.error('清除缓存失败:', error);
    cacheInfo.value = '清除失败';
  }
};

// 切换请求详情显示
const toggleRequestDetails = (index: number) => {
  expandedRequests.value[index] = !expandedRequests.value[index];
};

// 格式化JSON
const formatJSON = (value: any): string => {
  try {
    if (typeof value === 'string') {
      // 尝试解析JSON字符串
      try {
        const parsedValue = JSON.parse(value);
        return JSON.stringify(parsedValue, null, 2);
      } catch (e) {
        // 如果不是JSON，直接返回字符串
        return value;
      }
    }
    return JSON.stringify(value, null, 2);
  } catch (error) {
    return String(value);
  }
};

// 扩展XHR拦截，捕获请求和响应详情
const setupNetworkIntercept = () => {
  if (typeof window === 'undefined') return;
  
  // 保存原始方法
  const originalFetch = window.fetch;
  const originalXHROpen = XMLHttpRequest.prototype.open;
  const originalXHRSend = XMLHttpRequest.prototype.send;
  
  // 拦截Fetch
  window.fetch = async function(...args) {
    if (!enableLogging.value) return originalFetch.apply(this, args);
    
    const startTime = performance.now();
    const url = args[0];
    const options = args[1] || {};
    const method = options.method || 'GET';
    
    // 捕获请求头和请求体
    const requestHeaders: Record<string, string> = {};
    if (options.headers) {
      if (options.headers instanceof Headers) {
        options.headers.forEach((value, key) => {
          requestHeaders[key] = value;
        });
      } else if (Array.isArray(options.headers)) {
        for (const [key, value] of options.headers) {
          requestHeaders[key] = value;
        }
      } else {
        Object.assign(requestHeaders, options.headers);
      }
    }
    const requestBody = options.body;
    
    try {
      const response = await originalFetch.apply(this, args);
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);
      
      // 克隆响应以便读取内容
      const clonedResponse = response.clone();
      
      // 提取响应头
      const responseHeaders: Record<string, string> = {};
      clonedResponse.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });
      
      // 尝试读取响应体
      let responseBody;
      try {
        const contentType = clonedResponse.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          responseBody = await clonedResponse.json();
        } else if (contentType.includes('text/')) {
          responseBody = await clonedResponse.text();
        }
      } catch (err) {
        responseBody = '无法读取响应体';
      }
      
      // 记录请求
      networkLogs.value.unshift({
        method,
        path: typeof url === 'string' ? url : (url as Request).url,
        status: response.status,
        time: duration,
        requestHeaders,
        requestBody,
        responseHeaders,
        responseBody
      });
      
      return response;
    } catch (error: any) {
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);
      
      // 记录失败的请求
      networkLogs.value.unshift({
        method,
        path: typeof url === 'string' ? url : (url as Request).url,
        status: 0,
        time: duration,
        error: error.message,
        requestHeaders,
        requestBody
      });
      
      throw error;
    }
  };
  
  // 拦截XHR
  XMLHttpRequest.prototype.open = function(method, url) {
    this._debugMethod = method;
    this._debugUrl = url;
    this._debugStartTime = performance.now();
    this._debugRequestHeaders = {};
    this._debugRequestBody = null;
    
    // 拦截setRequestHeader
    const originalSetRequestHeader = this.setRequestHeader;
    this.setRequestHeader = function(name, value) {
      this._debugRequestHeaders[name] = value;
      return originalSetRequestHeader.apply(this, arguments);
    };
    
    return originalXHROpen.apply(this, arguments);
  };
  
  XMLHttpRequest.prototype.send = function(body) {
    if (enableLogging.value) {
      this._debugRequestBody = body;
      
      this.addEventListener('load', function() {
        const endTime = performance.now();
        const duration = Math.round(endTime - this._debugStartTime);
        
        // 获取响应头
        const responseHeaders: Record<string, string> = {};
        const headerLines = this.getAllResponseHeaders().split('\r\n');
        for (const line of headerLines) {
          if (line) {
            const parts = line.split(': ');
            const name = parts.shift();
            if (name) {
              responseHeaders[name] = parts.join(': ');
            }
          }
        }
        
        // 尝试解析响应体
        let responseBody;
        try {
          const contentType = this.getResponseHeader('content-type') || '';
          if (contentType.includes('application/json')) {
            responseBody = JSON.parse(this.responseText);
          } else {
            responseBody = this.responseText;
          }
        } catch (e) {
          responseBody = this.responseText;
        }
        
        networkLogs.value.unshift({
          method: this._debugMethod,
          path: this._debugUrl,
          status: this.status,
          time: duration,
          requestHeaders: this._debugRequestHeaders,
          requestBody: this._debugRequestBody,
          responseHeaders,
          responseBody
        });
      });
      
      this.addEventListener('error', function() {
        const endTime = performance.now();
        const duration = Math.round(endTime - this._debugStartTime);
        
        networkLogs.value.unshift({
          method: this._debugMethod,
          path: this._debugUrl,
          status: 0,
          time: duration,
          error: 'Network Error',
          requestHeaders: this._debugRequestHeaders,
          requestBody: this._debugRequestBody
        });
      });
    }
    
    return originalXHRSend.apply(this, arguments);
  };
};

// 监控路由变化
const setupRouteMonitor = () => {
  // 记录路由变化
  const recordRouteChange = (to: any, from: any) => {
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`;
    
    const redirected = to.redirectedFrom !== undefined;
    
    // 添加到历史记录
    routeHistory.value.unshift({
      from: from.fullPath || '/',
      to: to.fullPath,
      time: timeString,
      params: to.params,
      query: to.query,
      redirected,
      redirectedFrom: to.redirectedFrom?.fullPath || '',
      hash: to.hash
    });
    
    // 限制历史记录数量
    if (routeHistory.value.length > MAX_ROUTE_HISTORY) {
      routeHistory.value = routeHistory.value.slice(0, MAX_ROUTE_HISTORY);
    }
    
    // 开发模式下在控制台输出详细信息
    if (isDevelopmentMode.value) {
      console.group(`🧭 路由变化 [${timeString}]`);
      console.log('从:', from.fullPath);
      console.log('到:', to.fullPath);
      if (redirected) {
        console.log('重定向自:', to.redirectedFrom?.fullPath);
      }
      console.log('参数:', to.params);
      console.log('查询:', to.query);
      console.log('完整路由对象:', { to, from });
      console.groupEnd();
    }
  };
  
  // 设置路由监听
  router.afterEach(recordRouteChange);
};

// 清除路由历史
const clearRouteHistory = () => {
  routeHistory.value = [];
};

// 修复env类型
const isDevelopmentMode = computed(() => {
  return env.value === 'development';
});

// 生命周期钩子
onMounted(() => {
  setupNetworkIntercept();
  updatePerfMetrics();
  refreshStores();
  
  // 添加点击事件监测
  initClickMonitoring();
  
  // 添加路由监控
  setupRouteMonitor();
  
  // 定期更新性能指标
  const metricsInterval = setInterval(updatePerfMetrics, 2000);
  
  // 监听路由变化
  router.beforeEach((to, from, next) => {
    const startTime = performance.now();
    loadTime.value = 0;
    
    next();
    
    setTimeout(() => {
      const endTime = performance.now();
      loadTime.value = Math.round(endTime - startTime);
    }, 0);
  });
  
  // 清理函数
  onUnmounted(() => {
    clearInterval(metricsInterval);
    if (isMobileView.value) {
      document.body.classList.remove('debug-mobile-view');
    }
  });
});

// 初始化点击监测
const initClickMonitoring = () => {
  document.addEventListener('click', (e) => {
    if (collapsed.value) return;
    
    // 获取点击元素
    const target = e.target as HTMLElement;
    
    // 构建DOM路径
    let domPath = '';
    let elem: HTMLElement | null = target;
    let pathNodes: string[] = [];
    
    while (elem && elem !== document.body) {
      let nodeName = elem.nodeName.toLowerCase();
      
      // 添加id和class信息
      if (elem.id) {
        nodeName += `#${elem.id}`;
      } else if (elem.className && typeof elem.className === 'string') {
        nodeName += `.${elem.className.split(' ').join('.')}`;
      }
      
      // 添加特殊属性
      const dataAttrs: Record<string, string> = {};
      Array.from(elem.attributes).forEach(attr => {
        if (attr.name.startsWith('data-')) {
          dataAttrs[attr.name] = attr.value;
        }
      });
      
      if (Object.keys(dataAttrs).length > 0) {
        nodeName += `[${Object.entries(dataAttrs).map(([k, v]) => `${k}="${v}"`).join(' ')}]`;
      }
      
      pathNodes.unshift(nodeName);
      elem = elem.parentElement;
    }
    
    domPath = pathNodes.join(' > ');
    
    // 收集元素属性
    const attributes: Record<string, string> = {};
    Array.from(target.attributes).forEach(attr => {
      attributes[attr.name] = attr.value;
    });
    
    // 尝试获取组件名称
    let componentName = '';
    let currentElement: any = target;
    while (currentElement && !componentName) {
      if (currentElement.__vue__) {
        componentName = currentElement.__vue__.$options.name || 
                        currentElement.__vue__.$options._componentTag || 
                        'Anonymous Component';
        break;
      }
      currentElement = currentElement.parentNode;
    }
    
    // 路由信息
    const routeInfo: any = {
      currentPath: router.currentRoute.value.path
    };
    
    // 检查是否是链接
    if (target.tagName === 'A' && (target as HTMLAnchorElement).href) {
      routeInfo.href = (target as HTMLAnchorElement).href;
      
      // 尝试解析内部路由链接
      try {
        const url = new URL((target as HTMLAnchorElement).href);
        if (url.origin === window.location.origin) {
          routeInfo.to = url.pathname;
          
          // 解析查询参数
          if (url.search) {
            routeInfo.query = {};
            const searchParams = new URLSearchParams(url.search);
            searchParams.forEach((value, key) => {
              routeInfo.query[key] = value;
            });
          }
        }
      } catch (err) {
        console.error('解析URL时出错:', err);
      }
    }
    
    // 获取路由链接信息
    if (target.hasAttribute('to') || target.hasAttribute(':to') || target.hasAttribute('v-bind:to')) {
      const toAttr = target.getAttribute('to') || target.getAttribute(':to') || target.getAttribute('v-bind:to');
      if (toAttr) {
        routeInfo.to = toAttr;
      }
    }
    
    // 获取文本内容，截断过长内容
    let textContent = target.textContent || '';
    textContent = textContent.trim();
    if (textContent.length > 100) {
      textContent = textContent.substring(0, 100) + '...';
    }
    
    // 记录事件信息
    clickEvents.value.unshift({
      time: new Date().toLocaleTimeString(),
      element: target.tagName.toLowerCase(),
      path: target.id ? `#${target.id}` : (target.className ? `.${target.className.replace(/\s+/g, '.')}` : ''),
      domPath: domPath,
      position: { x: e.clientX, y: e.clientY },
      target: textContent,
      routeInfo,
      attributes,
      componentName,
      data: {
        tagName: target.tagName,
        innerText: textContent,
        classNames: Array.from(target.classList)
      }
    });
    
    // 限制记录数量
    if (clickEvents.value.length > 20) {
      clickEvents.value = clickEvents.value.slice(0, 20);
    }
    
    // 更新标签计数
    tabs.value[0].badge = clickEvents.value.length;
  });
};

// 清除点击记录
const clearClickEvents = () => {
  clickEvents.value = [];
};
</script>

<style scoped>
/* 主容器样式 */
.debug-panel {
  position: fixed;
  right: 0;
  top: 0;
  height: 100vh;
  width: 350px;
  background-color: #2a2a2a;
  color: #eaeaea;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.2);
  z-index: 9998;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  overflow: hidden;
}

.debug-panel.collapsed {
  transform: translateX(100%);
}

/* 悬浮按钮样式 */
.debug-float-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #262626;
  color: #4c8bf5;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 9999;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s ease;
  border: 1px solid #4c8bf5;
  width: 42px;
  height: 42px;
}

.debug-float-button.expanded {
  right: 350px;
  border-radius: 8px 0 0 8px;
  width: auto;
  height: auto;
  border-right: none;
  padding: 12px;
}

.debug-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.debug-icon svg {
  stroke: white;
}

.debug-icon-text {
  font-size: 20px;
}

.debug-float-button.expanded .debug-icon {
  margin-right: 8px;
}

.debug-float-button:hover {
  transform: scale(1.05);
  background-color: #333333;
}

.debug-float-button.expanded:hover {
  transform: none;
  padding-right: 16px;
}

.debug-float-text {
  white-space: nowrap;
}

/* 标签页样式 */
.debug-tabs {
  display: flex;
  background-color: #333333;
  border-bottom: 1px solid #444444;
}

.tab-item {
  padding: 12px 16px;
  cursor: pointer;
  font-size: 14px;
  position: relative;
  transition: all 0.2s;
  flex: 1;
  text-align: center;
}

.tab-item:hover {
  background-color: #3a3a3a;
}

.tab-item.active {
  background-color: #4c8bf5;
  color: white;
}

.tab-badge {
  background-color: #ff5252;
  color: white;
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 10px;
  position: absolute;
  top: 6px;
  right: 6px;
  min-width: 8px;
  text-align: center;
}

/* 内容区域样式 */
.debug-content {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

.tab-panel {
  padding: 16px;
  height: calc(100vh - 45px);
  overflow-y: auto;
}

.panel-title {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 500;
  color: #4c8bf5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 8px;
  border-bottom: 1px solid #444444;
}

.section-title {
  font-size: 16px;
  margin: 16px 0 12px 0;
  color: #cccccc;
  font-weight: 500;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-actions {
  display: flex;
  gap: 8px;
}

.action-button {
  background-color: #444444;
  border: none;
  color: #ffffff;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: background-color 0.2s;
}

.action-button:hover {
  background-color: #555555;
}

.action-icon {
  font-size: 14px;
}

/* 系统信息布局样式 */
.info-card {
  background-color: #333333;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.info-row {
  display: flex;
  margin-bottom: 10px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-col {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 12px;
  color: #aaaaaa;
  margin-bottom: 4px;
}

.info-value {
  font-size: 14px;
  color: #ffffff;
  font-weight: 500;
}

.env-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.env-badge.dev {
  background-color: #4c8bf5;
  color: #ffffff;
}

.env-badge.prod {
  background-color: #ff5252;
  color: #ffffff;
}

.metrics-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}

.metric-item {
  background-color: #333333;
  border-radius: 8px;
  padding: 10px;
  text-align: center;
}

.metric-value {
  font-size: 16px;
  font-weight: 600;
  color: #4c8bf5;
  margin-bottom: 2px;
}

.metric-label {
  font-size: 12px;
  color: #aaaaaa;
}

/* 网络请求列表样式 */
.network-filter-container {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.search-box {
  flex: 3;
  min-width: 150px;
}

.filter-options {
  flex: 2;
  display: flex;
  gap: 8px;
}

.status-filter, .method-filter {
  flex: 1;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #444444;
  background-color: #333333;
  color: #ffffff;
  font-size: 14px;
  outline: none;
}

.status-filter:focus, .method-filter:focus {
  border-color: #4c8bf5;
}

.network-list {
  background-color: #333333;
  border-radius: 8px;
  overflow: hidden;
  max-height: calc(100vh - 180px);
  overflow-y: auto;
}

.network-item {
  display: flex;
  padding: 10px 12px;
  border-bottom: 1px solid #444444;
  font-size: 13px;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.network-item:last-child {
  border-bottom: none;
}

.network-item.success {
  background-color: rgba(76, 175, 80, 0.1);
}

.network-item.error {
  background-color: rgba(244, 67, 54, 0.1);
}

.network-item.expanded {
  background-color: #3a3a3a;
}

.network-item-summary {
  display: flex;
  padding: 10px 12px;
  align-items: center;
  width: 100%;
}

.network-method {
  flex: 0 0 70px;
  font-weight: 600;
  color: #4c8bf5;
  text-align: center;
  padding: 2px 4px;
  border-radius: 3px;
  background-color: rgba(76, 139, 245, 0.1);
}

.network-method.get {
  color: #4caf50;
  background-color: rgba(76, 175, 80, 0.1);
}

.network-method.post {
  color: #ff9800;
  background-color: rgba(255, 152, 0, 0.1);
}

.network-method.put {
  color: #2196f3;
  background-color: rgba(33, 150, 243, 0.1);
}

.network-method.delete {
  color: #f44336;
  background-color: rgba(244, 67, 54, 0.1);
}

.network-path {
  flex: 1;
  padding: 0 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.network-toggle {
  width: 20px;
  text-align: center;
  color: #aaaaaa;
}

.network-details {
  padding: 0 12px 12px 12px;
  background-color: #2d2d2d;
  border-top: 1px solid #444444;
  font-size: 13px;
}

.detail-section {
  margin-top: 12px;
}

.detail-header {
  font-weight: 600;
  color: #4c8bf5;
  margin-bottom: 6px;
  padding-bottom: 4px;
  border-bottom: 1px dotted #444444;
}

.detail-content {
  padding-left: 10px;
}

.detail-row {
  margin-bottom: 4px;
  display: flex;
  flex-wrap: wrap;
}

.detail-label {
  flex: 0 0 100px;
  font-weight: 500;
  color: #aaaaaa;
}

.detail-value {
  flex: 1;
  word-break: break-all;
}

.status-success {
  color: #4caf50;
}

.status-error {
  color: #f44336;
}

.error-message {
  color: #f44336;
  font-weight: 500;
}

.code-block {
  background-color: #222222;
  border-radius: 4px;
  padding: 8px;
  max-height: 200px;
  overflow: auto;
}

.code-block pre {
  margin: 0;
  font-family: 'Fira Code', monospace;
  font-size: 12px;
  white-space: pre-wrap;
  word-break: break-all;
}

/* 存储列表样式 */
.stores-list {
  background-color: #333333;
  border-radius: 8px;
  overflow: hidden;
}

.store-item {
  border-bottom: 1px solid #444444;
}

.store-item:last-child {
  border-bottom: none;
}

.store-header {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  cursor: pointer;
  background-color: #3a3a3a;
  transition: background-color 0.2s;
}

.store-header:hover {
  background-color: #444444;
}

.store-name {
  font-weight: 500;
  color: #4c8bf5;
}

.toggle-icon {
  color: #aaaaaa;
}

.store-content {
  padding: 12px;
  background-color: #2d2d2d;
}

.store-json {
  margin: 0;
  font-family: 'Fira Code', monospace;
  font-size: 12px;
  color: #cccccc;
  overflow-x: auto;
}

/* 工具箱样式 */
.tools-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.tool-card {
  background-color: #333333;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.tool-card:hover {
  background-color: #3a3a3a;
  transform: translateY(-2px);
}

.tool-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.tool-icon.active {
  color: #4c8bf5;
}

.tool-name {
  font-weight: 500;
  margin-bottom: 4px;
}

.tool-status {
  font-size: 12px;
  color: #aaaaaa;
}

/* 路由工具样式 */
.route-tools {
  display: flex;
  gap: 8px;
}

.route-select {
  flex: 1;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #444444;
  background-color: #333333;
  color: #ffffff;
  outline: none;
  font-size: 14px;
}

.route-button {
  padding: 8px 16px;
  background-color: #4c8bf5;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.route-button:hover:not(:disabled) {
  background-color: #3b7ae0;
}

.route-button:disabled {
  background-color: #555555;
  cursor: not-allowed;
}

/* 空状态样式 */
.empty-state {
  padding: 40px 0;
  text-align: center;
  color: #888888;
  font-style: italic;
}

/* 移动视图模式 */
:global(.debug-mobile-view) {
  max-width: 414px;
  margin: 0 auto;
  position: relative;
  overflow-x: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  height: 100vh;
}

/* 滚动条样式 */
.debug-content::-webkit-scrollbar,
.network-list::-webkit-scrollbar,
.store-json::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.debug-content::-webkit-scrollbar-track,
.network-list::-webkit-scrollbar-track,
.store-json::-webkit-scrollbar-track {
  background: #2d2d2d;
}

.debug-content::-webkit-scrollbar-thumb,
.network-list::-webkit-scrollbar-thumb,
.store-json::-webkit-scrollbar-thumb {
  background: #555555;
  border-radius: 4px;
}

.debug-content::-webkit-scrollbar-thumb:hover,
.network-list::-webkit-scrollbar-thumb:hover,
.store-json::-webkit-scrollbar-thumb:hover {
  background: #666666;
}

/* 点击事件监测样式 */
.click-events {
  background-color: #333333;
  border-radius: 8px;
  overflow: hidden;
  max-height: 300px;
  overflow-y: auto;
}

.click-event {
  padding: 12px;
  border: 1px solid #444444;
  border-radius: 6px;
  margin-bottom: 10px;
  background-color: #333333;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  transition: all 0.2s ease;
}

.click-event:hover {
  background-color: #3a3a3a;
  border-color: #4c8bf5;
  box-shadow: 0 2px 5px rgba(0,0,0,0.15);
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #444444;
}

.event-element {
  font-weight: bold;
  font-size: 14px;
  background: #4c8bf5;
  padding: 2px 6px;
  border-radius: 4px;
  color: #ffffff;
}

.event-time {
  color: #aaaaaa;
  font-size: 12px;
}

.event-details {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
}

.dom-path {
  font-family: monospace;
  font-size: 12px;
  background: #2d2d2d;
  padding: 3px 6px;
  border-radius: 3px;
  word-break: break-all;
  line-height: 1.4;
  max-height: 60px;
  overflow-y: auto;
  color: #c4e3ff;
}

.route-details {
  font-family: monospace;
  font-size: 12px;
  margin-left: 70px;
  background: #2d2d2d;
  padding: 5px;
  border-radius: 4px;
  border-left: 2px solid #4c8bf5;
  color: #dddddd;
}

.attributes-list {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-left: 70px;
}

.attribute-item {
  background: #2d2d2d;
  padding: 3px 6px;
  border-radius: 3px;
  font-size: 12px;
  max-width: 100%;
  word-break: break-all;
  display: flex;
  align-items: center;
  color: #dddddd;
}

.attribute-value {
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #4c8bf5;
}

/* 路由历史样式 */
.route-history {
  background-color: #333333;
  border-radius: 8px;
  overflow: hidden;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

.route-item {
  padding: 12px;
  border-bottom: 1px solid #444444;
  font-size: 13px;
}

.route-item:hover {
  background-color: #3a3a3a;
}

.route-item:last-child {
  border-bottom: none;
}

.route-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.route-time {
  color: #aaaaaa;
  font-size: 12px;
}

.route-badge {
  background-color: #ff9800;
  color: #222;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: bold;
}

.route-content {
  display: flex;
  flex-direction: column;
  font-size: 12px;
  padding-left: 10px;
  border-left: 2px solid #444;
}

.route-path {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
}

.route-from, .route-to {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.route-arrow {
  margin: 0 8px;
  color: #4c8bf5;
  font-weight: bold;
}

.route-redirect, .route-params, .route-query, .route-hash {
  margin-bottom: 6px;
}

.param-list, .query-list {
  display: flex;
  flex-wrap: wrap;
  margin-top: 2px;
}

.param-item, .query-item {
  background-color: #444;
  border-radius: 3px;
  padding: 2px 5px;
  margin-right: 4px;
  margin-bottom: 4px;
  font-size: 11px;
}
</style> 