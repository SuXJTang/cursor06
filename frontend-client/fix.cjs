const fs = require('fs');
const path = 'src/views/CareerLibrary.vue';
let content = fs.readFileSync(path, 'utf8');

// 删除第一个checkIsFavorite函数定义
content = content.replace(/const checkIsFavorite = async \(careerId: number\) =>[\s\S]*?isFavorite\.value = false;\n  }\n};/m, '');

// 删除第二个checkIsFavorite函数定义
content = content.replace(/const checkIsFavorite = async \(careerId: string \| number\): Promise<boolean> =>[\s\S]*?return false;\n  }\n};/m, '');

// 更新导入路径
content = content.replace(
  /import \{ addFavoriteCareer, removeFavoriteCareer, checkIsFavorite as apiCheckIsFavorite \} from ['"].*['"]/, 
  "import { addFavoriteCareer, removeFavoriteCareer, checkIsFavorite as apiCheckIsFavorite } from '../api/favorites'"
);

// 保存修改后的文件
fs.writeFileSync(path, content, 'utf8');

console.log('删除完成'); 