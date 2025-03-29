import { execSync, spawn } from 'child_process';
import os from 'os';
const platform = os.platform();

console.log('正在检查端口5173...');

try {
  let pid;
  
  // 检查操作系统并使用相应的命令
  if (platform === 'win32') {
    // Windows平台
    const output = execSync('netstat -ano | findstr ":5173" | findstr "LISTENING"').toString();
    if (output) {
      // Windows下netstat输出的最后一列是PID
      const lines = output.trim().split('\n');
      const lastLine = lines[0];
      const parts = lastLine.trim().split(/\s+/);
      pid = parts[parts.length - 1];
    }
  } else {
    // Linux/Mac平台
    const output = execSync('lsof -i :5173 -t').toString();
    if (output) {
      pid = output.trim();
    }
  }

  if (pid) {
    console.log(`端口5173被进程PID: ${pid} 占用，正在结束...`);
    if (platform === 'win32') {
      execSync(`taskkill /F /PID ${pid}`);
    } else {
      execSync(`kill -9 ${pid}`);
    }
    console.log('进程已结束');
    // 等待端口释放
    setTimeout(() => {
      startFrontend();
    }, 2000);
  } else {
    console.log('端口5173未被占用');
    startFrontend();
  }
} catch (error) {
  console.log('端口5173未被占用或检查过程出错');
  startFrontend();
}

function startFrontend() {
  console.log('正在启动前端服务...');
  
  // 使用npm run dev启动前端服务
  const npmProcess = spawn('npm', ['run', 'dev'], { 
    stdio: 'inherit',
    shell: true
  });

  npmProcess.on('error', (error) => {
    console.error(`启动失败: ${error.message}`);
  });
} 