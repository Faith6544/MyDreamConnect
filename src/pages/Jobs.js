import React, { useState, useEffect } from 'react';
import './Jobs.css';
import ImageWithFallback from '../components/ImageWithFallback';
import { supabase } from '../lib/supabase';

const APPLY_EMAIL = 'info@mydreamconnect.org.ng';

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
      <div className="jobs-container">

        <h1 className="jobs-title">Job Openings</h1>

        <p className="jobs-intro-text">
          Explore current opportunities and join our team to make a difference.
        </p>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '40px' }}>Loading...</p>
        ) : jobs.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '40px' }}>No jobs yet.</p>
        ) : (
          <div className="jobs-grid">
            {jobs.map(job => (
              // There is no /jobs/:id route and the table holds no extra detail
              // fields, so the card shows everything it has instead of linking
              // to a page that does not exist.
              <article className="job-card" key={job.id}>
                <div className="job-image">
                  <ImageWithFallback src={job.image_url} alt={job.title || 'Job'} />
                </div>
                <div className="job-content">
                  <span className="job-date">
                    {job.created_at
                      ? new Date(job.created_at).toLocaleDateString('en-US', {
                          month: 'long', day: 'numeric', year: 'numeric',
                        })
                      : ''}
                  </span>
                  <h3 className="job-title">{job.title}</h3>
                  <p className="job-excerpt">{job.description}</p>

                  <a
                    className="job-apply-btn"
                    href={`mailto:${APPLY_EMAIL}?subject=${encodeURIComponent(`Application: ${job.title}`)}`}
                  >
                    Apply →
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Jobs;
