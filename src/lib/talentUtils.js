// one place for the talent helpers, so every page reads the data the same way

// skills can come back as an array or as a messy string like '["React","Node"]'
export function parseSkills(raw) {
  if (Array.isArray(raw)) return raw.filter(Boolean);
  if (typeof raw === 'string' && raw.trim()) {
    return raw
      .replace(/[[\]"]/g, '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

// portfolio_images is saved as an array of urls, but this also copes with a json string or comma list
export function parseImages(raw) {
  if (Array.isArray(raw)) return raw.filter((u) => typeof u === 'string' && u.trim() !== '');
  if (typeof raw === 'string' && raw.trim()) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parseImages(parsed);
    } catch (e) {
      // not json, fall through to the comma split
    }
    return raw.split(',').map((u) => u.trim()).filter(Boolean);
  }
  return [];
}
