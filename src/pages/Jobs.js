import React from 'react';
import './Jobs.css';

function Jobs() {
  // Real jobs from the WordPress staging site
  const jobs = [
    {
      id: 4112,
      title: 'Sales Officer Opportunities – Maritime Service Startup Company',
      image: 'https://mydreamconnect.org.ng/wp-content/uploads/2026/01/Marketers-job-opportunities.jpg',
      date: 'January 28, 2026',
      excerpt: 'Location: Onsite | Employment Type: Full-time | Reports To: MD/CEO. We are recruiting for a maritime startup company seeking committed, full-time sales personnel to join their growing team. This role is office-based…',
      url: 'https://mydreamconnect.org.ng/jobs/sales-officer-opportunities-maritime-service-startup-company/',
    },
    {
      id: 4106,
      title: 'Frontend & Backend Developers – Fintech Startup Opportunity',
      image: 'https://mydreamconnect.org.ng/wp-content/uploads/2026/01/web-app-developer.webp',
      date: 'January 28, 2026',
      excerpt: "Location: Remote/Hybrid | Engagement Type: Contract/Flexible | Reports To: Director, Product Development. We're building a fintech application and we're looking for young, passionate frontend and backend developers who are interested in joining us at an…",
      url: 'https://mydreamconnect.org.ng/jobs/frontend-backend-developers-fintech-startup-opportunity/',
    },
    {
      id: 4104,
      title: 'Social Media Manager',
      image: 'https://mydreamconnect.org.ng/wp-content/uploads/2026/01/Content-Creator-and-Social-Media-Officer.png',
      date: 'January 28, 2026',
      excerpt: 'Location: Onsite | Employment Type: Full-time | Reports To: Social Media Consultant. Role Overview: We are looking to recruit an experienced Social Media Manager with a strong track record of…',
      url: 'https://mydreamconnect.org.ng/jobs/social-media-manager/',
    },
    {
      id: 3959,
      title: "WE'RE HIRING!",
      image: 'https://mydreamconnect.org.ng/wp-content/uploads/2022/10/cropped-mdc-logo.png',
      date: 'August 1, 2025',
      excerpt: 'First Maritime Supplies Limited is seeking smart and reliable individuals to join its team! Secretary and Office Administrator (Female | Minimum Qualification: HND). Location: Office-based. Job Summary: Provide administrative support…',
      url: 'https://mydreamconnect.org.ng/jobs/were-hiring/',
    },
    {
      id: 3700,
      title: 'Business Development Manager Job Opening',
      image: 'https://mydreamconnect.org.ng/wp-content/uploads/2025/06/MyDreamConnect-Business-Development-Manager-1024x576.jpg',
      date: 'June 7, 2025',
      excerpt: 'Our client is a signage solutions company specializing in LED digital signs, outdoor and indoor signs, pylon signs, and cladding services, seeking qualified candidates for the Role of Business Development Manager…',
      url: 'https://mydreamconnect.org.ng/jobs/business-development-manager-job-opening/',
    },
    {
      id: 3350,
      title: 'Admin and Outreach Assistant',
      image: 'https://mydreamconnect.org.ng/wp-content/uploads/2025/03/adminoutreach-assistant.jpg',
      date: 'March 23, 2025',
      excerpt: 'Location: Lagos. Employment Type: Full-time. Reports To: CEO. Job Summary: We are seeking a dynamic and organized Admin and Outreach Assistant to support both administrative operations and community engagement efforts…',
      url: 'https://mydreamconnect.org.ng/jobs/admin-and-outreach-assistant/',
    },
    {
      id: 3273,
      title: '📢 Volunteer Opportunity: UI/UX Designer Needed!',
      image: 'https://mydreamconnect.org.ng/wp-content/uploads/2025/03/UI-UX-Volunteer-Designer-1024x640.jpg',
      date: 'March 4, 2025',
      excerpt: 'MyDreamConnect is looking for a volunteer UI/UX Designer to support our Tech Bootcamp and digital initiatives. If you’re passionate about creating user-friendly designs and want to make a social impact…',
      url: 'https://mydreamconnect.org.ng/jobs/volunteer-opportunity-ui-ux-designer-needed/',
    },
    {
      id: 3252,
      title: '📢 Call for Volunteer Instructors – MyDreamConnect TECH Bootcamp (Cohort 3)!',
      image: 'https://mydreamconnect.org.ng/wp-content/uploads/2025/02/dd-1024x576.jpg',
      date: 'March 2, 2025',
      excerpt: 'Are you passionate about sharing your tech knowledge and making a social impact? MyDreamConnect is seeking volunteer instructors for our upcoming Tech Bootcamp – Cohort 3, a free training program…',
      url: 'https://mydreamconnect.org.ng/jobs/call-for-volunteer-instructors-mydreamconnect-tech-bootcamp-cohort-3/',
    },
    {
      id: 3051,
      title: 'Executive Assistant at MVC Communications Ltd.',
      image: 'https://mydreamconnect.org.ng/wp-content/uploads/2025/02/secretaries-and-administrative-assistants-mvc.jpg',
      date: 'February 20, 2025',
      excerpt: "We're Hiring: Executive Assistant for MVC Communications Ltd. Are you an organized, detail-oriented professional with skills in event management, research and editing? Join our dynamic team…",
      url: 'https://mydreamconnect.org.ng/jobs/executive-assistant-mvc-communications/',
    },
    {
      id: 2975,
      title: 'Nonprofit Program Development Officer',
      image: 'https://mydreamconnect.org.ng/wp-content/uploads/2025/01/NonProfit-Programs-Development-Officer-Ogba-1024x556.jpg',
      date: 'January 17, 2025',
      excerpt: 'Job Description: Nonprofit Program Development. Summary: The Nonprofit Program Development Officer is responsible for designing, implementing, and managing programs within a nonprofit organization…',
      url: 'https://mydreamconnect.org.ng/jobs/nonprofit-program-development-officer/',
    },
  ];

  return (
    <div className="jobs-page">

      <section className="jobs-banner">
        <h1>Job Openings</h1>
        <p>Home / Talent Marketplace / Jobs</p>
      </section>

      <section className="jobs-section">
        <h2 className="jobs-section-title">Job Openings Archive</h2>

        <div className="jobs-grid">
          {jobs.map(job => (
            <a
              href={job.url}
              className="job-card"
              key={job.id}
              target="_blank"
              rel="noreferrer"
            >
              <div className="job-image">
                <img src={job.image} alt={job.title} />
              </div>
              <div className="job-content">
                <span className="job-date">{job.date}</span>
                <h3 className="job-title">{job.title}</h3>
                <p className="job-excerpt">{job.excerpt}</p>
              </div>
            </a>
          ))}
        </div>

        <div className="jobs-pagination">
          <span className="current">1</span>
          <a href="#">2</a>
          <a href="#" className="next">»</a>
        </div>
      </section>

    </div>
  );
}

export default Jobs;