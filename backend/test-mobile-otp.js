// Quick test script to verify mobile OTP functionality
const https = require('http');

const postData = JSON.stringify({
  mobileNumber: '9876543210'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/mobile-otp/send-otp',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('🧪 Testing Mobile OTP API...');
console.log('📱 Sending request to send OTP for: 9876543210');

const req = https.request(options, (res) => {
  console.log(`\n📊 Response Status: ${res.statusCode}`);
  console.log(`📋 Response Headers:`, res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('\n📱 Response Body:', data);
    try {
      const jsonResponse = JSON.parse(data);
      console.log('\n✅ Parsed Response:', JSON.stringify(jsonResponse, null, 2));
      
      if (jsonResponse.success) {
        console.log('\n🎉 SUCCESS: OTP sent successfully!');
        console.log(`📲 OTP ID: ${jsonResponse.otpId}`);
        console.log('💡 Check the console for the demo OTP output');
      } else {
        console.log('\n❌ FAILURE: OTP sending failed');
        console.log(`🚨 Error: ${jsonResponse.message}`);
      }
    } catch (e) {
      console.log('\n⚠️  Could not parse response as JSON:', e.message);
    }
    
    process.exit(0);
  });
});

req.on('error', (e) => {
  console.error(`\n🚨 Request failed: ${e.message}`);
  console.error(`🔍 Error code: ${e.code}`);
  console.error(`📊 Full error:`, e);
  process.exit(1);
});

req.write(postData);
req.end();