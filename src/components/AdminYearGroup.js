import React from 'react';

export default function AdminYearGroup({ items, dateField = 'created_at', renderItem }) {
  // 1. Group items by Year and Month
  const grouped = items.reduce((acc, item) => {
    const dateString = item[dateField];
    if (!dateString) {
      if (!acc['Undated']) acc['Undated'] = {};
      if (!acc['Undated']['Unknown']) acc['Undated']['Unknown'] = [];
      acc['Undated']['Unknown'].push(item);
      return acc;
    }

    const d = new Date(dateString);
    const year = d.getFullYear();
    const month = d.toLocaleString('en-US', { month: 'long' });

    if (!acc[year]) acc[year] = {};
    if (!acc[year][month]) acc[year][month] = [];
    acc[year][month].push(item);
    return acc;
  }, {});

  // 2. Sort Years (Newest first)
  const sortedYears = Object.keys(grouped).sort((a, b) => {
    if (a === 'Undated') return 1;
    if (b === 'Undated') return -1;
    return Number(b) - Number(a);
  });

  return (
    <div className="admin-year-wrapper">
      {sortedYears.map(year => {
        // 3. Sort Months within the year (Newest first)
        const months = Object.keys(grouped[year]).sort((a, b) => {
          if (a === 'Unknown') return 1;
          if (b === 'Unknown') return -1;
          const dateA = new Date(`${a} 1, ${year}`);
          const dateB = new Date(`${b} 1, ${year}`);
          return dateB - dateA;
        });

        return (
          <div key={year} className="admin-year-section">
            <h2 className="admin-year-header">{year}</h2>
            {months.map(month => (
              <div key={month} className="admin-month-section">
                <h3 className="admin-month-header">{month}</h3>
                <div className="admin-items-list">
                  {/* This loops through the items and calls the renderItem function passed from the parent */}
                  {grouped[year][month].map(item => renderItem(item))}
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}