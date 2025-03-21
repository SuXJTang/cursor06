/**
 * 职业数据显示修复脚本
 * 使用方法：在浏览器控制台中粘贴运行此脚本
 */

(function() {
  console.log('====== 开始修复职业显示问题 ======');
  
  // 步骤1: 获取Vue组件实例
  function getVueInstance() {
    try {
      // 尝试找到Vue 3的__vue_app__
      const app = document.querySelector('#app')?.__vue_app__;
      if (app) {
        console.log('找到Vue应用实例');
        return { type: 'vue3', instance: app };
      }
      
      // 尝试查找职业库组件
      const careerLibrary = document.querySelector('.career-library');
      if (careerLibrary && careerLibrary.__vue__) {
        console.log('找到Vue 2组件实例');
        return { type: 'vue2', instance: careerLibrary.__vue__ };
      }
      
      console.log('无法找到Vue实例，尝试访问Devtools窗口');
      return null;
    } catch (e) {
      console.error('获取Vue实例时出错:', e);
      return null;
    }
  }
  
  // 步骤2: 分析数据情况
  function analyzeData(vueInfo) {
    try {
      if (!vueInfo) return null;
      
      let componentInstance;
      
      if (vueInfo.type === 'vue2') {
        componentInstance = vueInfo.instance;
      } else {
        // Vue 3需要通过其他方式获取组件
        console.log('当前是Vue 3应用，直接使用全局变量访问');
        return null;
      }
      
      // 检查数据状态
      console.log('检查组件数据...');
      
      if (componentInstance.careers && Array.isArray(componentInstance.careers)) {
        console.log(`找到职业数据，共${componentInstance.careers.length}条`);
        
        if (componentInstance.careers.length > 0) {
          console.log('第一条职业数据:', componentInstance.careers[0]);
          
          // 检查是否有选中的职业
          if (componentInstance.selectedCareer) {
            console.log('当前已选中职业:', componentInstance.selectedCareer.name);
          } else {
            console.log('当前没有选中职业，这是问题所在');
          }
          
          return {
            hasCareers: true,
            careersCount: componentInstance.careers.length,
            hasSelected: !!componentInstance.selectedCareer,
            instance: componentInstance
          };
        } else {
          console.log('职业数据数组为空');
          return {
            hasCareers: false,
            careersCount: 0,
            hasSelected: false,
            instance: componentInstance
          };
        }
      } else {
        console.log('找不到职业数据数组或格式不正确');
        return null;
      }
    } catch (e) {
      console.error('分析数据时出错:', e);
      return null;
    }
  }
  
  // 步骤3: 尝试修复问题
  function fixDisplay(analysisResult) {
    if (!analysisResult) {
      console.log('无法修复：分析结果不可用');
      
      // 尝试直接通过DOM更新
      console.log('尝试通过DOM直接修复...');
      const careerItems = document.querySelectorAll('.career-item');
      if (careerItems && careerItems.length > 0) {
        console.log(`找到${careerItems.length}个职业项目，尝试触发点击第一项`);
        careerItems[0].click();
        return '已尝试通过DOM点击修复';
      }
      
      return '无法修复，请检查网络请求和数据格式';
    }
    
    const { hasCareers, careersCount, hasSelected, instance } = analysisResult;
    
    if (!hasCareers) {
      console.log('无职业数据，尝试重新获取...');
      // 尝试手动获取数据
      if (instance.activeCategory && typeof instance.fetchCareers === 'function') {
        console.log(`尝试重新获取分类ID=${instance.activeCategory}的数据`);
        instance.fetchCareers(instance.activeCategory);
        return '已触发数据重新获取，请等待几秒后查看结果';
      }
      return '无法修复：没有职业数据且无法触发获取';
    }
    
    if (hasCareers && !hasSelected) {
      console.log('有职业数据但未选中，尝试手动选择第一项');
      // 修复：手动选择第一项
      if (typeof instance.selectCareer === 'function') {
        instance.selectCareer(instance.careers[0]);
        console.log('已手动选择第一个职业');
        return '已修复：手动选择了第一个职业';
      } else if (instance.selectedCareer !== undefined) {
        // 直接设置
        instance.selectedCareer = instance.careers[0];
        console.log('已直接设置选中职业');
        return '已修复：直接设置了选中职业';
      }
    }
    
    // 触发视图更新
    console.log('尝试强制更新视图...');
    if (typeof instance.$forceUpdate === 'function') {
      instance.$forceUpdate();
      console.log('已强制更新视图');
      return '已强制更新视图';
    }
    
    return '无法确定修复方法，请手动检查组件结构';
  }
  
  // 步骤4：检查DOM结构
  function checkDOM() {
    // 检查职业列表
    const careerList = document.querySelector('.career-list');
    console.log('职业列表元素存在:', !!careerList);
    
    if (careerList) {
      const careerItems = careerList.querySelectorAll('.career-item');
      console.log('职业项目数量:', careerItems.length);
      
      if (careerItems.length > 0) {
        console.log('第一个职业项目内容:', careerItems[0].textContent);
      }
    }
    
    // 检查职业详情
    const careerDetail = document.querySelector('.career-detail');
    console.log('职业详情元素存在:', !!careerDetail);
    
    if (careerDetail) {
      console.log('职业详情内容长度:', careerDetail.textContent.length);
      console.log('职业详情可见性:', careerDetail.style.display !== 'none');
    }
    
    // 检查职业详情卡片
    const detailCard = document.querySelector('.career-detail-card');
    console.log('详情卡片存在:', !!detailCard);
    
    if (detailCard) {
      const detailHeader = detailCard.querySelector('.detail-header');
      console.log('详情标题区域存在:', !!detailHeader);
      
      if (detailHeader) {
        const title = detailHeader.querySelector('h2');
        console.log('标题元素存在:', !!title);
        console.log('标题内容:', title ? title.textContent : '无');
      }
    }
  }
  
  // 执行修复流程
  const vueInfo = getVueInstance();
  const analysisResult = analyzeData(vueInfo);
  const fixResult = fixDisplay(analysisResult);
  
  console.log('DOM结构检查:');
  checkDOM();
  
  console.log('修复结果:', fixResult);
  console.log('如果修复不成功，请尝试以下操作：');
  console.log('1. 刷新页面后再试');
  console.log('2. 执行 localStorage.clear() 清除缓存后刷新');
  console.log('3. 检查浏览器控制台是否有报错');
  console.log('4. 尝试手动点击职业列表项');
  
  // 尝试一个更直接的修复方式：直接点击第一个职业项
  setTimeout(() => {
    const careerItems = document.querySelectorAll('.career-item');
    if (careerItems && careerItems.length > 0) {
      console.log('尝试自动点击第一个职业项...');
      careerItems[0].click();
    }
  }, 1000);
  
  console.log('====== 修复尝试完成 ======');
})(); 