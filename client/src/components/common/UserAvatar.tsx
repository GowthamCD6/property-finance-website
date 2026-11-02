import React, { useState, useEffect } from 'react';
import { GoogleIcon } from './GoogleIcon';

interface UserAvatarProps {
  src?: string | null;
  name?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  showGoogleBadge?: boolean;
  showOnlineDot?: boolean;
  className?: string;
  alt?: string;
}

const sizeMap = {
  xs: { box: 'w-6 h-6', text: 'text-[10px]', badge: 10, dot: 'w-1.5 h-1.5' },
  sm: { box: 'w-8 h-8', text: 'text-xs', badge: 12, dot: 'w-2 h-2' },
  md: { box: 'w-10 h-10', text: 'text-sm', badge: 14, dot: 'w-2.5 h-2.5' },
  lg: { box: 'w-12 h-12', text: 'text-base', badge: 16, dot: 'w-3 h-3' },
  xl: { box: 'w-16 h-16', text: 'text-xl', badge: 20, dot: 'w-3.5 h-3.5' },
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  name,
  size = 'md',
  showGoogleBadge = false,
  showOnlineDot = false,
  className = '',
  alt,
}) => {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [src]);

  const initials = (name || 'User')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'U';

  const sizeConfig = typeof size === 'number'
    ? {
        box: '',
        text: size < 32 ? 'text-xs' : 'text-sm',
        badge: Math.max(10, Math.round(size * 0.35)),
        dot: 'w-2.5 h-2.5',
      }
    : sizeMap[size] || sizeMap.md;

  const customStyle = typeof size === 'number'
    ? { width: `${size}px`, height: `${size}px`, minWidth: `${size}px`, minHeight: `${size}px` }
    : undefined;

  const hasValidImage = Boolean(src && !imageError);

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full shrink-0 select-none ${sizeConfig.box} ${className}`}
      style={customStyle}
    >
      {hasValidImage ? (
        <img
          src={src as string}
          alt={alt || name || 'User Avatar'}
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
          onError={() => setImageError(true)}
          className="w-full h-full rounded-full object-cover ring-1 ring-black/10 shadow-xs"
        />
      ) : (
        <div
          className={`w-full h-full rounded-full bg-gradient-to-tr from-brand-teal via-[#145d5a] to-[#0A1624] text-white font-extrabold flex items-center justify-center shadow-xs ring-1 ring-white/20 font-heading tracking-wide ${sizeConfig.text}`}
        >
          {initials}
        </div>
      )}

      {/* Optional Google Verified Badge in corner */}
      {showGoogleBadge && (
        <span
          className="absolute -bottom-0.5 -right-0.5 rounded-full bg-white p-0.5 shadow-xs ring-1 ring-slate-200 flex items-center justify-center"
          title="Verified Google Identity"
        >
          <GoogleIcon size={sizeConfig.badge} />
        </span>
      )}

      {/* Online indicator dot */}
      {showOnlineDot && !showGoogleBadge && (
        <span
          className={`absolute bottom-0 right-0 ${sizeConfig.dot} bg-emerald-500 ring-2 ring-white rounded-full`}
          title="Active Session"
        />
      )}
    </div>
  );
};

