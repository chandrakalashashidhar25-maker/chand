import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import SplashScreen from './components/SplashScreen';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';
import HomePage from './pages/HomePage';
import HistoryPage from './pages/HistoryPage';
import AboutPage from './pages/AboutPage';
import UploadPage from './pages/UploadPage';
import SettingsPage from './pages/SettingsPage';
import './App.css';

const AppInner = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
      <Toast />
    </div>
  );
};

const App = () => {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <AppProvider>
      <BrowserRouter>
        {!splashDone ? (
          <SplashScreen onDone={() => setSplashDone(true)} />
        ) : (
          <AppInner />
        )}
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
