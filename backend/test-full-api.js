const http = require('http');

async function testMobileOTPAPI() {
  console.log('🧪 Testing Mobile OTP API Endpoint...\n');

  // Test case 1: Valid mobile number that exists in temp store
  const testMobileOTP = async (mobileNumber, description) => {
    return new Promise((resolve) => {
      const postData = JSON.stringify({ mobileNumber });
      
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

      console.log(`📱 Testing: ${description}`);
      console.log(`📞 Mobile Number: ${mobileNumber}`);

      const req = http.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          console.log(`📊 Status: ${res.statusCode}`);
          
          try {
            const response = JSON.parse(data);
            console.log('📱 Response:', JSON.stringify(response, null, 2));
            
            if (response.success) {
              console.log('✅ SUCCESS: OTP request successful!');
            } else {
              console.log('❌ FAILURE:', response.message);
            }
          } catch (e) {
            console.log('⚠️  Raw response:', data);
          }
          
          console.log('\n' + '='.repeat(50) + '\n');
          resolve();
        });
      });

      req.on('error', (e) => {
        console.error(`🚨 Request failed: ${e.message}`);
        console.log('\n' + '='.repeat(50) + '\n');
        resolve();
      });

      req.write(postData);
      req.end();
    });
  };

  // Test cases
  await testMobileOTP('9876543210', 'Valid mobile number (exists in temp store)');
  await testMobileOTP('9123456789', 'Another valid mobile number (exists in temp store)');
  await testMobileOTP('8888888888', 'Valid format but not in temp store');
  await testMobileOTP('5876543210', 'Invalid mobile number (starts with 5)');
  await testMobileOTP('', 'Empty mobile number');

  console.log('🎉 Mobile OTP API testing completed!');
}

// Run the test
testMobileOTPAPI().catch(console.error);