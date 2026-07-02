import { useEffect, useRef } from 'react';

const ORBS = [
  { color: 'rgba(0, 212, 255, 0.08)', size: 600, x: '15%', y: '20%', delay: 0 },
  { color: 'rgba(168, 85, 247, 0.06)', size: 500, x: '75%', y: '15%', delay: 5 },
  { color: 'rgba(16, 185, 129, 0.05)', size: 450, x: '60%', y: '70%', delay: 10 },
  { color: 'rgba(245, 158, 11, 0.05)', size: 400, x: '25%', y: '75%', delay: 15 },
  { color: 'rgba(0, 212, 255, 0.04)', size: 350, x: '85%', y: '50%', delay: 8 },
];

export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* Gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#060a14] via-[#0a1020] to-[#060a14]" />

      {/* Floating orbs */}
      {ORBS.map((orb, i) => (
        <div
          key={i}
          className={i % 2 === 0 ? 'animate-float' : 'animate-float-reverse'}
          style={{
            position: 'absolute',
            left: orb.x,
            top: orb.y,
            width: orb.size,
            height: orb.size,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: 'blur(40px)',
            animationDelay: `${orb.delay}s`,
            willChange: 'transform',
          }}
        />
      ))}

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay animate-grid-pulse" />

      {/* Scan line */}
      <div
        className="absolute left-0 right-0 h-[1px] animate-scan opacity-20"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.3), transparent)',
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, #060a14 100%)',
        }}
      />

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
