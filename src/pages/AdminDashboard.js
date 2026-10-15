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
  });
  const [recentEnrollments, setRecentEnrollments] = useState([]);
  const [recentActivity, setRecentActivity] = useState({
    messages: [],
    volunteers: [],
    partnerships: [],
    enrollments: [],
    subscribers: [],
  });
  const [newCounts, setNewCounts] = useState({
    messages: 0,
    volunteers: 0,
    partnerships: 0,
    enrollments: 0,
    subscribers: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/admin');
        return;
      }
      setUser(user);

      // -------- Counts --------
      const [
        { count: courses },
        { count: enrollments },
        { count: posts },
        { count: lessons },
      ] = await Promise.all([
        supabase.from('courses').select('*', { count: 'exact', head: true }),
        supabase.from('enrollments').select('*', { count: 'exact', head: true }),
        supabase.from('posts').select('*', { count: 'exact', head: true }),
        supabase.from('lessons').select('*', { count: 'exact', head: true }),
      ]);

      // Unique students
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
      });

      // -------- Recent Enrollments (with names) --------
      const { data: recent } = await supabase
        .from('enrollments')
        .select('id, enrolled_at, user_id, course_id')
        .order('enrolled_at', { ascending: false })
        .limit(5);

      if (recent && recent.length > 0) {
        const courseIds = [...new Set(recent.map(r => r.course_id))];
        const { data: recentCourses } = await supabase
          .from('courses')
          .select('id, name')
          .in('id', courseIds);

        const courseMap = {};
        (recentCourses || []).forEach(c => { courseMap[c.id] = c; });

        const userIds = [...new Set(recent.map(r => r.user_id))];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, email, full_name')
          .in('id', userIds);

        const profileMap = {};
        (profiles || []).forEach(p => { profileMap[p.id] = p; });

        const enriched = recent.map(r => ({
          ...r,
          courses: courseMap[r.course_id] || null,
          user: profileMap[r.user_id] || null,
        }));

        setRecentEnrollments(enriched);
      }

      // -------- Recent Activity --------
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

      const [
        { data: recentMessages },
        { data: recentVolunteers },
        { data: recentPartnerships },
        { data: recentSubs },
        { count: newMessagesCount },
        { count: newVolunteersCount },
        { count: newPartnershipsCount },
        { count: newEnrollmentsCount },
        { count: newSubscribersCount },
      ] = await Promise.all([
        supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('volunteer_applications').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('partnership_enquiries').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('subscribers').select('*').order('subscribed_at', { ascending: false }).limit(5),
        supabase.from('contact_messages').select('*', { count: 'exact', head: true }).gte('created_at', yesterday),
        supabase.from('volunteer_applications').select('*', { count: 'exact', head: true }).gte('created_at', yesterday),
        supabase.from('partnership_enquiries').select('*', { count: 'exact', head: true }).gte('created_at', yesterday),
        supabase.from('enrollments').select('*', { count: 'exact', head: true }).gte('enrolled_at', yesterday),
        supabase.from('subscribers').select('*', { count: 'exact', head: true }).gte('subscribed_at', yesterday),
      ]);

      setRecentActivity({
        messages: recentMessages || [],
        volunteers: recentVolunteers || [],
        partnerships: recentPartnerships || [],
        enrollments: recent || [],
        subscribers: recentSubs || [],
      });

      setNewCounts({
        messages: newMessagesCount || 0,
        volunteers: newVolunteersCount || 0,
        partnerships: newPartnershipsCount || 0,
        enrollments: newEnrollmentsCount || 0,
        subscribers: newSubscribersCount || 0,
      });

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
    { label: 'Users', path: '/admin/users', icon: '👥' },
    { label: 'Blog Categories', path: '/admin/post-categories', icon: '🏷' },
    { label: 'Subscribers', path: '/admin/subscribers', icon: '📧' },
    { label: 'Categories', path: '/admin/categories', icon: '🏷' },
    { label: 'Contact Messages', path: '/admin/messages', icon: '📬' },
    { label: 'Partnerships', path: '/admin/partnerships', icon: '🤝' },
    { label: 'Blog Tags', path: '/admin/post-tags', icon: '🔖' },
    { label: 'Volunteers', path: '/admin/volunteers', icon: '🙋' },
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

      {/* RECENT ACTIVITY */}
      <section className="admin-activity">
        <h2 className="admin-activity-heading">Recent Activity</h2>

        <div className="admin-activity-grid">

          {/* Messages */}
          <div className="admin-activity-card">
            <div className="admin-activity-head">
              <span className="admin-activity-icon">📬</span>
              <h3>Contact Messages</h3>
              {newCounts.messages > 0 && (
                <span className="admin-activity-badge">{newCounts.messages} new</span>
              )}
            </div>
            {recentActivity.messages.length === 0 ? (
              <p className="admin-activity-empty">No messages yet.</p>
            ) : (
              <ul className="admin-activity-list">
                {recentActivity.messages.map(m => (
                  <li key={m.id}>
                    <strong>{m.name}</strong>
                    <span className="admin-activity-time">
                      {new Date(m.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <Link to="/admin/messages" className="admin-activity-more">View all →</Link>
          </div>

          {/* Volunteers */}
          <div className="admin-activity-card">
            <div className="admin-activity-head">
              <span className="admin-activity-icon">🙋</span>
              <h3>Volunteers</h3>
              {newCounts.volunteers > 0 && (
                <span className="admin-activity-badge">{newCounts.volunteers} new</span>
              )}
            </div>
            {recentActivity.volunteers.length === 0 ? (
              <p className="admin-activity-empty">No applications yet.</p>
            ) : (
              <ul className="admin-activity-list">
                {recentActivity.volunteers.map(v => (
                  <li key={v.id}>
                    <strong>{v.name}</strong>
                    <span className="admin-activity-time">
                      {new Date(v.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <Link to="/admin/volunteers" className="admin-activity-more">View all →</Link>
          </div>

          {/* Partnerships */}
          <div className="admin-activity-card">
            <div className="admin-activity-head">
              <span className="admin-activity-icon">🤝</span>
              <h3>Partnerships</h3>
              {newCounts.partnerships > 0 && (
                <span className="admin-activity-badge">{newCounts.partnerships} new</span>
              )}
            </div>
            {recentActivity.partnerships.length === 0 ? (
              <p className="admin-activity-empty">No enquiries yet.</p>
            ) : (
              <ul className="admin-activity-list">
                {recentActivity.partnerships.map(p => (
                  <li key={p.id}>
                    <strong>{p.org_name}</strong>
                    <span className="admin-activity-time">
                      {new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <Link to="/admin/partnerships" className="admin-activity-more">View all →</Link>
          </div>

          {/* Enrollments */}
          <div className="admin-activity-card">
            <div className="admin-activity-head">
              <span className="admin-activity-icon">📋</span>
              <h3>Enrollments</h3>
              {newCounts.enrollments > 0 && (
                <span className="admin-activity-badge">{newCounts.enrollments} new</span>
              )}
            </div>
            {recentActivity.enrollments.length === 0 ? (
              <p className="admin-activity-empty">No enrollments yet.</p>
            ) : (
              <ul className="admin-activity-list">
                {recentActivity.enrollments.map(e => (
                  <li key={e.id}>
                    <strong>New enrollment</strong>
                    <span className="admin-activity-time">
                      {new Date(e.enrolled_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <Link to="/admin/enrollments" className="admin-activity-more">View all →</Link>
          </div>

          {/* Subscribers */}
          <div className="admin-activity-card">
            <div className="admin-activity-head">
              <span className="admin-activity-icon">📧</span>
              <h3>Subscribers</h3>
              {newCounts.subscribers > 0 && (
                <span className="admin-activity-badge">{newCounts.subscribers} new</span>
              )}
            </div>
            {recentActivity.subscribers.length === 0 ? (
              <p className="admin-activity-empty">No subscribers yet.</p>
            ) : (
              <ul className="admin-activity-list">
                {recentActivity.subscribers.map(s => (
                  <li key={s.id}>
                    <strong>{s.name || s.email}</strong>
                    <span className="admin-activity-time">
                      {new Date(s.subscribed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <Link to="/admin/subscribers" className="admin-activity-more">View all →</Link>
          </div>

        </div>
      </section>

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