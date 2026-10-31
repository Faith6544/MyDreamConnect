import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { supabase } from '../lib/supabase';
import './AdminInstructorApplications.css';

// same EmailJS account the scholarship page uses. the template is a new one, see the setup note
const EMAIL_SERVICE_ID = 'service_i93rqqa';
const EMAIL_TEMPLATE_ID = 'template_instructor'; // <- create this template in EmailJS and put its real id here
const EMAIL_PUBLIC_KEY = 'iyczG5moSdTXjFTOx';

const TABS = ['pending', 'approved', 'declined'];

export default function AdminInstructorApplications() {
  const [apps, setApps] = useState([]);
  const [tab, setTab] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [docLinks, setDocLinks] = useState({}); // application id -> [{ name, url }]
  const [notice, setNotice] = useState(null); // { text, link } shown when an email could not be sent

  const load = async () => {
    const { data, error } = await supabase
      .from('instructor_applications')
      .select('*, courses(name)')
      .order('created_at', { ascending: false });

    if (error) alert('Could not load applications: ' + error.message);
    setApps(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  // private files need a short-lived link
  const showDocuments = async (app) => {
    const links = [];
    for (const path of app.document_paths || []) {
      const { data } = await supabase.storage.from('instructor-documents').createSignedUrl(path, 600);
      if (data?.signedUrl) links.push({ name: path.split('/').pop().replace(/^\d+-/, ''), url: data.signedUrl });
    }
    setDocLinks((prev) => ({ ...prev, [app.id]: links }));
  };

  const sendEmail = async (app, params) => {
    await emailjs.send(
      EMAIL_SERVICE_ID,
      EMAIL_TEMPLATE_ID,
      { to_name: app.full_name, to_email: app.email, course_name: app.courses?.name || 'a MyDreamConnect course', ...params },
      { publicKey: EMAIL_PUBLIC_KEY }
    );
  };

  const decide = async (app, status) => {
    let note = '';
    if (status === 'declined') {
      note = window.prompt('Optional message to the applicant (why it was not accepted):', '') || '';
    } else if (!window.confirm(`Approve ${app.full_name} to teach ${app.courses?.name}? An email with a confirmation link will be sent.`)) {
      return;
    }

    setBusyId(app.id);
    setNotice(null);

    const { error } = await supabase
      .from('instructor_applications')
      .update({ status, admin_note: note || null, reviewed_at: new Date().toISOString() })
      .eq('id', app.id);

    if (error) {
      alert('Could not save the decision: ' + error.message);
      setBusyId(null);
      return;
    }

    const confirmLink = `${window.location.origin}/instructor/confirm/${app.token}`;
    const approved = status === 'approved';

    try {
      await sendEmail(app, approved
        ? {
            subject_line: 'You have been approved to teach on MyDreamConnect',
            message: 'Congratulations! Your application was approved. Click the button below to confirm. You will then have full access to the course, with no payment needed.',
            action_text: 'Confirm and open my course',
            action_link: confirmLink,
          }
        : {
            subject_line: 'Update on your MyDreamConnect instructor application',
            message: `Thank you for applying. After review, we are not able to accept this application right now.${note ? ' ' + note : ''} You are welcome to apply again in future.`,
            action_text: 'Visit MyDreamConnect',
            action_link: window.location.origin,
          });
    } catch (err) {
      console.error('EmailJS error:', err);
      // the decision is saved, so give the admin the link to send by hand
      setNotice({
        text: `The decision was saved, but the email to ${app.email} did not send. ${approved ? 'Send them this confirmation link yourself:' : ''}`,
        link: approved ? confirmLink : '',
      });
    }

    await load();
    setBusyId(null);
  };

  const shown = apps.filter((a) => a.status === tab);

  if (loading) return <div className="aia-loading">Loading applications...</div>;

  return (
    <div className="aia-page">
      <Link to="/admin" className="aia-back">← Dashboard</Link>
      <h1>Instructor Applications</h1>

      {notice && (
        <div className="aia-notice">
          <p>{notice.text}</p>
          {notice.link && <input readOnly value={notice.link} onFocus={(e) => e.target.select()} />}
        </div>
      )}

      <div className="aia-tabs">
        {TABS.map((t) => (
          <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>
            {t[0].toUpperCase() + t.slice(1)} ({apps.filter((a) => a.status === t).length})
          </button>
        ))}
      </div>

      {shown.length === 0 && <p className="aia-empty">Nothing here.</p>}

      {shown.map((app) => (
        <article className="aia-card" key={app.id}>
          <header>
            <div>
              <h2>{app.full_name}</h2>
              <p className="aia-course">for {app.courses?.name || 'a course'}</p>
            </div>
            <span className={`aia-badge ${app.status}`}>{app.status}</span>
          </header>

          <dl>
            <dt>Email</dt><dd>{app.email}</dd>
            <dt>Phone</dt><dd>{app.phone || '-'}</dd>
            <dt>Qualifications</dt><dd>{app.qualifications || '-'}</dd>
            <dt>Experience</dt><dd>{app.experience || '-'}</dd>
            <dt>Why this course</dt><dd>{app.motivation || '-'}</dd>
            {app.profile_link && (
              <>
                <dt>Profile link</dt>
                <dd><a href={/^https?:\/\//i.test(app.profile_link) ? app.profile_link : `https://${app.profile_link}`} target="_blank" rel="noopener noreferrer">{app.profile_link}</a></dd>
              </>
            )}
            <dt>Applied</dt><dd>{new Date(app.created_at).toLocaleString()}</dd>
            {app.confirmed_at && (<><dt>Confirmed</dt><dd>{new Date(app.confirmed_at).toLocaleString()}</dd></>)}
            {app.admin_note && (<><dt>Your note</dt><dd>{app.admin_note}</dd></>)}
          </dl>

          <div className="aia-docs">
            {docLinks[app.id] ? (
              docLinks[app.id].length ? docLinks[app.id].map((d) => (
                <a key={d.url} href={d.url} target="_blank" rel="noopener noreferrer">📄 {d.name}</a>
              )) : <span>No documents found.</span>
            ) : (
              <button onClick={() => showDocuments(app)}>View documents ({(app.document_paths || []).length})</button>
            )}
          </div>

          {app.status === 'pending' && (
            <div className="aia-actions">
              <button className="approve" disabled={busyId === app.id} onClick={() => decide(app, 'approved')}>
                {busyId === app.id ? 'Working...' : 'Approve and email'}
              </button>
              <button className="decline" disabled={busyId === app.id} onClick={() => decide(app, 'declined')}>
                Decline
              </button>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
