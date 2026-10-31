import React from 'react';
import { Link } from 'react-router-dom';
import ImageWithFallback from './ImageWithFallback';
import './TeamGrid.css';

// round photos with the name and role underneath, no boxes. the whole thing is one link to the person's profile
export default function TeamGrid({ members = [] }) {
  return (
    <ul className="tg-grid">
      {members.map((m) => (
        <li key={m.id} className="tg-item">
          <Link to={`/team/${m.id}`} className="tg-link" aria-label={`View ${m.name}'s profile`}>
            <span className="tg-photo">
              <ImageWithFallback src={m.image_url} alt={m.name} type="human" />
            </span>
            <span className="tg-name">{m.name}</span>
            <span className="tg-role">{m.role}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
