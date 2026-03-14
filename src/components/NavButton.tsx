import { ReactNode } from 'react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

export function NavButton({ icon, label, active, onClick, hasNotification }: { 
  icon: ReactNode, 
  label: string, 
  active?: boolean, 
  onClick: () => void,
  hasNotification?: boolean
}) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center space-x-3 w-full p-4 rounded-xl transition-all duration-200 group relative",
        active 
          ? "bg-white text-primary-600 shadow-sm border border-surface-200" 
          : "text-ink-500 hover:bg-white/50 hover:text-ink-800"
      )}
    >
      {active && (
        <motion.div 
          layoutId="activeTab" 
          className="absolute left-0 w-1.5 h-8 bg-primary-500 rounded-r-full"
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
      <div className="relative ml-2">
        <div className={cn("transition-transform", active ? "scale-110" : "group-hover:scale-110")}>
          {icon}
        </div>
        {hasNotification && (
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-coral-500 rounded-full border-2 border-surface-50" />
        )}
      </div>
      <span className={cn("font-semibold text-sm", active ? "text-primary-600" : "")}>{label}</span>
    </button>
  );
}
