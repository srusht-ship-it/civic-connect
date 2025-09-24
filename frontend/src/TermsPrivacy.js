import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TermsPrivacy.css';

const TermsPrivacy = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="terms-container">
      <div className="terms-content">
        <div className="terms-header">
          <button className="back-button" onClick={handleGoBack}>
            ← Back
          </button>
          <h1>Terms & Privacy Policy</h1>
        </div>

        <div className="terms-body">
          <section className="terms-section">
            <h2>Terms of Service</h2>
            <div className="terms-text">
              <p>
                Welcome to Civic Connect. By using our service, you agree to these terms. 
                Please read them carefully.
              </p>
              <p>
                Civic Connect provides a platform for citizens to access local government 
                services and community information. We are committed to protecting your 
                privacy and ensuring a secure experience.
              </p>
            </div>
          </section>

          <section className="terms-section">
            <h2>Privacy Policy</h2>
            <div className="terms-text">
              <p>
                We collect information you provide directly to us, such as when you 
                create an account, use our services, or contact us for support.
              </p>
              <p>
                Your personal information is used to provide and improve our services, 
                communicate with you, and ensure the security of your account.
              </p>
              <p>
                We do not sell, trade, or otherwise transfer your personal information 
                to third parties without your consent, except as described in this policy.
              </p>
            </div>
          </section>

          <section className="terms-section">
            <h2>Data Security</h2>
            <div className="terms-text">
              <p>
                We implement appropriate security measures to protect your personal 
                information against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </div>
          </section>

          <section className="terms-section">
            <h2>Contact Information</h2>
            <div className="terms-text">
              <p>
                If you have any questions about these Terms or Privacy Policy, 
                please contact us at support@civicconnect.com
              </p>
            </div>
          </section>
        </div>

        <div className="terms-footer">
          <p>Last updated: September 24, 2025</p>
        </div>
      </div>
    </div>
  );
};

export default TermsPrivacy;