import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Sidebar = () => {
  const { sidebarOpen, setSidebarOpen } = useApp();
  const navigate = useNavigate();

  const close = () => setSidebarOpen(false);

  const handleUpload = () => {
    close();
    navigate('/upload');
  };

  return (
    <>
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
        onClick={close}
      />
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <span className="sidebar-logo-icon">🌱</span>
          <div className="sidebar-logo-text">
            <span>ECOISTIC</span>
            <span>GROW GREEN TOGETHER</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''} onClick={close}>
            <span className="nav-icon">🏠</span>
            Home
          </NavLink>
          <NavLink to="/history" className={({ isActive }) => isActive ? 'active' : ''} onClick={close}>
            <span className="nav-icon">🏆</span>
            Success History
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''} onClick={close}>
            <span className="nav-icon">🌿</span>
            About Us
          </NavLink>
          <button onClick={handleUpload}>
            <span className="nav-icon">📤</span>
            Upload
          </button>
          <NavLink to="/settings" className={({ isActive }) => isActive ? 'active' : ''} onClick={close}>
            <span className="nav-icon">⚙️</span>
            Settings
          </NavLink>
        </nav>

        <div className="sidebar-planter">
          <svg className="real-planter-svg" viewBox="0 0 220 210" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <ellipse cx="112" cy="184" rx="78" ry="13" fill="#081b12" opacity="0.35" />

            <path d="M74 170C90 151 122 144 151 153C169 159 182 171 187 182C150 196 94 193 51 179C56 175 64 172 74 170Z" fill="#4d2f1d" />
            <path d="M67 174C92 162 128 161 164 174C140 185 95 185 67 174Z" fill="#755037" />

            <path d="M145 166C144 142 150 122 161 101" stroke="#4fb979" strokeWidth="6" strokeLinecap="round" />
            <path d="M146 146C132 136 123 123 117 106" stroke="#3f9f65" strokeWidth="4" strokeLinecap="round" />
            <path d="M151 136C168 125 179 112 188 95" stroke="#66ca8c" strokeWidth="4" strokeLinecap="round" />
            <path d="M116 103C101 99 91 105 87 118C103 126 116 119 123 107C121 105 119 104 116 103Z" fill="#72c76a" />
            <path d="M190 93C205 90 214 98 215 112C198 119 186 113 181 99C183 96 186 94 190 93Z" fill="#9adc82" />
            <path d="M162 99C160 83 170 75 185 77C188 94 178 104 163 105C162 103 162 101 162 99Z" fill="#b8ee9b" />

            <circle cx="80" cy="69" r="22" fill="#f2c29d" />
            <path d="M58 68C59 49 76 39 94 47C105 52 108 63 101 78C92 70 77 68 58 68Z" fill="#2b2d33" />
            <circle cx="91" cy="70" r="2.2" fill="#263238" />
            <path d="M89 83C82 88 73 86 68 80" stroke="#8f5d43" strokeWidth="2.5" strokeLinecap="round" />

            <path d="M58 101C70 87 95 89 109 106C103 124 84 132 63 123C52 118 50 108 58 101Z" fill="#78bf58" />
            <path d="M63 105C75 98 91 99 105 110" stroke="#a3dc81" strokeWidth="4" strokeLinecap="round" opacity="0.75" />

            <path d="M67 126C60 139 54 153 47 176" stroke="#1f2f35" strokeWidth="14" strokeLinecap="round" />
            <path d="M101 123C114 136 126 150 139 170" stroke="#1f2f35" strokeWidth="14" strokeLinecap="round" />
            <path d="M43 177H66" stroke="#90c96f" strokeWidth="8" strokeLinecap="round" />
            <path d="M132 173H158" stroke="#90c96f" strokeWidth="8" strokeLinecap="round" />

            <path d="M104 121C117 132 128 141 144 151" stroke="#f2c29d" strokeWidth="9" strokeLinecap="round" />
            <path d="M58 122C69 138 87 146 107 149" stroke="#f2c29d" strokeWidth="9" strokeLinecap="round" />
            <circle cx="145" cy="151" r="5" fill="#f2c29d" />
            <circle cx="108" cy="149" r="5" fill="#f2c29d" />
          </svg>
          <p>Every Plant<br />Makes a Difference 🌿</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
