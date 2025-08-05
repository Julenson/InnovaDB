'use client';

import Image from 'next/image';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export function InnovaSportLogo({ width = 40, height = 40, className = '' }: LogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="Innova Sport Logo"
      width={width}
      height={height}
      className={className}
      priority
    />
  );
}
