import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import ImageWithFallback from '../components/ImageWithFallback';
import { supabase } from '../lib/supabase';

const FALLBACK_TESTIMONIALS = [
  {
    id: 'f1',
    quote: "Dear Miss Macaulay, I love your teaching today, I wish to be your friend but I know you can't stay in the school forever. But are you going to come back? If yes, please come tomorrow.",
    name: 'Jemima',
    role: 'Pearlygate Private School, Ikotun, Lagos - Student',
    image_url: 'https://mydreamconnect.org.ng/wp-content/uploads/2022/10/IMG_20170628_162654.jpg',
  },
  {
    id: 'f2',
    quote: 'I personally love the close attention paid to individual strengths and development of personal code of ethics. We hope that we guardians too will have the opportunity to enjoy from your wealth of knowledge.',
    name: 'Mr. Ajayi',
    role: 'FRICOM College, Ikotun - Principal',
    image_url: 'https://mydreamconnect.org.ng/wp-content/uploads/2022/10/cropped-mdc-logo-1.png',
  },
  {
    id: 'f3',
    quote: 'Thank you MyDreamConnect for impacting our students SO GREATLY. Our students await more encounters with you - they love all the activities especially the chess game.',
    name: 'Mr. Jatto',
    role: 'JANET Memorial Schools - Principal',
    image_url: 'https://mydreamconnect.org.ng/wp-content/uploads/2022/10/IMG_20170628_151333-1.jpg',
  },
  {
    id: 'f4',
    quote: 'Our students are always excited to come to your Centre, they say the atmosphere is wonderful and a place they have gained the confidence to accept new people as well.',
    name: 'Mrs. Ajibade',
    role: 'HOPEWELL College, Proprietress',
    image_url: 'https://mydreamconnect.org.ng/wp-content/uploads/2022/10/FB_IMG_1623781752620.jpg',
  },
];

