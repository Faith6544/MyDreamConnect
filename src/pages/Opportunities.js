import React from 'react';
import './Opportunities.css';

function Opportunities() {
  // Real opportunities from the WordPress site (category: OPPORTUNITIES FOR DEVELOPMENT)
  const opportunities = [
    {
      id: 2458,
      title: 'Emotional Intelligence Has 12 Elements',
      image: 'https://mydreamconnect.org.ng/wp-content/uploads/2024/05/image.png',
      excerpt: 'Which Do You Need to Work On? by Daniel Goleman and Richard E. Boyatzis. Although there are many models of emotional intelligence, they are often lumped together as "EQ" in the popular vernacular. An alternative term is "EI," which comprises four domains: self-awareness, self-management, social awareness, and relationship…',
      url: 'https://mydreamconnect.org.ng/emotional-intelligence-has-12-elements/',
    },
    {
      id: 2426,
      title: 'PIXELS & PROGRAMS: Understanding the Contrasts Between Technical and Digital Media Skills',
      image: 'https://mydreamconnect.org.ng/wp-content/uploads/2024/05/pixels-programs-digital-landscape.webp',
      excerpt: "In today's rapidly evolving digital landscape, the demand for technical expertise is soaring; from software development to cybersecurity, technical skills are undeniably vital for navigating the complexities of the modern world. However, amidst the buzz surrounding technology, there's a prevailing misconception that equates digital media skills with technical proficiency…",
      url: 'https://mydreamconnect.org.ng/pixels-programs-understanding-the-contrasts-between-technical-and-digital-media-skills/',
    },
    {
      id: 4095,
      title: 'Call for Proposals: Global Youth Action Fund 2026',
      image: 'https://mydreamconnect.org.ng/wp-content/uploads/2026/01/ChatGPT-Image-Jan-20-2026-09_34_36-AM.png',
      excerpt: 'The Global Youth Action Fund 2026 is an empowering grant and mentorship initiative aimed at supporting young changemakers around the world. Sponsored by the International Baccalaureate (IB), this program provides financial resources and capacity-building support to student-led projects addressing pressing community and global challenges…',
      url: 'https://mydreamconnect.org.ng/call-for-proposals-global-youth-action-fund-2026/',
    },
    {
      id: 4049,
      title: 'FORTIFIED 2025: TECH Powered, FORTIFIED for Success Impact Report',
      image: 'https://mydreamconnect.org.ng/wp-content/uploads/2025/12/MyDreamConnect-FORTIFIED-SUMMIT-2025.jpeg',
      excerpt: 'FORTIFIED SUMMIT & 24-HOUR HACKATHON 2025. Hosted by MyDreamConnect Foundation, November 28–29, 2025 | University of Lagos (AIR Lab & The Design Studio). A TRANSFORMATIONAL GATHERING OF INNOVATORS, EDUCATORS, LEADERS & CREATORS…',
      url: 'https://mydreamconnect.org.ng/fortified-2025-tech-powered-fortified-for-success-impact-report/',
    },
  ];

  return (
    <div className="opps-page">

      {/* Banner */}
      <section className="opps-banner">
        <h1>Opportunities for Development</h1>
        <p>Home / Talent Marketplace / Opportunities</p>
      </section>

      <div className="opps-layout">

        {/* === MAIN CONTENT === */}
        <article className="opps-content">

          {/* Featured Image */}
          <figure className="opps-featured">
            <img
              src="https://mydreamconnect.org.ng/wp-content/uploads/2023/10/images-13.jpeg"
              alt="Opportunities for Development"
            />
          </figure>

          {/* Social icons */}
          <div className="opps-socials">
            <a href="https://www.facebook.com/MyDreamConnect?mibextid=ZbWKwL" target="_blank" rel="noreferrer" className="social-btn fb">f</a>
            <a href="https://instagram.com/mydreamconnect" target="_blank" rel="noreferrer" className="social-btn ig">📷</a>
            <a href="https://www.linkedin.com/company/mydreamconnect-learning-centre/" target="_blank" rel="noreferrer" className="social-btn li">in</a>
          </div>

          {/* Intro */}
          <p className="opps-intro-text">
            <em>Want to move from zero to hero? JOIN US to explore <strong>SOME GREAT OPPORTUNITIES FOR YOUR DEVELOPMENT!</strong></em>
          </p>

          <p>
            <em>The road to your dream isn't always easy to navigate</em>, sometimes it's dotted with mountains to climb, obstacles to overcome—and hard, mind-numbing times that will make you feel like quitting. Just remember this: <em>Anything worth having doesn't come easy</em>, even if you get lost along the way, don't turn back around. <em>Don't give up.</em> <em>Find a way</em>!
          </p>

          <p>
            As you work to achieve your most ambitious goals, <em>continue to push yourself to keep moving forward</em>.
          </p>

          <p><strong>You're Powerful! 😍</strong></p>

          {/* WhatsApp */}
          <h2 className="opps-join-heading">JOIN US ON WHATSAPP 👇</h2>
          <a
            href="https://chat.whatsapp.com/Dn1ant6kEgZ7md5fhNDSzp"
            target="_blank"
            rel="noreferrer"
            className="opps-whatsapp"
          >
            💬 Join WhatsApp Group
          </a>

          {/* Mail */}
          <h2 className="opps-join-heading">MAIL US 👇</h2>
          <a
            href="mailto:mydreamconnectlc@gmail.com"
            className="opps-mail"
          >
            ✉️ mydreamconnectlc@gmail.com
          </a>

          {/* Opportunities Grid */}
          <h2 className="opps-list-heading">Latest Opportunities</h2>
          <div className="opps-grid">
            {opportunities.map(opp => (
              <a
                href={opp.url}
                key={opp.id}
                className="opp-card"
                target="_blank"
                rel="noreferrer"
              >
                <div className="opp-image">
                  <img src={opp.image} alt={opp.title} />
                </div>
                <div className="opp-content">
                  <h3>{opp.title}</h3>
                  <p>{opp.excerpt}</p>
                </div>
              </a>
            ))}
          </div>

          <p className="opps-thanks"><strong>Thanks for reading.</strong></p>

        </article>

        {/* === SIDEBAR === */}
        <aside className="opps-sidebar">

          <div className="widget">
            <h3>Search</h3>
            <form className="sidebar-search" onSubmit={(e) => e.preventDefault()}>
              <input type="text" placeholder="" />
              <button type="submit">Search</button>
            </form>
          </div>

          <div className="widget">
            <h3>Recent Posts</h3>
            <ul className="widget-list">
              <li><a href="/blog">Call for Proposals: Global Youth Action Fund 2026</a></li>
              <li><a href="/blog">FORTIFIED 2025: TECH Powered, FORTIFIED for Success Impact Report</a></li>
              <li><a href="/blog">Register</a></li>
              <li><a href="/blog">I Want to Learn Tech, But I Don't Know Where to Start</a></li>
              <li><a href="/blog">Why Learning to Code This Holiday Could Be the Smartest Decision for Your Child's Future</a></li>
            </ul>
          </div>

          <div className="widget">
            <h3>Recent Comments</h3>
            <ul className="widget-list comments-list">
              <li><strong>MyDreamConnect</strong> on <a href="/blog">Hello June!</a></li>
              <li><strong>Tinuola Ameh</strong> on <a href="/blog">Hello June!</a></li>
              <li><strong>MyDreamConnect</strong> on <a href="/blog">Emotional Intelligence Has 12 Elements</a></li>
              <li><strong>Elvis Boateng</strong> on <a href="/blog">Emotional Intelligence Has 12 Elements</a></li>
            </ul>
          </div>

          <div className="widget">
            <h3>Archives</h3>
            <ul className="widget-list">
              <li><a href="/blog">January 2026</a></li>
              <li><a href="/blog">December 2025</a></li>
              <li><a href="/blog">October 2025</a></li>
              <li><a href="/blog">August 2025</a></li>
              <li><a href="/blog">July 2025</a></li>
              <li><a href="/blog">June 2025</a></li>
            </ul>
          </div>

          <div className="widget">
            <h3>Categories</h3>
            <ul className="widget-list">
              <li><a href="/blog">Blogs</a></li>
              <li><a href="/blog">Digital Information</a></li>
              <li><a href="/blog">Health &amp; Wellness</a></li>
              <li><a href="/blog">News &amp; Events</a></li>
              <li><a href="/blog">OPPORTUNITIES FOR DEVELOPMENT</a></li>
              <li><a href="/blog">Personal Development</a></li>
              <li><a href="/blog">Wellness</a></li>
            </ul>
          </div>

          <div className="widget">
            <h3>Subscribe</h3>
            <form className="sidebar-subscribe" onSubmit={(e) => e.preventDefault()}>
              <input type="text" placeholder="Enter your name" />
              <input type="email" placeholder="Enter your email" />
              <button type="submit">Subscribe</button>
            </form>
          </div>

        </aside>

      </div>
    </div>
  );
}

export default Opportunities;