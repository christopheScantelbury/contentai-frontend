import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  href?: string;
}

export default function Logo({ size = 'md', href = '/' }: LogoProps) {
  const sizes = {
    sm: { icon: 'w-6 h-6 text-xs', text: 'text-base' },
    md: { icon: 'w-8 h-8 text-sm', text: 'text-xl' },
    lg: { icon: 'w-10 h-10 text-base', text: 'text-2xl' },
  };
  const s = sizes[size];

  const inner = (
    <div className="flex items-center gap-2 select-none">
      {/* Ícone hexagonal */}
      <div className={`${s.icon} relative flex items-center justify-center flex-shrink-0`}>
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <polygon
            points="16,2 28,9 28,23 16,30 4,23 4,9"
            fill="url(#logoGrad)"
            stroke="none"
          />
          <text
            x="16" y="22"
            textAnchor="middle"
            fontSize="14"
            fontWeight="800"
            fontFamily="system-ui, sans-serif"
            fill="white"
          >S</text>
          <defs>
            <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00D4FF" />
              <stop offset="100%" stopColor="#0066CC" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      {/* Texto */}
      <div className="flex items-baseline gap-0.5 leading-none">
        <span className={`${s.text} font-extrabold tracking-tight text-gray-900`}>
          Descrição
        </span>
        <span className={`${s.text} font-extrabold tracking-tight`}
          style={{ color: '#00D4FF' }}>
          AI
        </span>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href} className="hover:opacity-80 transition-opacity">{inner}</Link>;
  }
  return inner;
}