function TestimonialsCarousel({ testimonials }) {
  const items = [...testimonials, ...testimonials];

  return (
    <section className="testimonials-section">
      <div className="section-heading light">
        <span className="heading-lead">What People Say</span>{' '}
        <span className="heading-main">About Us</span>
      </div>

      <div className="testimonials-fade">
        <div className="testimonials-track">
          {items.map((t, i) => (
            <div className="testimonial-card" key={`${t.id}-${i}`}>
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
      </div>
    </section>
  );
}

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
  const [testimonials, setTestimonials] = useState(FALLBACK_TESTIMONIALS);
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
      try {
        // 1. Fetch Courses
        const { data: coursesData, error: coursesError } = await supabase
          .from('courses')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (coursesError) console.error("Error fetching courses:", coursesError);
        setCourses(coursesData || []);

        // 2. Fetch Instructors
        const { data: instrData } = await supabase
          .from('instructors')
          .select('*')
          .order('order_index', { ascending: true });
        setInstructors(instrData || []);

        // 3. Fetch Testimonials
        const { data: testData } = await supabase
          .from('testimonials')
          .select('*')
          .order('order_index', { ascending: true });

        if (testData && testData.length > 0) {
          setTestimonials(testData);
        }

        // 4. Fetch Blogs
        const { data: blogData } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(6);
        setBlogs(blogData || []);

        // 5. Fetch Stats
        const { count: totalCourses } = await supabase
          .from('courses')
          .select('*', { count: 'exact', head: true });

        // "Students Enrolled" used to be hard-coded to 0. Count real
        // enrollment rows instead (one row per student/course).
        const { count: totalEnrollments } = await supabase
          .from('enrollments')
          .select('*', { count: 'exact', head: true });

        setStats({
          courses: totalCourses || 0,
          students: totalEnrollments || 0,
          instructors: instrData ? instrData.length : 0,
          programs: 4,
        });
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchAll();
  }, []);

  const statIcons = {
    courses: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
    students: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    instructors: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
    programs: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  };

  return (
    <div className="home-page">

      {/* HERO */}
      <section className="hero">
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="https://kzdqbqnyytgovlngfvwr.supabase.co/storage/v1/object/public/images/uploads/mdc-logo.png"
        >
          <source
            src="https://kzdqbqnyytgovlngfvwr.supabase.co/storage/v1/object/public/images/uploads/hero.mp4"
            type="video/mp4"
          />
        </video>
        <div className="hero-overlay">
          <h4>Welcome to MyDreamConnect!</h4>
          <h1>Be educated so that<br />you can change the world.</h1>
          <p>Having the right COACHING &amp; TRAINING broadens your understanding, it's essential for your personal and professional growth.</p>
          <Link to="/get-started" className="btn-primary">GET STARTED NOW! →</Link>
        </div>
      </section>

      {/* 4 PROGRAM CARDS */}
      <section className="programs-wrapper">
        <div className="programs-section">
          {programs.map((p, i) => (
            <Link to={p.link} className="program-card" key={i} style={{ backgroundColor: p.color }}>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
              <div className="card-arrow">→</div>
            </Link>
          ))}
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="about-section">
        <div className="about-container">
          <div className="about-image">
            <ImageWithFallback src="https://kzdqbqnyytgovlngfvwr.supabase.co/storage/v1/object/public/images/uploads/mdc-logo.png" alt="" />
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

      {/* MISSION SECTION */}
      <section className="mission-section">
        <div className="mission-container">
          <div className="mission-content">
            <div className="stats-row">
              <div className="stat-item">
                <div className="stat-icon">{statIcons.courses}</div>
                <h3>{stats.courses}+</h3>
                <p>Courses</p>
              </div>
              <div className="stat-item">
                <div className="stat-icon">{statIcons.students}</div>
                <h3>{stats.students}+</h3>
                <p>Students Enrolled</p>
              </div>
              <div className="stat-item">
                <div className="stat-icon">{statIcons.instructors}</div>
                <h3>{stats.instructors}+</h3>
                <p>Instructors</p>
              </div>
              <div className="stat-item">
                <div className="stat-icon">{statIcons.programs}</div>
                <h3>{stats.programs}</h3>
                <p>Programs</p>
              </div>
            </div>

            <div className="mission-divider" />

            <h2>Support Our Mission</h2>
            <p>
              MyDreamConnect is the social impact platform of MVC Communications
              Ltd dedicated to empowering individuals through skills-based
              learning, mentorship and guidance. With a mission to bridge the gap
              between formal education and real-world professional skills.
            </p>

            <a
              href="https://bit.ly/support-mydreamconnect"
              target="_blank"
              rel="noreferrer"
              className="btn-donate"
            >
              Donate Now
            </a>
          </div>

          <div className="mission-image">
            <img
              src="https://kzdqbqnyytgovlngfvwr.supabase.co/storage/v1/object/public/images/uploads/do.png"
              alt="MyDreamConnect classroom"
            />
          </div>
        </div>
      </section>

      {/* COURSES */}
      <section className="courses-preview">
        <div className="section-heading-row">
          <div className="section-heading">
            <span className="heading-lead">Check Out</span>{' '}
            <span className="heading-main">Our Courses</span>
          </div>
          <Link to="/courses" className="view-all-link">
            View All Courses
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
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
              // price may be null, 0, a number, or a numeric string.
              const priceValue = Number(course.price);
              const isFree = !course.price || !Number.isFinite(priceValue) || priceValue <= 0;
              return (
                <div className="course-card" key={course.id}>
                  <div className="course-image">
                    <ImageWithFallback src={course.image_url} alt={course.name ? `${course.name} course` : 'Course'} />
                  </div>
                  <div className="course-body">
                    <h3>{course.name || 'Untitled Course'}</h3>
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
                        {isFree ? 'Free' : `₦${priceValue.toLocaleString('en-NG')}`}
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
      <TestimonialsCarousel testimonials={testimonials} />

      {/* INSTRUCTORS */}
      {instructors.length > 0 && (
        <section className="instructors-section">
          <div className="section-heading-row">
            <div className="section-heading">
              <span className="heading-lead">Meet Some of Our TECH Bootcamp</span>{' '}
              <span className="heading-main">Instructors</span>
            </div>
            <Link to="/about" className="view-all-link">
              View All Instructors
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>

          <div className="instructors-grid">
            {instructors.map((inst) => (
              <div className="instructor-card" key={inst.id}>
                <ImageWithFallback src={inst.image_url} alt={inst.name || 'Instructor'} type="human" />
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
          <div className="section-heading-row">
            <div className="section-heading">
              <span className="heading-lead">Latest From Our</span>{' '}
              <span className="heading-main">Blogs</span>
            </div>
            <Link to="/blog" className="view-all-link">
              View All Blogs
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>

          <div className="blogs-grid">
            {blogs.map((b) => (
              <Link to={`/blog/${b.id}`} className="blog-card" key={b.id}>
                <ImageWithFallback src={b.image_url} alt={b.title || 'Blog post'} />
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