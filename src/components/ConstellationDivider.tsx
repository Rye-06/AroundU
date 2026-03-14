import React from 'react';
import { cn } from '../lib/utils';

export function ConstellationDivider({ className }: { className?: string }) {
  return (
    <div className={cn("w-full flex items-center justify-center space-x-4 opacity-30", className)}>
      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-primary-300 to-transparent"></div>
      <div className="flex space-x-2">
        <div className="w-1 h-1 rounded-full bg-primary-400"></div>
        <div className="w-1 h-1 rounded-full bg-primary-400"></div>
        <div className="w-1 h-1 rounded-full bg-coral-400 opacity-70"></div>
      </div>
      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-primary-300 to-transparent"></div>
    </div>
  );
}
