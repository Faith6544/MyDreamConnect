import React, { useState } from 'react';
import './WhatsAppButton.css';

function WhatsAppButton() {
  const [open, setOpen] = useState(false);

  // Your WhatsApp number in international format (no +, no spaces)
  const phoneNumber = '2348128936463';

  // Preset message that will appear in WhatsApp
  const message = encodeURIComponent(
    'Hi MyDreamConnect! I would like to know more about your programs.'
  );

  const whatsappLink = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <div className="wa-wrapper">

      {/* Chat popup (only when open) */}
      {open && (
        <div className="wa-chatbox">
          <div className="wa-header">
            <div className="wa-header-info">
              <img
                src="https://mydreamconnect.org.ng/wp-content/uploads/2024/02/MyDreamConnect-58x58.jpg"
                alt=""
              />
              <div>
                <h4>MyDreamConnect</h4>
                <small>Typically replies in a few minutes</small>
              </div>
            </div>
            <button
              className="wa-close"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              ×
            </button>
          </div>

          <div className="wa-body">
            <div className="wa-bubble">
              Hello 👋<br />
              How can we be of help today?
            </div>
          </div>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="wa-start-btn"
          >
            Start Chat on WhatsApp
          </a>
        </div>
      )}

      {/* Floating button */}
      <button
        className={`wa-button ${open ? 'open' : ''}`}
        onClick={() => setOpen(!open)}
        aria-label="Open WhatsApp chat"
      >
        {open ? '×' : (
          <svg viewBox="0 0 24 24" width="28" height="28" fill="#fff">
            <path d="M20.52 3.48A11.94 11.94 0 0 0 12.05 0C5.5 0 .16 5.33.16 11.89c0 2.1.55 4.14 1.6 5.94L0 24l6.33-1.66a11.86 11.86 0 0 0 5.72 1.46h.01c6.55 0 11.89-5.33 11.89-11.89 0-3.18-1.24-6.16-3.43-8.43zM12.06 21.8h-.01a9.86 9.86 0 0 1-5.02-1.37l-.36-.22-3.75.98 1-3.66-.23-.38a9.85 9.85 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88a9.82 9.82 0 0 1 6.99 2.9 9.81 9.81 0 0 1 2.9 6.99c0 5.45-4.44 9.89-9.9 9.89zm5.42-7.4c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.47-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.92-2.19-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37s-1.04 1.01-1.04 2.47 1.06 2.86 1.21 3.06c.15.2 2.09 3.19 5.07 4.47.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.19-.57-.34z" />
          </svg>
        )}
      </button>

    </div>
  );
}

export default WhatsAppButton;