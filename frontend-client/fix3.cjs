const fs = require('fs');
const path = 'src/views/CareerLibrary.vue';
let content = fs.readFileSync(path, 'utf8');

// 修复所有catchError部分，添加类型断言
const errorFixPattern = /catch \(error\) {/g;
const errorFixReplacement = 'catch (err: unknown) {\n    const error = err as Error;';
content = content.replace(errorFixPattern, errorFixReplacement);

// 修复过滤方法中的类型
const filterFixPattern = /return careers\.value\.filter\((career)(\s*=>)/g;
const filterFixReplacement = 'return careers.value.filter((career: Career)$2';

content = content.replace(filterFixPattern, filterFixReplacement);

// 修复Career.tags.some中的类型
const tagsFixPattern = /career\.tags\.some\((tag)(\s*=>)/g;
const tagsFixReplacement = 'career.tags.some((tag: string)$2';

content = content.replace(tagsFixPattern, tagsFixReplacement);

// 修复本地实现的addFavoriteCareer和removeFavoriteCareer与导入冲突
// 将它们重命名为localXXX
const favoriteFixPattern = /const addFavoriteCareer/g;
const favoriteFixReplacement = 'const localAddFavoriteCareer';
content = content.replace(favoriteFixPattern, favoriteFixReplacement);

const removeFavoriteFixPattern = /const removeFavoriteCareer/g;
const removeFavoriteFixReplacement = 'const localRemoveFavoriteCareer';
content = content.replace(removeFavoriteFixPattern, removeFavoriteFixReplacement);

// 更新toggleFavorite中的调用
content = content.replace(/await removeFavoriteCareer/g, 'await localRemoveFavoriteCareer');
content = content.replace(/await addFavoriteCareer/g, 'await localAddFavoriteCareer');

// 保存修改后的文件
fs.writeFileSync(path, content, 'utf8');

console.log('类型问题修复完成'); 