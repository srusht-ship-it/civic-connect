// Direct test of the mobile OTP service validation method
const path = require('path');

// Import the mobile OTP service
const mobileOTPService = require('./src/services/mobileOTPService');

console.log('🧪 Testing Mobile OTP Service validateAndFormatMobileNumber method...\n');

// Test cases
const testCases = [
  { input: '9876543210', description: 'Valid 10-digit mobile number' },
  { input: '+919876543210', description: 'Already formatted mobile number' },
  { input: '8765432109', description: 'Valid mobile starting with 8' },
  { input: '5876543210', description: 'Invalid mobile starting with 5' },
  { input: '987654321', description: 'Invalid 9-digit mobile number' },
  { input: '98765432100', description: 'Invalid 11-digit mobile number' },
  { input: 'abc1234567', description: 'Invalid non-numeric mobile' },
  { input: '', description: 'Empty mobile number' }
];

testCases.forEach((testCase, index) => {
  console.log(`\n📱 Test ${index + 1}: ${testCase.description}`);
  console.log(`📞 Input: "${testCase.input}"`);
  
  try {
    const result = mobileOTPService.validateAndFormatMobileNumber(testCase.input);
    
    if (result.isValid) {
      console.log(`✅ Valid: ${result.formattedNumber} (Clean: ${result.cleanNumber})`);
    } else {
      console.log(`❌ Invalid: ${result.error}`);
    }
  } catch (error) {
    console.log(`❌ Exception: ${error.message}`);
  }
});

console.log('\n🎉 Mobile OTP Service validation test completed!');