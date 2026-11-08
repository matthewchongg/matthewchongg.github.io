import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRightIcon } from './Icons';

/**
 * Monochrome LoopDay Calendar Logo with Spinning Sync Arrows Inside
 * Matches the user's attached LoopDay icon in a stark black-and-white hardware theme.
 */
export function LoopDayMonochromeLogo({ className = 'w-12 h-12' }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Rounded Square Outer Badge */}
      <rect
        x="2"
        y="2"
        width="60"
        height="60"
        rx="14"
        fill="#141418"
        stroke="#52525b"
        strokeWidth="2"
      />

      {/* White Calendar Body */}
      <rect
        x="11"
        y="15"
        width="42"
        height="38"
        rx="8"
        fill="#f4f4f5"
      />

      {/* Dark Calendar Top Header Bar */}
      <path
        d="M11 23C11 18.5817 14.5817 15 19 15H45C49.4183 15 53 18.5817 53 23V27H11V23Z"
        fill="#18181b"
      />

      {/* Left & Right Calendar Binding Rings */}
      <rect
        x="20"
        y="9"
        width="6"
        height="12"
        rx="3"
        fill="#f4f4f5"
        stroke="#18181b"
        strokeWidth="2"
      />
      <rect
        x="38"
        y="9"
        width="6"
        height="12"
        rx="3"
        fill="#f4f4f5"
        stroke="#18181b"
        strokeWidth="2"
      />

      {/* Spinning Circular Sync Arrows Inside the Calendar Body (centered at 32, 39.5) */}
      <g
        style={{
          transformOrigin: '32px 39.5px',
          animation: 'spin 5s linear infinite',
        }}
      >
        {/* Top-Right Curved Sync Arrow */}
        <path
          d="M23.5 36.5 A 9.2 9.2 0 0 1 39.2 33.8"
          stroke="#141418"
          strokeWidth="3.4"
          strokeLinecap="round"
          fill="none"
        />
        <polygon points="41.8,29.8 42.6,37.2 35.4,35.8" fill="#141418" />

        {/* Bottom-Left Curved Sync Arrow */}
        <path
          d="M40.5 42.5 A 9.2 9.2 0 0 1 24.8 45.2"
          stroke="#141418"
          strokeWidth="3.4"
          strokeLinecap="round"
          fill="none"
        />
        <polygon points="22.2,49.2 21.4,41.8 28.6,43.2" fill="#141418" />
      </g>
    </svg>
  );
}

/**
 * Extended Robotic Arm Limb + Wrist + Articulated Mechanical Claw SVG
 * Includes a long upper connecting limb reaching all the way to the top of the section/page
 * so it looks like it is extending directly down from the main robotic arm above.
 */
