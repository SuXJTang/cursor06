// 前端收藏职业功能测试
// 在浏览器控制台中运行此脚本

// 配置
const BASE_URL = 'http://localhost:8000/api/v1';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDI1NTAzMzYsInN1YiI6IjEifQ.0PlNYALurwyaOWZnqJD9pqDsxuyl3PauyulnpRNX2dU';
const CAREER_ID = 476;  // 全栈工程师

// 通用请求配置
const getHeaders = () => ({
  'Authorization': `Bearer ${TOKEN}`,
  'Content-Type': 'application/json'
});

// 测试收藏职业
async function testFavoriteCareer() {
  console.log('===== 前端收藏职业功能测试 =====');
  
  try {
    // 1. 收藏职业
    console.log('\n1. 收藏职业');
    const favoriteResponse = await fetch(`${BASE_URL}/careers/${CAREER_ID}/favorite`, {
      method: 'POST',
      headers: getHeaders()
    });
    
    const favoriteResult = await favoriteResponse.json();
    console.log('状态:', favoriteResponse.status);
    console.log('响应:', favoriteResult);
    
    // 2. 获取收藏状态
    console.log('\n2. 检查是否已收藏');
    const checkResponse = await fetch(`${BASE_URL}/careers/${CAREER_ID}/is_favorite`, {
      headers: getHeaders()
    });
    
    const checkResult = await checkResponse.json();
    console.log('状态:', checkResponse.status);
    console.log('是否已收藏:', checkResult.is_favorite);
    
    // 3. 获取收藏列表
    console.log('\n3. 获取收藏职业列表');
    const listResponse = await fetch(`${BASE_URL}/careers/user/favorites`, {
      headers: getHeaders()
    });
    
    const listResult = await listResponse.json();
    console.log('状态:', listResponse.status);
    console.log('收藏职业数量:', listResult.careers ? listResult.careers.length : 0);
    
    if (listResult.careers && listResult.careers.length > 0) {
      console.log('前3个收藏职业:');
      listResult.careers.slice(0, 3).forEach((career, index) => {
        console.log(`  ${index + 1}. ${career.title || career.name} (ID: ${career.id})`);
      });
    }
    
    // 4. 取消收藏
    console.log('\n4. 取消收藏');
    const unfavoriteResponse = await fetch(`${BASE_URL}/careers/${CAREER_ID}/favorite`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    
    const unfavoriteResult = await unfavoriteResponse.json();
    console.log('状态:', unfavoriteResponse.status);
    console.log('响应:', unfavoriteResult);
    
    // 5. 再次检查状态
    console.log('\n5. 再次检查是否已收藏');
    const recheckResponse = await fetch(`${BASE_URL}/careers/${CAREER_ID}/is_favorite`, {
      headers: getHeaders()
    });
    
    const recheckResult = await recheckResponse.json();
    console.log('状态:', recheckResponse.status);
    console.log('是否已收藏:', recheckResult.is_favorite);
    
    console.log('\n测试完成!');
  } catch (error) {
    console.error('测试过程中出错:', error);
  }
}

// 运行测试
testFavoriteCareer(); 