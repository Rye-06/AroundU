import { Plus } from 'lucide-react';

// Pre-designed constellation cluster with 3-layer depth system
// Foreground (large 8px), Mid (6px), Background (4px)
const CONSTELLATION_DOTS = [
  // --- Foreground layer (large, stronger) ---
  { x: 62, y: 30, r: 4, opacity: 0.22, layer: 'fg' },
  { x: 78, y: 55, r: 4, opacity: 0.20, layer: 'fg' },
  { x: 50, y: 65, r: 3.5, opacity: 0.18, layer: 'fg' },
  // --- Mid layer (medium) ---
  { x: 55, y: 20, r: 3, opacity: 0.16, layer: 'mid' },
  { x: 70, y: 38, r: 3, opacity: 0.15, layer: 'mid' },
  { x: 85, y: 42, r: 3, opacity: 0.14, layer: 'mid' },
  { x: 58, y: 48, r: 2.5, opacity: 0.15, layer: 'mid' },
  { x: 42, y: 40, r: 3, opacity: 0.13, layer: 'mid' },
  { x: 75, y: 70, r: 2.5, opacity: 0.14, layer: 'mid' },
  { x: 90, y: 25, r: 2.5, opacity: 0.12, layer: 'mid' },
  // --- Background layer (small, softer) ---
  { x: 48, y: 15, r: 2, opacity: 0.10, layer: 'bg' },
  { x: 65, y: 18, r: 2, opacity: 0.09, layer: 'bg' },
  { x: 82, y: 30, r: 2, opacity: 0.10, layer: 'bg' },
  { x: 92, y: 60, r: 2, opacity: 0.08, layer: 'bg' },
  { x: 45, y: 75, r: 2, opacity: 0.09, layer: 'bg' },
  { x: 68, y: 75, r: 2, opacity: 0.10, layer: 'bg' },
  { x: 55, y: 82, r: 2, opacity: 0.08, layer: 'bg' },
  { x: 38, y: 55, r: 2, opacity: 0.09, layer: 'bg' },
];

// Connecting lines between nearby dots — curved composition
const CONSTELLATION_LINES = [
  { x1: 55, y1: 20, x2: 62, y2: 30 },
  { x1: 62, y1: 30, x2: 70, y2: 38 },
  { x1: 70, y1: 38, x2: 78, y2: 55 },
  { x1: 78, y1: 55, x2: 75, y2: 70 },
  { x1: 70, y1: 38, x2: 85, y2: 42 },
  { x1: 58, y1: 48, x2: 50, y2: 65 },
  { x1: 62, y1: 30, x2: 58, y2: 48 },
  { x1: 42, y1: 40, x2: 58, y2: 48 },
  { x1: 85, y1: 42, x2: 90, y2: 25 },
  { x1: 50, y1: 65, x2: 75, y2: 70 },
];

// Faint curved dotted path (signature detail)
const DOTTED_PATH = "M 35,80 Q 55,25 95,35";

export function ConstellationHero({ onCreateEvent }: { onCreateEvent: () => void }) {
  return (
    <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary-50 via-white to-surface-50 border border-surface-100 shadow-sm">
      {/* Inner layout: text left, constellation right */}
      <div className="relative z-10 flex items-center min-h-[220px] px-10 py-10">
        {/* Left side — Text */}
        <div className="flex-1 max-w-md space-y-4 relative z-10">
          <h2 className="text-[2.2rem] leading-[1.15] font-semibold text-ink-900 tracking-tight">
            Find your people
          </h2>
          <p className="text-ink-500 text-base leading-relaxed font-medium max-w-sm">
            Discover shared interests and communities nearby
          </p>
          <div className="pt-2">
            <button
              onClick={onCreateEvent}
              className="group relative overflow-hidden flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-2xl font-medium text-sm transition-all duration-500 shadow-sm shadow-primary-500/20 hover:shadow-[0_0_20px_rgba(112,147,136,0.3)] hover:-translate-y-0.5"
            >
              <div className="absolute inset-0 bg-white/20 scale-0 rounded-full group-hover:animate-ripple z-0 pointer-events-none" />
              <Plus className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Start a hangout</span>
            </button>
          </div>
        </div>

        {/* Right side — Constellation Visual Field */}
        <div className="hidden md:block flex-1 relative">
          <svg className="w-full h-[200px]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            {/* Signature detail: faint curved dotted path */}
            <path
              d={DOTTED_PATH}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.3"
              strokeDasharray="1.5 2.5"
              className="text-primary-400 opacity-[0.12]"
            />

            {/* Connecting lines */}
            {CONSTELLATION_LINES.map((line, i) => (
              <line
                key={`line-${i}`}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="currentColor"
                strokeWidth="0.25"
                className="text-primary-500 opacity-[0.10]"
              />
            ))}

            {/* Dots with glow halos */}
            {CONSTELLATION_DOTS.map((dot, i) => (
              <g key={`dot-${i}`}>
                {/* Glow halo (only for foreground + mid) */}
                {dot.layer !== 'bg' && (
                  <circle
                    cx={dot.x}
                    cy={dot.y}
                    r={dot.r * 2.5}
                    fill="currentColor"
                    className="text-primary-400"
                    opacity={dot.opacity * 0.25}
                  />
                )}
                {/* Core dot */}
                <circle
                  cx={dot.x}
                  cy={dot.y}
                  r={dot.r}
                  fill="currentColor"
                  className="text-primary-500"
                  opacity={dot.opacity}
                >
                  {/* Slow glow breathing on foreground dots */}
                  {dot.layer === 'fg' && (
                    <animate
                      attributeName="opacity"
                      values={`${dot.opacity};${dot.opacity * 1.4};${dot.opacity}`}
                      dur="4s"
                      repeatCount="indefinite"
                    />
                  )}
                </circle>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Soft gradient glow accent at top-right */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-primary-200/20 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-coral-100/15 rounded-full blur-[60px] pointer-events-none" />
    </div>
  );
}
