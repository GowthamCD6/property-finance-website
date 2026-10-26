import React from 'react';

export interface LogoProps {
  className?: string;
  size?: number;
  height?: number | string;
  width?: number | string;
  showWordmark?: boolean;
  variant?: 'dark' | 'light';
  alt?: string;
}

export const PrimeAssociateLogo: React.FC<LogoProps> = ({
  className = '',
  size = 68,
  height,
  width,
  variant = 'dark',
  alt = 'Prime Associate Loans',
}) => {
  const resolvedHeight = height !== undefined
    ? (typeof height === 'number' ? `${height}px` : height)
    : `${size}px`;

  const resolvedWidth = width !== undefined
    ? (typeof width === 'number' ? `${width}px` : width)
    : 'auto';

  // If variant === 'light' (used on dark backgrounds like dark footers),
  // wrap in an elegant white badge container for pristine contrast and clarity
  if (variant === 'light') {
    return (
      <div
        className={`inline-flex items-center bg-white px-4 py-2.5 rounded-2xl shadow-sm border border-white/20 select-none transition-transform hover:shadow-md ${className}`}
      >
        <img
          src="/logo.png"
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
        src="/logo.png"
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
