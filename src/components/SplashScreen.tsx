import { motion } from 'framer-motion';
import { AroundULogo } from './AroundULogo';

export function SplashScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-surface-50 via-[#f8f5eb] to-surface-100"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-16 left-1/3 h-72 w-72 rounded-full bg-primary-200/30 blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-8 h-72 w-72 rounded-full bg-coral-100/28 blur-[120px] animate-pulse" style={{ animationDelay: '0.6s' }} />
      </div>

      <div className="absolute inset-0 flex items-center justify-center px-6">
        <AroundULogo showTagline className="scale-[1.08]" emblemClassName="h-24 w-24 sm:h-28 sm:w-28" />
      </div>
    </motion.div>
  );
}
