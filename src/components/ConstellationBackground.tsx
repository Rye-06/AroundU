import React, { useMemo } from 'react';

// Seeded pseudo-random for stable layouts across renders
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

interface Dot {
  id: string;
  x: number;
  y: number;
  r: number; // radius in px (2, 3, or 4 → visual sizes 4px, 6px, 8px)
}

interface Line {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

// Pre-defined cluster anchor points positioned intentionally around the viewport.
// Each cluster has a center (% of viewport) and a rough arc direction.
const CLUSTER_ANCHORS = [
  { cx: 12, cy: 8, spread: 6 },   // top-left corner accent
  { cx: 78, cy: 5, spread: 7 },   // top-right header accent
  { cx: 88, cy: 35, spread: 5 },  // right-side mid
  { cx: 8, cy: 55, spread: 6 },  // left-side mid
  { cx: 55, cy: 85, spread: 7 },  // bottom-center
  { cx: 30, cy: 92, spread: 5 },  // bottom-left
];

function generateClusters(seed: number): { dots: Dot[]; lines: Line[] } {
  const rand = seededRandom(seed);
  const allDots: Dot[] = [];
  const allLines: Line[] = [];
  let dotId = 0;

  CLUSTER_ANCHORS.forEach((anchor, ci) => {
    const numDots = Math.floor(rand() * 5) + 6; // 6-10 dots per cluster
    const clusterDots: Dot[] = [];

    // Generate dots in a curved arc around the anchor
    const arcStart = rand() * Math.PI * 2;
    const arcSpan = Math.PI * (0.6 + rand() * 0.8); // partial arc, not full circle

    for (let i = 0; i < numDots; i++) {
      const t = i / (numDots - 1); // 0..1
      const angle = arcStart + t * arcSpan;
      const dist = anchor.spread * (0.3 + rand() * 0.7);

      // Sizes: small=2, medium=3, large=4 (radius in px → 4px, 6px, 8px diameter)
      const sizeOptions = [2, 2, 3, 3, 3, 4]; // weighted toward medium
      const r = sizeOptions[Math.floor(rand() * sizeOptions.length)];

      const dot: Dot = {
        id: `c${ci}-d${dotId++}`,
        x: anchor.cx + Math.cos(angle) * dist + (rand() - 0.5) * 2,
        y: anchor.cy + Math.sin(angle) * dist + (rand() - 0.5) * 2,
        r,
      };

      clusterDots.push(dot);
      allDots.push(dot);
    }

    // Connect nearby dots within this cluster
    for (let i = 0; i < clusterDots.length; i++) {
      for (let j = i + 1; j < clusterDots.length; j++) {
        const d1 = clusterDots[i];
        const d2 = clusterDots[j];
        const dist = Math.sqrt((d2.x - d1.x) ** 2 + (d2.y - d1.y) ** 2);
        if (dist < anchor.spread * 0.8) {
          allLines.push({
            id: `${d1.id}-${d2.id}`,
            x1: d1.x,
            y1: d1.y,
            x2: d2.x,
            y2: d2.y,
          });
        }
      }
    }
  });

  return { dots: allDots, lines: allLines };
}

export function ConstellationBackground() {
  const { dots, lines } = useMemo(() => generateClusters(42), []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      <svg className="absolute w-full h-full" preserveAspectRatio="none">
        {/* Connecting lines within clusters */}
        {lines.map((line) => (
          <line
            key={line.id}
            x1={`${line.x1}%`}
            y1={`${line.y1}%`}
            x2={`${line.x2}%`}
            y2={`${line.y2}%`}
            stroke="currentColor"
            strokeWidth="0.8"
            className="text-primary-500 opacity-[0.08]"
          />
        ))}

        {/* Cluster dots — clearly visible */}
        {dots.map((dot) => (
          <circle
            key={dot.id}
            cx={`${dot.x}%`}
            cy={`${dot.y}%`}
            r={dot.r}
            className="fill-primary-500 opacity-[0.15]"
          />
        ))}
      </svg>
    </div>
  );
}
