import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';
import Sidebar from '../components/Sidebar';
import ImageWithFallback from '../components/ImageWithFallback';
function About() {
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
            <ImageWithFallback
  src="https://mydreamconnect.org.ng/wp-content/uploads/2022/10/sdg-goals-1024x538.png"
  alt=""
/>
          </figure>

          <p className="about-coach-cta">
            Want to <Link to="/partnership" className="about-cta-btn">Partner With Us</Link>
          </p>

        </article>

        {/* === SIDEBAR (LIVE) === */}
        <Sidebar />

      </div>
    </div>
  );
}

export default About;