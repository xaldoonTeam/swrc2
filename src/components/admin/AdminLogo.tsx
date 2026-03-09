/** Modern adorable admin logo – SVG mark for SWRC Admin */

interface AdminLogoProps {
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
  className?: string;
}

const sizes = { sm: 36, md: 44, lg: 52 };

export default function AdminLogo({ size = "md", showWordmark = true, className = "" }: AdminLogoProps) {
  const px = sizes[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo mark - squircle with gradient + S + sparkle */}
      <div
        className="relative flex-shrink-0 rounded shadow-lg ring-2 ring-white/10 overflow-hidden"
        style={{
          width: px,
          height: px,
          boxShadow: "0 8px 24px -4px rgba(249, 115, 22, 0.35), 0 4px 8px -2px rgba(0,0,0,0.1)",
        }}
      >
        <svg
          width={px}
          height={px}
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="block"
        >
          <defs>
            <linearGradient id="admin-logo-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
          </defs>
          {/* Rounded square background */}
          <rect width="44" height="44" rx="0" fill="url(#admin-logo-bg)" />
          {/* Letter S - bold, centered */}
          <text
            x="22"
            y="28"
            textAnchor="middle"
            fill="white"
            fontSize="22"
            fontWeight="700"
            fontFamily="system-ui, -apple-system, sans-serif"
            style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))" }}
          >
            S
          </text>
          {/* Sparkle dot */}
          <circle cx="32" cy="12" r="2.5" fill="white" fillOpacity="0.95" />
        </svg>
      </div>
      {showWordmark && (
        <div className="flex-1 min-w-0">
          <div className="font-bold text-white text-sm leading-tight tracking-tight">SWRC Admin</div>
          <div className="text-[11px] text-slate-400 font-medium">Content Manager</div>
        </div>
      )}
    </div>
  );
}
