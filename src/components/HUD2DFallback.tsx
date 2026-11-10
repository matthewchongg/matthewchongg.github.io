import React, { useEffect, useState } from 'react';

interface HUD2DFallbackProps {
  telemetryData?: {
    theta1: number;
    theta2: number;
    turretDeg: number;
    endX: number;
    endY: number;
  };
}

/**
 * Lightweight, crash-proof 2D SVG/CSS animated digital twin.
 * Activated whenever WebGL hardware acceleration is missing or Three.js fails.
 */
export default function HUD2DFallback({ telemetryData }: HUD2DFallbackProps) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let frameId: number;
    const update = () => {
      setTime(performance.now() * 0.001);
      frameId = requestAnimationFrame(update);
    };
    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Compute animated joint angles if telemetry is idle
  const t = time * 0.8;
  const th1 = telemetryData ? telemetryData.theta1 : Math.sin(t) * 24 - 15;
  const th2 = telemetryData ? telemetryData.theta2 : Math.cos(t * 1.1) * 35 + 40;
  const turret = telemetryData ? telemetryData.turretDeg : Math.sin(t * 0.5) * 18;

  // Kinematic 2D forward projection for schematic display
  const basePoint = { x: 300, y: 390 };
  const L1_len = 135;
  const L2_len = 115;
  const L3_len = 45;

  const rad1 = ((th1 - 90) * Math.PI) / 180;
  const j1 = {
    x: basePoint.x + Math.cos(rad1) * L1_len,
    y: basePoint.y + Math.sin(rad1) * L1_len,
  };

  const rad2 = rad1 + (th2 * Math.PI) / 180;
  const j2 = {
    x: j1.x + Math.cos(rad2) * L2_len,
    y: j1.y + Math.sin(rad2) * L2_len,
  };

  const rad3 = rad2 + 0.2;
  const tip = {
    x: j2.x + Math.cos(rad3) * L3_len,
    y: j2.y + Math.sin(rad3) * L3_len,
  };

  return (
    <div className="w-full h-full relative select-none flex items-center justify-center overflow-hidden">
      {/* Background vector tactical grid */}
      <div className="absolute inset-0 hardware-grid-bg opacity-30 pointer-events-none" />

      {/* Atmospheric Radial Sheen */}
      <div className="absolute w-[480px] h-[480px] rounded-full bg-white/[0.02] blur-3xl pointer-events-none" />

      <svg
        viewBox="0 0 600 480"
        className="w-full h-full max-w-[680px] max-h-[520px] relative z-10 drop-shadow-[0_0_25px_rgba(255,255,255,0.06)]"
      >
        <defs>
          <linearGradient id="linkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#71717a" stopOpacity="0.4" />
          </linearGradient>
          <radialGradient id="targetGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Circular Radar Sweep Background */}
        <circle
          cx={basePoint.x}
          cy={basePoint.y}
          r={240}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
          strokeDasharray="4 6"
        />
        <circle
          cx={basePoint.x}
          cy={basePoint.y}
          r={160}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
        />
        <circle
          cx={basePoint.x}
          cy={basePoint.y}
          r={80}
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1"
          strokeDasharray="2 4"
        />

        {/* Dynamic sweeping radar vector line */}
        <line
          x1={basePoint.x}
          y1={basePoint.y}
          x2={basePoint.x + Math.cos(time * 1.5) * 240}
          y2={basePoint.y + Math.sin(time * 1.5) * 240}
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1"
        />

        {/* Seated Pedestal / Base Platform */}
        <path
          d={`M ${basePoint.x - 65} ${basePoint.y + 25} L ${basePoint.x + 65} ${basePoint.y + 25} L ${basePoint.x + 45} ${basePoint.y} L ${basePoint.x - 45} ${basePoint.y} Z`}
          fill="#18181b"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1.5"
        />
        <circle
          cx={basePoint.x}
          cy={basePoint.y}
          r={18}
          fill="#09090b"
          stroke="#ffffff"
          strokeWidth="2"
        />

        {/* Arm Link 1 (Shoulder to Elbow) */}
        <line
          x1={basePoint.x}
          y1={basePoint.y}
          x2={j1.x}
          y2={j1.y}
          stroke="url(#linkGrad)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <line
          x1={basePoint.x}
          y1={basePoint.y}
          x2={j1.x}
          y2={j1.y}
          stroke="#09090b"
          strokeWidth="2"
        />

        {/* Elbow Joint Pivot */}
        <circle
          cx={j1.x}
          cy={j1.y}
          r={11}
          fill="#18181b"
          stroke="#ffffff"
          strokeWidth="2"
        />
        <circle cx={j1.x} cy={j1.y} r={3} fill="#ffffff" />

        {/* Arm Link 2 (Elbow to Wrist) */}
        <line
          x1={j1.x}
          y1={j1.y}
          x2={j2.x}
          y2={j2.y}
          stroke="url(#linkGrad)"
          strokeWidth="4.5"
          strokeLinecap="round"
        />

        {/* Wrist Joint Pivot */}
        <circle
          cx={j2.x}
          cy={j2.y}
          r={8}
          fill="#18181b"
          stroke="#a1a1aa"
          strokeWidth="1.5"
        />

        {/* End-Effector / Micro Claw */}
        <line
          x1={j2.x}
          y1={j2.y}
          x2={tip.x}
          y2={tip.y}
          stroke="#ffffff"
          strokeWidth="3"
        />
        {/* Left and Right Finger Vane */}
        <line
          x1={tip.x}
          y1={tip.y}
          x2={tip.x - 8}
          y2={tip.y - 10}
          stroke="#ffffff"
          strokeWidth="2"
        />
        <line
          x1={tip.x}
          y1={tip.y}
          x2={tip.x + 8}
          y2={tip.y - 10}
          stroke="#ffffff"
          strokeWidth="2"
        />

        {/* Target Reticle at Claw Tip */}
        <circle
          cx={tip.x}
          cy={tip.y}
          r={18}
          fill="url(#targetGlow)"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1"
          strokeDasharray="2 3"
        />
        <circle cx={tip.x} cy={tip.y} r={2} fill="#ffffff" />

        {/* Tactical HUD Coordinate Readout Overlay */}
        <g transform="translate(40, 60)" className="font-mono text-[10px] fill-zinc-400">
          <rect
            x="0"
            y="0"
            width="170"
            height="86"
            fill="#09090b"
            fillOpacity="0.85"
            stroke="rgba(255,255,255,0.15)"
            rx="6"
          />
          <text x="12" y="20" fill="#ffffff" fontWeight="600" letterSpacing="0.1em">
            MODE // 2D_VECTOR_HUD
          </text>
          <text x="12" y="38">
            THETA_1 : <tspan fill="#ffffff">{th1.toFixed(1)}°</tspan>
          </text>
          <text x="12" y="52">
            THETA_2 : <tspan fill="#ffffff">{th2.toFixed(1)}°</tspan>
          </text>
          <text x="12" y="66">
            TURRET &nbsp;: <tspan fill="#ffffff">{turret.toFixed(1)}°</tspan>
          </text>
          <circle cx="150" cy="18" r="3" fill="#22c55e" />
        </g>

        {/* Tactical Status Tag in Bottom Right */}
        <g transform="translate(420, 420)" className="font-mono text-[9px] fill-zinc-500">
          <text x="0" y="0" textAnchor="end">
            FALLBACK ENGINE : ACTIVE
          </text>
          <text x="0" y="14" textAnchor="end" fill="rgba(255,255,255,0.3)">
            ZERO_CRASH_ARCHITECTURE
          </text>
        </g>
      </svg>
    </div>
  );
}
