import React, { useState } from 'react';
import './TalentMarketplace.css';

function TalentMarketplace() {
  const [activeTab, setActiveTab] = useState('jobs');

  // Jobs — placeholder data (will fetch from WordPress later)
  const jobs = [
    {
      id: 1,
      title: 'Frontend Developer',
      company: 'TechCorp Nigeria',
      location: 'Lagos, Nigeria',
      type: 'Full-time',
      salary: '₦250,000 - ₦400,000',
      posted: '2 days ago',
      description: 'We are looking for a skilled Frontend Developer with experience in React and modern JavaScript.',
    },
    {
      id: 2,
      title: 'Digital Marketing Intern',
      company: 'MyDreamConnect',
      location: 'Remote',
      type: 'Internship',
      salary: '₦80,000 / month',
      posted: '1 week ago',
      description: 'Join our team as a Digital Marketing Intern and gain hands-on experience in social media and content marketing.',
    },
    {
      id: 3,
      title: 'Data Analyst',
      company: 'FinData Ltd',
      location: 'Abuja, Nigeria',
      type: 'Full-time',
      salary: '₦300,000 - ₦500,000',
      posted: '3 days ago',
      description: 'Looking for a Data Analyst with strong SQL and Excel skills to join our growing analytics team.',
    },
    {
      id: 4,
      title: 'UI/UX Designer',
      company: 'Pixel Studio',
      location: 'Lagos, Nigeria',
      type: 'Contract',
      salary: '₦200,000 - ₦350,000',
      posted: '5 days ago',
      description: 'We need a creative UI/UX Designer to design modern, user-friendly interfaces for our clients.',
    },
  ];

  // Opportunities — from the original site
  const opportunities = [
    {
      id: 1,
      title: 'Global Youth Action Fund 2026',
      org: 'Global Youth Action Network',
      deadline: 'March 31, 2026',
      category: 'Grant',
      description: 'Funding opportunity for youth-led projects that address community challenges.',
    },
    {
      id: 2,
      title: 'TechGirls Program 2026',
      org: 'U.S. Department of State',
      deadline: 'December 8, 2026',
      category: 'Exchange Program',
      description: 'A program for young women to develop their skills in technology and STEM fields.',
    },
    {
      id: 3,
      title: 'Google Africa Developer Scholarship',
      org: 'Google',
      deadline: 'April 15, 2026',
      category: 'Scholarship',
      description: 'Free online training and certification for African developers.',
    },
    {
      id: 4,
      title: 'YALI Regional Leadership Center',
      org: 'USAID',
      deadline: 'May 20, 2026',
      category: 'Leadership Program',
      description: 'Leadership training for young African leaders aged 18-35.',
    },
  ];

  return (
    <div className="tm-page">

      {/* Banner */}
      <section className="tm-banner">
        <h1>Talent Marketplace</h1>
        <p>Home / Talent Marketplace</p>
      </section>

      {/* Tabs */}
      <div className="tm-tabs">
        <button
          className={activeTab === 'jobs' ? 'tm-tab active' : 'tm-tab'}
          onClick={() => setActiveTab('jobs')}
        >
          Jobs
        </button>
        <button
          className={activeTab === 'opportunities' ? 'tm-tab active' : 'tm-tab'}
          onClick={() => setActiveTab('opportunities')}
        >
          Opportunities for Development
        </button>
      </div>

      {/* JOBS */}
      {activeTab === 'jobs' && (
        <section className="tm-section">
          <div className="tm-intro">
            <h2>Latest Job Openings</h2>
            <p>Discover exciting career opportunities from our partner organisations.</p>
          </div>

          <div className="jobs-list">
            {jobs.map(job => (
              <div className="job-card" key={job.id}>
                <div className="job-header">
                  <h3>{job.title}</h3>
                  <span className={`job-type ${job.type.toLowerCase().replace('-', '')}`}>
                    {job.type}
                  </span>
                </div>
                <div className="job-meta">
                  <span>🏢 {job.company}</span>
                  <span>📍 {job.location}</span>
                  <span>💰 {job.salary}</span>
                  <span>🕐 {job.posted}</span>
                </div>
                <p className="job-description">{job.description}</p>
                <a href="#" className="btn-apply">Apply Now →</a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* OPPORTUNITIES */}
      {activeTab === 'opportunities' && (
        <section className="tm-section">
          <div className="tm-intro">
            <h2>Opportunities for Development</h2>
            <p>Scholarships, grants, fellowships, and programs to help you grow.</p>
          </div>

          <div className="opps-grid">
            {opportunities.map(opp => (
              <div className="opp-card" key={opp.id}>
                <span className="opp-category">{opp.category}</span>
                <h3>{opp.title}</h3>
                <p className="opp-org">by {opp.org}</p>
                <p className="opp-desc">{opp.description}</p>
                <div className="opp-footer">
                  <span className="opp-deadline">⏰ Deadline: {opp.deadline}</span>
                  <a href="#" className="btn-learn">Learn More →</a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}

export default TalentMarketplace;