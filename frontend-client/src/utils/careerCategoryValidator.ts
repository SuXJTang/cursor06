import request from '@/api/request';

/**
 * 职业类别接口
 */
interface CareerCategory {
  id: number;
  name: string;
  level: number;
  subcategories?: CareerCategory[];
  parent_id?: number;
}

/**
 * 职业信息接口
 */
interface Career {
  id: number;
  name?: string;
  title?: string;
  category_id: number;
  description?: string;
}

/**
 * API响应接口
 */
interface CareersResponse {
  items: Career[];
  total: number;
  page: number;
  limit: number;
}

/**
 * 测试结果接口
 */
interface TestResult {
  totalCategories: number;
  categoriesWithCareers: number;
  categoriesWithoutCareers: number;
  missingCategories: Array<{id: number; name: string; path: string}>;
  report: string;
}

/**
 * 获取所有职业类别的扁平列表
 * @param categories 类别树
 * @param level 当前层级
 * @param parentPath 父级路径
 * @returns 类别列表
 */
const flattenCategories = (
  categories: CareerCategory[], 
  level: number = 1, 
  parentPath: string = ''
): Array<{category: CareerCategory; path: string}> => {
  let result: Array<{category: CareerCategory; path: string}> = [];
  
  categories.forEach(category => {
    const currentPath = parentPath ? `${parentPath} > ${category.name}` : category.name;
    category.level = level;
    
    result.push({
      category,
      path: currentPath
    });
    
    if (category.subcategories && category.subcategories.length > 0) {
      const subResults = flattenCategories(category.subcategories, level + 1, currentPath);
      result = result.concat(subResults);
    }
  });
  
  return result;
};

/**
 * 获取指定类别下的职业列表
 * @param categoryId 类别ID
 * @returns 职业列表
 */
const getCareersForCategory = async (categoryId: number): Promise<Career[]> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      console.error('未找到认证token');
      return [];
    }
    
    const response = await request<CareersResponse>({
      url: '/api/v1/careers',
      method: 'GET',
      params: {
        category_id: categoryId,
        page: 1,
        limit: 5
      },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response?.data?.items || [];
  } catch (error) {
    console.error(`获取类别 ${categoryId} 的职业失败:`, error);
    return [];
  }
};

/**
 * 验证所有三级类别是否有关联职业
 * @returns 测试结果
 */
export const validateCategoryCareerRelations = async (): Promise<TestResult> => {
  console.log('开始验证职业三级类别是否有关联的职业信息...');
  
  const result: TestResult = {
    totalCategories: 0,
    categoriesWithCareers: 0,
    categoriesWithoutCareers: 0,
    missingCategories: [],
    report: ''
  };
  
  try {
    // 1. 获取所有类别
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('未找到认证token，请先登录');
    }
    
    console.log('正在获取所有职业类别...');
    const response = await request<CareerCategory[]>({
      url: '/api/v1/career-categories/roots',
      method: 'GET',
      params: {
        include_children: true,
        include_all_children: true
      },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    // 确保响应数据是数组
    const rootCategories = Array.isArray(response) ? response : [];
    
    // 2. 提取所有三级类别
    const allCategories = flattenCategories(rootCategories);
    const thirdLevelCategories = allCategories.filter(item => item.category.level === 3);
    
    console.log(`找到 ${thirdLevelCategories.length} 个三级类别`);
    result.totalCategories = thirdLevelCategories.length;
    
    // 3. 检查每个三级类别是否有关联的职业
    console.log('开始检查每个类别的职业关联...');
    const progressTotal = thirdLevelCategories.length;
    let progressCurrent = 0;
    
    for (const item of thirdLevelCategories) {
      progressCurrent++;
      if (progressCurrent % 10 === 0 || progressCurrent === progressTotal) {
        console.log(`进度: ${progressCurrent}/${progressTotal}`);
      }
      
      const careers = await getCareersForCategory(item.category.id);
      
      if (careers.length > 0) {
        result.categoriesWithCareers++;
      } else {
        result.categoriesWithoutCareers++;
        result.missingCategories.push({
          id: item.category.id,
          name: item.category.name,
          path: item.path
        });
      }
    }
    
    // 4. 生成报告
    const generateReport = () => {
      const coverage = (result.categoriesWithCareers / result.totalCategories * 100).toFixed(2);
      
      let report = `
职业三级类别与职业信息关联验证报告
========================================
总计三级类别数量: ${result.totalCategories}
有关联职业的类别数: ${result.categoriesWithCareers}
缺少关联职业的类别数: ${result.categoriesWithoutCareers}
覆盖率: ${coverage}%
========================================
`;
      
      if (result.missingCategories.length > 0) {
        report += `
缺少职业信息的类别列表:
`;
        result.missingCategories.forEach((item, index) => {
          report += `${index + 1}. ${item.path} (ID: ${item.id})\n`;
        });
      }
      
      return report;
    };
    
    result.report = generateReport();
    console.log(result.report);
    
    return result;
  } catch (error: unknown) {
    console.error('验证过程中发生错误:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    result.report = `验证过程中发生错误: ${errorMessage}`;
    return result;
  }
};

/**
 * 生成CSV格式的缺失职业信息类别报告
 * @param result 测试结果
 * @returns CSV字符串
 */
export const generateCSVReport = (result: TestResult): string => {
  let csv = '类别ID,类别名称,完整路径\n';
  
  result.missingCategories.forEach(item => {
    // 确保CSV格式正确，处理可能包含逗号的字段
    const escapedName = item.name.includes(',') ? `"${item.name}"` : item.name;
    const escapedPath = item.path.includes(',') ? `"${item.path}"` : item.path;
    
    csv += `${item.id},${escapedName},${escapedPath}\n`;
  });
  
  return csv;
};

/**
 * 下载测试报告
 * @param result 测试结果
 * @param type 报告类型 'text' 或 'csv'
 */
export const downloadReport = (result: TestResult, type: 'text' | 'csv' = 'text'): void => {
  let content = '';
  let filename = '';
  let contentType = '';
  
  if (type === 'csv') {
    content = generateCSVReport(result);
    filename = `缺失职业信息类别报告_${new Date().toISOString().split('T')[0]}.csv`;
    contentType = 'text/csv;charset=utf-8';
  } else {
    content = result.report;
    filename = `职业类别验证报告_${new Date().toISOString().split('T')[0]}.txt`;
    contentType = 'text/plain;charset=utf-8';
  }
  
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  
  URL.revokeObjectURL(url);
}; 