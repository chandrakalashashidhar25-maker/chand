import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import TopBar from '../components/TopBar';
import PasswordModal from '../components/PasswordModal';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import MediaViewer from '../components/MediaViewer';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const UploadPage = () => {
  const { showToast } = useApp();
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [showPwd, setShowPwd] = useState(true);
  const [form, setForm] = useState({ plantName: '', date: '', report: '' });
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [viewMedia, setViewMedia] = useState(null);
  const fileRef = useRef();

  useEffect(() => { setShowPwd(true); }, []);

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selected]);
    const newPreviews = selected.map(f => ({
      url: URL.createObjectURL(f),
      name: f.name,
      isVideo: f.type.startsWith('video/')
    }));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeFile = (idx) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
    setPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.plantName || !form.date) {
      alert('Please fill in Plant Name and Date.');
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('plantName', form.plantName);
      fd.append('date', form.date);
      fd.append('report', form.report);
      files.forEach(f => fd.append('files', f));
      await axios.post(`${API}/api/plants`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      showToast('Plant uploaded successfully!');
      setForm({ plantName: '', date: '', report: '' });
      setFiles([]);
      setPreviews([]);
      navigate('/');
    } catch (err) {
      alert('Upload failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!authenticated) {
    return (
      <>
        <TopBar showTitle={false} />
        {showPwd && (
          <PasswordModal
            title="Upload Access"
            onSuccess={() => { setAuthenticated(true); setShowPwd(false); }}
            onClose={() => navigate('/')}
          />
        )}
      </>
    );
  }

  return (
    <>
      <TopBar showTitle={false} />
      {viewMedia && (
        <MediaViewer
          src={viewMedia.src}
          isVideo={viewMedia.isVideo}
          alt={viewMedia.alt}
          onClose={() => setViewMedia(null)}
        />
      )}
      <div className="page-container upload-container">
        <form className="upload-card" onSubmit={handleSubmit}>
          <div className="upload-page-header">
            <span className="upload-header-icon">📤</span>
            <div>
              <h1>Upload Plant</h1>
              <p>Share your green initiative with the world.</p>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Plant Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Tulsi Plant, Mango Sapling"
                value={form.plantName}
                onChange={e => setForm({ ...form, plantName: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Planting Date *</label>
              <input
                type="date"
                className="form-input"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Upload Photos / Videos</label>
            <div
              className="upload-zone"
              onClick={() => fileRef.current.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') fileRef.current.click();
              }}
            >
              <input
                type="file"
                ref={fileRef}
                accept="image/*,video/*"
                multiple
                onChange={handleFileChange}
              />
              <div className="upload-zone-icon">☁️</div>
              <div className="upload-zone-text">
                Tap to upload photos or videos<br />
                <span>JPG, PNG, MP4, MOV (up to 100MB each)</span>
              </div>
            </div>

            {previews.length > 0 && (
              <div className="uploaded-files-preview">
                {previews.map((p, i) => (
                  <div className="file-preview-item" key={i}>
                    {p.isVideo
                      ? <video src={p.url} muted onClick={() => setViewMedia({ src: p.url, isVideo: true, alt: p.name })} />
                      : <img src={p.url} alt={p.name} onClick={() => setViewMedia({ src: p.url, isVideo: false, alt: p.name })} />
                    }
                    <button type="button" className="file-preview-remove" onClick={(e) => { e.stopPropagation(); removeFile(i); }}>x</button>
                  </div>
                ))}
              </div>
            )}
            <div className="file-count">{files.length} file(s) selected</div>
          </div>

          <div className="form-group">
            <label className="form-label">Short Report (max 200 words)</label>
            <textarea
              className="form-textarea"
              placeholder="Write a short report about your plant..."
              value={form.report}
              onChange={e => {
                const words = e.target.value.trim().split(/\s+/);
                if (words.length <= 200 || e.target.value === '') {
                  setForm({ ...form, report: e.target.value });
                }
              }}
              rows={5}
            />
            <div className="word-count">
              {form.report.trim() ? form.report.trim().split(/\s+/).length : 0}/200 words
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? '⏳ Uploading...' : '🌱 Submit Plant'}
          </button>
        </form>
      </div>
    </>
  );
};

export default UploadPage;
