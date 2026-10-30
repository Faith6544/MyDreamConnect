import React from 'react';
import { Link } from 'react-router-dom';
import ImageWithFallback from './ImageWithFallback';
import PortfolioGallery from './PortfolioGallery';
import { parseSkills, parseImages } from '../lib/talentUtils';
import './TalentCard.css';

// the one talent card, used on /talent and on /talent/all so they always show the same thing
export default function TalentCard({ talent }) {
  const images = parseImages(talent.portfolio_images);
  const skills = parseSkills(talent.skills);

  return (
    <article className="tc-card">
      <div className="tc-header">
        <div className="tc-profile">
          <div className="tc-avatar">
            <ImageWithFallback src={talent.avatar_url} alt={talent.name || 'Anonymous'} type="human" />
          </div>
          <div className="tc-names">
            <h3 className="tc-name">{talent.name || 'Anonymous User'}</h3>
            <span className="tc-role">{talent.role || 'Talent'}</span>
          </div>
        </div>
        <Link to={`/talent/${talent.id}`} className="tc-view-btn">
          View Profile
        </Link>
      </div>

      {(talent.location || talent.availability) && (
        <div className="tc-meta">
          {talent.location && <span>📍 {talent.location}</span>}
          {talent.availability && <span className="tc-availability">● {talent.availability}</span>}
        </div>
      )}

      <PortfolioGallery images={images} name={talent.name} />

      {skills.length > 0 && (
        <div className="tc-skills">
          {skills.slice(0, 4).map((s) => (
            <span className="tc-skill" key={s}>{s}</span>
          ))}
        </div>
      )}
    </article>
  );
}
