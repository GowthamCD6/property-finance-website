import React from 'react';
import logoImg from '../../assets/images/logo.png';
import logoDarkImg from '../../assets/images/logo-dark.png';

export interface LogoProps {
  className?: string;
  size?: number;
  height?: number | string;
  width?: number | string;
  showWordmark?: boolean;
  variant?: 'dark' | 'light' | 'on-dark' | 'white' | 'badge';
  alt?: string;
}

export const PrimeAssociateLogo: React.FC<LogoProps> = ({
  className = '',
  size = 68,
  height,
  width,
  variant = 'dark',
  alt = 'Prime Associates Loans',
}) => {
  const resolvedHeight = height !== undefined
    ? (typeof height === 'number' ? `${height}px` : height)
    : `${size}px`;

  const resolvedWidth = width !== undefined
    ? (typeof width === 'number' ? `${width}px` : width)
    : 'auto';

  // If variant === 'on-dark' or 'white': native dark mode logo (pure white text + vibrant orange roof)
  if (variant === 'on-dark' || variant === 'white') {
    return (
      <div className={`inline-flex items-center select-none ${className}`}>
        <img
          src={logoDarkImg}
          alt={alt}
          style={{ height: resolvedHeight, width: resolvedWidth }}
          className="object-contain block transition-transform group-hover:scale-105 filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
          loading="eager"
        />
      </div>
    );
  }

  // If variant === 'light' or 'badge' (used when framing inside a frosted white card):
  if (variant === 'light' || variant === 'badge') {
    return (
      <div
        className={`inline-flex items-center bg-white px-4 py-2.5 rounded-2xl shadow-sm border border-white/20 select-none transition-transform hover:shadow-md ${className}`}
      >
        <img
          src={logoImg}
          alt={alt}
          style={{ height: resolvedHeight, width: resolvedWidth }}
          className="object-contain block transition-transform group-hover:scale-105"
          loading="eager"
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <img
        src={logoImg}
        alt={alt}
        style={{ height: resolvedHeight, width: resolvedWidth }}
        className="object-contain block transition-transform group-hover:scale-105"
        loading="eager"
      />
    </div>
  );
};

// Re-export as WealthAnchorLogo for backwards compatibility with existing component imports
export const WealthAnchorLogo = PrimeAssociateLogo;

