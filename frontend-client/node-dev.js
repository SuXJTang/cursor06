// 使用 Node.js 原生模块
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// 设置路径
const rootDir = __dirname;
const vitePath = path.join(rootDir, 'node_modules', 'vite', 'bin', 'vite.js');

// 检查 Vite 是否存在
if (!fs.existsSync(vitePath)) {
  console.error(`错误: 找不到 Vite 在 ${vitePath}`);
  console.error('请确保已安装项目依赖');
  process.exit(1);
}

console.log('正在启动开发服务器...');
console.log(`使用 Vite: ${vitePath}`);

// 直接使用 spawn 启动子进程
const viteProcess = spawn('node', [vitePath, '--port', '5174'], {
  stdio: 'inherit', // 将输出直接传递到父进程
  cwd: rootDir,     // 使用当前目录作为工作目录
});

// 处理子进程事件
viteProcess.on('close', (code) => {
  console.log(`Vite开发服务器已退出，退出码: ${code}`);
  process.exit(code);
});

// 处理 CTRL+C 和其他信号
process.on('SIGINT', () => {
  viteProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  viteProcess.kill('SIGTERM');
}); 