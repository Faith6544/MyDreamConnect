import React from 'react';
import './Terms.css';

function Terms() {
  return (
    <div className="tm-page">

      <section className="tm-banner">
        <h1>Terms &amp; Conditions</h1>
        <p>Home / Terms &amp; Conditions</p>
      </section>

      <section className="tm-content">

        <p className="tm-updated">
          <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <h2>1. Introduction</h2>
        <p>
          Welcome to MyDreamConnect. By accessing or using our website
          <strong> mydreamconnect.org.ng</strong>, enrolling in our courses, or
          participating in our programs, you agree to be bound by these Terms
          and Conditions. If you do not agree, please do not use the site.
        </p>

        <h2>2. About Us</h2>
        <p>
          MyDreamConnect Foundation, officially registered with CAC as
          MyDreamConnect Academy for Change &amp; Development Foundation, is a
          Nigerian-based non-profit organisation providing free and paid
          developmental programs to teenagers, youth, and women.
        </p>

        <h2>3. Use of the Website</h2>
        <p>You agree to use this website only for lawful purposes. You must not:</p>
        <ul>
          <li>Attempt to gain unauthorised access to any part of the site</li>
          <li>Use the site to distribute spam, malware, or harmful content</li>
          <li>Copy, reproduce, or republish our content without permission</li>
          <li>Impersonate another person or organisation</li>
        </ul>

        <h2>4. Accounts and Registration</h2>
        <p>
          Some features of the site require you to create an account. You are
          responsible for maintaining the confidentiality of your login details
          and for all activities that occur under your account.
        </p>

        <h2>5. Courses and Payments</h2>
        <p>
          Some of our courses are free. Others require payment. All payments
          are processed through secure third-party gateways (Paystack,
          Flutterwave, or similar). Once payment is made, access to the course
          is granted according to the description on the course page. Refunds
          are handled on a case-by-case basis.
        </p>

        <h2>6. Donations</h2>
        <p>
          All donations to MyDreamConnect are used to support our programs and
          operations. Donations are non-refundable except in cases of
          processing error.
        </p>

        <h2>7. Intellectual Property</h2>
        <p>
          All content on this site, including text, images, logos, videos, and
          course materials, is owned by MyDreamConnect or licensed to us. You
          may not reproduce, modify, or distribute it without written
          permission.
        </p>

        <h2>8. Privacy</h2>
        <p>
          We take your privacy seriously. Information you submit through forms
          on this site is used only to respond to your enquiry, process your
          enrollment, or improve our services. We do not sell your data to
          third parties.
        </p>

        <h2>9. Third-Party Links</h2>
        <p>
          Our site may link to third-party websites. We are not responsible for
          the content or practices of those sites. Accessing them is at your
          own risk.
        </p>

        <h2>10. Limitation of Liability</h2>
        <p>
          MyDreamConnect is not liable for any indirect, incidental, or
          consequential damages arising from your use of the site or our
          programs. Our total liability to you is limited to the amount you
          have paid us.
        </p>

        <h2>11. Changes to Terms</h2>
        <p>
          We may update these Terms from time to time. Any changes will be
          posted on this page with an updated date. Continued use of the site
          means you accept the new Terms.
        </p>

        <h2>12. Contact</h2>
        <p>
          Questions about these Terms? Email us at
          {' '}<a href="mailto:info@mydreamconnect.org.ng">info@mydreamconnect.org.ng</a>.
        </p>

      </section>

    </div>
  );
}

export default Terms;