import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PROJECTS_DATA } from '../data/projects';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';

const CARD_STEP_PX = 305; // 285px card width + 20px gap

export default function ProjectsSection({ onActiveCardChange }) {
  const sectionRef = useRef(null);
  const lastAutoScrollTimeRef = useRef(0);
  const [hoveredProject, setHoveredProject] = useState(null);
  const [hoveredSlotIndex, setHoveredSlotIndex] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [startIndex, setStartIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    const updateVisibleCount = () => {
      const w = window.innerWidth;
      const count = w >= 1200 ? 4 : w >= 900 ? 3 : w >= 640 ? 2 : 1;
      setVisibleCount(count);
      setStartIndex((prev) =>
        Math.min(prev, Math.max(0, PROJECTS_DATA.length - count))
      );
    };
    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  const maxStartIndex = Math.max(0, PROJECTS_DATA.length - visibleCount);
  const canPanLeft = startIndex > 0;
  const canPanRight = startIndex < maxStartIndex;

  const handlePanLeft = () => {
    setHoveredProject(null);
    setHoveredSlotIndex(null);
    setStartIndex((prev) => Math.max(0, prev - 1));
  };

  const handlePanRight = () => {
    setHoveredProject(null);
    setHoveredSlotIndex(null);
    setStartIndex((prev) => Math.min(maxStartIndex, prev + 1));
  };

  const alignProjectsViewport = () => {
    if (!sectionRef.current) return;
    const now = performance.now();
    if (now - lastAutoScrollTimeRef.current < 900) return;
    const rect = sectionRef.current.getBoundingClientRect();
    if (Math.abs(rect.top) > 32 && Math.abs(rect.top) < window.innerHeight * 0.78) {
      lastAutoScrollTimeRef.current = now;
      sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleHoverStart = (project, slotIdx) => {
    setHoveredProject(project);
    setHoveredSlotIndex(slotIdx);
    onActiveCardChange?.(project);
    alignProjectsViewport();
  };

  const handleHoverEnd = () => {
    setHoveredProject(null);
    setHoveredSlotIndex(null);
    if (!selectedProject) {
      onActiveCardChange?.(null);
    }
  };

  const handleGrabSelect = (project) => {
    setSelectedProject(project);
    onActiveCardChange?.(project);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
    onActiveCardChange?.(null);
  };

  const spotlightLeft =
    hoveredSlotIndex !== null ? `${18 + hoveredSlotIndex * 21}%` : '50%';

  const deckWidthPx = visibleCount * 285 + (visibleCount - 1) * 20;
  const startLabel = String(startIndex + 1).padStart(2, '0');
  const endLabel = String(
    Math.min(PROJECTS_DATA.length, startIndex + visibleCount)
  ).padStart(2, '0');
  const totalLabel = String(PROJECTS_DATA.length).padStart(2, '0');

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative min-h-screen pt-20 pb-12 px-6 bg-[#060608] border-t border-white/[0.08] overflow-hidden flex flex-col justify-center select-none"
    >
      {/* Dynamic Atmospheric Radial Glow that follows the hovered project box */}
      <div
        className="absolute top-[56%] -translate-x-1/2 -translate-y-1/2 w-[880px] h-[460px] rounded-full pointer-events-none blur-[145px] transition-all duration-700 ease-out"
        style={{
          left: spotlightLeft,
          opacity: hoveredProject ? 0.95 : 0.55,
          background:
            'radial-gradient(circle, rgba(255,255,255,0.085) 0%, rgba(161,161,170,0.025) 60%, transparent 100%)',
        }}
      />
      <div className="absolute inset-0 hardware-grid-bg opacity-45 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Section Header + Top Deck Navigation Arrows */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-4">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-zinc-400 tracking-widest uppercase">
              <span className="text-white font-semibold">.02</span>
              <span>// SELECTED SYSTEMS &amp; ARCHITECTURES</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-semibold tracking-tight text-white">
              Engineered Modules
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base max-w-xl">
              Hover any card to extend the robotic gripper over the module. Use the left and right arrows to pan through all engineered and template modules.
            </p>
          </div>

          {/* Top-Right Horizontal Pan Controls & Module Index Counter */}
          <div className="flex items-center gap-3 self-start md:self-end">
            <div className="font-mono text-xs text-zinc-400 px-3 py-2 rounded-lg bg-[#101014] border border-white/10 tracking-wider">
              MODULES <span className="text-white font-semibold">{startLabel}–{endLabel}</span> // {totalLabel}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePanLeft}
                disabled={!canPanLeft}
                aria-label="Previous project module"
                className={`w-10 h-10 rounded-xl border flex items-center justify-center font-mono text-sm transition-all ${
                  canPanLeft
                    ? 'bg-[#101014] border-white/25 text-white hover:bg-white hover:text-black shadow-[0_0_20px_rgba(255,255,255,0.12)] cursor-pointer'
                    : 'bg-[#0a0a0d] border-white/10 text-zinc-600 cursor-not-allowed'
                }`}
              >
                ←
              </button>
              <button
                type="button"
                onClick={handlePanRight}
                disabled={!canPanRight}
                aria-label="Next project module"
                className={`w-10 h-10 rounded-xl border flex items-center justify-center font-mono text-sm transition-all ${
                  canPanRight
                    ? 'bg-[#101014] border-white/25 text-white hover:bg-white hover:text-black shadow-[0_0_20px_rgba(255,255,255,0.12)] cursor-pointer'
                    : 'bg-[#0a0a0d] border-white/10 text-zinc-600 cursor-not-allowed'
                }`}
              >
                →
              </button>
            </div>
          </div>
        </div>

        {/* 3D Perspective Horizontal Panning Track + Side Left/Right Arrow Buttons */}
        <div className="relative flex items-center justify-center">
          {/* Left Side Arrow Button */}
          <button
            type="button"
            onClick={handlePanLeft}
            disabled={!canPanLeft}
            aria-label="Pan projects left"
            className={`hidden sm:flex absolute left-0 xl:-left-5 z-40 w-11 h-11 rounded-full border items-center justify-center font-mono text-base transition-all ${
              canPanLeft
                ? 'bg-[#101014]/95 border-white/30 text-white hover:bg-white hover:text-black hover:scale-105 shadow-[0_10px_28px_rgba(0,0,0,0.85)] cursor-pointer'
                : 'bg-[#09090c]/70 border-white/10 text-zinc-600 opacity-50 cursor-not-allowed'
            }`}
          >
            ←
          </button>

          {/* Centered 4-Card Deck Window (No overflow-y clipping so the robotic arm limb extends freely to the top!) */}
          <div
            className="relative pt-6 pb-6 mx-auto"
            style={{
              width: `${deckWidthPx}px`,
              maxWidth: '100%',
              perspective: '1600px',
            }}
          >
            <motion.div
              animate={{ x: -startIndex * CARD_STEP_PX }}
              transition={{ type: 'spring', stiffness: 210, damping: 28, mass: 0.75 }}
              className="flex items-center gap-5"
            >
              {PROJECTS_DATA.map((project, index) => {
                const slotIndex = index - startIndex;
                const isVisibleSlot =
                  slotIndex >= 0 && slotIndex < visibleCount;
                return (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                    slotIndex={slotIndex}
                    isVisibleSlot={isVisibleSlot}
                    isHovered={hoveredProject?.id === project.id}
                    onHoverStart={handleHoverStart}
                    onHoverEnd={handleHoverEnd}
                    onGrabSelect={handleGrabSelect}
                  />
                );
              })}
            </motion.div>
          </div>

          {/* Right Side Arrow Button */}
          <button
            type="button"
            onClick={handlePanRight}
            disabled={!canPanRight}
            aria-label="Pan projects right"
            className={`hidden sm:flex absolute right-0 xl:-right-5 z-40 w-11 h-11 rounded-full border items-center justify-center font-mono text-base transition-all ${
              canPanRight
                ? 'bg-[#101014]/95 border-white/30 text-white hover:bg-white hover:text-black hover:scale-105 shadow-[0_10px_28px_rgba(0,0,0,0.85)] cursor-pointer'
                : 'bg-[#09090c]/70 border-white/10 text-zinc-600 opacity-50 cursor-not-allowed'
            }`}
          >
            →
          </button>
        </div>

        {/* Bottom Pan Progress Dots */}
        <div className="mt-4 flex items-center justify-center gap-2">
          {Array.from({ length: maxStartIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setHoveredProject(null);
                setHoveredSlotIndex(null);
                setStartIndex(idx);
              }}
              aria-label={`Go to project group ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                startIndex === idx
                  ? 'w-7 bg-white'
                  : 'w-2 bg-white/20 hover:bg-white/45'
              }`}
            />
          ))}
        </div>
      </div>

      <ProjectModal
        selectedProject={selectedProject}
        onClose={handleCloseModal}
      />
    </section>
  );
}
