import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const ALLOWED = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const MAX_FILES = 5;
const MAX_MB = 5;

// uploads private documents (CV, certificates) into the instructor-documents bucket, inside the person's own folder
export default function DocumentUpload({ userId, files, onChange, disabled }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  const handlePick = async (e) => {
    const picked = Array.from(e.target.files || []);
    e.target.value = ''; // so the same file can be picked again
    if (picked.length === 0) return;

    setMessage('');
    if (files.length + picked.length > MAX_FILES) {
      setMessage(`You can attach up to ${MAX_FILES} files.`);
      return;
    }

    setBusy(true);
    const added = [];
    for (const file of picked) {
      if (!ALLOWED.includes(file.type)) {
        setMessage(`${file.name} is not allowed. Use PDF, Word, JPG or PNG.`);
        continue;
      }
      if (file.size > MAX_MB * 1024 * 1024) {
        setMessage(`${file.name} is bigger than ${MAX_MB} MB.`);
        continue;
      }

      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_'); // no spaces or odd characters in the path
      const path = `${userId}/${Date.now()}-${safeName}`;
      const { error } = await supabase.storage.from('instructor-documents').upload(path, file);

      if (error) setMessage(`Could not upload ${file.name}: ${error.message}`);
      else added.push({ name: file.name, path });
    }
    setBusy(false);
    if (added.length) onChange([...files, ...added]);
  };

  const remove = (path) => onChange(files.filter((f) => f.path !== path));

  return (
    <div className="ia-docs">
      <label className="ia-docs-pick">
        <input type="file" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={handlePick} disabled={disabled || busy} hidden />
        {busy ? 'Uploading...' : '＋ Choose files'}
      </label>
      <small className="ia-hint">PDF, Word, JPG or PNG. Up to {MAX_FILES} files, {MAX_MB} MB each. Only our review team can see them.</small>

      {message && <p className="ia-error">{message}</p>}

      {files.length > 0 && (
        <ul className="ia-doc-list">
          {files.map((f) => (
            <li key={f.path}>
              <span>📄 {f.name}</span>
              <button type="button" onClick={() => remove(f.path)} disabled={disabled} aria-label={`Remove ${f.name}`}>✕</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
