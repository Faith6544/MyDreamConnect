import React, { useEffect, useState } from 'react';
import emailjs from '@emailjs/browser';
import { supabase } from '../lib/supabase';
import './AdminScholarships.css';

export default function AdminScholarships() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null); // Tracks ONLY the clicked student

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    const { data, error } = await supabase
      .from('scholarship_applications')
      .select('*, courses(name)')
      .order('created_at', { ascending: false });
    
    if (!error) setApplications(data || []);
    setLoading(false);
  };

  const handleApprove = async (app) => {
    setProcessingId(app.id); // Lock ONLY this specific card
    
    // 1. Update database status to approved
    await supabase
      .from('scholarship_applications')
      .update({ status: 'approved' })
      .eq('id', app.id);

    // 2. Generate the Magic Link
    const magicLink = `${window.location.origin}/courses/${app.course_id}?scholarship=approved_80`;

    // 3. Send Email directly to the student using EmailJS
    try {
      await emailjs.send(
        'service_i93rqqa',       // Your Service ID
        'template_u0bb4if',      // Your Template ID
        {
          to_name: app.full_name,
          to_email: app.email,
          course_name: app.courses?.name || 'MyDreamConnect Course',
          magic_link: magicLink,
        },
        { publicKey: 'iyczG5moSdTXjFTOx' } // <-- YOUR CORRECT PUBLIC KEY & FORMAT
      );

      alert(`Approved! Email sent successfully to ${app.email}`);
      fetchApps(); // Refresh list to show updated status
    } catch (err) {
      console.error("EmailJS Error:", err);
      alert('Approved, but the email failed to send. Check the F12 console.');
    } finally {
      setProcessingId(null); // Unlock the card when done
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