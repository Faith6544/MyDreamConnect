import React, { useState, useEffect } from 'react';
import './Jobs.css';
import ImageWithFallback from '../components/ImageWithFallback';
import { supabase } from '../lib/supabase';

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Jobs fetch error:', error);
      } else {
        setJobs(data || []);
      }
      setLoading(false);
    };

    fetchJobs();
  }, []);

  return (
    <div className="jobs-page">
      <section className="jobs-banner">
        <h1>Job Openings</h1>
        <p>Home / Talent Marketplace / Jobs</p>
      </section>

      <section className="jobs-section">
        <h2 className="jobs-section-title">Job Openings Archive</h2>
        {loading ? (
          <p style={{ textAlign: 'center', padding: '40px' }}>Loading...</p>
        ) : jobs.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '40px' }}>No jobs yet.</p>
        ) : (
          <div className="jobs-grid">
            {jobs.map(job => (
              <div className="job-card" key={job.id}>
                <div className="job-image">
                  <ImageWithFallback src={job.image_url} alt={job.title} />
                </div>
                <div className="job-content">
                  <span className="job-date">
                    {new Date(job.created_at).toLocaleDateString('en-US', {
                      month: 'long', day: 'numeric', year: 'numeric'
                    })}
                  </span>
                  <h3 className="job-title">{job.title}</h3>
                  <p className="job-excerpt">{job.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Jobs;