import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import './ImageUpload.css';

function ImageUpload({ value, onChange, label = 'Image' }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (e) => {
    const input = e.target;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      input.value = ''; // allow re-selecting the same file
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5 MB.');
      input.value = '';
      return;
    }

    setError('');
    setUploading(true);

    try {
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const path = `uploads/${filename}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(path, file, { cacheControl: '3600', upsert: false });

      if (uploadError) {
        setError('Upload failed: ' + uploadError.message);
        return;
      }

      const { data } = supabase.storage.from('images').getPublicUrl(path);
      onChange(data.publicUrl);
    } catch (err) {
      setError('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
      // Clearing the input lets the user pick the SAME file again; without
      // this the change event never fires and "Replace image" looks broken.
      input.value = '';
    }
  };

  return (
    <div className="img-upload">
      <label className="img-upload-label">{label}</label>

      {value && (
        <div className="img-upload-preview">
          <img src={value} alt="Preview" />
          <button
            type="button"
            className="img-upload-remove"
            onClick={() => onChange('')}
            disabled={uploading}
          >
            Remove
          </button>
        </div>
      )}

      <div className="img-upload-row">
        <label className="img-upload-btn">
          {uploading ? 'Uploading...' : value ? 'Replace image' : 'Choose file'}
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            disabled={uploading}
            style={{ display: 'none' }}
          />
        </label>

        <input
          type="text"
          className="img-upload-url"
          placeholder="...or paste an image URL"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={uploading}
        />
      </div>

      {error && <p className="img-upload-error">{error}</p>}
    </div>
  );
}

export default ImageUpload;