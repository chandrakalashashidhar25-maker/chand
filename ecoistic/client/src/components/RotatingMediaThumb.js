import React, { useEffect, useState } from 'react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const isVideoFile = (src) => /\.(mp4|mov|avi|webm)$/i.test(src || '');

const RotatingMediaThumb = ({
  files = [],
  alt = '',
  className,
  rotateAfter = 3,
  interval = 2600,
  onOpen
}) => {
  const validFiles = files.filter(Boolean);
  const shouldRotate = validFiles.length > rotateAfter;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [validFiles.join('|')]);

  useEffect(() => {
    if (!shouldRotate) return undefined;
    const timer = setInterval(() => {
      setIndex(current => (current + 1) % validFiles.length);
    }, interval);
    return () => clearInterval(timer);
  }, [interval, shouldRotate, validFiles.length]);

  if (!validFiles.length) return null;

  const src = validFiles[index] || validFiles[0];
  const isVideo = isVideoFile(src);
  const fullSrc = /^(blob:|data:|https?:\/\/)/i.test(src) ? src : `${API}${src}`;
  const open = () => onOpen?.(src, isVideo, alt);

  if (isVideo) {
    return <video src={fullSrc} className={className} muted playsInline onClick={open} />;
  }

  return <img src={fullSrc} alt={alt} className={className} loading="lazy" onClick={open} />;
};

export default RotatingMediaThumb;
