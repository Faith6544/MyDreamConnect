import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import ImageWithFallback from '../components/ImageWithFallback';
import { supabase } from '../lib/supabase';

function Home() {

  const programs = [
    { title: 'SHAPE', desc: 'Life Skills training for teenagers for personal development.', color: '#8e44ad', link: '/about' },
    { title: 'STAR', desc: 'Tech, digital & leadership training for educators, youth & managers.', color: '#e84393', link: '/about' },
    { title: 'MIX', desc: 'Fun activities for psychosocial development.', color: '#0984e3', link: '/about' },
    { title: 'BACK TO SCHOOL', desc: 'Support with school writing materials for the less privileged.', color: '#d4a017', link: '/about' },
  ];

  const features = [
    'Life Skills Training for Psychosocial Competence',
    'Tech, Digital & Vocational Skills Training',
    'BACK TO SCHOOL Support for High Schoolers',
  ];

  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  const [stats, setStats] = useState({
    courses: 0,
    students: 0,
    instructors: 0,
    programs: 4,
  });

  useEffect(() => {
    const fetchAll = async () => {
      // Courses (5 most recent)
      const { data: coursesData } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      const safeCourses = coursesData || [];
      setCourses(safeCourses);

      // Instructors
      const { data: instrData } = await supabase
        .from('instructors')
        .select('*')
        .order('order_index', { ascending: true });
      setInstructors(instrData || []);

      // Testimonials
      const { data: testData } = await supabase
        .from('testimonials')
        .select('*')
        .order('order_index', { ascending: true });
      setTestimonials(testData || []);

      // Blogs (6 most recent)
      const { data: blogData } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);
      setBlogs(blogData || []);

      // Stats
      const { count: totalCourses } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true });

      setStats({
        courses: totalCourses || 0,
        students: 0,
        instructors: instrData ? instrData.length : 0,
        programs: 4,
      });

      setLoadingCourses(false);
    };

    fetchAll();
  }, []);

  return (
    <div className="home-page">

      {/* HERO */}
      <section className="hero">
        <div className="hero-overlay">
          <h4>Welcome to MyDreamConnect!</h4>
          <h1>Be educated so that<br />you can change the world.</h1>
          <p>Having the right COACHING &amp; TRAINING broadens your understanding, it's essential for your personal and professional growth.</p>
          <Link to="/get-started" className="btn-primary">GET STARTED NOW! →</Link>
        </div>
      </section>

      {/* 4 PROGRAM CARDS */}
      <section className="programs-section">
        {programs.map((p, i) => (
          <Link to={p.link} className="program-card" key={i} style={{ backgroundColor: p.color }}>
            <h3>{p.title}</h3>
            <p>{p.desc}</p>
            <div className="card-arrow">→</div>
          </Link>
        ))}
      </section>

      {/* WHO WE ARE */}
      <section className="about-section">
        <div className="about-container">
          <div className="about-image">
            <ImageWithFallback src="https://mydreamconnect.org.ng/wp-content/uploads/2022/10/cropped-mdc-logo-1024x817.png" alt="" />
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

      {/* STATS */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <h3>{stats.courses}+</h3>
            <p>Courses</p>
          </div>
          <div className="stat-item">
            <h3>{stats.students}+</h3>
            <p>Students enrolled</p>
          </div>
          <div className="stat-item">
            <h3>{stats.instructors}+</h3>
            <p>Course instructors</p>
          </div>
          <div className="stat-item">
            <h3>{stats.programs}</h3>
            <p>Flagship programs</p>
          </div>
        </div>
      </section>

      {/* DONATE CTA */}
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

      {/* COURSES */}
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
              return (
                <div className="course-card" key={course.id}>
                  <div className="course-image">
                    <ImageWithFallback src={course.image_url} alt="" />
                  </div>
                  <div className="course-body">
                    <h3>{course.name}</h3>
                    <p className="course-excerpt">
                      {course.excerpt
                        ? course.excerpt.substring(0, 90) + '...'
                        : 'Click to view full course description and enroll today.'}
                    </p>
                    <div className="course-meta">
                      <span>{course.duration || 'Flexible'}</span>
                      <span>{course.level || 'All Levels'}</span>
                    </div>
                    <div className="course-footer">
                      <span className="course-price">
                        {isFree ? 'Free' : `₦${course.price.toLocaleString('en-NG')}`}
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

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="testimonials-section">
          <div className="section-heading light">
            <span className="heading-lead">What People Say</span>{' '}
            <span className="heading-main">About Us</span>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((t) => (
              <div className="testimonial-card" key={t.id}>
                <p className="testimonial-quote">"{t.quote}"</p>
                <div className="testimonial-author">
                  <ImageWithFallback src={t.image_url} alt="" type="human" />
                  <div>
                    <h4>{t.name}</h4>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* INSTRUCTORS */}
      {instructors.length > 0 && (
        <section className="instructors-section">
          <div className="section-heading">
            <span className="heading-lead">Meet Some of Our TECH Bootcamp</span>{' '}
            <span className="heading-main">Instructors</span>
          </div>

          <div className="instructors-grid">
            {instructors.map((inst) => (
              <div className="instructor-card" key={inst.id}>
                <ImageWithFallback src={inst.image_url} alt="" type="human" />
                <h4>{inst.name}</h4>
                <span>{inst.role}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* BLOGS */}
      {blogs.length > 0 && (
        <section className="blogs-preview">
          <div className="section-heading">
            <span className="heading-lead">Latest From Our</span>{' '}
            <span className="heading-main">Blogs</span>
          </div>

          <div className="blogs-grid">
            {blogs.map((b) => (
              <Link to={`/blog/${b.id}`} className="blog-card" key={b.id}>
                <ImageWithFallback src={b.image_url} alt="" />
                <h3>{b.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}

export default Home;