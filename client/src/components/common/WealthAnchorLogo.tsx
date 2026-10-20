import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showWordmark?: boolean;
}

export const WealthAnchorLogo: React.FC<LogoProps> = ({
  className = '',
  size = 40,
  showWordmark = true,
}) => {
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Geometric SVG Icon Mark */}
      <div
        style={{ width: size, height: size }}
        className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#187C78] to-[#0E5B58] text-white shadow-sm flex-shrink-0 transition-transform group-hover:scale-105"
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-3/5 h-3/5"
        >
          {/* Top Ring / Growth Node */}
          <circle
            cx="16"
            cy="7"
            r="3"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Central Anchor Pillar */}
          <line
            x1="16"
            y1="10"
            x2="16"
            y2="24"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Crossbar Balance */}
          <line
            x1="10.5"
            y1="13"
            x2="21.5"
            y2="13"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Anchor Flukes (Curved Cradle / Shield) */}
          <path
            d="M8.5 18.5C9.5 24 12.5 26.5 16 26.5C19.5 26.5 22.5 24 23.5 18.5"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Anchor Tips */}
          <polyline
            points="6.5,19.5 8.5,17.5 10.5,19.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points="21.5,19.5 23.5,17.5 25.5,19.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Brand Wordmark (Only "WealthAnchor") */}
      {showWordmark && (
        <span className="font-extrabold text-lg sm:text-xl tracking-tight text-brand-navy leading-none font-heading whitespace-nowrap">
          WealthAnchor
        </span>
      )}
    </div>
  );
};
