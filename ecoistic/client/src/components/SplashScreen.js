import React, { useEffect, useState } from 'react';

const PLANT_THOUGHTS = [
  'A plant grows quietly, but changes everything around it.',
  'Care for one leaf today, and tomorrow it becomes shade.',
  'Small roots hold big promises.',
  'Every green beginning deserves patience.',
  'Nature answers kindness with growth.'
];

const SplashScreen = ({ onDone }) => {
  const [thought] = useState(() => PLANT_THOUGHTS[Math.floor(Math.random() * PLANT_THOUGHTS.length)]);
  const [leaves] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 3,
      size: 8 + Math.random() * 8,
      drift: Math.random() > 0.5 ? 1 : -1,
      hue: Math.floor(Math.random() * 28)
    }))
  );

  useEffect(() => {
    const timer = setTimeout(onDone, 3400);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="splash-screen">
      {leaves.map(leaf => (
        <span
          key={leaf.id}
          className="leaf-fall real-leaf"
          style={{
            left: `${leaf.left}%`,
            animationDelay: `${leaf.delay}s`,
            animationDuration: `${leaf.duration}s`,
            width: `${leaf.size}px`,
            height: `${leaf.size * 1.7}px`,
            '--leaf-drift': leaf.drift,
            '--leaf-hue': `${leaf.hue}deg`
          }}
        />
      ))}
      <div className="splash-logo-container">
        <div className="splash-logo-icon">🌱</div>
        <div className="splash-title">ECOISTIC</div>
        <div className="splash-subtitle">FRIENDLY</div>
        <div className="splash-thought">{thought}</div>
      </div>
    </div>
  );
};

export default SplashScreen;
