// Simple test to debug mobile OTP API
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testMobileOTP() {
  console.log('🧪 Testing Mobile OTP API...\n');
  
  try {
    console.log('📞 Sending request to:', `${BASE_URL}/mobile-otp/send-login-otp`);
    console.log('📱 Using mobile number: 9876543210\n');
    
    const response = await axios.post(`${BASE_URL}/mobile-otp/send-login-otp`, {
      mobileNumber: '9876543210'
    });
    
    console.log('✅ SUCCESS! Response:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.log('❌ ERROR DETAILS:');
    console.log('Status:', error.response?.status);
    console.log('Status Text:', error.response?.statusText);
    console.log('Error Data:', JSON.stringify(error.response?.data, null, 2));
    console.log('Error Message:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('🔥 Server is not running! Please start the backend server first.');
    }
  }
}

testMobileOTP();