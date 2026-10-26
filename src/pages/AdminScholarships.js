import React, { useEffect, useState } from 'react';
import emailjs from '@emailjs/browser';
import { supabase } from '../lib/supabase';
import './AdminScholarships.css';

export default function AdminScholarships() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null); 

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    const { data, error } = await supabase
      .from('scholarship_applications')
      .select('*, courses(name)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to load scholarship applications:', error);
      alert('Failed to load applications: ' + error.message);
    }

    if (!error) setApplications(data || []);
    setLoading(false);
  };

  const handleApprove = async (app) => {
    setProcessingId(app.id);

    // 1. Update database status to approved
    const { error: updateError } = await supabase
      .from('scholarship_applications')
      .update({ status: 'approved' })
      .eq('id', app.id);

    // 🚨 CRITICAL CHECK: If the database blocked the update, stop here.
    if (updateError) {
      alert('Failed to update database: ' + updateError.message);
      setProcessingId(null);
      return;
    }

    // 2. Generate the Magic Link
    const magicLink = `${window.location.origin}/courses/${app.course_id}?scholarship=approved_80`;

    // 3. Send Email directly to the student using EmailJS
    try {
      await emailjs.send(
        'service_i93rqqa',       
        'template_u0bb4if',      
        {
          to_name: app.full_name,
          to_email: app.email,
          course_name: app.courses?.name || 'MyDreamConnect Course',
          magic_link: magicLink,
        },
        { publicKey: 'iyczG5moSdTXjFTOx' } 
      );

      alert(`Approved! Email sent successfully to ${app.email}`);
    } catch (err) {
      console.error("EmailJS Error:", err);
      alert('Database updated to approved, but the email failed to send.');
    } finally {
      await fetchApps(); // Refresh list to show updated status
      setProcessingId(null); 
    }
  };

  if (loading && applications.length === 0) {
    return <div className="admin-loading">Loading applications...</div>;
  }

  return (
    <div className="admin-scholarships">
      <h1>Scholarship Applications</h1>
      
      {applications.length === 0 ? (
        <p className="no-apps">No applications yet.</p>
      ) : (
        <div className="apps-grid">
          {applications.map(app => (
            <div className="app-card" key={app.id}>
              <div className="app-header">
                <h3>{app.full_name}</h3>
                <span className={`status-badge ${app.status}`}>{app.status.toUpperCase()}</span>
              </div>
              <p><strong>Email:</strong> {app.email}</p>
              <p><strong>Course:</strong> {app.courses?.name || 'Unknown'}</p>
              <p className="app-reason"><strong>Reason:</strong> {app.reason}</p>
              
              {app.status === 'pending' && (
                <button 
                  onClick={() => handleApprove(app)} 
                  className="approve-btn" 
                  disabled={processingId === app.id}
                >
                  {processingId === app.id ? 'Sending Email...' : 'Approve & Send Email'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}