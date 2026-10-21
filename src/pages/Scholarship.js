import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './Scholarship.css';

export default function Scholarship() {
  const [searchParams] = useSearchParams();
  const initialCourseId = searchParams.get('course_id') || '';

  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({ 
    full_name: '', 
    email: '', 
    reason: '', 
    course_id: initialCourseId 
  });
  const [status, setStatus] = useState('idle');

  // Fetch courses in case they didn't come from a specific course page
  useEffect(() => {
    const fetchCourses = async () => {
      const { data } = await supabase.from('courses').select('id, name, price');
      setCourses(data || []);
    };
    if (!initialCourseId) {
      fetchCourses();
    }
  }, [initialCourseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.course_id) {
      alert("Please select a course.");
      return;
    }
    
    setStatus('submitting');

    const { error } = await supabase.from('scholarship_applications').insert([
      { 
        course_id: formData.course_id, 
        full_name: formData.full_name, 
        email: formData.email, 
        reason: formData.reason 
      }
    ]);

    if (error) {
      alert("Failed to submit application: " + error.message);
      setStatus('idle');
      return;
    }

    setStatus('success');
  };

  return (
    <div className="scholarship-page">
      <div className="scholarship-container">
        
        {status === 'success' ? (
          <div className="success-box">
            <div style={{ fontSize: '56px', marginBottom: '10px' }}>📩</div>
            <h2>Application Received!</h2>
            <p style={{ marginTop: '15px', fontSize: '16px', lineHeight: '1.6' }}>
              Thank you, <strong>{formData.full_name}</strong>. We have received your scholarship application.
            </p>
            <p style={{ color: '#666', fontSize: '14px', marginTop: '10px' }}>
              Our team is currently reviewing it. If you are eligible, you will receive an email within <strong>24 - 48 hours</strong> with a special link to claim your 80% discount.
            </p>
            
            <Link to="/courses" className="submit-btn" style={{ display: 'inline-block', marginTop: '25px', textDecoration: 'none' }}>
              Return to Courses
            </Link>
          </div>
        ) : (
          <>
            <h1>Apply for a Scholarship</h1>
            <p>MyDreamConnect offers an 80% scholarship to eligible applicants. Tell us why you need it.</p>

            <form onSubmit={handleSubmit} className="scholarship-form">
              
              {/* SHOW DROPDOWN ONLY IF NO COURSE WAS PRE-SELECTED */}
              {!initialCourseId && (
                <div className="form-group">
                  <label>Which course are you applying for?</label>
                  <select 
                    required
                    value={formData.course_id}
                    onChange={(e) => setFormData({...formData, course_id: e.target.value})}
                    style={{ padding: '12px 16px', border: '1px solid #ddd', borderRadius: '8px', fontFamily: 'inherit' }}
                  >
                    <option value="">-- Select a Course --</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.name} (₦{c.price?.toLocaleString() || 0})</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  required 
                  value={formData.full_name} 
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})} 
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  required 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                />
              </div>
              <div className="form-group">
                <label>Why do you need this scholarship?</label>
                <textarea 
                  required 
                  rows="5"
                  value={formData.reason} 
                  onChange={(e) => setFormData({...formData, reason: e.target.value})} 
                />
              </div>
              <button type="submit" disabled={status === 'submitting'} className="submit-btn">
                {status === 'submitting' ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}