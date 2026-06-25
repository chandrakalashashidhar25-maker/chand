import React, { useState } from 'react';
import TopBar from '../components/TopBar';
import { useApp } from '../context/AppContext';

const ToggleSwitch = ({ checked, onChange }) => (
  <label className="toggle-switch">
    <input type="checkbox" checked={checked} onChange={onChange} />
    <span className="toggle-slider" />
  </label>
);

const SettingsPage = () => {
  const { darkMode, setDarkMode, showToast } = useApp();
  const [settings, setSettings] = useState({
    notifications: true,
    autoPlay: true,
    showDates: true,
    compactView: false,
    animation: true,
    soundEffects: false,
    autoCarousel: true,
    highContrast: false,
    largeText: false,
  });

  const toggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    showToast('Setting updated ✓');
  };

  return (
    <>
      <TopBar showTitle={false} />
      <div className="page-container">
        <div className="about-hero">
          <h1>⚙️ Settings</h1>
          <p>Customize your Ecoistic Friendly experience.</p>
        </div>

        {/* Appearance */}
        <div className="settings-section">
          <h2>🎨 Appearance</h2>
          <div className="settings-item">
            <div className="settings-item-left">
              <span className="settings-item-label">🌙 Dark Mode</span>
              <span className="settings-item-desc">Switch to dark theme for low-light use</span>
            </div>
            <ToggleSwitch checked={darkMode} onChange={() => { setDarkMode(!darkMode); showToast(darkMode ? 'Light mode enabled' : 'Dark mode enabled'); }} />
          </div>
          <div className="settings-item">
            <div className="settings-item-left">
              <span className="settings-item-label">🔤 Large Text</span>
              <span className="settings-item-desc">Increase text size for better readability</span>
            </div>
            <ToggleSwitch checked={settings.largeText} onChange={() => toggle('largeText')} />
          </div>
          <div className="settings-item">
            <div className="settings-item-left">
              <span className="settings-item-label">⚡ High Contrast</span>
              <span className="settings-item-desc">Enhance color contrast for visibility</span>
            </div>
            <ToggleSwitch checked={settings.highContrast} onChange={() => toggle('highContrast')} />
          </div>
          <div className="settings-item">
            <div className="settings-item-left">
              <span className="settings-item-label">🍃 Animations</span>
              <span className="settings-item-desc">Enable floating leaves and transitions</span>
            </div>
            <ToggleSwitch checked={settings.animation} onChange={() => toggle('animation')} />
          </div>
          <div className="settings-item">
            <div className="settings-item-left">
              <span className="settings-item-label">📦 Compact View</span>
              <span className="settings-item-desc">Show more plants in less space</span>
            </div>
            <ToggleSwitch checked={settings.compactView} onChange={() => toggle('compactView')} />
          </div>
        </div>

        {/* Content */}
        <div className="settings-section">
          <h2>🌿 Content</h2>
          <div className="settings-item">
            <div className="settings-item-left">
              <span className="settings-item-label">▶️ Auto-Play Carousel</span>
              <span className="settings-item-desc">Automatically advance plant carousel</span>
            </div>
            <ToggleSwitch checked={settings.autoCarousel} onChange={() => toggle('autoCarousel')} />
          </div>
          <div className="settings-item">
            <div className="settings-item-left">
              <span className="settings-item-label">▶️ Auto-Play Videos</span>
              <span className="settings-item-desc">Automatically play video previews</span>
            </div>
            <ToggleSwitch checked={settings.autoPlay} onChange={() => toggle('autoPlay')} />
          </div>
          <div className="settings-item">
            <div className="settings-item-left">
              <span className="settings-item-label">📅 Show Dates</span>
              <span className="settings-item-desc">Display planting dates on cards</span>
            </div>
            <ToggleSwitch checked={settings.showDates} onChange={() => toggle('showDates')} />
          </div>
        </div>

        {/* Notifications */}
        <div className="settings-section">
          <h2>🔔 Notifications</h2>
          <div className="settings-item">
            <div className="settings-item-left">
              <span className="settings-item-label">🔔 Push Notifications</span>
              <span className="settings-item-desc">Get alerts for new plant uploads</span>
            </div>
            <ToggleSwitch checked={settings.notifications} onChange={() => toggle('notifications')} />
          </div>
          <div className="settings-item">
            <div className="settings-item-left">
              <span className="settings-item-label">🔊 Sound Effects</span>
              <span className="settings-item-desc">Play sounds on interactions</span>
            </div>
            <ToggleSwitch checked={settings.soundEffects} onChange={() => toggle('soundEffects')} />
          </div>
        </div>

        {/* About App */}
        <div className="settings-section">
          <h2>ℹ️ About App</h2>
          <div className="settings-item">
            <div className="settings-item-left">
              <span className="settings-item-label">📱 App Version</span>
              <span className="settings-item-desc">Ecoistic Friendly v1.0.0</span>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--green-accent)', fontWeight: 600 }}>v1.0.0</span>
          </div>
          <div className="settings-item">
            <div className="settings-item-left">
              <span className="settings-item-label">💻 Tech Stack</span>
              <span className="settings-item-desc">MongoDB · Express · React · Node.js</span>
            </div>
            <span style={{ fontSize: '1rem' }}>🛠️</span>
          </div>
          <div className="settings-item">
            <div className="settings-item-left">
              <span className="settings-item-label">🌐 Platform</span>
              <span className="settings-item-desc">Mobile-first web application</span>
            </div>
            <span style={{ fontSize: '1rem' }}>📱</span>
          </div>
        </div>

        {/* Storage */}
        <div className="settings-section">
          <h2>💾 Storage</h2>
          <div className="settings-item">
            <div className="settings-item-left">
              <span className="settings-item-label">🗂️ Media Storage</span>
              <span className="settings-item-desc">Photos and videos stored on server</span>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--green-accent)' }}>Local</span>
          </div>
          <div className="settings-item">
            <div className="settings-item-left">
              <span className="settings-item-label">🔒 Admin Password</span>
              <span className="settings-item-desc">Protected upload and edit access</span>
            </div>
            <span style={{ fontSize: '1rem' }}>🔑</span>
          </div>
        </div>

        <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-light)', fontSize: '0.8rem' }}>
          Made with 💚 for a Greener Tomorrow
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
