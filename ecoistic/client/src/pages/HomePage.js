import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import TopBar from '../components/TopBar';
import FloatingLeaves from '../components/FloatingLeaves';
import MediaViewer from '../components/MediaViewer';
import AutoMediaStrip from '../components/AutoMediaStrip';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
const trimReport = (report = '') => report.replace(/\s+/g, ' ').trim();

const objectIdTime = (id) => {
  if (!/^[a-f\d]{24}$/i.test(id || '')) return 0;
  return parseInt(id.slice(0, 8), 16) * 1000;
};

const plantTime = (plant) => {
  const times = [plant.createdAt, plant.updatedAt, plant.date]
    .map(value => value ? new Date(value).getTime() : 0)
    .filter(Boolean);
  return Math.max(objectIdTime(plant._id), ...times, 0);
};

const MediaThumb = ({ files, alt, onOpen }) => {
  if (!files?.length) return <div className="plant-card-placeholder">🌱</div>;
  return (
    <AutoMediaStrip
      files={files}
      alt={alt}
      className="plant-card-media-strip"
      onOpen={onOpen}
    />
  );
};

const StatCounter = ({ end, label, icon }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const inc = Math.max(1, Math.ceil(end / 40));
    const t = setInterval(() => {
      start += inc;
      if (start >= end) { setCount(end); clearInterval(t); }
      else setCount(start);
    }, 40);
    return () => clearInterval(t);
  }, [end]);
  return (
    <div className="stat-card">
      <span className="stat-icon">{icon}</span>
      <div>
        <div className="stat-value">{count}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
};

const AutoCarousel = ({ items, renderSlide, slidesPerView = 2, mobileSlidesPerView = 1, interval = 4000 }) => {
  const [idx, setIdx] = useState(0);
  const timer = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const visibleSlides = isMobile ? mobileSlidesPerView : slidesPerView;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 560);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const next = useCallback(() => {
    setIdx(i => (i + 1) % Math.max(1, items.length - visibleSlides + 1));
  }, [items.length, visibleSlides]);

  useEffect(() => {
    if (items.length <= visibleSlides) return;
    timer.current = setInterval(next, interval);
    return () => clearInterval(timer.current);
  }, [items.length, next, interval, visibleSlides]);

  const total = Math.max(1, items.length - visibleSlides + 1);

  return (
    <div>
      <div className="carousel-wrapper">
        <div
          className="carousel-track"
          style={{ transform: `translateX(-${idx * (100 / visibleSlides)}%)` }}
        >
          {items.map((item, i) => (
            <div key={item._id || i} style={{ minWidth: `${100 / visibleSlides}%`, padding: '0 6px' }}>
              {renderSlide(item, i)}
            </div>
          ))}
        </div>
      </div>
      {total > 1 && (
        <div className="carousel-dots">
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              className={`carousel-dot ${idx === i ? 'active' : ''}`}
              onClick={() => setIdx(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const HomePage = () => {
  const [recent, setRecent] = useState([]);
  const [allPlants, setAllPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMedia, setViewMedia] = useState(null);

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/api/plants/recent`),
      axios.get(`${API}/api/plants`)
    ]).then(([r, a]) => {
      setRecent(r.data);
      setAllPlants(a.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const latestPlants = [...new Map([...recent, ...allPlants].map(plant => [plant._id, plant])).values()]
    .sort((a, b) => plantTime(b) - plantTime(a))
    .slice(0, 10);
  const last7Activity = allPlants.slice(0, 7);
  const openMedia = (files, index = 0, alt = '') => setViewMedia({ files, src: files[index], alt });

  return (
    <>
      <TopBar />
      <FloatingLeaves />
      {viewMedia && (
        <MediaViewer
          src={viewMedia.src}
          files={viewMedia.files}
          isVideo={viewMedia.isVideo}
          alt={viewMedia.alt}
          onClose={() => setViewMedia(null)}
        />
      )}
      <div className="page-container home-container">
        <section className="welcome-panel">
          <div>
            <span className="welcome-kicker">Ecoistic Friendly</span>
            <h1>Welcome Back</h1>
            <p>Keep growing the record of every plant you care for.</p>
          </div>
        </section>

        <div className="stats-row">
          <StatCounter end={allPlants.length} label="Plants Added" icon="🌱" />
          <StatCounter end={allPlants.length * 3} label="Care Updates" icon="📝" />
          <StatCounter end={allPlants.length * 3} label="Plants Growing" icon="🍃" />
          <div className="stat-card">
            <span className="stat-icon">🌍</span>
            <div>
              <div className="stat-value">Go</div>
              <div className="stat-label">Greener Tomorrow</div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div className="section-title">
            <span>🌿</span> Latest Plant Contributions
            <span style={{ fontSize: '0.72rem', color: 'var(--text-light)', marginLeft: 'auto' }}>Newest</span>
          </div>
          {loading ? (
            <div className="spinner" />
          ) : latestPlants.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🌱</div>
              <h3>No recent contributions</h3>
              <p>Be the first to add a plant!</p>
            </div>
          ) : (
            <AutoCarousel
              items={latestPlants}
              interval={4000}
              slidesPerView={4}
              mobileSlidesPerView={2}
              renderSlide={(plant) => {
                const report = trimReport(plant.report);
                return (
                  <div className="plant-card">
                    <MediaThumb files={plant.files} alt={plant.plantName} onOpen={openMedia} />
                    <div className="plant-card-body">
                      <div className="plant-card-name">{plant.plantName}</div>
                      <div className="plant-card-date">📅 {formatDate(plant.date)}</div>
                      {report && <div className="plant-card-report">{report}</div>}
                    </div>
                  </div>
                );
              }}
            />
          )}
        </div>

        <div>
          <div className="section-title">
            <span>📋</span> Recent Activity Reports
            <span style={{ fontSize: '0.72rem', color: 'var(--text-light)', marginLeft: 'auto' }}>Last 7</span>
          </div>
          {loading ? (
            <div className="spinner" />
          ) : last7Activity.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <h3>No activity yet</h3>
            </div>
          ) : (
            <div className="hscroll-carousel">
              {last7Activity.map((plant, i) => {
                const report = trimReport(plant.report);
                return (
                  <div className="activity-card activity-card-text-only" key={plant._id} style={{ animationDelay: `${i * 0.08}s` }}>
                    <div className="activity-card-info">
                      <div className="activity-card-name">{plant.plantName}</div>
                      <div className="activity-card-date">📅 {formatDate(plant.date)}</div>
                      <div className="activity-card-report">{report || 'No report added.'}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;
