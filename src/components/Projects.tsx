import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PROJECTS_DATA } from '../data/projects';
import { Project } from '../types';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';

const CARD_STEP_PX = 305; // 285px card width + 20px gap
const TOTAL_ITEMS = PROJECTS_DATA.length;

interface ProjectsProps {
  onActiveCardChange?: (project: Project | null) => void;
}

export default function Projects({ onActiveCardChange }: ProjectsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const lastAutoScrollTimeRef = useRef(0);
  const lastInteractionRef = useRef(0);
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [hoveredSlotIndex, setHoveredSlotIndex] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [startIndex, setStartIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const [isJumping, setIsJumping] = useState(false);

  const recordInteraction = () => {
    lastInteractionRef.current = Date.now();
  };

  useEffect(() => {
    const updateVisibleCount = () => {
      const w = window.innerWidth;
      const count = w >= 1200 ? 4 : w >= 900 ? 3 : w >= 640 ? 2 : 1;
      setVisibleCount(count);
    };
    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  // When smoothly sliding into the cloned cards at index TOTAL_ITEMS, silently jump back to index 0
  useEffect(() => {
    if (startIndex >= TOTAL_ITEMS) {
      const resetTimer = setTimeout(() => {
        setIsJumping(true);
        setStartIndex(0);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsJumping(false);
          });
        });
      }, 550);
      return () => clearTimeout(resetTimer);
    }
  }, [startIndex]);

  // Automatic horizontal scrolling:
  // If user interacts (clicks arrows, hovers cards, etc.), do NOT move until 5 seconds of idle have passed
  useEffect(() => {
    if (selectedProject) return;

    const intervalId = window.setInterval(() => {
      const elapsed = Date.now() - lastInteractionRef.current;
      if (elapsed < 5000) return; // 5 seconds interaction pause

      setHoveredProject(null);
      setHoveredSlotIndex(null);
      setStartIndex((prev) => prev + 1);
    }, 3200);

    return () => window.clearInterval(intervalId);
  }, [selectedProject]);

  const handlePanLeft = () => {
    recordInteraction();
    setHoveredProject(null);
    setHoveredSlotIndex(null);
    if (startIndex === 0) {
      setIsJumping(true);
      setStartIndex(TOTAL_ITEMS);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsJumping(false);
          setStartIndex(TOTAL_ITEMS - 1);
        });
      });
    } else {
      setStartIndex((prev) => prev - 1);
    }
  };

  const handlePanRight = () => {
    recordInteraction();
    setHoveredProject(null);
    setHoveredSlotIndex(null);
    setStartIndex((prev) => prev + 1);
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

  const handleHoverStart = (project: Project, slotIdx: number) => {
    recordInteraction();
    setHoveredProject(project);
    setHoveredSlotIndex(slotIdx);
    onActiveCardChange?.(project);
    alignProjectsViewport();
  };

  const handleHoverEnd = () => {
    recordInteraction();
    setHoveredProject(null);
    setHoveredSlotIndex(null);
    if (!selectedProject) {
      onActiveCardChange?.(null);
    }
  };

  const handleGrabSelect = (project: Project) => {
    recordInteraction();
    setSelectedProject(project);
    onActiveCardChange?.(project);
  };

  const handleCloseModal = () => {
    recordInteraction();
    setSelectedProject(null);
    onActiveCardChange?.(null);
  };

  const spotlightLeft =
    hoveredSlotIndex !== null ? `${18 + hoveredSlotIndex * 21}%` : '50%';

  const deckWidthPx = visibleCount * 285 + (visibleCount - 1) * 20;
  const realCurrentIndex = startIndex % TOTAL_ITEMS;
  const startLabel = String(realCurrentIndex + 1).padStart(2, '0');
  const endLabel = String(
    ((realCurrentIndex + visibleCount - 1) % TOTAL_ITEMS) + 1
  ).padStart(2, '0');
  const totalLabel = String(TOTAL_ITEMS).padStart(2, '0');

  // Cloned items appended at the end for seamless infinite loop transition
  const displayList = [...PROJECTS_DATA, ...PROJECTS_DATA.slice(0, visibleCount)];

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
              Hover any card to inspect the hardware telemetry and software architecture. Use the left and right arrows to pan through all engineered and research modules.
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
                aria-label="Previous project module"
                className="w-10 h-10 rounded-xl border flex items-center justify-center font-mono text-sm transition-all bg-[#101014] border-white/25 text-white hover:bg-white hover:text-black shadow-[0_0_20px_rgba(255,255,255,0.12)] cursor-pointer"
              >
                ←
              </button>
              <button
                type="button"
                onClick={handlePanRight}
                aria-label="Next project module"
                className="w-10 h-10 rounded-xl border flex items-center justify-center font-mono text-sm transition-all bg-[#101014] border-white/25 text-white hover:bg-white hover:text-black shadow-[0_0_20px_rgba(255,255,255,0.12)] cursor-pointer"
              >
                →
              </button>
            </div>
          </div>
        </div>

        {/* 3D Perspective Horizontal Panning Track + Side Left/Right Arrow Buttons */}
        <div
          onMouseMove={recordInteraction}
          onTouchStart={recordInteraction}
          onTouchMove={recordInteraction}
          className="relative flex items-center justify-center"
        >
          {/* Left Side Arrow Button */}
          <button
            type="button"
            onClick={handlePanLeft}
            aria-label="Pan projects left"
            className="hidden sm:flex absolute left-0 xl:-left-5 z-40 w-11 h-11 rounded-full border items-center justify-center font-mono text-base transition-all bg-[#101014]/95 border-white/30 text-white hover:bg-white hover:text-black hover:scale-105 shadow-[0_10px_28px_rgba(0,0,0,0.85)] cursor-pointer"
          >
            ←
          </button>

          {/* Centered Deck Window */}
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
              transition={
                isJumping
                  ? { duration: 0 }
                  : { type: 'spring', stiffness: 210, damping: 28, mass: 0.75 }
              }
              className="flex items-center gap-5"
            >
              {displayList.map((project, index) => {
                const slotIndex = index - startIndex;
                const isVisibleSlot =
                  slotIndex >= 0 && slotIndex < visibleCount;
                return (
                  <ProjectCard
                    key={`${project.id}-slot-${index}`}
                    project={project}
                    index={index % TOTAL_ITEMS}
                    slotIndex={slotIndex}
                    isVisibleSlot={isVisibleSlot}
                    isHovered={
                      hoveredProject?.id === project.id &&
                      hoveredSlotIndex === slotIndex
                    }
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
            aria-label="Pan projects right"
            className="hidden sm:flex absolute right-0 xl:-right-5 z-40 w-11 h-11 rounded-full border items-center justify-center font-mono text-base transition-all bg-[#101014]/95 border-white/30 text-white hover:bg-white hover:text-black hover:scale-105 shadow-[0_10px_28px_rgba(0,0,0,0.85)] cursor-pointer"
          >
            →
          </button>
        </div>

        {/* Bottom Pan Progress Dots */}
        <div className="mt-4 flex items-center justify-center gap-2">
          {Array.from({ length: TOTAL_ITEMS }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                recordInteraction();
                setHoveredProject(null);
                setHoveredSlotIndex(null);
                setStartIndex(idx);
              }}
              aria-label={`Go to project module ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                realCurrentIndex === idx
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
