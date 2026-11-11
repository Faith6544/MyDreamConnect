import React from 'react';
import './Toast.css';

/**
 * Friendly, subtle toast. Render it once at the bottom of a page and
 * drive it with the `useToast` hook:
 *
 *   const { toast, showToast } = useToast();
 *   showToast('Saved successfully!');
 *   ...
 *   <Toast toast={toast} onClose={() => showToast(null)} />
 */
function Toast({ toast, onClose }) {
  if (!toast) return null;

  return (
    <div className={`mdc-toast mdc-toast-${toast.type || 'success'}`} role="status" aria-live="polite">
      <span className="mdc-toast-icon">
        {toast.type === 'error' ? '⚠️' : '✓'}
      </span>
      <span className="mdc-toast-message">{toast.message}</span>
      <button className="mdc-toast-close" onClick={onClose} aria-label="Dismiss notification">
        ×
      </button>
    </div>
  );
}

export default Toast;
