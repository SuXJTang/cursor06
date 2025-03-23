/**
 * 职业库页面调试脚本
 * 使用方法：在浏览器控制台中粘贴运行此脚本
 */

(function() {
  console.log('========= 职业库调试脚本开始 =========');

  // 检查环境变量
  const ENV_MOCK = window?.VITE_USE_MOCK || false;
  console.log('是否启用mock:', ENV_MOCK);

  // 检查token
  const token = localStorage.getItem('auth_token');
  console.log('认证token是否存在:', !!token);
  if (token) {
    console.log('Token前10位:', token.substring(0, 10));
    console.log('Token后10位:', token.substring(token.length - 10));
  }

  // 查看Vue实例
  const appElement = document.querySelector('#app');
  console.log('找到App元素:', !!appElement);

  // 检查职业库组件
  setTimeout(() => {
    const careerLibraryElement = document.querySelector('.career-library');
    console.log('找到职业库组件:', !!careerLibraryElement);

    // 检查职业列表
    const careerListElement = document.querySelector('.career-list');
    console.log('找到职业列表元素:', !!careerListElement);

    // 检查职业项
    const careerItems = document.querySelectorAll('.career-item');
    console.log('职业项数量:', careerItems.length);

    // 检查分类菜单
    const categoryMenu = document.querySelector('.category-menu');
    console.log('找到分类菜单:', !!categoryMenu);
    if (categoryMenu) {
      const categoryItems = categoryMenu.querySelectorAll('.el-sub-menu, .el-menu-item');
      console.log('分类项数量:', categoryItems.length);
    }

    // 查看数据模型
    console.log('尝试访问Vue实例数据...');
    
    // 尝试获取Vue实例
    try {
      const instance = document.querySelector('.career-library').__vue__;
      console.log('获取到Vue实例:', !!instance);
      
      if (instance) {
        console.log('职业数据数量:', instance.careers?.length || 0);
        console.log('活动分类:', instance.activeCategory);
        console.log('已选择职业:', instance.selectedCareer ? instance.selectedCareer.name : 'null');
      }
    } catch (e) {
      console.log('无法获取Vue实例:', e.message);
    }
    
    // 尝试检查网络请求
    console.log('检查最近的网络请求...');
    try {
      // 手动发起一个测试请求
      const testUrl = '/api/v1/career-categories/roots?include_children=true';
      console.log('发送测试请求:', testUrl);
      
      fetch(testUrl, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      })
        .then(response => {
          console.log('测试请求状态:', response.status);
          return response.json();
        })
        .then(data => {
          console.log('测试请求数据:', data);
        })
        .catch(error => {
          console.error('测试请求失败:', error);
        });
    } catch (e) {
      console.error('测试请求出错:', e);
    }
  }, 1000);

  // 修复建议
  console.log('可能的修复建议:');
  console.log('1. 检查.env文件中是否禁用了mock数据 (VITE_USE_MOCK=false)');
  console.log('2. 清除localStorage缓存数据 (localStorage.clear())');
  console.log('3. 检查请求拦截器是否正确转发API请求');
  console.log('4. 检查数据处理逻辑是否正确转换API响应格式');

  console.log('========= 职业库调试脚本结束 =========');
})(); 