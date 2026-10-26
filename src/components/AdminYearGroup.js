import React from 'react';

export default function AdminYearGroup({ items, dateField = 'created_at', renderItem, children }) {
  // 1. Group the items by year
  const grouped = items.reduce((acc, item) => {
    const dateString = item[dateField];
    const year = dateString ? new Date(dateString).getFullYear() : 'Undated';
    
    if (!acc[year]) acc[year] = [];
    acc[year].push(item);
    return acc;
  }, {});

  // 2. Sort the years descending (2026 before 2025)
  const sortedYears = Object.keys(grouped).sort((a, b) => {
    if (a === 'Undated') return 1;
    if (b === 'Undated') return -1;
    return Number(b) - Number(a);
  });

  return (
    <div className="admin-year-wrapper">
      {sortedYears.map(year => (
        <div key={year} className="admin-year-section">
          <h2 className="admin-year-header">{year}</h2>
          
          <div className="admin-year-content">
            {/* If it's a table, render the headers once per year */}
            {children && children}
            
            {/* Render the items */}
            {grouped[year].map(item => renderItem(item))}
          </div>
        </div>
      ))}
    </div>
  );
}