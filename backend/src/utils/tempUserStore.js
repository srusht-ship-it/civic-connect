// Temporary in-memory user store for testing without MongoDB
// This simulates the database functionality

class TemporaryUserStore {
  constructor() {
    this.users = [
      // Sample users for testing
      {
        _id: '1',
        email: 'test@example.com',
        mobileNumber: '+919876543210',
        fullName: 'Test User',
        password: '$2b$10$hashedpassword', // This would be properly hashed
        role: 'citizen',
        isMobileVerified: false,
        createdAt: new Date()
      },
      {
        _id: '2', 
        email: 'user@test.com',
        mobileNumber: '+919123456789',
        fullName: 'Another User',
        password: '$2b$10$hashedpassword',
        role: 'citizen',
        isMobileVerified: false,
        createdAt: new Date()
      }
    ];
    
    this.otps = []; // Store OTPs temporarily
  }

  // Find user by email
  async findByEmail(email) {
    const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    return user || null;
  }

  // Find user by mobile number
  async findByMobile(mobileNumber) {
    const user = this.users.find(u => u.mobileNumber === mobileNumber);
    return user || null;
  }

  // Add a new user (for registration)
  async addUser(userData) {
    const newUser = {
      _id: String(this.users.length + 1),
      ...userData,
      createdAt: new Date()
    };
    this.users.push(newUser);
    return newUser;
  }

  // Store OTP for email
  async storeOTP(email, otp, type = 'login') {
    // Remove existing OTPs for this email
    this.otps = this.otps.filter(o => o.email !== email);
    
    // Add new OTP
    const otpData = {
      email,
      otp,
      type,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    };
    
    this.otps.push(otpData);
    return { success: true, otp };
  }

  // Store Mobile OTP
  async createMobileOTP(mobileNumber, purpose) {
    // Remove existing OTPs for this mobile number
    this.otps = this.otps.filter(o => o.mobileNumber !== mobileNumber || o.purpose !== purpose);
    
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Add new OTP
    const otpData = {
      mobileNumber,
      otp,
      purpose,
      verified: false,
      attempts: 0,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    };
    
    this.otps.push(otpData);
    return { success: true, otp };
  }

  // Verify OTP for email
  async verifyOTP(email, otp) {
    const otpData = this.otps.find(o => 
      o.email === email && 
      o.otp === otp && 
      o.expiresAt > new Date()
    );

    if (otpData) {
      // Remove used OTP
      this.otps = this.otps.filter(o => o !== otpData);
      return { success: true, message: 'OTP verified successfully' };
    }
    return { success: false, message: 'Invalid or expired OTP' };
  }

  // Verify Mobile OTP
  async verifyMobileOTP(mobileNumber, otp, purpose) {
    const otpRecord = this.otps.find(o => 
      o.mobileNumber === mobileNumber && 
      o.purpose === purpose && 
      o.verified === false
    );

    if (!otpRecord) {
      return { 
        success: false, 
        message: 'OTP not found or already verified' 
      };
    }

    // Check if OTP has expired
    if (new Date() > otpRecord.expiresAt) {
      // Remove expired OTP
      this.otps = this.otps.filter(o => o !== otpRecord);
      return { 
        success: false, 
        message: 'OTP has expired. Please request a new one.' 
      };
    }

    // Check attempts limit
    if (otpRecord.attempts >= 5) {
      // Remove OTP after too many attempts
      this.otps = this.otps.filter(o => o !== otpRecord);
      return { 
        success: false, 
        message: 'Too many failed attempts. Please request a new OTP.' 
      };
    }

    // Verify OTP
    if (otpRecord.otp === otp) {
      otpRecord.verified = true;
      return { success: true, message: 'OTP verified successfully' };
    } else {
      otpRecord.attempts += 1;
      return { 
        success: false, 
        message: `Invalid OTP. ${5 - otpRecord.attempts} attempts remaining.` 
      };
    }
  }

  // Get all users (for debugging)
  getUsers() {
    return this.users.map(u => ({ 
      email: u.email, 
      mobileNumber: u.mobileNumber,
      fullName: u.fullName 
    }));
  }

  // Get stored OTPs (for debugging)
  getOTPs() {
    return this.otps;
  }
}

// Create a singleton instance
const tempUserStore = new TemporaryUserStore();

console.log('🧪 Temporary User Store initialized');
console.log('📋 Sample users available for OTP testing:');
tempUserStore.getUsers().forEach(user => {
  console.log(`   • ${user.mobileNumber} (${user.fullName})`);
  console.log(`     Email: ${user.email}`);
});

module.exports = tempUserStore;