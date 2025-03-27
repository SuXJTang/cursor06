import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Vite脚本路径
const vitePath = path.join(__dirname, 'node_modules', 'vite', 'bin', 'vite.js');

console.log('正在启动开发服务器...');
console.log(`使用脚本: ${vitePath}`);

// 直接使用spawn启动子进程
const viteProcess = spawn(process.execPath, [vitePath], {
  stdio: 'inherit', // 将输出直接传递到父进程
  shell: false,     // 不使用shell
  cwd: __dirname,   // 使用当前目录作为工作目录
  env: process.env  // 传递环境变量
});

// 处理子进程事件
viteProcess.on('close', (code) => {
  console.log(`Vite开发服务器已退出，退出码: ${code}`);
  process.exit(code);
});

// 处理CTRL+C和其他信号
process.on('SIGINT', () => {
  viteProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  viteProcess.kill('SIGTERM');
}); 