'use client';

import LogoSvg from '@/assets/logo.svg';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export function InnovaSportLogo({ width = 40, height = 40, className = '' }: LogoProps) {
  return <LogoSvg width={width} height={height} className={className} aria-label="Innova Sport Logo" />;
}
