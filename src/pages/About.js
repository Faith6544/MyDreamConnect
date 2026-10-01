import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

function About() {
  const recentPosts = [
    { title: 'Call for Proposals: Global Youth Action Fund 2026', url: '/blog' },
    { title: 'FORTIFIED 2025: TECH Powered, FORTIFIED for Success Impact Report', url: '/blog' },
    { title: 'Register', url: '/blog' },
    { title: 'I Want to Learn Tech, But I Don\'t Know Where to Start', url: '/blog' },
    { title: 'Why Learning to Code This Holiday Could Be the Smartest Decision for Your Child\'s Future', url: '/blog' },
  ];

  const recentComments = [
    { author: 'MyDreamConnect', post: 'Hello June!' },
    { author: 'Tinuola Ameh', post: 'Hello June!' },
    { author: 'MyDreamConnect', post: 'Emotional Intelligence Has 12 Elements' },
    { author: 'Elvis Boateng', post: 'Emotional Intelligence Has 12 Elements' },
    { author: 'Yetunde Macaulay', post: 'PIXELS & PROGRAMS: Understanding the Contrasts' },
  ];

  const archives = [
    'January 2026', 'December 2025', 'October 2025', 'August 2025', 'July 2025',
    'June 2025', 'May 2025', 'April 2025', 'March 2025', 'February 2025',
    'May 2024', 'March 2024', 'February 2024', 'January 2024', 'December 2023',
    'October 2023', 'July 2023', 'October 2022', 'September 2022', 'August 2022',
    'July 2022', 'June 2022',
  ];

  const categories = [
    'Blogs', 'Digital Information', 'Health & Wellness', 'News & Events',
    'OPPORTUNITIES FOR DEVELOPMENT', 'Personal Development', 'Wellness',
  ];

  return (
    <div className="about-page">

      {/* Banner */}
      <section className="about-banner">
        <h1>About Us</h1>
        <p>Home / About Us</p>
      </section>

      <div className="about-layout">

        {/* === MAIN CONTENT === */}
        <article className="about-content">

          <p>
            <strong>MyDreamConnect Foundation</strong>, officially registered with CAC as <strong>MyDreamConnect Academy for Change &amp; Development Foundation</strong>, is a Nigerian-based non-profit organisation and an ecosystem for change and development committed to raising a generation of empowered, purpose-driven, and future-ready young people.
          </p>

          <p>
            We design and deliver impactful programmes in <strong>SDGs Education, Life &amp; Soft Skills, Tech &amp; Digital Skills Development, Entrepreneurship &amp; Business Skills, Career Development, and Youth Empowerment</strong>. Through strategic partnerships with schools, government, corporate organisations, development partners, and communities, we create opportunities that enable teenagers, youth, and women to learn, grow, innovate, and thrive.
          </p>

          <p><strong>Our ecosystem is built around four flagship platforms:</strong></p>

          <p><strong>SHAPE</strong> – Empowering teenagers through leadership, life skills, technology, entrepreneurship, and personal development programmes.</p>
          <p><strong>SMART</strong> – Preparing youth for employment, entrepreneurship, leadership, and career success through practical skills development.</p>
          <p><strong>MIX</strong> – Equipping women with digital, entrepreneurial, and business skills that foster economic empowerment.</p>
          <p><strong>BTS (Back to School Support Initiative)</strong> – Supporting vulnerable teenagers with essential educational materials and advocacy to improve access to quality education.</p>

          <p>
            While we are proudly headquartered in Nigeria, our technology-enabled learning model allows us to reach and empower young people and women across Africa through accessible online and physical training, mentorship, and community-based programmes. We believe that every young person deserves the opportunity to discover their potential, build relevant skills, and contribute meaningfully to society. By creating safe learning environments, practical experiences, and pathways to opportunity, we are helping to develop the next generation of leaders, innovators, entrepreneurs, and changemakers.
          </p>

          <blockquote className="about-quote">
            <p><strong>OUR VISION:</strong></p>
            <p>To raise knowledgeable, purpose-driven, and future-ready leaders with the character, competence, and confidence to create positive change and build thriving communities across Africa.</p>
          </blockquote>

          <p>
            We believe a person needs to have all their psychosocial needs met to be happy with themselves and those around them, so we decided to create a safe support platform.
          </p>

          <blockquote className="about-quote">
            <p><strong>OUR MISSION</strong></p>
            <p>To empower teenagers, youth, and women with life, digital, entrepreneurial, and career development skills while creating opportunities that promote education, innovation, employability, entrepreneurship, and sustainable development.</p>
          </blockquote>

          <blockquote className="about-quote">
            <p><strong>OUR CORE VALUES</strong></p>
            <p><strong>PERSONAL RESPONSIBILITY</strong><br />
              We inspire people to take ownership of their lives, decisions, and contributions to society.</p>
            <p><strong>RESPECT FOR HUMAN DIGNITY</strong><br />
              We value every individual and promote inclusion, equity, compassion, and respect in all that we do.</p>
            <p><strong>INTEGRITY</strong><br />
              We uphold transparency, accountability, and ethical leadership in our relationships and programmes.</p>
            <p><strong>DEVELOPMENT</strong><br />
              We are committed to continuous learning, innovation, and the holistic development of individuals and communities.</p>
            <p><strong>EXCELLENCE</strong><br />
              We strive for quality, professionalism, and continuous improvement in every initiative we undertake.</p>
            <p><strong>IMPACT</strong><br />
              We focus on creating measurable, sustainable, and life-changing outcomes for the people and communities we serve.</p>
            <p><strong>COLLABORATION</strong><br />
              We believe lasting change happens through strong partnerships with government, schools, businesses, development partners, volunteers, and communities.</p>
          </blockquote>

          <h3 className="about-impact-heading">Our Impact</h3>

          <p>
            We are particularly interested, and strongly committed to <strong>SDG 4</strong> (Quality Education) and <strong>SDG 8</strong> (Decent Work and Economic Growth) – both are essential for personal and professional growth in future. Our work contributes to the achievement of the <strong>United Nations Sustainable Development Goals (SDGs)</strong> 1, 3, 4 &amp; 8.
          </p>

          <figure className="about-sdg-image">
            <img
              src="https://mydreamconnect.org.ng/wp-content/uploads/2022/10/sdg-goals-1024x538.png"
              alt=""
            />
          </figure>

          <p className="about-coach-cta">
            Want to <Link to="/partnership" className="about-cta-btn">Partner With Us</Link>
          </p>

        </article>

        {/* === SIDEBAR === */}
        <aside className="about-sidebar">

          {/* Search */}
          <div className="widget">
            <h3>Search</h3>
            <form className="sidebar-search" onSubmit={(e) => e.preventDefault()}>
              <input type="text" placeholder="" />
              <button type="submit">Search</button>
            </form>
          </div>

          {/* Recent Posts */}
          <div className="widget">
            <h3>Recent Posts</h3>
            <ul className="widget-list">
              {recentPosts.map((post, i) => (
                <li key={i}><Link to={post.url}>{post.title}</Link></li>
              ))}
            </ul>
          </div>

          {/* Recent Comments */}
          <div className="widget">
            <h3>Recent Comments</h3>
            <ul className="widget-list comments-list">
              {recentComments.map((c, i) => (
                <li key={i}>
                  <strong>{c.author}</strong> on <Link to="/blog">{c.post}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Archives */}
          <div className="widget">
            <h3>Archives</h3>
            <ul className="widget-list">
              {archives.map((a, i) => (
                <li key={i}><Link to="/blog">{a}</Link></li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="widget">
            <h3>Categories</h3>
            <ul className="widget-list">
              {categories.map((c, i) => (
                <li key={i}><Link to="/blog">{c}</Link></li>
              ))}
            </ul>
          </div>

          {/* Subscribe */}
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

export default About;