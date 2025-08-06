'use client';

import LogoSvg from '@/assets/logo.svg';

interface LogoProps {
  className?: string;
}

export function InnovaSportLogo({ className = '' }: LogoProps) {
  return (
    <div className={`max-w-[180px] max-h-[90px] ${className}`}>
      <LogoSvg
        aria-label="Innova Sport Logo"
        style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
      />
    </div>
  );
}


