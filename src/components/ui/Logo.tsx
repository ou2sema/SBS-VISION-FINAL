import React from 'react';
import { cn } from '../../lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'horizontal' | 'stacked' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  theme?: 'dark' | 'light';
}

export function Logo({
  className,
  variant = 'horizontal',
  size = 'md',
  showTagline = false,
  theme = 'dark',
}: LogoProps) {
  // Sizes
  const iconSizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    sm: { sbs: 'text-base', vision: 'text-base', tag: 'text-[9px]' },
    md: { sbs: 'text-xl', vision: 'text-xl', tag: 'text-[10px]' },
    lg: { sbs: 'text-2xl sm:text-3xl', vision: 'text-2xl sm:text-3xl', tag: 'text-xs' },
    xl: { sbs: 'text-3xl sm:text-4xl', vision: 'text-3xl sm:text-4xl', tag: 'text-sm' },
  };

  // Color selection
  const sbsColor = theme === 'dark' ? '#FFFFFF' : '#0B0D11';
  const visionColor = '#E11D2A'; // Hikvision-style security red
  const iconColor = '#E11D2A';

  // High-precision vector of the SBS VISION Arrow-Eye emblem
  const Emblem = ({ sizeClass = 'w-9 h-9' }: { sizeClass?: string }) => (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(sizeClass, 'shrink-0 transition-transform duration-300 group-hover:scale-105')}
      aria-label="SBS VISION Logo Mark"
    >
      {/* Dynamic Security Red Glow */}
      <defs>
        <filter id="sbs-red-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#E11D2A" floodOpacity="0.4" />
        </filter>
        <linearGradient id="sbs-red-grad" x1="0" y1="100" x2="120" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#C41220" />
          <stop offset="100%" stopColor="#ED2230" />
        </linearGradient>
      </defs>

      {/* Top Eye Brow that morphs into a dynamic upward-right arrow */}
      <path
        d="M20 72 C 34 56, 56 42, 85 45 L 82 32 L 112 36 L 99 64 L 91 51 C 70 50, 48 60, 36 74 Z"
        fill="url(#sbs-red-grad)"
      />

      {/* Lower Eye Arch with Pupil (The Vision Lens) */}
      <path
        d="M48 64 C 48 64, 58 57, 72 58 C 76 64, 82 72, 82 78 C 82 92, 69 100, 56 96 C 47 93, 42 84, 44 76 C 44 73, 46 68, 48 64 Z"
        fill="url(#sbs-red-grad)"
      />

      {/* Pupil negative cutout / Iris reflection */}
      <path
        d="M52 74 C 58 68, 70 68, 76 74 C 73 83, 62 87, 56 83 C 53 81, 52 77, 52 74 Z"
        fill={theme === 'dark' ? '#090B0E' : '#FFFFFF'}
      />

      {/* Center Camera Lens Core */}
      <circle cx="63" cy="75" r="4.5" fill="url(#sbs-red-grad)" />
    </svg>
  );

  if (variant === 'icon') {
    return <Emblem sizeClass={iconSizeClasses[size]} />;
  }

  if (variant === 'stacked') {
    return (
      <div className={cn('inline-flex flex-col items-center text-center group cursor-pointer select-none', className)}>
        <Emblem sizeClass={iconSizeClasses[size]} />
        <div className="mt-2 flex items-baseline tracking-tight font-black">
          <span
            className={cn('font-extrabold tracking-wider', textSizes[size].sbs)}
            style={{ color: sbsColor, letterSpacing: '0.05em' }}
          >
            SBS
          </span>
          <span
            className={cn('ml-1.5 font-black uppercase tracking-wider', textSizes[size].vision)}
            style={{ color: visionColor, letterSpacing: '0.06em' }}
          >
            VISION
          </span>
        </div>
        {showTagline && (
          <span className={cn('mt-0.5 tracking-[0.25em] font-semibold text-[#8B95A5] uppercase', textSizes[size].tag)}>
            Sécurité & Surveillance
          </span>
        )}
      </div>
    );
  }

  // Horizontal variant (default for navbar & header)
  return (
    <div className={cn('inline-flex items-center gap-3 group cursor-pointer select-none', className)}>
      <Emblem sizeClass={iconSizeClasses[size]} />
      <div className="flex flex-col">
        <div className="flex items-baseline leading-none">
          <span
            className={cn('font-black tracking-wider uppercase', textSizes[size].sbs)}
            style={{ color: sbsColor, letterSpacing: '0.04em' }}
          >
            SBS
          </span>
          <span
            className={cn('ml-1.5 font-black tracking-wider uppercase', textSizes[size].vision)}
            style={{ color: visionColor, letterSpacing: '0.06em' }}
          >
            VISION
          </span>
        </div>
        {showTagline && (
          <span className={cn('mt-1 tracking-[0.2em] font-semibold text-[#8B95A5] uppercase leading-none', textSizes[size].tag)}>
            Sécurité & Surveillance
          </span>
        )}
      </div>
    </div>
  );
}
