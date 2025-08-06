'use client';

import LogoSvg from '@/assets/logo.svg';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export function InnovaSportLogo({ className = '' }: { className?: string }) {
  return (
    <LogoSvg
      className={`${className} max-w-[180px] max-h-[90px] w-auto h-auto block`}
      aria-label="Innova Sport Logo"
      style={{ overflow: 'visible' }}
    />
  );
}