export function ExtendedRoboticArmClaw({ isExtended, isClamped }) {
  return (
    <div className="flex flex-col items-center pointer-events-none select-none">
      <svg
        width="120"
        height="96"
        viewBox="0 0 120 96"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible drop-shadow-[0_14px_24px_rgba(0,0,0,0.95)]"
      >
        {/* ================================================================
            UPPER CONNECTING ROBOTIC LIMB EXTENDING TO THE TOP OF THE PAGE
            ================================================================ */}
        {/* Upper Arm Boom Housing (y = -680 to -115) */}
        <rect
          x="48"
          y="-680"
          width="24"
          height="565"
          fill="#d4d4dc"
          stroke="#18181b"
          strokeWidth="1.5"
        />
        {/* Recessed Dark Actuator Channel along Upper Boom */}
        <rect
          x="56"
          y="-680"
          width="8"
          height="565"
          fill="#18181b"
        />
        {/* Side Hydraulic Conduit Lines */}
        <line x1="51" y1="-680" x2="51" y2="-115" stroke="#71717a" strokeWidth="1" />
        <line x1="69" y1="-680" x2="69" y2="-115" stroke="#71717a" strokeWidth="1" />

        {/* Articulated Elbow Joint Drum (at y = -110) */}
        <circle
          cx="60"
          cy="-110"
          r="16"
          fill="#f1f1f4"
          stroke="#18181b"
          strokeWidth="1.8"
        />
        <circle
          cx="60"
          cy="-110"
          r="10"
          fill="#141418"
          stroke="#a1a1aa"
          strokeWidth="1.2"
        />
        <circle cx="60" cy="-110" r="3.5" fill="#ffffff" />

        {/* Forearm Connecting Limb Segment (y = -94 to 12) */}
        <rect
          x="50"
          y="-94"
          width="20"
          height="106"
          rx="3"
          fill="#f1f1f4"
          stroke="#18181b"
          strokeWidth="1.5"
        />
        <rect
          x="57"
          y="-86"
          width="6"
          height="90"
          rx="1.5"
          fill="#27272a"
        />

        {/* ================================================================
            WRIST ROTARY HOUSING & MECHANICAL GRIPPER CLAW
            ================================================================ */}
        {/* Forearm White Wrist Housing Segment */}
        <rect
          x="46"
          y="10"
          width="28"
          height="28"
          rx="5"
          fill="#f1f1f4"
          stroke="#18181b"
          strokeWidth="1.6"
        />
        {/* Dark Rotary Wrist Drum */}
        <circle
          cx="60"
          cy="24"
          r="8.5"
          fill="#141418"
          stroke="#a1a1aa"
          strokeWidth="1.5"
        />
        <circle cx="60" cy="24" r="3" fill="#ffffff" />

        {/* Wrist Collar & Horizontal Actuator Bar */}
        <rect
          x="49"
          y="38"
          width="22"
          height="10"
          rx="2"
          fill="#a1a1aa"
          stroke="#18181b"
          strokeWidth="1.2"
        />
        <rect
          x="28"
          y="48"
          width="64"
          height="9"
          rx="3"
          fill="#141418"
          stroke="#71717a"
          strokeWidth="1.2"
        />

        {/* Left Articulated Mechanical Gripper Finger */}
        <motion.g
          initial={false}
          animate={{
            x: isClamped ? 10 : isExtended ? -4 : 6,
            rotate: isClamped ? -12 : isExtended ? 14 : 0,
          }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          style={{ originX: '34px', originY: '54px' }}
        >
          <path
            d="M30 56 L22 76 L30 92 L38 89 L33 75 L39 56 Z"
            fill="#f1f1f4"
            stroke="#18181b"
            strokeWidth="1.6"
          />
          <circle cx="34" cy="56" r="3" fill="#141418" />
        </motion.g>

        {/* Right Articulated Mechanical Gripper Finger */}
        <motion.g
          initial={false}
          animate={{
            x: isClamped ? -10 : isExtended ? 4 : -6,
            rotate: isClamped ? 12 : isExtended ? -14 : 0,
          }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          style={{ originX: '86px', originY: '54px' }}
        >
          <path
            d="M90 56 L98 76 L90 92 L82 89 L87 75 L81 56 Z"
            fill="#f1f1f4"
            stroke="#18181b"
            strokeWidth="1.6"
          />
          <circle cx="86" cy="56" r="3" fill="#141418" />
        </motion.g>
      </svg>
    </div>
  );
}

export default function ProjectCard({
  project,
  index,
  slotIndex = index,
  isVisibleSlot = true,
  isHovered,
  onHoverStart,
  onHoverEnd,
  onGrabSelect,
}) {
  const hitBoxRef = useRef(null);
  const tagsViewportRef = useRef(null);
  const tagsContentRef = useRef(null);
  const [scrollDistance, setScrollDistance] = useState(0);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 220, damping: 24, mass: 0.6 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), springConfig);
  const glareX = useSpring(useTransform(mouseX, [-0.5, 0.5], [0, 100]), springConfig);
  const glareY = useSpring(useTransform(mouseY, [-0.5, 0.5], [0, 100]), springConfig);

  // Measure horizontal overflow of the single-line language tags so they autoscroll on hover
  useEffect(() => {
    const updateOverflow = () => {
      if (tagsViewportRef.current && tagsContentRef.current) {
        const overflow =
          tagsContentRef.current.scrollWidth - tagsViewportRef.current.clientWidth;
        setScrollDistance(overflow > 4 ? overflow + 8 : 0);
      }
    };
    updateOverflow();
    window.addEventListener('resize', updateOverflow);
    return () => window.removeEventListener('resize', updateOverflow);
  }, [project.techStack]);

  const handleMouseMove = (e) => {
    if (!hitBoxRef.current) return;
    const rect = hitBoxRef.current.getBoundingClientRect();
    const nx = Math.min(Math.max((e.clientX - rect.left) / rect.width - 0.5, -0.5), 0.5);
    const ny = Math.min(Math.max((e.clientY - rect.top) / rect.height - 0.5, -0.5), 0.5);
    mouseX.set(nx);
    mouseY.set(ny);
  };

  const clampedSlot = Math.min(Math.max(slotIndex, -1), 4);
  const perspectiveRotateY = (clampedSlot - 1.5) * -8;

  return (
    /* Stationary Hit-Target Wrapper: prevents boundary hover glitching */
    <motion.div
      ref={hitBoxRef}
      animate={{
        opacity: isVisibleSlot ? 1 : 0,
        scale: isVisibleSlot ? 1 : 0.92,
      }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {
        if (isVisibleSlot) onHoverStart(project, slotIndex);
      }}
      onMouseLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
        onHoverEnd();
      }}
      onClick={() => {
        if (isVisibleSlot) onGrabSelect(project);
      }}
      className={`relative group select-none w-[285px] flex-shrink-0 py-3 ${
        isVisibleSlot ? 'cursor-pointer pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      <motion.div
        layoutId={`project-card-container-${project.id}`}
        animate={{
          y: isHovered ? -10 : 0,
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        className="relative w-full pointer-events-none"
      >
        {/* 1. 3D Perspective Card Container (isolated stacking context so it NEVER occludes the claw!) */}
        <div className="relative z-10 w-full" style={{ perspective: '1200px' }}>
          <motion.article
            style={{
              rotateX: isHovered ? rotateX : 0,
              rotateY: isHovered ? rotateY : perspectiveRotateY,
            }}
            className={`relative w-full min-h-[385px] rounded-2xl p-6 flex flex-col justify-between transition-colors duration-300 border pointer-events-none ${
              isHovered
                ? 'bg-charcoal-800/95 border-white/50 shadow-hardware-hover'
                : 'bg-charcoal-900/85 border-white/10 shadow-hardware'
            } backdrop-blur-xl overflow-hidden`}
          >
            {/* Top Mechanical Grab Latch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-2 rounded-b bg-white/25 group-hover:bg-white transition-colors" />

            {/* Dynamic Specular Glare */}
            <motion.div
              className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: useTransform(
                  [glareX, glareY],
                  ([gx, gy]) =>
                    `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.02) 45%, transparent 75%)`
                ),
              }}
            />

            <div className="relative z-10 space-y-4 pt-1">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono text-xs text-zinc-400 tracking-widest">
                  .{project.index} // {project.code}
                </span>
                <span
                  className={`font-mono text-[10px] px-2 py-0.5 rounded border uppercase tracking-wider ${
                    project.isWip
                      ? 'border-zinc-600 bg-zinc-800/80 text-zinc-300'
                      : 'border-white/30 bg-white/10 text-white'
                  }`}
                >
                  {project.status}
                </span>
              </div>

              {/* Schematic Preview Box */}
              <div className="relative h-28 w-full rounded-xl bg-[#070709] border border-white/10 overflow-hidden flex items-center justify-center hardware-subgrid-bg px-3">
                {project.id === 'loopday' && (
                  <div className="flex items-center gap-3.5">
                    <LoopDayMonochromeLogo className="w-12 h-12 flex-shrink-0" />
                    <div className="font-mono text-[10px] text-zinc-300 space-y-1">
                      <div className="text-white font-semibold tracking-wider">
                        LOOPDAY // ADDON
                      </div>
                      <div className="text-zinc-400">
                        Your Schedule, on Autopilot
                      </div>
                    </div>
                  </div>
                )}

                {project.id === 'friendly-feud' && (
                  <div className="grid grid-cols-2 gap-1.5 w-4/5 font-mono text-[10px]">
                    <div className="px-2 py-1 rounded bg-white/10 border border-white/25 text-white flex justify-between">
                      <span>01 SURVEY</span>
                      <span>48</span>
                    </div>
                    <div className="px-2 py-1 rounded bg-white/[0.04] border border-white/10 text-zinc-400 flex justify-between">
                      <span>02 BUZZER</span>
                      <span>27</span>
                    </div>
                    <div className="px-2 py-1 rounded bg-white/[0.04] border border-white/10 text-zinc-400 flex justify-between">
                      <span>03 STATE</span>
                      <span>15</span>
                    </div>
                    <div className="px-2 py-1 rounded bg-white/[0.04] border border-white/10 text-zinc-400 flex justify-between">
                      <span>04 HOST</span>
                      <span>10</span>
                    </div>
                  </div>
                )}

                {project.isWip && (
                  <div className="flex flex-col items-center gap-1.5 font-mono text-center px-4">
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-300 border border-white/20 px-2.5 py-1 rounded-full bg-white/[0.04]">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      <span>WORK IN PROGRESS</span>
                    </div>
                    <span className="text-[10px] text-zinc-500 tracking-wider">
                      {project.code} // LAB PROTOTYPE
                    </span>
                  </div>
                )}
              </div>

              <div>
                <motion.h3
                  layoutId={`project-title-${project.id}`}
                  className="font-display text-2xl font-semibold text-white tracking-tight"
                >
                  {project.title}
                </motion.h3>
                <motion.p
                  layoutId={`project-subtitle-${project.id}`}
                  className="font-mono text-xs text-zinc-400 mt-0.5 truncate"
                >
                  {project.subtitle}
                </motion.p>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed line-clamp-4">
                {project.shortDescription}
              </p>
            </div>

            {/* Single-Line Language Tags Bar (Auto-scrolls horizontally on hover if overflowing) */}
            <div className="relative z-10 pt-4 mt-3 border-t border-white/10 flex items-center justify-between gap-2.5">
              <div
                ref={tagsViewportRef}
                className="flex-1 min-w-0 overflow-hidden whitespace-nowrap relative"
                style={{
                  maskImage:
                    'linear-gradient(to right, black 82%, transparent 100%)',
                  WebkitMaskImage:
                    'linear-gradient(to right, black 82%, transparent 100%)',
                }}
              >
                <motion.div
                  ref={tagsContentRef}
                  animate={{
                    x: isHovered && scrollDistance > 0 ? -scrollDistance : 0,
                  }}
                  transition={{
                    duration: isHovered ? Math.max(1.8, scrollDistance * 0.022) : 0.4,
                    ease: 'easeInOut',
                    repeat: isHovered && scrollDistance > 0 ? Infinity : 0,
                    repeatType: 'reverse',
                    repeatDelay: 0.35,
                  }}
                  className="inline-flex items-center gap-1.5 whitespace-nowrap pr-3"
                >
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="font-mono text-[10px] px-2 py-0.5 rounded bg-white/[0.05] text-zinc-300 border border-white/10 flex-shrink-0"
                    >
                      {tech}
                    </span>
                  ))}
                </motion.div>
              </div>

              <span className="inline-flex items-center gap-1 font-mono text-[11px] text-white font-medium flex-shrink-0 whitespace-nowrap group-hover:translate-x-0.5 transition-transform">
                <span>GRAB MODULE</span>
                <ArrowUpRightIcon className="w-3.5 h-3.5" />
              </span>
            </div>
          </motion.article>
        </div>

        {/* 2. Extended Robotic Arm Limb + Claw (Rendered AFTER the card at z-50 so it is ALWAYS in front of the box!) */}
        <motion.div
          initial={{ opacity: 0, y: -120 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? -54 : -120,
          }}
          transition={{ type: 'spring', stiffness: 270, damping: 24 }}
          className="absolute top-0 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex flex-col items-center"
        >
          <ExtendedRoboticArmClaw isExtended={isHovered} isClamped={false} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
