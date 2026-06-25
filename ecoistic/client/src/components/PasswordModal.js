import React, { useState } from 'react';

const HARDCODED_PASSWORD = '123456';

const PasswordModal = ({ onSuccess, onClose, title = 'Enter Password' }) => {
  const [pwd, setPwd] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pwd === HARDCODED_PASSWORD) {
      onSuccess();
    } else {
      setError('Incorrect password. Please try again.');
      setPwd('');
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <h2>🔒 {title}</h2>
        <p>Enter the admin password to continue.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="password-input-wrapper">
              <input
                type={show ? 'text' : 'password'}
                className="form-input"
                placeholder="Enter password"
                value={pwd}
                onChange={e => { setPwd(e.target.value); setError(''); }}
                autoFocus
              />
              <button type="button" className="password-toggle" onClick={() => setShow(!show)}>
                {show ? '🙈' : '👁️'}
              </button>
            </div>
            {error && <div className="error-msg">⚠️ {error}</div>}
          </div>
          <div className="btn-row">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ flex: 1 }}>Confirm</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;
