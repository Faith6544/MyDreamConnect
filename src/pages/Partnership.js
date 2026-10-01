import React, { useState } from 'react';
import './Partnership.css';

const ACCESS_KEY = '7ccbf4db-5413-4d7f-8537-2ee111f3832f';

function Partnership() {
  const [formData, setFormData] = useState({
    orgName: '',
    contactPerson: '',
    email: '',
    phone: '',
    type: '',
    message: '',
  });
  const [status, setStatus] = useState('idle');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: 'New Partnership Enquiry - MyDreamConnect',
          from_name: 'MyDreamConnect Website',
          organisation: formData.orgName,
          contact_person: formData.contactPerson,
          email: formData.email,
          phone: formData.phone,
          partnership_type: formData.type,
          message: formData.message,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus('success');
        setFormData({
          orgName: '', contactPerson: '', email: '', phone: '', type: '', message: '',
        });
        setTimeout(() => setStatus('idle'), 6000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 6000);
      }
    } catch (err) {
      console.error('Partnership form error:', err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 6000);
    }
  };

  return (
    <div className="ps-page">

      <section className="ps-banner">
        <h1>Partnership &amp; Collaboration</h1>
        <p>Home / Partnership</p>
      </section>

      <section className="ps-intro">
        <h2>Let&apos;s Build the Future Together</h2>
        <p>
          MyDreamConnect partners with schools, government, corporate
          organisations, development partners, and community groups to reach
          more young people with practical, life-changing programs. If your
          organisation shares our vision, we would love to hear from you.
        </p>
      </section>

      <section className="ps-layout">

        {/* Form */}
        <div className="ps-form-wrap">
          <h3>Partnership Enquiry</h3>

          {status === 'success' && (
            <div className="form-success">
              ✅ Thank you. Our team will be in touch shortly.
            </div>
          )}

          {status === 'error' && (
            <div className="form-error">
              ❌ Something went wrong. Please try again or email us directly at info@mydreamconnect.org.ng.
            </div>
          )}

          <form className="ps-form" onSubmit={handleSubmit}>

            <div className="ps-row">
              <div className="ps-group">
                <label>Organisation Name *</label>
                <input type="text" name="orgName" value={formData.orgName} onChange={handleChange} placeholder="Company or school name" required disabled={status === 'sending'} />
              </div>
              <div className="ps-group">
                <label>Contact Person *</label>
                <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} placeholder="Full name" required disabled={status === 'sending'} />
              </div>
            </div>

            <div className="ps-row">
              <div className="ps-group">
                <label>Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@organisation.com" required disabled={status === 'sending'} />
              </div>
              <div className="ps-group">
                <label>Phone</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+234 ..." disabled={status === 'sending'} />
              </div>
            </div>

            <div className="ps-group">
              <label>Partnership Type *</label>
              <select name="type" value={formData.type} onChange={handleChange} required disabled={status === 'sending'}>
                <option value="">Choose one</option>
                <option value="school">School Partnership</option>
                <option value="corporate">Corporate Sponsorship</option>
                <option value="government">Government / Public Sector</option>
                <option value="ngo">NGO / Development Partner</option>
                <option value="community">Community Group</option>
                <option value="media">Media / Press</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="ps-group">
              <label>Message</label>
              <textarea name="message" value={formData.message} onChange={handleChange} rows="5" placeholder="Tell us about your organisation and how you would like to partner with us..." disabled={status === 'sending'} />
            </div>

            <button type="submit" className="ps-submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending...' : 'Send Enquiry →'}
            </button>
          </form>
        </div>

        {/* Why partner */}
        <div className="ps-why">
          <h3>Why Partner With Us</h3>

          <div className="ps-why-item">
            <span className="ps-icon">🎯</span>
            <div>
              <h4>Real Impact</h4>
              <p>Reach thousands of teenagers, youth, and women across Nigeria.</p>
            </div>
          </div>

          <div className="ps-why-item">
            <span className="ps-icon">🏫</span>
            <div>
              <h4>School Network</h4>
              <p>Plug into our network of schools and community partners.</p>
            </div>
          </div>

          <div className="ps-why-item">
            <span className="ps-icon">🤝</span>
            <div>
              <h4>Shared Vision</h4>
              <p>Collaborate on programs that align with your CSR and SDG goals.</p>
            </div>
          </div>

          <div className="ps-why-item">
            <span className="ps-icon">📈</span>
            <div>
              <h4>Measurable Results</h4>
              <p>We report on every program so you can see the impact of your support.</p>
            </div>
          </div>

          <div className="ps-contact">
            <p>Prefer to email us directly?</p>
            <a href="mailto:info@mydreamconnect.org.ng">info@mydreamconnect.org.ng</a>
          </div>
        </div>

      </section>

    </div>
  );
}

export default Partnership;