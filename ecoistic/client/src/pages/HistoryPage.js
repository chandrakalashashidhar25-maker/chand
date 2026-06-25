import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import TopBar from '../components/TopBar';
import PasswordModal from '../components/PasswordModal';
import { useApp } from '../context/AppContext';
import MediaViewer from '../components/MediaViewer';
import RotatingMediaThumb from '../components/RotatingMediaThumb';
import AutoMediaStrip from '../components/AutoMediaStrip';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

const TrimesterEditor = ({ trimKey, plant, onUpdate, onView }) => {
  const fileRef = useRef();
  const files = plant[trimKey]?.files || [];

  const handleAdd = async (e) => {
    const newFiles = Array.from(e.target.files);
    if (!newFiles.length) return;
    const fd = new FormData();
    newFiles.forEach(f => fd.append(trimKey, f));
    await axios.put(`${API}/api/plants/${plant._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    onUpdate();
  };

  const handleRemove = async (fp) => {
    const fd = new FormData();
    fd.append(`remove${trimKey.charAt(0).toUpperCase() + trimKey.slice(1)}`, JSON.stringify([fp]));
    await axios.put(`${API}/api/plants/${plant._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    onUpdate();
  };

  return (
    <div className="trim-editor">
      {files.length === 0 && <span className="trim-empty">-</span>}
      {files.slice(0, 2).map((fp, i) => {
        const isVideo = /\.(mp4|mov|avi|webm)$/i.test(fp);
        return (
          <div key={i} style={{ position: 'relative' }}>
            <RotatingMediaThumb
              files={[fp]}
              className="trim-thumb media-openable"
              alt=""
              onOpen={() => onView(fp, isVideo)}
            />
            <button
              type="button"
              onClick={() => handleRemove(fp)}
              className="trim-remove-btn"
              aria-label="Remove media"
            >
              x
            </button>
          </div>
        );
      })}
      {files.length > 2 && <span style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>+{files.length - 2}</span>}
      <button type="button" onClick={() => fileRef.current.click()} className="trim-add-btn">+</button>
      <input type="file" ref={fileRef} accept="image/*,video/*" multiple style={{ display: 'none' }} onChange={handleAdd} />
    </div>
  );
};

const EditModal = ({ plant, onClose, onSaved, onView }) => {
  const [form, setForm] = useState({
    plantName: plant.plantName,
    date: plant.date ? plant.date.split('T')[0] : '',
    report: plant.report || ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSave = async () => {
    setSubmitting(true);
    const fd = new FormData();
    fd.append('plantName', form.plantName);
    fd.append('date', form.date);
    fd.append('report', form.report);
    await axios.put(`${API}/api/plants/${plant._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    setSubmitting(false);
    onSaved();
  };

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <h2>Edit Plant</h2>
        <p>Update plant details and trimester photos/videos below.</p>
        <div className="form-group">
          <label className="form-label">Plant Name</label>
          <input type="text" className="form-input" value={form.plantName} onChange={e => setForm({ ...form, plantName: e.target.value })} />
        </div>
        <div className="form-group">
          <label className="form-label">Date</label>
          <input type="date" className="form-input" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
        </div>
        <div className="form-group">
          <label className="form-label">Report</label>
          <textarea className="form-textarea" value={form.report} onChange={e => setForm({ ...form, report: e.target.value })} />
        </div>

        {['trimester1', 'trimester2', 'trimester3', 'trimester4'].map((t, i) => (
          <div key={t} style={{ marginBottom: 14 }}>
            <div className="form-label">{['1st', '2nd', '3rd', '4th'][i]} Trimester</div>
            <TrimesterEditor trimKey={t} plant={plant} onUpdate={onSaved} onView={onView} />
          </div>
        ))}

        <div className="btn-row">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" style={{ flex: 1 }} onClick={handleSave} disabled={submitting}>
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

const HistoryPage = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPwd, setShowPwd] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [editPlant, setEditPlant] = useState(null);
  const [viewMedia, setViewMedia] = useState(null);
  const { showToast } = useApp();

  const load = () => {
    setLoading(true);
    axios.get(`${API}/api/plants`).then(r => setPlants(r.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleActionClick = (type, plant) => {
    setPendingAction({ type, plant });
    setShowPwd(true);
  };

  const handlePasswordSuccess = async () => {
    setShowPwd(false);
    if (!pendingAction) return;
    if (pendingAction.type === 'edit') {
      setEditPlant(pendingAction.plant);
    } else if (pendingAction.type === 'delete') {
      await axios.delete(`${API}/api/plants/${pendingAction.plant._id}`);
      showToast('Plant deleted successfully.');
      load();
    }
    setPendingAction(null);
  };

  return (
    <>
      <TopBar showTitle={false} />
      {showPwd && (
        <PasswordModal
          title={pendingAction?.type === 'delete' ? 'Confirm Delete' : 'Edit Access'}
          onSuccess={handlePasswordSuccess}
          onClose={() => { setShowPwd(false); setPendingAction(null); }}
        />
      )}
      {editPlant && (
        <EditModal
          plant={editPlant}
          onClose={() => { setEditPlant(null); }}
          onSaved={() => { load(); setEditPlant(null); showToast('Plant updated!'); }}
          onView={(src, isVideo) => setViewMedia({ src, isVideo })}
        />
      )}
      {viewMedia && (
        <MediaViewer
          src={viewMedia.src}
          files={viewMedia.files}
          isVideo={viewMedia.isVideo}
          onClose={() => setViewMedia(null)}
        />
      )}

      <div className="page-container">
        <div className="about-hero">
          <h1>🏆 Success History</h1>
          <p>All plant records - track every sapling's journey from seed to tree.</p>
        </div>

        {loading ? (
          <div className="spinner" />
        ) : plants.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🌱</div>
            <h3>No plants yet</h3>
            <p>Start by uploading your first plant!</p>
          </div>
        ) : (
          <div className="history-table-wrapper">
            <table className="history-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Plant Name</th>
                  <th>1st Trim.</th>
                  <th>2nd Trim.</th>
                  <th>3rd Trim.</th>
                  <th>4th Trim.</th>
                  <th>Report</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {plants.map((plant, idx) => (
                  <tr key={plant._id}>
                    <td>{idx + 1}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{formatDate(plant.date)}</td>
                    <td>
                      <span style={{ fontWeight: 600, minWidth: 120, display: 'inline-block' }}>{plant.plantName}</span>
                    </td>
                    {['trimester1', 'trimester2', 'trimester3', 'trimester4'].map(t => {
                      const files = t === 'trimester1'
                        ? [...(plant.files || []), ...(plant[t]?.files || [])]
                        : (plant[t]?.files || []);
                      if (files.length === 0) return <td key={t}><span className="trim-empty">-</span></td>;
                      return (
                        <td key={t}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                            <AutoMediaStrip
                              files={files}
                              className="trim-media-strip"
                              alt={plant.plantName}
                              onOpen={(mediaFiles, index) => setViewMedia({ files: mediaFiles, src: mediaFiles[index], alt: plant.plantName })}
                            />
                            {files.length > 1 && <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', alignSelf: 'center' }}>+{files.length - 1}</span>}
                          </div>
                        </td>
                      );
                    })}
                    <td style={{ maxWidth: 150 }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-mid)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 140 }}>
                        {plant.report || '-'}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="action-btn edit" onClick={() => handleActionClick('edit', plant)} title="Edit" aria-label="Edit plant">
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                          </svg>
                        </button>
                        <button className="action-btn delete" onClick={() => handleActionClick('delete', plant)} title="Delete" aria-label="Delete plant">
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M3 6h18" />
                            <path d="M8 6V4h8v2" />
                            <path d="M19 6l-1 14H6L5 6" />
                            <path d="M10 11v5" />
                            <path d="M14 11v5" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default HistoryPage;
