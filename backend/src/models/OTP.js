const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  mobileNumber: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true,
    match: [
      /^(\+91|91)?[6-9]\d{9}$/,
      'Please enter a valid Indian mobile number'
    ]
  },
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  otp: {
    type: String,
    required: [true, 'OTP is required'],
    minlength: [6, 'OTP must be 6 digits'],
    maxlength: [6, 'OTP must be 6 digits']
  },
  purpose: {
    type: String,
    enum: ['login', 'registration', 'password_reset'],
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  attempts: {
    type: Number,
    default: 0,
    max: [5, 'Maximum 5 attempts allowed']
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for automatic cleanup of expired OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index for faster lookups
otpSchema.index({ mobileNumber: 1, purpose: 1 });
otpSchema.index({ email: 1, purpose: 1 });

// Static method to generate OTP
otpSchema.statics.generateOTP = function() {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Static method to create or update OTP for mobile
otpSchema.statics.createMobileOTP = async function(mobileNumber, purpose) {
  try {
    // Remove any existing OTP for this mobile number and purpose
    await this.deleteMany({ mobileNumber, purpose });
    
    // Generate new OTP
    const otp = this.generateOTP();
    
    // Create new OTP record
    const otpRecord = new this({
      mobileNumber,
      otp,
      purpose
    });
    
    await otpRecord.save();
    return { success: true, otp };
    
  } catch (error) {
    console.error('Error creating mobile OTP:', error);
    return { success: false, error: error.message };
  }
};

// Static method to create or update OTP for email (keeping for backward compatibility)
otpSchema.statics.createOTP = async function(email, purpose) {
  try {
    // Remove any existing OTP for this email and purpose
    await this.deleteMany({ email, purpose });
    
    // Generate new OTP
    const otp = this.generateOTP();
    
    // Create new OTP record
    const otpRecord = new this({
      email,
      otp,
      purpose
    });
    
    await otpRecord.save();
    return { success: true, otp };
    
  } catch (error) {
    console.error('Error creating OTP:', error);
    return { success: false, error: error.message };
  }
};

// Static method to verify mobile OTP
otpSchema.statics.verifyMobileOTP = async function(mobileNumber, otp, purpose) {
  try {
    const otpRecord = await this.findOne({ 
      mobileNumber, 
      purpose, 
      verified: false 
    });
    
    if (!otpRecord) {
      return { 
        success: false, 
        message: 'OTP not found or already verified' 
      };
    }
    
    // Check if OTP has expired
    if (new Date() > otpRecord.expiresAt) {
      await otpRecord.deleteOne();
      return { 
        success: false, 
        message: 'OTP has expired. Please request a new one.' 
      };
    }
    
    // Check attempts limit
    if (otpRecord.attempts >= 5) {
      await otpRecord.deleteOne();
      return { 
        success: false, 
        message: 'Too many failed attempts. Please request a new OTP.' 
      };
    }
    
    // Verify OTP
    if (otpRecord.otp === otp) {
      otpRecord.verified = true;
      await otpRecord.save();
      return { success: true, message: 'OTP verified successfully' };
    } else {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return { 
        success: false, 
        message: `Invalid OTP. ${5 - otpRecord.attempts} attempts remaining.` 
      };
    }
    
  } catch (error) {
    console.error('Error verifying mobile OTP:', error);
    return { success: false, message: 'OTP verification failed' };
  }
};

// Static method to verify OTP (keeping for backward compatibility)
otpSchema.statics.verifyOTP = async function(email, otp, purpose) {
  try {
    const otpRecord = await this.findOne({ 
      email, 
      purpose, 
      verified: false 
    });
    
    if (!otpRecord) {
      return { 
        success: false, 
        message: 'OTP not found or already verified' 
      };
    }
    
    // Check if OTP has expired
    if (new Date() > otpRecord.expiresAt) {
      await otpRecord.deleteOne();
      return { 
        success: false, 
        message: 'OTP has expired. Please request a new one.' 
      };
    }
    
    // Check attempts limit
    if (otpRecord.attempts >= 5) {
      await otpRecord.deleteOne();
      return { 
        success: false, 
        message: 'Too many failed attempts. Please request a new OTP.' 
      };
    }
    
    // Verify OTP
    if (otpRecord.otp === otp) {
      otpRecord.verified = true;
      await otpRecord.save();
      return { success: true, message: 'OTP verified successfully' };
    } else {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return { 
        success: false, 
        message: `Invalid OTP. ${5 - otpRecord.attempts} attempts remaining.` 
      };
    }
    
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return { success: false, message: 'OTP verification failed' };
  }
};

// Instance method to check if OTP is expired
otpSchema.methods.isExpired = function() {
  return new Date() > this.expiresAt;
};

const OTP = mongoose.model('OTP', otpSchema);

module.exports = OTP;