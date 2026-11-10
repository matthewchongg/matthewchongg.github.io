import React, { useRef, useEffect, useState } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
} from 'framer-motion';
import RoboticArmCanvas from './RoboticArmCanvas';
import HUD2DFallback from './HUD2DFallback';
import WebGLErrorBoundary from './WebGLErrorBoundary';
import { isWebGLAvailable } from '../utils/webgl';
import { RoboticClawIcon } from './Icons';
import { ArmTelemetryData } from '../types';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollOpenRef = useRef(0);
  const telemetryCallbackRef = useRef<((data: ArmTelemetryData) => void) | null>(null);
  const resetBlockTriggerRef = useRef(false);

  // Check WebGL availability with query param override support for testing (?webgl=0 or ?fallback=1)
  const [webGLSupported, setWebGLSupported] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('webgl') === '0' || urlParams.get('fallback') === '1') {
      return false;
    }
    return isWebGLAvailable();
  });

  const [activeTelemetry, setActiveTelemetry] = useState<{
    theta1: number;
    theta2: number;
    turretDeg: number;
    endX: number;
    endY: number;
  }>({
    theta1: 77.0,
    theta2: -63.0,
    turretDeg: 27,
    endX: -0.65,
    endY: -0.25,
  });

  const theta1NodeRef = useRef<HTMLSpanElement>(null);
  const theta2NodeRef = useRef<HTMLSpanElement>(null);
  const turretNodeRef = useRef<HTMLSpanElement>(null);
  const endCoordsNodeRef = useRef<HTMLSpanElement>(null);
  const apertureNodeRef = useRef<HTMLSpanElement>(null);
  const clawStateNodeRef = useRef<HTMLSpanElement>(null);
  const blockStatusNodeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    telemetryCallbackRef.current = (data: ArmTelemetryData) => {
      if (theta1NodeRef.current) theta1NodeRef.current.textContent = `${data.theta1}°`;
      if (theta2NodeRef.current) theta2NodeRef.current.textContent = `${data.theta2}°`;
      if (turretNodeRef.current) turretNodeRef.current.textContent = `${data.turretDeg}°`;
      if (endCoordsNodeRef.current) {
        endCoordsNodeRef.current.textContent = `[${data.endX}, ${data.endY}]`;
      }
      if (apertureNodeRef.current) {
        apertureNodeRef.current.textContent = `${data.aperture}%`;
      }
      if (clawStateNodeRef.current) {
        clawStateNodeRef.current.textContent = data.isHoldingBlock
          ? 'CLAW : HOLDING BLOCK'
          : data.isClosed
          ? 'CLAW : CLOSED [GRIP]'
          : 'CLAW : OPEN';
      }
      if (blockStatusNodeRef.current) {
        blockStatusNodeRef.current.textContent = data.isResettingBlock
          ? 'PIXEL_RESET [ACTIVE]'
          : data.isHoldingBlock
          ? 'GRIPPED [SQUISHED]'
          : 'FREE [FLOOR PHYSICS]';
      }

      setActiveTelemetry({
        theta1: data.theta1,
        theta2: data.theta2,
        turretDeg: data.turretDeg,
        endX: data.endX,
        endY: data.endY,
      });
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 75,
    damping: 22,
    mass: 0.45,
    restDelta: 0.0005,
  });

  useMotionValueEvent(smoothScroll, 'change', (latest) => {
    scrollOpenRef.current = Math.min(Math.max(latest * 1.35, 0), 1);
  });

  const armOpacity = useTransform(smoothScroll, [0, 0.65], [1, 0]);
  const armY = useTransform(smoothScroll, [0, 0.7], [0, -70]);
  const leftTextY = useTransform(smoothScroll, [0, 0.68], [0, -48]);
  const leftTextX = useTransform(smoothScroll, [0, 0.68], [0, -28]);
  const rightHudY = useTransform(smoothScroll, [0, 0.68], [0, -40]);
  const rightHudX = useTransform(smoothScroll, [0, 0.68], [0, 28]);
  const heroTextOpacity = useTransform(smoothScroll, [0, 0.58], [1, 0]);
  const heroScale = useTransform(smoothScroll, [0, 0.68], [1, 0.97]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative h-screen min-h-[480px] sm:min-h-[540px] max-h-screen w-full bg-[#050506] overflow-hidden flex flex-col justify-between pt-14 sm:pt-16 select-none"
    >
      {/* Background Atmospheric Glow & Hardware Grid */}
      <div className="absolute inset-0 hardware-grid-bg opacity-65 pointer-events-none" />
      <div className="absolute inset-0 atmospheric-glow pointer-events-none" />

      {/* Subtle Bottom Pedestal Floor Horizon */}
      <motion.div
        style={{ opacity: armOpacity }}
        className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-white/[0.04] to-transparent border-t border-white/[0.08] pointer-events-none"
      />

      {/* Right-Side Background Telemetry Info Boxes (Visible on tablets, laptops & desktop at z-20) */}
      <div className="hidden md:block absolute inset-0 z-20 pointer-events-none max-w-7xl mx-auto select-none">
        <motion.div
          initial={{ opacity: 0, x: 24, y: 12 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          style={{ x: rightHudX, y: rightHudY, opacity: heroTextOpacity }}
          className="absolute right-4 sm:right-6 md:right-8 bottom-16 sm:bottom-20 md:bottom-24 flex flex-col gap-2.5 sm:gap-3.5 w-60 md:w-72 pointer-events-none select-none"
        >
          {/* Background Info Box 1 */}
          <div className="p-4 bg-[#0d0d11]/85 border border-white/15 rounded relative select-none">
            <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t border-l border-white/55" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t border-r border-white/55" />
            <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b border-l border-white/55" />
            <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b border-r border-white/55" />

            <div className="flex items-center justify-between font-mono text-[10px] text-zinc-400 mb-2 pb-1.5 border-b border-white/15">
              <span>
                ENGINE :{' '}
                <span className={webGLSupported ? 'text-emerald-400' : 'text-amber-400'}>
                  {webGLSupported ? '3D_WEBGL' : '2D_VECTOR'}
                </span>
              </span>
              <span ref={clawStateNodeRef} className="text-white font-semibold">
                CLAW : OPEN
              </span>
            </div>
            <div className="space-y-1 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-zinc-500">CLAW_PINCH_XY</span>
                <span ref={endCoordsNodeRef} className="text-zinc-200">
                  [-0.65, -0.25]
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">BASE_TURRET_YAW</span>
                <span ref={turretNodeRef} className="text-zinc-200">
                  27°
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">JOINTS [θ1, θ2]</span>
                <span className="text-zinc-200">
                  <span ref={theta1NodeRef}>77.0°</span> /{' '}
                  <span ref={theta2NodeRef}>-63.0°</span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">CLAW_APERTURE</span>
                <span ref={apertureNodeRef} className="text-white font-semibold">
                  100%
                </span>
              </div>
            </div>
          </div>

          {/* Background Info Box 2 (Anchor for the 3D Red Reset Button right underneath) */}
          <div
            data-info-panel-anchor="true"
            className="p-4 bg-[#0d0d11]/85 border border-white/15 rounded font-mono text-[10px] text-zinc-400 space-y-2 relative select-none"
          >
            <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t border-l border-white/55" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t border-r border-white/55" />
            <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b border-l border-white/55" />
            <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b border-r border-white/55" />

            <div className="text-white font-semibold flex items-center justify-between">
              <span>SQUISHY BLOCK // PHY-01</span>
              <span className="text-[9px] text-red-400 tracking-wider">
                [RED BTN BELOW]
              </span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-zinc-500">OBJECT_STATE</span>
              <span ref={blockStatusNodeRef} className="text-zinc-200">
                FREE [FLOOR PHYSICS]
              </span>
            </div>
            <p className="text-zinc-500 leading-relaxed">
              Grab &amp; toss the block, or touch the red button below with the block or claw to pixel-reset.
            </p>
          </div>
        </motion.div>
      </div>

      {/* 3D Robotic Arm Canvas protected by WebGL check + WebGLErrorBoundary fallback to HUD2DFallback */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{ opacity: armOpacity, y: armY }}
        className="absolute inset-0 z-30 pointer-events-none select-none"
      >
        <WebGLErrorBoundary
          fallback={<HUD2DFallback telemetryData={activeTelemetry} />}
          onError={() => setWebGLSupported(false)}
        >
          {webGLSupported ? (
            <RoboticArmCanvas
              scrollOpenRef={scrollOpenRef}
              telemetryCallbackRef={telemetryCallbackRef}
              resetBlockTriggerRef={resetBlockTriggerRef}
            />
          ) : (
            <HUD2DFallback telemetryData={activeTelemetry} />
          )}
        </WebGLErrorBoundary>
      </motion.div>

      {/* Main Hero Text Content (Rendered at z-10 beneath the 3D robotic arm while preserving button clickability) */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 pt-8 md:pt-12 flex-1 flex flex-col justify-between pointer-events-none select-none">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            style={{
              x: leftTextX,
              y: leftTextY,
              scale: heroScale,
              opacity: heroTextOpacity,
            }}
            className="lg:col-span-6 space-y-5 pointer-events-auto select-none"
          >
            <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded border border-white/15 bg-[#101014] font-mono text-xs text-zinc-300">
              <span className="text-zinc-500">.01 //</span>
              <span>ABOUT ME</span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-[1.12]">
              Hi, I&apos;m Matthew.
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-zinc-300 font-normal leading-relaxed max-w-xl border-l-2 border-white/30 pl-5 py-1 bg-gradient-to-r from-white/[0.03] to-transparent">
              I&apos;m currently a college student pursuing Data Science and Artificial Intelligence at the HK Polytechnic University. I enjoy the process of building intelligent hardware, autonomous systems, and various software architectures.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <a
                href="#projects"
                className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white text-black font-medium text-sm hover:bg-zinc-200 transition-all shadow-[0_0_25px_rgba(255,255,255,0.2)]"
              >
                <RoboticClawIcon className="w-4 h-4" />
                <span>Explore Projects</span>
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          style={{ opacity: heroTextOpacity, y: leftTextY }}
          className="pb-6 flex flex-col items-center gap-1.5 font-mono text-[11px] text-zinc-400 tracking-widest uppercase pointer-events-auto select-none"
        >
          <a
            href="#projects"
            className="hover:text-white transition-colors flex items-center gap-2"
          >
            <span>SCROLL TO PROJECTS DECK</span>
            <span className="text-white animate-bounce">↓</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
