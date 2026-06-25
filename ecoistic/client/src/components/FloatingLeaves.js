import React, { useEffect, useState } from 'react';

const FloatingLeaves = () => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const generated = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 9 + Math.random() * 8,
      size: 7 + Math.random() * 7,
      drift: Math.random() > 0.5 ? 1 : -1,
      hue: Math.floor(Math.random() * 24)
    }));
    setLeaves(generated);
  }, []);

  return (
    <>
      {leaves.map(leaf => (
        <span
          key={leaf.id}
          className="floating-leaf real-leaf"
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
    </>
  );
};

export default FloatingLeaves;
