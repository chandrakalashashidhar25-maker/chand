import React, { useEffect, useState } from 'react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const resolveSrc = (src) => {
  if (!src) return '';
  if (/^(blob:|data:|https?:\/\/)/i.test(src)) return src;
  return `${API}${src}`;
};

const isVideoFile = (src) => /\.(mp4|mov|avi|webm)$/i.test(src || '');

const AutoMediaStrip = ({ files = [], alt = '', className = '', interval = 1200, onOpen }) => {
  const validFiles = files.filter(Boolean);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [validFiles.join('|')]);

  useEffect(() => {
    if (validFiles.length <= 1) return undefined;
    const timer = setInterval(() => {
      setIndex(current => (current + 1) % validFiles.length);
    }, interval);
    return () => clearInterval(timer);
  }, [interval, validFiles.length]);

  if (!validFiles.length) return null;

  return (
    <button
      type="button"
      className={`auto-media-strip ${className}`}
      onClick={() => onOpen?.(validFiles, index, alt)}
      aria-label="Open all media"
    >
      <span
        className="auto-media-track"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {validFiles.map((file, i) => {
          const src = resolveSrc(file);
          const isVideo = isVideoFile(file);
          return (
            <span className="auto-media-frame" key={`${file}-${i}`}>
              {isVideo
                ? <video src={src} muted playsInline autoPlay loop preload="metadata" />
                : <img src={src} alt={alt} loading="lazy" />
              }
            </span>
          );
        })}
      </span>
    </button>
  );
};

export default AutoMediaStrip;
