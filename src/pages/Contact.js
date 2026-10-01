import React, { useState } from 'react';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production, this will POST to your WordPress contact form endpoint.
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="contact-page">

      {/* Banner */}
      <section className="contact-banner">
        <h1>Contact Us</h1>
        <p>Home / Contact</p>
      </section>

      {/* Intro */}
      <section className="contact-intro">
        <h2>Get In Touch</h2>
        <p>We would love to hear from you. Reach out for partnerships, questions, or feedback.</p>
      </section>

      {/* Two-column layout */}
      <section className="contact-layout">

        {/* Contact Info */}
        <div className="contact-info">
          <h3>Contact Information</h3>

          <div className="info-item">
            <span className="info-icon">📞</span>
            <div>
              <h4>Phone</h4>
              <a href="tel:+2348128936463">+234 (812) 893 6463</a>
            </div>
          </div>

          <div className="info-item">
            <span className="info-icon">✉️</span>
            <div>
              <h4>Email</h4>
              <a href="mailto:info@mydreamconnect.org.ng">info@mydreamconnect.org.ng</a>
            </div>
          </div>

          <div className="info-item">
            <span className="info-icon">📍</span>
            <div>
              <h4>Address</h4>
              <p>Nice Estate, Ota, Ogun State<br />Alagbado, Lagos State</p>
            </div>
          </div>

          <div className="info-item">
            <span className="info-icon">🌐</span>
            <div>
              <h4>Follow Us</h4>
              <div className="contact-socials">
                <a href="https://web.facebook.com/MyDreamConnect" target="_blank" rel="noreferrer">Facebook</a>
                <a href="https://www.instagram.com/mydreamconnect" target="_blank" rel="noreferrer">Instagram</a>
                <a href="http://linkedin.com/company/mydreamconnect-learning-centre" target="_blank" rel="noreferrer">LinkedIn</a>
                <a href="https://twitter.com/mydreamconnect" target="_blank" rel="noreferrer">Twitter</a>
                <a href="https://www.youtube.com/channel/UCzGmgTBsYvN4vWFgB_ea1aw/videos" target="_blank" rel="noreferrer">YouTube</a>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form-wrapper">
          <h3>Send Us a Message</h3>

          {submitted && (
            <div className="form-success">
              ✅ Thank you! Your message has been sent. We will get back to you soon.
            </div>
          )}

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Your Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email address"
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="What is this about?"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows="6"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Write your message here..."
              />
            </div>

            <button type="submit" className="contact-submit">
              Send Message →
            </button>
          </form>
        </div>

      </section>

      {/* Map */}
      <section className="contact-map">
        <iframe
          title="MyDreamConnect Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126854.70291606354!2d3.2196345!3d6.6796655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8cf6b5da9d5f%3A0x7a5e5b5e5b5e5b5e!2sOta%2C%20Ogun%20State!5e0!3m2!1sen!2sng!4v1700000000000"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>

    </div>
  );
}

export default Contact;