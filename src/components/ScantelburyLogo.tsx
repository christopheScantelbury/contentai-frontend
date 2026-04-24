'use client';

import Link from 'next/link';

interface LogoMarkProps {
  className?: string;
}

interface LogoFullProps {
  href?: string;
  className?: string;
}

export function ScantelburyLogoMark({ className = '' }: LogoMarkProps) {
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
        <polygon
          points="16,2 28,9 28,23 16,30 4,23 4,9"
          fill="url(#scanGrad1)"
        />
        <text
          x="16"
          y="22"
          textAnchor="middle"
          fontSize="13"
          fontWeight="800"
          fontFamily="system-ui, -apple-system, sans-serif"
          fill="white"
        >
          S
        </text>
        <defs>
          <linearGradient id="scanGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D4FF" />
            <stop offset="100%" stopColor="#0055CC" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export function ScantelburyLogoFull({ href, className = '' }: LogoFullProps) {
  const inner = (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32" style={{ flexShrink: 0 }}>
        <polygon
          points="16,2 28,9 28,23 16,30 4,23 4,9"
          fill="url(#scanGrad2)"
        />
        <text
          x="16"
          y="22"
          textAnchor="middle"
          fontSize="13"
          fontWeight="800"
          fontFamily="system-ui, -apple-system, sans-serif"
          fill="white"
        >
          S
        </text>
        <defs>
          <linearGradient id="scanGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D4FF" />
            <stop offset="100%" stopColor="#0055CC" />
          </linearGradient>
        </defs>
      </svg>
      <div className="flex items-baseline gap-0.5 leading-none">
        <span className="text-xl font-extrabold tracking-tight text-gray-900">
          Descrição
        </span>
        <span
          className="text-xl font-extrabold tracking-tight"
          style={{ color: '#00D4FF' }}
        >
          AI
        </span>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="hover:opacity-80 transition-opacity">
        {inner}
      </Link>
    );
  }

  return inner;
}
