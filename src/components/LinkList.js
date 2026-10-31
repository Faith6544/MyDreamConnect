import React from 'react';
import { parseLinks } from '../lib/talentUtils';
import './LinkList.css';

// public side: every link opens in a new tab
export default function LinkList({ links }) {
  const list = parseLinks(links);
  if (list.length === 0) return null;

  return (
    <ul className="ll-list">
      {list.map((link) => (
        <li key={link.url}>
          <a href={link.url} target="_blank" rel="noopener noreferrer" className="ll-link">
            <span className="ll-label">{link.label}</span>
            <span className="ll-arrow" aria-hidden="true">↗</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
