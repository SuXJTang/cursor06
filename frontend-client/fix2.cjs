const fs = require('fs');
const path = 'src/views/CareerLibrary.vue';
let content = fs.readFileSync(path, 'utf8');

// 查找并删除底部的ApiError接口定义
content = content.replace(/\/\/ 添加自定义ApiError类型[\s\S]*?message\?: string;\n}/m, '');

// 替换所有catch (apiError)为catch (error)并使用isApiError类型守卫
content = content.replace(/catch \(apiError\) {/g, 'catch (error) {\n      const apiError = error as ApiError;');

// 保存修改后的文件
fs.writeFileSync(path, content, 'utf8');

console.log('API错误处理已修复'); 