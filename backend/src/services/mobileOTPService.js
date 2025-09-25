const crypto = require('crypto');

class MobileOTPService {
  constructor() {
    // For demo purposes, we'll simulate SMS sending
    // In production, you would integrate with services like:
    // - Twilio
    // - AWS SNS
    // - Firebase SMS
    // - MSG91
    // - TextLocal
    this.initializeSMSService();
  }

  initializeSMSService() {
    console.log('📱 Mobile OTP Service initialized');
    console.log('🔧 Using demo SMS service (console output)');
    console.log('💡 For production, integrate with Twilio/AWS SNS');
  }

  // Generate 6-digit OTP
  generateOTP() {
    return crypto.randomBytes(3).toString('hex').slice(0, 6).padStart(6, '0');
  }

  // Validate Indian mobile number format
  isValidMobileNumber(mobile) {
    // Indian mobile number validation (10 digits)
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(mobile.replace(/\s+/g, ''));
  }

  // Format mobile number
  formatMobileNumber(mobile) {
    // Remove spaces and add country code if not present
    const cleanMobile = mobile.replace(/\s+/g, '');
    if (cleanMobile.length === 10) {
      return '+91' + cleanMobile;
    }
    if (cleanMobile.startsWith('91') && cleanMobile.length === 12) {
      return '+' + cleanMobile;
    }
    if (cleanMobile.startsWith('+91')) {
      return cleanMobile;
    }
    return '+91' + cleanMobile;
  }

  // Send OTP via SMS (Demo implementation)
  async sendOTP(mobileNumber, otp, purpose = 'login') {
    try {
      // Validate mobile number
      if (!this.isValidMobileNumber(mobileNumber.replace('+91', ''))) {
        return {
          success: false,
          message: 'Invalid mobile number format'
        };
      }

      const formattedMobile = this.formatMobileNumber(mobileNumber);
      const message = this.generateSMSContent(otp, purpose);

      // Demo: Log SMS to console (replace with real SMS service)
      console.log('\n📱 ===== SMS SENT =====');
      console.log(`📞 To: ${formattedMobile}`);
      console.log(`💬 Message: ${message}`);
      console.log('========================\n');

      // Simulate SMS delivery delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      return {
        success: true,
        mobile: formattedMobile,
        message: 'OTP sent successfully',
        // In production, you'd get messageId from SMS service
        messageId: `SMS_${Date.now()}`
      };

    } catch (error) {
      console.error('❌ Error sending SMS OTP:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to send OTP SMS'
      };
    }
  }

  // Validate and format mobile number (used by controller)
  validateAndFormatMobileNumber(mobileNumber) {
    if (!mobileNumber) {
      return {
        isValid: false,
        error: 'Mobile number is required'
      };
    }

    const cleanMobile = mobileNumber.replace(/\s+/g, '').replace(/[^\d]/g, '');
    
    if (!this.isValidMobileNumber(cleanMobile)) {
      return {
        isValid: false,
        error: 'Please enter a valid 10-digit Indian mobile number starting with 6-9'
      };
    }

    return {
      isValid: true,
      formattedNumber: this.formatMobileNumber(cleanMobile),
      cleanNumber: cleanMobile
    };
  }

  // Generate SMS content
  generateSMSContent(otp, purpose) {
    const purposeText = purpose === 'login' ? 'login' : 'verification';
    
    return `🏛️ Civic Connect: Your OTP for ${purposeText} is ${otp}. Valid for 5 minutes. Do not share with anyone. - Civic Connect Team`;
  }

  // Production Twilio implementation (commented for reference)
  /*
  async sendOTPWithTwilio(mobileNumber, otp) {
    const twilio = require('twilio');
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    
    try {
      const message = await client.messages.create({
        body: this.generateSMSContent(otp, 'login'),
        from: process.env.TWILIO_PHONE_NUMBER,
        to: this.formatMobileNumber(mobileNumber)
      });
      
      return {
        success: true,
        messageId: message.sid,
        message: 'OTP sent successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to send OTP SMS'
      };
    }
  }
  */

  // Test SMS service
  async testSMSService() {
    try {
      const testMobile = '+919876543210';
      const testOTP = '123456';
      
      console.log('🧪 Testing SMS service...');
      const result = await this.sendOTP(testMobile, testOTP, 'test');
      
      if (result.success) {
        console.log('✅ SMS service test successful');
        return { success: true, message: 'SMS service working correctly' };
      } else {
        console.log('❌ SMS service test failed:', result.message);
        return { success: false, error: result.message };
      }
    } catch (error) {
      console.error('❌ SMS service test error:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new MobileOTPService();