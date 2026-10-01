import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {

  // Programs — matching the original 4 cards
  const programs = [
    { title: 'SHAPE', desc: 'Life Skills training for teenagers for personal development.', color: '#8e44ad', link: '/about' },
    { title: 'STAR', desc: 'Tech, digital & leadership training for educators, youth & managers.', color: '#e84393', link: '/about' },
    { title: 'MIX', desc: 'Fun activities for psychosocial development.', color: '#0984e3', link: '/about' },
    { title: 'BACK TO SCHOOL', desc: 'Support with school writing materials for the less privileged.', color: '#d4a017', link: '/about' },
  ];

  // The 3 feature list items in "Who We Are"
  const features = [
    'Life Skills Training for Psychosocial Competence',
    'Tech, Digital & Vocational Skills Training',
    'BACK TO SCHOOL Support for High Schoolers',
  ];

  // Live courses from WordPress LearnPress
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_WP_API}/learnpress/v1/courses`)
      .then(res => res.json())
      .then(data => {
        setCourses(Array.isArray(data) ? data.slice(0, 5) : []);
        setLoadingCourses(false);
      })
      .catch(err => {
        console.error('Courses fetch error:', err);
        setLoadingCourses(false);
      });
  }, []);

  // Testimonials — will connect to WordPress later
  const testimonials = [
    { quote: 'Dear Miss Macaulay, I love your teaching today, I wish to be your friend but I know you can\'t stay in the school forever. But are you going to come back? If yes, please come tomorrow.', name: 'Jemima', role: 'Pearlygate Private School, Ikotun, Lagos - Student', image: 'https://mydreamconnect.org.ng/wp-content/uploads/2022/10/IMG_20170628_162654.jpg' },
    { quote: 'I personally love the close attention paid to individual strengths and development of personal code of ethics. We hope that we guardians too will have the opportunity to enjoy from your wealth of knowledge.', name: 'Mr. Ajayi', role: 'FRICOM COLLEGE, Ikotun - Principal', image: 'https://mydreamconnect.org.ng/wp-content/uploads/2022/10/cropped-mdc-logo-1.png' },
    { quote: 'Thank you MyDreamConnect for impacting our students SO GREATLY. Our students await more encounters with you - they love all the activities especially the chess game.', name: 'Mr. Jatto', role: 'JANET Memorial Schools - Principal', image: 'https://mydreamconnect.org.ng/wp-content/uploads/2022/10/IMG_20170628_151333-1.jpg' },
    { quote: 'Our students are always excited to come to your Centre, they say the atmosphere is wonderful and a place they have gained the confidence to accept new people as well.', name: 'Mrs. Ajibade', role: 'HOPEWELL COLLEGE, Proprietress', image: 'https://mydreamconnect.org.ng/wp-content/uploads/2022/10/FB_IMG_1623781752620.jpg' },
  ];

  // Instructors — will connect to WordPress later
  const instructors = [
    { name: 'Georgine Pudo', role: 'Digital Media Marketing Instructor', image: 'https://mydreamconnect.org.ng/wp-content/uploads/2025/05/Georgine-Pudo_MyDreamConnect-TECH_Bootcamp-Instructor-Digital-Media.png' },
    { name: 'Oluwatomisin Olowoyo', role: 'Digital Media Marketing Instructor', image: 'https://mydreamconnect.org.ng/wp-content/uploads/2025/05/Tomisin-Olowoyo_MyDreamConnect-TECH_Bootcamp-Instructor-Digital-Media.png' },
    { name: 'Gideon Iboyi', role: 'Programming/Web-Dev Instructor', image: 'https://mydreamconnect.org.ng/wp-content/uploads/2025/05/Gideon-Iboyi_MyDreamConnect-TECH_Bootcamp-Instructor-Programming-Web-Dev.png' },
    { name: 'Ebenezer Abioye', role: 'UI/UX [Product Design] Instructor', image: 'https://mydreamconnect.org.ng/wp-content/uploads/2025/05/Abioye-Ebenezer_MyDreamConnect-TECH_Bootcamp-Instructor-Product-Design-UIUX.png' },
    { name: 'Rachel Babalola', role: 'Data Analysis Instructor', image: 'https://mydreamconnect.org.ng/wp-content/uploads/2025/05/Rachel-Babalola_MyDreamConnect-TECH_Bootcamp-Instructor-Data-Analysis.png' },
    { name: 'Simon Onguka', role: 'Data Analysis Instructor', image: 'https://mydreamconnect.org.ng/wp-content/uploads/2025/05/Simon-Onguka_MyDreamConnect-TECH_Bootcamp-Instructor-Data-Analysis.png' },
  ];

  // Blogs — will connect to WordPress later
  const blogs = [
    { title: 'Emotional Intelligence Has 12 Elements', image: 'https://mydreamconnect.org.ng/wp-content/uploads/2024/05/image.png', url: '/blog' },
    { title: 'PIXELS & PROGRAMS: Understanding the Contrasts Between Technical and Digital Media Skills', image: 'https://mydreamconnect.org.ng/wp-content/uploads/2024/05/pixels-programs-digital-landscape.webp', url: '/blog' },
    { title: 'Call for Proposals: Global Youth Action Fund 2026', image: 'https://mydreamconnect.org.ng/wp-content/uploads/2026/01/ChatGPT-Image-Jan-20-2026-09_34_36-AM.png', url: '/blog' },
    { title: 'FORTIFIED 2025: TECH Powered, FORTIFIED for Success Impact Report', image: 'https://mydreamconnect.org.ng/wp-content/uploads/2025/12/MyDreamConnect-FORTIFIED-SUMMIT-2025.jpeg', url: '/blog' },
    { title: 'I Want to Learn Tech, But I Don\'t Know Where to Start', image: 'https://mydreamconnect.org.ng/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-08-at-08.34.20_e3ec1c0c.jpg', url: '/blog' },
    { title: 'Why Learning to Code This Holiday Could Be the Smartest Decision for Your Child\'s Future', image: 'https://mydreamconnect.org.ng/wp-content/uploads/2025/07/Child-Coding-1.png', url: '/blog' },
  ];

  return (
    <div className="home-page">

      {/* ============ HERO ============ */}
      <section className="hero">
        <div className="hero-overlay">
          <h4>Welcome to MyDreamConnect!</h4>
          <h1>Be educated so that<br />you can change the world.</h1>
          <p>Having the right COACHING &amp; TRAINING broadens your understanding, it's essential for your personal and professional growth.</p>
          <Link to="/get-started" className="btn-primary">GET STARTED NOW! →</Link>
        </div>
      </section>

      {/* ============ 4 PROGRAM CARDS ============ */}
      <section className="programs-section">
        {programs.map((p, i) => (
          <Link to={p.link} className="program-card" key={i} style={{ backgroundColor: p.color }}>
            <h3>{p.title}</h3>
            <p>{p.desc}</p>
            <div className="card-arrow">→</div>
          </Link>
        ))}
      </section>

      {/* ============ WHO WE ARE ============ */}
      <section className="about-section">
        <div className="about-container">
          <div className="about-image">
            <img src="https://mydreamconnect.org.ng/wp-content/uploads/2022/10/cropped-mdc-logo-1024x817.png" alt="" />
          </div>
          <div className="about-text">
            <h2>We are a group of socially responsible young people;</h2>
            <p>
              we organize free developmental programs to promote youth life
              development. We are committed to investing our resources (money,
              time &amp; wisdom) into teaching teens and young adults to make
              decisions and lead themselves to making choices to do the right
              things at the right times.
            </p>
            <ul className="about-features">
              {features.map((f, i) => (<li key={i}>✔ {f}</li>))}
            </ul>
            <Link to="/partnership" className="btn-primary">JOIN US Today</Link>
          </div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-item"><h3>15,000+</h3><p>Courses & videos</p></div>
          <div className="stat-item"><h3>14,000+</h3><p>Students enrolled</p></div>
          <div className="stat-item"><h3>100+</h3><p>Course instructors</p></div>
          <div className="stat-item"><h3>100%</h3><p>Satisfaction rate</p></div>
        </div>
      </section>

      {/* ============ DONATE CTA ============ */}
      <section className="donate-cta">
        <div className="donate-cta-content">
          <h2>Support Our Mission</h2>
          <p>
            MyDreamConnect is the social impact platform of MVC Communications
            Ltd dedicated to empowering individuals through skills-based
            learning, mentorship and guidance. With a mission to bridge the gap
            between formal education and real-world professional skills.
          </p>
          <a href="https://bit.ly/support-mydreamconnect" target="_blank" rel="noreferrer" className="btn-donate">
            Donate
          </a>
        </div>
      </section>

      {/* ============ COURSES (LIVE) ============ */}
      <section className="courses-preview">
        <div className="section-heading">
          <span className="heading-lead">Check Out</span>{' '}
          <span className="heading-main">Our Courses</span>
        </div>

        {loadingCourses && (
          <p style={{ textAlign: 'center', padding: '40px' }}>Loading courses...</p>
        )}

        {!loadingCourses && courses.length === 0 && (
          <p style={{ textAlign: 'center', padding: '40px' }}>No courses yet.</p>
        )}

        {!loadingCourses && courses.length > 0 && (
          <div className="courses-grid">
            {courses.map(course => {
              const isFree = !course.price || course.price === 0;
              const lessons = course.meta_data?._lp_offline_lesson_count || course.meta_data?._lp_lesson_count || 0;
              const level = course.meta_data?._lp_level === 'all' ? 'All Levels' : (course.meta_data?._lp_level || 'All Levels');

              return (
                <div className="course-card" key={course.id}>
                  <div className="course-image">
                    <img src={course.image} alt="" />
                  </div>
                  <div className="course-body">
                    <h3>{course.name}</h3>
                    <p className="course-excerpt">
                      {course.excerpt
                        ? course.excerpt.replace(/<[^>]+>/g, '').substring(0, 90) + '...'
                        : 'Click to view full course description and enroll today.'}
                    </p>
                    <div className="course-meta">
                      <span>{course.duration}</span>
                      <span>{level}</span>
                      <span>{lessons} Lessons</span>
                      <span>{course.count_students} Students</span>
                    </div>
                    <div className="course-footer">
                      <span className="course-price">
                        {isFree ? 'Free' : course.price_rendered}
                      </span>
                      <Link to={`/courses/${course.id}`} className="course-btn">
                        {isFree ? 'Enroll Now' : 'Buy Now'}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="testimonials-section">
        <div className="section-heading light">
          <span className="heading-lead">What People Say</span>{' '}
          <span className="heading-main">About Us</span>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div className="testimonial-card" key={i}>
              <p className="testimonial-quote">"{t.quote}"</p>
              <div className="testimonial-author">
                <img src={t.image} alt="" />
                <div>
                  <h4>{t.name}</h4>
                  <span>{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ INSTRUCTORS ============ */}
      <section className="instructors-section">
        <div className="section-heading">
          <span className="heading-lead">Meet Some of Our TECH Bootcamp</span>{' '}
          <span className="heading-main">Instructors</span>
        </div>

        <div className="instructors-grid">
          {instructors.map((inst, i) => (
            <div className="instructor-card" key={i}>
              <img src={inst.image} alt="" />
              <h4>{inst.name}</h4>
              <span>{inst.role}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ============ BLOGS ============ */}
      <section className="blogs-preview">
        <div className="section-heading">
          <span className="heading-lead">Latest From Our</span>{' '}
          <span className="heading-main">Blogs</span>
        </div>

        <div className="blogs-grid">
          {blogs.map((b, i) => (
            <Link to={b.url} className="blog-card" key={i}>
              <img src={b.image} alt="" />
              <h3>{b.title}</h3>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}

export default Home;