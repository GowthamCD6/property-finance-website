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
  const [currentWord, setCurrentWord] = useState(ROTATING_WORDS[0]);
  const [exitingWord, setExitingWord] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  // ─── Portal entrance animation ───
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 120);
    return () => clearTimeout(timer);
  }, []);

  // ─── Word rotation with staggered letter breaking & assembling animation ───
  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prevIdx) => {
        const nextIdx = (prevIdx + 1) % ROTATING_WORDS.length;
        setExitingWord(ROTATING_WORDS[prevIdx]);
        setCurrentWord(ROTATING_WORDS[nextIdx]);
        setIsTransitioning(true);

        setTimeout(() => {
          setExitingWord(null);
          setIsTransitioning(false);
        }, 900);

        return nextIdx;
      });
    }, 3600);

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
            style={{
              minWidth: '170px',
              textAlign: 'left',
              verticalAlign: 'baseline',
            }}
          >
            {/* Exiting word: Letters break apart, scatter, and fade out smoothly */}
            {exitingWord && (
              <span
                className="absolute left-0 top-0 pointer-events-none whitespace-nowrap select-none text-[#38bdf8] drop-shadow-[0_4px_22px_rgba(56,189,248,0.65)] font-extrabold"
                aria-hidden="true"
              >
                {exitingWord.split('').map((char, idx) => {
                  const scatterX = (idx % 2 === 0 ? -1 : 1) * (5 + (idx % 3) * 3);
                  const scatterRot = (idx % 2 === 0 ? -1 : 1) * (10 + (idx % 4) * 4);
                  return (
                    <span
                      key={`exit-${idx}`}
                      className="animate-letter-break"
                      style={
                        {
                          '--char-index': idx,
                          '--scatter-x': `${scatterX}px`,
                          '--scatter-rot': `${scatterRot}deg`,
                        } as React.CSSProperties
                      }
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                  );
                })}
              </span>
            )}

            {/* Current/Incoming word: Letters rise from below, clear blur, and assemble smoothly */}
            <span className="relative inline-block whitespace-nowrap text-[#38bdf8] drop-shadow-[0_4px_22px_rgba(56,189,248,0.65)] font-extrabold">
              {currentWord.split('').map((char, idx) => {
                const enterX = (idx % 2 === 0 ? 1 : -1) * (4 + (idx % 3) * 2);
                const enterRot = (idx % 2 === 0 ? 1 : -1) * (6 + (idx % 3) * 2);
                return (
                  <span
                    key={`enter-${wordIndex}-${idx}`}
                    className={isTransitioning ? 'animate-letter-assemble' : 'inline-block'}
                    style={
                      {
                        '--char-index': idx,
                        '--enter-x': `${enterX}px`,
                        '--enter-rot': `${enterRot}deg`,
                      } as React.CSSProperties
                    }
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                );
              })}
            </span>
          </span>
        </span>
      </h1>
    </div>
  );
};
