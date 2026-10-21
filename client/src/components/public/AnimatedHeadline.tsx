import React, { useState, useEffect, useRef } from 'react';

const ROTATING_WORDS = [
  'Trust.',
  'Precision.',
  'Lowest Rates.',
  'Fast Sanctions.',
  'Prime Properties.',
];

export const AnimatedHeadline: React.FC = () => {
  const [wordIndex, setWordIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  // ─── Portal entrance animation ───
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 120);
    return () => clearTimeout(timer);
  }, []);

  // ─── Word rotation interval ───
  useEffect(() => {
    const interval = setInterval(() => {
      setIsFlipping(true);
      setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
        setIsFlipping(false);
      }, 350);
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  // ─── Subtle 3D mouse tilt interaction ───
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 8; // -4deg to +4deg
      const y = -(e.clientY / innerHeight - 0.5) * 8; // -4deg to +4deg
      setTilt({ x: y, y: x });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)',
        transformStyle: 'preserve-3d',
      }}
      className="will-change-transform inline-block"
    >
      <h1 className="text-[33px] sm:text-[43px] md:text-[51px] lg:text-[59px] font-extrabold text-white tracking-tight leading-[1.15] font-heading drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)] max-w-4xl mx-auto select-none">
        <span
          className="relative inline-block overflow-hidden"
          style={{
            display: 'inline-block',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(32px)',
            transition: 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.25s, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.25s',
          }}
        >
          <span className="shimmer-headline-text">Strategic Property Loans,</span>
        </span>
        <br className="hidden sm:inline" />{' '}
        <span
          className="inline-flex items-center justify-center flex-wrap gap-x-2"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(32px)',
            transition: 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.42s, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.42s',
          }}
        >
          <span>Anchored in</span>{' '}
          <span
            className="inline-block relative overflow-visible"
            style={{ minWidth: '180px', textAlign: 'left' }}
          >
            <span
              key={wordIndex}
              style={{
                display: 'inline-block',
                transformOrigin: 'center bottom',
                transform: isFlipping
                  ? 'perspective(400px) rotateX(90deg) translateY(-8px)'
                  : 'perspective(400px) rotateX(0deg) translateY(0)',
                opacity: isFlipping ? 0 : 1,
                transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease',
              }}
              className="text-[#38bdf8] drop-shadow-[0_4px_16px_rgba(56,189,248,0.45)] whitespace-nowrap font-extrabold"
            >
              {ROTATING_WORDS[wordIndex]}
            </span>
          </span>
        </span>
      </h1>
    </div>
  );
};
