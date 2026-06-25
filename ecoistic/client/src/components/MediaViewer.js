import React from 'react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const resolveSrc = (src) => {
  if (!src) return '';
  if (/^(blob:|data:|https?:\/\/)/i.test(src)) return src;
  return `${API}${src}`;
};

const isVideoFile = (src) => /\.(mp4|mov|avi|webm)$/i.test(src || '');

const MediaViewer = ({ src, files, isVideo, alt = 'Media preview', onClose }) => {
  const galleryFiles = files?.filter(Boolean) || [];
  if (!src && galleryFiles.length === 0) return null;

  if (galleryFiles.length > 0) {
    return (
      <div className="media-viewer-overlay" onClick={onClose}>
        <button className="media-viewer-close" onClick={onClose} aria-label="Close media viewer">x</button>
        <div className="media-viewer-gallery" onClick={e => e.stopPropagation()}>
          {galleryFiles.map((file, i) => {
            const fullSrc = resolveSrc(file);
            const video = isVideoFile(file);
            return (
              <div className="media-viewer-gallery-item" key={`${file}-${i}`}>
                {video
                  ? <video src={fullSrc} controls />
                  : <img src={fullSrc} alt={`${alt} ${i + 1}`} />
                }
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const video = isVideo ?? isVideoFile(src);
  const fullSrc = resolveSrc(src);

  return (
    <div className="media-viewer-overlay" onClick={onClose}>
      <button className="media-viewer-close" onClick={onClose} aria-label="Close media viewer">x</button>
      {video
        ? <video src={fullSrc} controls autoPlay className="media-viewer-video" onClick={e => e.stopPropagation()} />
        : <img src={fullSrc} alt={alt} className="media-viewer-img" onClick={e => e.stopPropagation()} />
      }
    </div>
  );
};

export default MediaViewer;
