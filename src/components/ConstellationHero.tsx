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
            See what is happening near you, join nearby circles, and start welcoming hangouts in one tap.
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
              <radialGradient id="heroGlow" cx="52%" cy="48%" r="60%">
                <stop offset="0%" stopColor="rgba(240,233,211,0.85)" />
                <stop offset="100%" stopColor="rgba(240,233,211,0)" />
              </radialGradient>
            </defs>

            <circle cx="210" cy="108" r="96" fill="url(#heroGlow)" />

            <path d="M142 92A66 66 0 0 1 182 42" fill="none" stroke="currentColor" strokeWidth="5" className="text-primary-400 opacity-60" strokeLinecap="round" />
            <path d="M234 40A66 66 0 0 1 278 79" fill="none" stroke="currentColor" strokeWidth="5" className="text-primary-400 opacity-60" strokeLinecap="round" />
            <path d="M280 134A66 66 0 0 1 246 173" fill="none" stroke="currentColor" strokeWidth="5" className="text-primary-400 opacity-60" strokeLinecap="round" />
            <path d="M176 176A66 66 0 0 1 140 138" fill="none" stroke="currentColor" strokeWidth="5" className="text-primary-400 opacity-60" strokeLinecap="round" />

            <line x1="208" y1="109" x2="174" y2="125" stroke="currentColor" strokeWidth="5" className="text-primary-500 opacity-70" strokeLinecap="round" />
            <line x1="208" y1="109" x2="220" y2="78" stroke="currentColor" strokeWidth="5" className="text-primary-500 opacity-70" strokeLinecap="round" />
            <line x1="208" y1="109" x2="243" y2="123" stroke="currentColor" strokeWidth="5" className="text-primary-500 opacity-70" strokeLinecap="round" />
            <line x1="174" y1="125" x2="188" y2="84" stroke="currentColor" strokeWidth="4" className="text-primary-500 opacity-48" strokeLinecap="round" />
            <line x1="243" y1="123" x2="229" y2="148" stroke="currentColor" strokeWidth="4" className="text-primary-500 opacity-48" strokeLinecap="round" />

            <circle cx="208" cy="109" r="18" className="fill-primary-500 opacity-75" />
            <circle cx="174" cy="125" r="10" className="fill-primary-500 opacity-70" />
            <circle cx="220" cy="78" r="9" className="fill-primary-500 opacity-64" />
            <circle cx="243" cy="123" r="8.5" className="fill-primary-500 opacity-58" />
            <circle cx="188" cy="84" r="7" className="fill-primary-500 opacity-52" />
            <circle cx="229" cy="148" r="7" className="fill-primary-500 opacity-52" />
            <circle cx="130" cy="103" r="4" className="fill-coral-300 opacity-70" />
            <circle cx="292" cy="102" r="4" className="fill-coral-300 opacity-65" />
            <circle cx="214" cy="188" r="4" className="fill-coral-300 opacity-65" />

            <g transform="translate(218 44)" className="text-primary-600 opacity-75">
              <Users className="w-4 h-4" />
            </g>
            <g transform="translate(256 66)" className="text-primary-600 opacity-72">
              <MapPin className="w-4 h-4" />
            </g>
            <g transform="translate(158 146)" className="text-primary-600 opacity-72">
              <MapPin className="w-4 h-4" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
