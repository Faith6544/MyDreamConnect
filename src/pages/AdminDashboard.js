import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './AdminDashboard.css';

function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    students: 0,
    courses: 0,
    enrollments: 0,
    posts: 0,
    lessons: 0,
    photos: 0,
  });
  const [recentEnrollments, setRecentEnrollments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/admin');
        return;
      }
      setUser(user);

      // Count stats in parallel
      const [
        { count: students },
        { count: courses },
        { count: enrollments },
        { count: posts },
        { count: lessons },
        { count: photos },
      ] = await Promise.all([
        supabase.from('enrollments').select('*', { count: 'exact', head: true }).then(r => ({ count: null })), // placeholder, we count unique below
        supabase.from('courses').select('*', { count: 'exact', head: true }),
        supabase.from('enrollments').select('*', { count: 'exact', head: true }),
        supabase.from('posts').select('*', { count: 'exact', head: true }),
        supabase.from('lessons').select('*', { count: 'exact', head: true }),
        supabase.from('album_photos').select('*', { count: 'exact', head: true }),
      ]);

      // Unique students — distinct user_id count
      const { data: enrollData } = await supabase
        .from('enrollments')
        .select('user_id');
      const uniqueStudents = new Set((enrollData || []).map(e => e.user_id)).size;

      setStats({
        students: uniqueStudents,
        courses: courses || 0,
        enrollments: enrollments || 0,
        posts: posts || 0,
        lessons: lessons || 0,
        photos: photos || 0,
      });

      // Recent enrollments (last 5)
      const { data: recent } = await supabase
        .from('enrollments')
        .select(`
          id,
          enrolled_at,
          user_id,
          courses:courses(name)
        `)
        .order('enrolled_at', { ascending: false })
        .limit(5);

      // Fetch user emails for these
      if (recent && recent.length > 0) {
        const userIds = [...new Set(recent.map(r => r.user_id))];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, email, full_name')
          .in('id', userIds);

        const profileMap = {};
        (profiles || []).forEach(p => { profileMap[p.id] = p; });

        const enriched = recent.map(r => ({
          ...r,
          user: profileMap[r.user_id] || null,
        }));
        setRecentEnrollments(enriched);
      }

      setLoading(false);
    };

    checkAuthAndLoad();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  if (loading) {
    return <div className="admin-dashboard-loading">Loading...</div>;
  }

  const sections = [
    { label: 'Blog Posts', path: '/admin/posts', icon: '📝' },
    { label: 'Courses', path: '/admin/courses', icon: '🎓' },
    { label: 'Photos', path: '/admin/photos', icon: '📷' },
    { label: 'Videos', path: '/admin/videos', icon: '🎥' },
    { label: 'Flyers', path: '/admin/flyers', icon: '📄' },
    { label: 'Jobs', path: '/admin/jobs', icon: '💼' },
    { label: 'Opportunities', path: '/admin/opportunities', icon: '🌟' },
    { label: 'Talent', path: '/admin/talent', icon: '🧑‍💼' },
    { label: 'Instructors', path: '/admin/instructors', icon: '👨‍🏫' },
    { label: 'Enrollments', path: '/admin/enrollments', icon: '📋' },
    { label: 'Testimonials', path: '/admin/testimonials', icon: '💬' },
  ];

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-user">
          <span>{user?.email}</span>
          <button onClick={handleLogout}>Log out</button>
        </div>
      </header>

      {/* STATS */}
      <section className="admin-stats">
        <div className="admin-stat-card">
          <span className="admin-stat-icon">👥</span>
          <div>
            <h3>{stats.students}</h3>
            <p>Students Enrolled</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-icon">📚</span>
          <div>
            <h3>{stats.courses}</h3>
            <p>Courses</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-icon">📋</span>
          <div>
            <h3>{stats.enrollments}</h3>
            <p>Total Enrollments</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-icon">✍️</span>
          <div>
            <h3>{stats.posts}</h3>
            <p>Blog Posts</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-icon">📖</span>
          <div>
            <h3>{stats.lessons}</h3>
            <p>Lessons</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-icon">🖼</span>
          <div>
            <h3>{stats.photos}</h3>
            <p>Album Photos</p>
          </div>
        </div>
      </section>

      {/* RECENT ENROLLMENTS */}
      {recentEnrollments.length > 0 && (
        <section className="admin-recent">
          <h2>Recent Enrollments</h2>
          <div className="admin-recent-list">
            {recentEnrollments.map(enr => (
              <div key={enr.id} className="admin-recent-item">
                <div className="admin-recent-dot" />
                <div className="admin-recent-text">
                  <strong>{enr.user?.full_name || enr.user?.email || 'A student'}</strong>
                  {' enrolled in '}
                  <strong>{enr.courses?.name || 'a course'}</strong>
                </div>
                <span className="admin-recent-time">
                  {new Date(enr.enrolled_at).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric'
                  })}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* NAVIGATION CARDS */}
      <h2 className="admin-section-title">Manage Content</h2>
      <div className="admin-grid">
        {sections.map(s => (
          <Link to={s.path} key={s.path} className="admin-card">
            <span className="admin-icon">{s.icon}</span>
            <h3>{s.label}</h3>
            <span className="admin-manage">Manage →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;