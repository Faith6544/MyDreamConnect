import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';
import ImageWithFallback from '../components/ImageWithFallback';
import { supabase } from '../lib/supabase';

const HERO_POSTER =
  'https://kzdqbqnyytgovlngfvwr.supabase.co/storage/v1/object/public/images/uploads/mdc-logo.png';
const HERO_VIDEO =
  'https://kzdqbqnyytgovlngfvwr.supabase.co/storage/v1/object/public/images/uploads/hero.mp4';

const FALLBACK_TESTIMONIALS = [
  {
    id: 'f1',
    quote: "Dear Miss Macaulay, I love your teaching today, I wish to be your friend but I know you can't stay in the school forever. But are you going to come back? If yes, please come tomorrow.",
    name: 'Jemima',
    role: 'Pearlygate Private School, Ikotun, Lagos - Student',
    image_url: 'https://kzdqbqnyytgovlngfvwr.supabase.co/storage/v1/object/public/images/uploads/logo-transparent.png',
  },
  {
    id: 'f2',
    quote: 'I personally love the close attention paid to individual strengths and development of personal code of ethics. We hope that we guardians too will have the opportunity to enjoy from your wealth of knowledge.',
    name: 'Mr. Ajayi',
    role: 'FRICOM College, Ikotun - Principal',
    image_url: 'https://kzdqbqnyytgovlngfvwr.supabase.co/storage/v1/object/public/images/uploads/logo-transparent.png',
  },
  {
    id: 'f3',
    quote: 'Thank you MyDreamConnect for impacting our students SO GREATLY. Our students await more encounters with you - they love all the activities especially the chess game.',
    name: 'Mr. Jatto',
    role: 'JANET Memorial Schools - Principal',
    image_url: 'https://kzdqbqnyytgovlngfvwr.supabase.co/storage/v1/object/public/images/uploads/logo-transparent.png',
  },
  {
    id: 'f4',
    quote: 'Our students are always excited to come to your Centre, they say the atmosphere is wonderful and a place they have gained the confidence to accept new people as well.',
    name: 'Mrs. Ajibade',
    role: 'HOPEWELL College, Proprietress',
    image_url: 'https://kzdqbqnyytgovlngfvwr.supabase.co/storage/v1/object/public/images/uploads/logo-transparent.png',
  },
];

/**
 * Hero background video, tuned for smooth scrolling:
 * - On small screens the heavy mp4 is never downloaded; the poster
 *   image is shown instead (saves mobile data + CPU).
 * - On desktop the video is paused as soon as the hero scrolls out of
 *   view, so it stops competing with scrolling for CPU/GPU.
 */
function HeroVideo() {
  const videoRef = useRef(null);
  const heroRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Poster-only on phones: matchMedia keeps it in sync on rotation/resize.
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(mq.matches);
    update();
    if (mq.addEventListener) {
      mq.addEventListener('change', update);
      return () => mq.removeEventListener('change', update);
    }
    return undefined;
  }, []);

  // Pause the video once the hero leaves the viewport (desktop only).
  useEffect(() => {
    if (isMobile) return undefined;
    const video = videoRef.current;
    const hero = heroRef.current;
    if (!video || !hero || !('IntersectionObserver' in window)) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [isMobile]);

  return (
    <section className="hero" ref={heroRef}>
      <video
        ref={videoRef}
        className="hero-video"
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        poster={HERO_POSTER}
      >
        {/* The <source> is omitted on mobile so the browser shows the
            poster without downloading ~megabytes of video. */}
        {!isMobile && <source src={HERO_VIDEO} type="video/mp4" />}
      </video>
      <div className="hero-overlay">
        <h4>Welcome to MyDreamConnect!</h4>
        <h1>Be educated so that<br />you can change the world.</h1>
        <p>Having the right COACHING &amp; TRAINING broadens your understanding, it's essential for your personal and professional growth.</p>
        <Link to="/get-started" className="btn-primary">GET STARTED NOW! →</Link>
      </div>
    </section>
  );
}

