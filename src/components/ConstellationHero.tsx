import { MapPin, Plus, Users } from 'lucide-react';
import { AroundULogo } from './AroundULogo';

export function ConstellationHero({ onCreateEvent }: { onCreateEvent: () => void }) {
  return (
    <div className="relative overflow-hidden rounded-[2.75rem] bg-gradient-to-br from-surface-50 via-[#f9f4e7] to-surface-100 border border-surface-200 shadow-[0_18px_44px_rgba(80,92,76,0.10)]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 right-16 h-80 w-80 rounded-full bg-primary-200/26 blur-[110px] animate-pulse" />
        <div className="absolute -bottom-16 left-16 h-64 w-64 rounded-full bg-coral-100/34 blur-[100px] animate-pulse" style={{ animationDelay: '0.8s' }} />
      </div>

      <div className="relative z-10 flex items-center min-h-[260px] px-8 py-10 sm:px-10">
        <div className="flex-1 max-w-md space-y-5">
          <AroundULogo showTagline className="mb-1" emblemClassName="h-14 w-14" />
          <h2 className="text-[2rem] leading-[1.14] font-semibold text-ink-900 tracking-tight">
            Real-time campus connection, made easy.
          </h2>
          <p className="text-ink-600 text-[15px] leading-relaxed font-medium max-w-sm">
            See what is happening near you, join nearby circles, and start hangouts immediately in one tap.
          </p>
          <button
            onClick={onCreateEvent}
            className="group relative overflow-hidden inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-2xl font-medium text-sm transition-all duration-500 shadow-sm shadow-primary-500/20 hover:shadow-[0_0_20px_rgba(123,151,128,0.35)]"
          >
            <div className="absolute inset-0 bg-white/20 scale-0 rounded-full group-hover:animate-ripple z-0 pointer-events-none" />
            <Plus className="w-4 h-4 relative z-10" />
            <span className="relative z-10">Start a hangout</span>
          </button>
        </div>

        <div className="hidden md:flex flex-1 justify-end">
          <svg className="w-[360px] h-[220px]" viewBox="0 0 360 220" preserveAspectRatio="xMidYMid meet">
            <defs>
              <radialGradient id="heroGlow" cx="50%" cy="50%" r="64%">
                <stop offset="0%" stopColor="rgba(240,233,211,0.85)" />
                <stop offset="100%" stopColor="rgba(240,233,211,0)" />
              </radialGradient>
              <linearGradient id="flowLine" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(123,151,128,0.82)" />
                <stop offset="100%" stopColor="rgba(123,151,128,0.34)" />
              </linearGradient>
            </defs>

            <circle cx="228" cy="112" r="104" fill="url(#heroGlow)" />

            <path d="M128 130C162 78 222 58 288 78" fill="none" stroke="currentColor" strokeWidth="6" className="text-primary-300 opacity-55" strokeLinecap="round" />
            <path d="M136 148C178 180 250 184 304 150" fill="none" stroke="currentColor" strokeWidth="6" className="text-primary-300 opacity-45" strokeLinecap="round" />
            <path d="M168 94C200 64 254 62 292 90" fill="none" stroke="currentColor" strokeWidth="4" className="text-primary-400 opacity-44" strokeLinecap="round" />

            <path d="M152 152L194 108L238 132L274 98L304 126" fill="none" stroke="url(#flowLine)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M194 108L216 78L254 82" fill="none" stroke="currentColor" strokeWidth="4" className="text-primary-500 opacity-50" strokeLinecap="round" />
            <path d="M238 132L224 166L268 170" fill="none" stroke="currentColor" strokeWidth="4" className="text-primary-500 opacity-42" strokeLinecap="round" />

            <circle cx="152" cy="152" r="8" className="fill-primary-500 opacity-62" />
            <circle cx="194" cy="108" r="11" className="fill-primary-500 opacity-72" />
            <circle cx="238" cy="132" r="10" className="fill-primary-500 opacity-68" />
            <circle cx="274" cy="98" r="9" className="fill-primary-500 opacity-62" />
            <circle cx="304" cy="126" r="8" className="fill-primary-500 opacity-56" />
            <circle cx="216" cy="78" r="7" className="fill-primary-500 opacity-52" />
            <circle cx="254" cy="82" r="6" className="fill-primary-500 opacity-46" />
            <circle cx="224" cy="166" r="6" className="fill-primary-500 opacity-48" />
            <circle cx="268" cy="170" r="6" className="fill-primary-500 opacity-44" />

            <rect x="116" y="130" width="18" height="34" rx="5" className="fill-coral-200 opacity-58" />
            <rect x="128" y="120" width="14" height="44" rx="4" className="fill-coral-200 opacity-48" />
            <rect x="304" y="88" width="16" height="36" rx="4" className="fill-coral-200 opacity-54" />

            <g transform="translate(206 58)" className="text-primary-600 opacity-74">
              <Users className="w-4 h-4" />
            </g>
            <g transform="translate(264 88)" className="text-primary-600 opacity-72">
              <MapPin className="w-4 h-4" />
            </g>
            <g transform="translate(184 156)" className="text-primary-600 opacity-68">
              <MapPin className="w-4 h-4" />
            </g>

            <circle cx="146" cy="74" r="3" className="fill-coral-300 opacity-65" />
            <circle cx="318" cy="168" r="3" className="fill-coral-300 opacity-60" />
            <circle cx="292" cy="58" r="3" className="fill-coral-300 opacity-60" />
          </svg>
        </div>
      </div>
    </div>
  );
}
