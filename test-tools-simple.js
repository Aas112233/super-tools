import fetch from 'node-fetch';

const baseUrl = 'http://localhost:5173';

const testRoutes = [
  '/tools/dashboard',
  '/tools/case-converter',
  '/tools/lorem-ipsum-generator',
  '/tools/css-loader-generator',
  '/tools/base64-encoder-decoder',
  '/tools/qrcode-generator'
];

console.log('🧪 Testing Super Tools Dashboard...\n');

async function testRoute(route) {
  try {
    const response = await fetch(`${baseUrl}${route}`);
    const status = response.status;
    const text = await response.text();
    
    if (status === 200) {
      if (text.includes('<!DOCTYPE html>')) {
        console.log(`✅ ${route} - OK (${status})`);
        return { route, status: 'OK', code: status };
      } else {
        console.log(`⚠️  ${route} - No HTML content (${status})`);
        return { route, status: 'No HTML', code: status };
      }
    } else {
      console.log(`❌ ${route} - Error (${status})`);
      return { route, status: 'Error', code: status };
    }
  } catch (error) {
    console.log(`💥 ${route} - Connection failed: ${error.message}`);
    return { route, status: 'Connection Failed', error: error.message };
  }
}

async function runTests() {
  console.log(`Testing server at: ${baseUrl}\n`);
  
  const results = [];
  
  for (const route of testRoutes) {
    const result = await testRoute(route);
    results.push(result);
    await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
  }
  
  console.log('\n📊 SUMMARY:');
  const working = results.filter(r => r.status === 'OK').length;
  const total = results.length;
  console.log(`✅ Working: ${working}/${total}`);
  
  if (working === 0) {
    console.log('\n❌ No routes are working. Make sure your dev server is running:');
    console.log('   npm run dev');
    console.log('   or');
    console.log('   yarn dev');
  } else if (working < total) {
    console.log('\n⚠️  Some routes have issues. Check the logs above.');
  } else {
    console.log('\n🎉 All test routes are working!');
  }
}

runTests().catch(console.error);