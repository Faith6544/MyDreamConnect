import React from 'react';
import { Link } from 'react-router-dom';
import './Terms.css';

function Terms() {
  return (
    <div className="terms-page">
      <div className="terms-container">
        
        {/* Clean Underlined Title */}
        <h1 className="terms-title">Terms &amp; Conditions</h1>
        
        <p className="terms-last-updated">Last updated: October 27, 2026</p>

        <div className="terms-content">
          <h2>1. Introduction</h2>
          <p>
            Welcome to MyDreamConnect. By accessing or using our website <strong>mydreamconnect.org.ng</strong>, enrolling in our courses, or participating in our programs, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our services.
          </p>

          <h2>2. Use of Our Website</h2>
          <p>
            You agree to use our website only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the website. Prohibited behavior includes harassing or causing distress or inconvenience to any other user, transmitting obscene or offensive content, or disrupting the normal flow of dialogue within our website.
          </p>

          <h2>3. Course Enrollment and Payments</h2>
          <p>
            When you enroll in a course, you agree to provide accurate, current, and complete information about yourself. For paid courses, all payments are processed securely through our third-party payment provider (Paystack). You agree to pay all fees and charges associated with your enrollment. 
          </p>
          <p>
            <strong>Refund Policy:</strong> Due to the digital nature of our courses, all sales are final unless otherwise stated. If you experience technical issues, please contact us at info@mydreamconnect.org.ng.
          </p>

          <h2>4. Scholarships</h2>
          <p>
            MyDreamConnect offers a limited number of scholarships to eligible applicants. Submitting an application does not guarantee approval. All decisions made by our review team are final. Scholarship links are unique and cannot be shared or transferred.
          </p>

          <h2>5. Intellectual Property Rights</h2>
          <p>
            All content on this website, including text, graphics, logos, images, course materials, and software, is the property of MyDreamConnect and is protected by Nigerian and international copyright laws. You may not reproduce, distribute, modify, or create derivative works of any content without our express written permission.
          </p>

          <h2>6. User-Generated Content</h2>
          <p>
            By submitting comments, testimonials, or portfolio images to our website, you grant us a non-exclusive, royalty-free, worldwide license to use, display, and distribute that content in connection with our services. You represent that you own or have the necessary rights to the content you submit.
          </p>

          <h2>7. Limitation of Liability</h2>
          <p>
            MyDreamConnect shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use our website or services. This includes, but is not limited to, damages for loss of profits, data, or other intangible losses.
          </p>

          <h2>8. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms and Conditions at any time. Any changes will be effective immediately upon posting to this page. Your continued use of the website after any changes constitutes your acceptance of the new Terms.
          </p>

          <h2>9. Contact Information</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
            <br />
            <strong>Email:</strong> info@mydreamconnect.org.ng
            <br />
            <strong>Phone:</strong> +234 (812) 893 6463
          </p>
        </div>

      </div>
    </div>
  );
}

export default Terms;