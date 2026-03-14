import React from 'react';

interface OrganicDividerProps {
  className?: string;
}

export function OrganicDivider({ className = '' }: OrganicDividerProps) {
  return (
    <div className={`w-full overflow-hidden leading-none ${className}`}>
      <svg
        className="relative block w-full h-8 sm:h-12"
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C73.23,26.47,152.23,46.29,228.14,58.33,260.67,63.46,293.18,62.33,321.39,56.44Z"
          className="fill-surface-200/50"
        ></path>
      </svg>
    </div>
  );
}
