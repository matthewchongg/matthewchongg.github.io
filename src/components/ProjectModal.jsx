import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloseIcon, ArrowUpRightIcon } from './Icons';
import { ExtendedRoboticArmClaw } from './ProjectCard';

export default function ProjectModal({ selectedProject, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (selectedProject) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject, onClose]);

  return (
    <AnimatePresence>
      {selectedProject && (
        <motion.div
          key="project-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl"
        >
          {/* Modal + Extended Robotic Forearm Assembly */}
          <motion.div
            layoutId={`project-card-container-${selectedProject.id}`}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl mt-12 rounded-2xl bg-[#0c0c0f] border border-white/30 shadow-[0_35px_100px_-15px_rgba(0,0,0,0.95),0_0_40px_rgba(255,255,255,0.1)] text-white"
          >
            {/* Extended Robotic Forearm + Clamped Claw Holding the Top of the Modal */}
            <motion.div
              initial={{ y: -120, opacity: 0 }}
              animate={{ y: -62, opacity: 1 }}
              exit={{ y: -120, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
              className="absolute top-0 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex flex-col items-center"
            >
              <ExtendedRoboticArmClaw isExtended={true} isClamped={true} />
            </motion.div>

            {/* Top Telemetry Header Bar */}
            <div className="px-6 sm:px-8 py-4 bg-white/[0.03] border-b border-white/10 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3 font-mono text-xs text-zinc-400">
                <span className="px-2 py-0.5 rounded bg-white/10 text-white font-medium">
                  .{selectedProject.index}
                </span>
                <span>{selectedProject.code}</span>
                <span className="hidden sm:inline text-zinc-600">//</span>
                <span className="hidden sm:inline text-zinc-300">
                  {selectedProject.category}
                </span>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.07] hover:bg-white hover:text-black border border-white/15 font-mono text-xs transition-colors"
              >
                <span>RELEASE [ESC]</span>
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[76vh] overflow-y-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <motion.h2
                    layoutId={`project-title-${selectedProject.id}`}
                    className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-white"
                  >
                    {selectedProject.title}
                  </motion.h2>
                  <motion.p
                    layoutId={`project-subtitle-${selectedProject.id}`}
                    className="font-mono text-sm text-zinc-400 mt-1"
                  >
                    {selectedProject.subtitle}
                  </motion.p>
                </div>

                <span
                  className={`self-start sm:self-center font-mono text-xs px-3 py-1 rounded-full border ${
                    selectedProject.isWip
                      ? 'border-zinc-500 bg-zinc-800/90 text-zinc-200'
                      : 'border-white/40 bg-white/15 text-white'
                  }`}
                >
                  {selectedProject.status}
                </span>
              </div>

              {/* Telemetry Metrics Strip */}
              <div className="grid grid-cols-3 gap-3">
                {selectedProject.metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="p-3.5 rounded-xl bg-charcoal-900/90 border border-white/10"
                  >
                    <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">
                      {metric.label}
                    </div>
                    <div className="font-mono text-base sm:text-lg font-semibold text-white mt-0.5">
                      {metric.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Full Project Description */}
              <div className="space-y-2">
                <h4 className="font-mono text-xs uppercase tracking-widest text-zinc-400">
                  SYSTEM OVERVIEW &amp; ARCHITECTURE
                </h4>
                <p className="text-sm sm:text-base text-zinc-200 leading-relaxed">
                  {selectedProject.fullDescription}
                </p>
              </div>

              {/* Technical Highlights */}
              <div className="space-y-2.5">
                <h4 className="font-mono text-xs uppercase tracking-widest text-zinc-400">
                  KEY ENGINEERING SPECIFICATIONS
                </h4>
                <ul className="space-y-2">
                  {selectedProject.highlights.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-sm text-zinc-300"
                    >
                      <span className="font-mono text-xs text-white mt-0.5">
                        [0{idx + 1}]
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tech Stack Pills */}
              <div className="space-y-2">
                <h4 className="font-mono text-xs uppercase tracking-widest text-zinc-400">
                  STACK &amp; TOOLCHAIN
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="font-mono text-xs px-3 py-1 rounded-md bg-white/[0.06] border border-white/15 text-zinc-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Modal Footer CTA Buttons ("Learn More" + Release Grip) */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/15 border border-white/15 font-mono text-xs text-zinc-300 transition-colors"
                >
                  RELEASE GRIP [ESC]
                </button>

                <div className="flex flex-wrap items-center gap-3">
                  {selectedProject.githubUrl &&
                    selectedProject.githubUrl !== selectedProject.repoUrl && (
                      <a
                        href={selectedProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-sm transition-all"
                      >
                        <span>GitHub Repo</span>
                        <ArrowUpRightIcon className="w-4 h-4" />
                      </a>
                    )}
                  <a
                    href={selectedProject.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black font-medium text-sm hover:bg-zinc-200 transition-all shadow-[0_0_25px_rgba(255,255,255,0.25)]"
                  >
                    <span>Learn More</span>
                    <ArrowUpRightIcon className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
