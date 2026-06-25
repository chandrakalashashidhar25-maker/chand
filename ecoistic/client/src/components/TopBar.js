import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const TopBar = ({ showTitle = true }) => {
  const { sidebarOpen, setSidebarOpen } = useApp();

  return (
    <div className="topbar">
      <button
        className="hamburger-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle Menu"
      >
        <span />
        <span />
        <span />
      </button>

      <Link to="/" className="topbar-logo">
        <span className="topbar-logo-icon">🌱</span>
        <span className="topbar-logo-text">ECOISTIC</span>
      </Link>

      {showTitle && (
        <div className="topbar-title">
          ECOISTIC FRIENDLY <span>🌿</span>
        </div>
      )}
    </div>
  );
};

export default TopBar;