function TestimonialsCarousel({ testimonials }) {
  // The list is duplicated once so the track can animate exactly -50%
  // and loop seamlessly, no matter how many testimonials exist.
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
  const navigate = useNavigate();
  const programs = [
    { title: 'SHAPE', desc: 'Life Skills training for teenagers for personal development.', color: '#8e44ad', link: '/about' },
    { title: 'STAR', desc: 'Tech, digital & leadership training for educators, youth & managers.', color: '#e84393', link: '/about' },
    { title: 'MIX', desc: 'Fun activities for psychosocial development.', color: '#0984e3', link: '/about' },
    { title: 'BACK TO SCHOOL', desc: 'Support with school writing materials for the less privileged.', color: '#d4a017', link: '/about' },
  ];

  const features = [
    'Life Skills Training for Psychosocial Competence',
    'Tech, Digital & Vocational Skills Training',
    'BACK TO SCHOOL Support for Highschoolers',
  ];

  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [testimonials, setTestimonials] = useState(FALLBACK_TESTIMONIALS);
  const [blogs, setBlogs] = useState([]);
  const [team, setTeam] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  const [stats, setStats] = useState({ courses: 0, students: 0, instructors: 0, programs: 4 });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [
          { data: coursesData },
          { data: instrData },
          { data: testData },
          { data: blogData },
          { data: teamData },
          { count: totalCourses },
          { count: totalEnrollments }
        ] = await Promise.all([
          // Respect the order set with drag-and-drop in the admin panel.
          supabase.from('courses').select('*').order('display_order', { ascending: true }).limit(5),
          supabase.from('instructors').select('*').order('order_index', { ascending: true }),
          supabase.from('testimonials').select('*').order('order_index', { ascending: true }),
          supabase.from('posts').select('*').order('display_order', { ascending: true }).limit(6),
          // ONLY FETCH TEAM MEMBERS WHO ARE SET TO SHOW ON HOME
          supabase.from('team_members').select('*').eq('show_on_home', true).order('order_index', { ascending: true }).limit(4),
          supabase.from('courses').select('*', { count: 'exact', head: true }),
          supabase.from('enrollments').select('*', { count: 'exact', head: true })
        ]);

        setCourses(coursesData || []);
        setInstructors(instrData || []);
        if (testData && testData.length > 0) setTestimonials(testData);
        setBlogs(blogData || []);
        setTeam(teamData || []);

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
    courses: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>),
    students: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>),
    instructors: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>),
    programs: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>),
  };

  return (
    <div className="home-page">
      {/* HERO */}
      <HeroVideo />

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
            <ImageWithFallback src="https://kzdqbqnyytgovlngfvwr.supabase.co/storage/v1/object/public/images/uploads/mdc-logo-transparent.png" alt="" style={{ mixBlendMode: 'multiply' }} />
          </div>
          <div className="about-text">
            <h2>We are a group of socially responsible young people;</h2>
            <p>we organize free developmental programs to promote youth life development. We are committed to investing our resources (money, time &amp; wisdom) into teaching teens and young adults to make decisions and lead themselves to making choices to do the right things at the right times.</p>
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
              <div className="stat-item"><div className="stat-icon">{statIcons.courses}</div><h3>{stats.courses}+</h3><p>Courses</p></div>
              <div className="stat-item"><div className="stat-icon">{statIcons.students}</div><h3>{stats.students}+</h3><p>Students Enrolled</p></div>
              <div className="stat-item"><div className="stat-icon">{statIcons.instructors}</div><h3>{stats.instructors}+</h3><p>Instructors</p></div>
              <div className="stat-item"><div className="stat-icon">{statIcons.programs}</div><h3>{stats.programs}</h3><p>Programs</p></div>
            </div>
            <div className="mission-divider" />
            <h2>Support Our Mission</h2>
            <p>MyDreamConnect is the social impact platform of MVC Communications Ltd dedicated to empowering individuals through skills-based learning, mentorship and guidance. With a mission to bridge the gap between formal education and real-world professional skills.</p>
            <a href="https://bit.ly/support-mydreamconnect" target="_blank" rel="noreferrer" className="btn-donate">Donate Now</a>
          </div>
          <div className="mission-image">
            <img src="https://kzdqbqnyytgovlngfvwr.supabase.co/storage/v1/object/public/images/uploads/do.png" alt="MyDreamConnect classroom" loading="lazy" />
          </div>
        </div>
      </section>

      {/* ================= TEAM PREVIEW SECTION ================= */}
      {team.length > 0 && (
        <section className="team-preview-section">
          <div className="team-preview-container">
            <div className="section-heading-row">
              <div className="section-heading">
                <span className="heading-lead">Meet Our</span>{' '}
                <span className="heading-main">Leadership Team</span>
              </div>
              <Link to="/team" className="view-all-link">
                Meet the Full Team
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>

            <div className="team-preview-grid">
              {team.map(member => (
                <div
                  key={member.id}
                  className="team-preview-card"
                  onClick={() => navigate(`/team/${member.id}`)}
                  role="link"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') navigate(`/team/${member.id}`);
                  }}
                >
                  <div className="team-preview-photo">
                    <ImageWithFallback
                      src={member.image_url}
                      alt={member.name}
                      type="human"
                    />
                  </div>
                  <h3 className="team-preview-name">{member.name}</h3>
                  <p className="team-preview-role">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* COURSES */}
      <section className="courses-preview">
        <div className="section-heading-row">
          <div className="section-heading">
            <span className="heading-lead">Check Out</span>{' '}
            <span className="heading-main">Our Courses</span>
          </div>
          <Link to="/courses" className="view-all-link">View All Courses <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></Link>
        </div>

        {loadingCourses && <p className="preview-status">Loading courses...</p>}
        {!loadingCourses && courses.length === 0 && <p className="preview-status">No courses yet.</p>}

        {!loadingCourses && courses.length > 0 && (
          <div className="courses-grid">
            {courses.map(course => {
              const priceValue = Number(course.price);
              const isFree = !course.price || !Number.isFinite(priceValue) || priceValue <= 0;
              return (
                <div className="course-card" key={course.id}>
                  <div className="course-image"><ImageWithFallback src={course.image_url} alt={course.name ? `${course.name} course` : 'Course'} /></div>
                  <div className="course-body">
                    <h3>{course.name || 'Untitled Course'}</h3>
                    <p className="course-excerpt">{course.excerpt ? course.excerpt.substring(0, 90) + '...' : 'Click to view full course description and enroll today.'}</p>
                    <div className="course-meta"><span>{course.duration || 'Flexible'}</span><span>{course.level || 'All Levels'}</span></div>
                    <div className="course-footer">
                      <span className="course-price">{isFree ? 'Free' : `₦${priceValue.toLocaleString('en-NG')}`}</span>
                      <Link to={`/courses/${course.id}`} className="course-btn">{isFree ? 'Enroll Now' : 'Buy Now'}</Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <TestimonialsCarousel testimonials={testimonials} />

      {/* INSTRUCTORS */}
      {instructors.length > 0 && (
        <section className="instructors-section">
          <div className="section-heading-row">
            <div className="section-heading"><span className="heading-lead">Meet Some of Our TECH Bootcamp</span>{' '}<span className="heading-main">Instructors</span></div>
            <Link to="/about" className="view-all-link">View All Instructors <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></Link>
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
            <div className="section-heading"><span className="heading-lead">Latest From Our</span>{' '}<span className="heading-main">Blogs</span></div>
            <Link to="/blog" className="view-all-link">View All Blogs <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></Link>
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
