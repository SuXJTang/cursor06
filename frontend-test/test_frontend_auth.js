// 使用Playwright测试前端登录功能
// 需要安装: npm install -g playwright
// 运行: node test_frontend_auth.js

const { chromium } = require('playwright');

// 测试配置
const BASE_URL = 'http://localhost:5173'; // 前端应用URL
const VALID_USER = {
  username: 'admin@example.com',
  password: 'admin123',
};

async function testLogin() {
  console.log('启动浏览器测试前端登录功能...');
  
  // 启动浏览器
  const browser = await chromium.launch({ headless: false }); // 设置为false可以看到浏览器界面
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // 访问登录页面
    console.log('访问登录页面...');
    await page.goto(`${BASE_URL}/login`);
    await page.waitForSelector('.login-container');
    
    // 填写登录表单
    console.log('填写登录表单...');
    await page.fill('input[placeholder="请输入用户名"]', VALID_USER.username);
    await page.fill('input[placeholder="请输入密码"]', VALID_USER.password);
    
    // 点击登录按钮
    console.log('点击登录按钮...');
    await page.click('button:has-text("登录")');
    
    // 等待登录完成，检查是否成功跳转
    console.log('等待登录响应...');
    try {
      // 两种可能的结果:
      // 1. 登录成功 - 跳转到首页
      // 2. 登录失败 - 显示错误消息
      
      // 检查是否有错误消息
      const errorElement = await page.waitForSelector('.el-message', { timeout: 5000 }).catch(() => null);
      if (errorElement) {
        const errorText = await errorElement.textContent();
        if (errorText.includes('失败') || errorText.includes('错误')) {
          console.log(`❌ 登录失败: ${errorText}`);
        } else if (errorText.includes('成功')) {
          console.log(`✅ 登录成功: ${errorText}`);
        }
      }
      
      // 检查URL是否发生变化
      await page.waitForTimeout(2000); // 给页面变化一些时间
      const currentUrl = page.url();
      console.log(`当前URL: ${currentUrl}`);
      
      if (currentUrl !== `${BASE_URL}/login`) {
        console.log('✅ 登录成功: 页面已跳转');
        
        // 验证导航栏显示用户头像
        const avatarElement = await page.waitForSelector('.nav-user .el-avatar', { timeout: 5000 }).catch(() => null);
        if (avatarElement) {
          console.log('✅ 用户头像已显示，认证状态正确');
        } else {
          console.log('❌ 用户头像未显示，认证状态可能不正确');
        }
      } else {
        console.log('❌ 登录失败: 页面未跳转');
      }
    } catch (error) {
      console.log(`❌ 登录测试出错: ${error.message}`);
    }
    
    // 截图
    console.log('保存测试截图...');
    await page.screenshot({ path: 'login-test-result.png' });
    
  } finally {
    // 关闭浏览器
    console.log('测试完成，关闭浏览器');
    await browser.close();
  }
}

// 运行测试
(async () => {
  try {
    await testLogin();
  } catch (error) {
    console.error('测试过程中出现错误:', error);
  }
})(); 