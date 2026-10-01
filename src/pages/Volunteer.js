import React, { useState } from 'react';
import './Volunteer.css';

const ACCESS_KEY = '7ccbf4db-5413-4d7f-8537-2ee111f3832f';

function Volunteer() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    skills: '',
    availability: '',
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
          subject: 'New Volunteer Application - MyDreamConnect',
          from_name: 'MyDreamConnect Website',
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          skills: formData.skills,
          availability: formData.availability,
          message: formData.message,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus('success');
        setFormData({
          name: '', email: '', phone: '', city: '',
          skills: '', availability: '', message: '',
        });
        setTimeout(() => setStatus('idle'), 6000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 6000);
      }
    } catch (err) {
      console.error('Volunteer form error:', err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 6000);
    }
  };

  return (
    <div className="volunteer-page">

      <section className="volunteer-banner">
        <h1>Volunteer With Us</h1>
        <p>Home / Volunteer</p>
      </section>

      <section className="volunteer-intro">
        <h2>Become a Changemaker</h2>
        <p>
          Join a growing community of young professionals, mentors, and coaches
          who are investing their time and skills into the next generation.
          Whether you can give one hour a week or one day a month, your time
          makes a difference.
        </p>
      </section>

      <section className="volunteer-layout">

        {/* Left: Form */}
        <div className="volunteer-form-wrap">
          <h3>Volunteer Application</h3>

          {status === 'success' && (
            <div className="form-success">
              ✅ Thank you for applying! We will contact you soon.
            </div>
          )}

          {status === 'error' && (
            <div className="form-error">
              ❌ Something went wrong. Please try again or email us directly at info@mydreamconnect.org.ng.
            </div>
          )}

          <form className="volunteer-form" onSubmit={handleSubmit}>

            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                  disabled={status === 'sending'}
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  disabled={status === 'sending'}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+234 ..."
                  disabled={status === 'sending'}
                />
              </div>

              <div className="form-group">
                <label>City / Location</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Lagos, Nigeria"
                  disabled={status === 'sending'}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Skills / What Can You Offer? *</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g. Teaching, Design, Coding, Event Planning"
                required
                disabled={status === 'sending'}
              />
            </div>

            <div className="form-group">
              <label>Availability *</label>
              <select
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                required
                disabled={status === 'sending'}
              >
                <option value="">Choose one</option>
                <option value="weekly">1 hour per week</option>
                <option value="fortnightly">A few hours every two weeks</option>
                <option value="monthly">One day per month</option>
                <option value="events">Only during events</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>

            <div className="form-group">
              <label>Why Do You Want to Volunteer?</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us a bit about yourself and why you want to join..."
                rows="5"
                disabled={status === 'sending'}
              />
            </div>

            <button type="submit" className="volunteer-submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending...' : 'Submit Application →'}
            </button>
          </form>
        </div>

        {/* Right: Benefits */}
        <div className="volunteer-benefits">
          <h3>Why Volunteer?</h3>

          <div className="benefit-item">
            <span className="benefit-icon">💚</span>
            <div>
              <h4>Make an Impact</h4>
              <p>Help us reach more young people and transform communities.</p>
            </div>
          </div>

          <div className="benefit-item">
            <span className="benefit-icon">🤝</span>
            <div>
              <h4>Build Your Network</h4>
              <p>Meet other professionals, educators, and changemakers.</p>
            </div>
          </div>

          <div className="benefit-item">
            <span className="benefit-icon">🎯</span>
            <div>
              <h4>Sharpen Your Skills</h4>
              <p>Teaching and mentoring are the best way to grow your own skills.</p>
            </div>
          </div>

          <div className="benefit-item">
            <span className="benefit-icon">🏅</span>
            <div>
              <h4>Earn Recognition</h4>
              <p>Get volunteer certificates and public recognition for your time.</p>
            </div>
          </div>

          <div className="volunteer-contact">
            <p>Questions? Email us at:</p>
            <a href="mailto:info@mydreamconnect.org.ng">
              info@mydreamconnect.org.ng
            </a>
          </div>
        </div>

      </section>

      <section className="volunteer-closing">
        <h2>Ready to Serve?</h2>
        <p>Fill out the form above and someone from our team will reach out.</p>
      </section>

    </div>
  );
}

export default Volunteer;