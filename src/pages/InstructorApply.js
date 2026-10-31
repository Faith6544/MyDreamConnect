import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import DocumentUpload from '../components/DocumentUpload';
import './InstructorApply.css';

export default function InstructorApply() {
  const { id } = useParams(); // the course id
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [existing, setExisting] = useState(null); // the person's latest application for this course
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    full_name: user?.user_metadata?.full_name || '',
    phone: '',
    qualifications: '',
    experience: '',
    profile_link: '',
    motivation: '',
  });
  const [files, setFiles] = useState([]);


  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const { data: courseData } = await supabase.from('courses').select('id, name').eq('id', id).maybeSingle();
      const { data: apps } = await supabase
        .from('instructor_applications')
        .select('id, status, created_at')
        .eq('course_id', id)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (cancelled) return;
      setCourse(courseData || null);
      setExisting((apps || [])[0] || null);
      setLoading(false);
    };

    load();
    return () => { cancelled = true; };
  }, [id, user.id]);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (files.length === 0) {
      setError('Please attach at least one document, like your CV or a certificate.');
      return;
    }

    setSaving(true);
    const { error: insertError } = await supabase.from('instructor_applications').insert([{
      course_id: Number(id),
      user_id: user.id,
      full_name: form.full_name.trim(),
      email: user.email,
      phone: form.phone.trim(),
      qualifications: form.qualifications.trim(),
      experience: form.experience.trim(),
      profile_link: form.profile_link.trim() || null,
      motivation: form.motivation.trim(),
      document_paths: files.map((f) => f.path),
    }]);
    setSaving(false);

    if (insertError) {
      // 23505 = unique index: there is already an open application for this course
      setError(insertError.code === '23505'
        ? 'You already have an application for this course.'
        : 'Could not send your application: ' + insertError.message);
      return;
    }
    setDone(true);
  };

  if (loading) return <p className="ia-status">Loading...</p>;
  if (!course) {
    return (
      <div className="ia-status">
        <p>We could not find this course.</p>
        <Link to="/courses" className="ia-back">← All courses</Link>
      </div>
    );
  }

  // already applied, or just applied
  const open = done ? { status: 'pending' } : existing && existing.status !== 'declined' ? existing : null;
  if (open) {
    return (
      <div className="ia-page">
        <div className="ia-card ia-center">
          <div className="ia-big">{open.status === 'approved' ? '✅' : '📨'}</div>
          <h1>{open.status === 'approved' ? 'Your application was approved' : 'Application received'}</h1>
          <p>
            {open.status === 'approved'
              ? `Check your email (${user.email}) for the confirmation link to start teaching ${course.name}.`
              : `Thank you. Our team will review your application for ${course.name} and email you at ${user.email} with the result.`}
          </p>
          <Link to={`/courses/${course.id}`} className="ia-btn">Back to the course</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="ia-page">
      <div className="ia-card">
        <Link to={`/courses/${course.id}`} className="ia-back">← Back to the course</Link>
        <h1>Teach this course</h1>
        <p className="ia-course">{course.name}</p>
        <p className="ia-intro">
          Tell us about yourself and attach your documents. Our team reviews every application. If you are accepted,
          we email you a link. Once you open it, you can teach the course and open all its lessons for free.
        </p>

        {existing && existing.status === 'declined' && (
          <p className="ia-note">Your last application for this course was not accepted. You are welcome to apply again.</p>
        )}

        <form onSubmit={handleSubmit}>
          {error && <p className="ia-error">❌ {error}</p>}

          <label>Full name *
            <input name="full_name" value={form.full_name} onChange={handleChange} required disabled={saving} />
          </label>

          <label>Email
            <input value={user.email} disabled readOnly />
            <small className="ia-hint">The approval link goes to this email. Use the same account when you open it.</small>
          </label>

          <label>Phone number *
            <input name="phone" value={form.phone} onChange={handleChange} required disabled={saving} placeholder="+234..." />
          </label>

          <label>Qualifications *
            <textarea name="qualifications" value={form.qualifications} onChange={handleChange} required rows="3" disabled={saving} placeholder="Degrees, certificates, trainings..." />
          </label>

          <label>Teaching or work experience *
            <textarea name="experience" value={form.experience} onChange={handleChange} required rows="4" disabled={saving} placeholder="What have you taught or worked on, and for how long?" />
          </label>

          <label>LinkedIn or portfolio link
            <input name="profile_link" value={form.profile_link} onChange={handleChange} disabled={saving} placeholder="https://" />
          </label>

          <label>Why do you want to teach this course? *
            <textarea name="motivation" value={form.motivation} onChange={handleChange} required rows="4" disabled={saving} />
          </label>

          <div className="ia-field">
            <span className="ia-label">Documents * (CV, certificates, ID)</span>
            <DocumentUpload userId={user.id} files={files} onChange={setFiles} disabled={saving} />
          </div>

          <button type="submit" className="ia-btn" disabled={saving}>
            {saving ? 'Sending...' : 'Submit application'}
          </button>
        </form>
      </div>
    </div>
  );
}
