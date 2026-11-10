import React from 'react';
import { GitHubIcon, LinkedInIcon, EmailIcon } from './Icons';

export default function Footer() {
  const linkedInUrl =
    (import.meta.env.VITE_LINKEDIN_URL as string) ||
    'https://www.linkedin.com/in/matthewchongg/';
  const contactEmail =
    (import.meta.env.VITE_CONTACT_EMAIL as string) ||
    'matthew.chong.dev@gmail.com';

  return (
    <footer className="relative bg-[#030304] border-t border-white/10 pt-12 pb-12 px-6 overflow-hidden select-none">
      <div className="relative z-10 max-w-7xl mx-auto space-y-12">
        {/* Bottom Structured Multi-Column Directory & Copyright Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-xs">
          <div className="md:col-span-5 space-y-2.5">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded bg-white text-black font-mono text-[10px] font-bold flex items-center justify-center">
                M
              </span>
              <span className="font-display font-semibold text-white tracking-wider uppercase">
                MATTHEW // SYSTEMS PORTFOLIO
              </span>
            </div>
            <p className="text-zinc-500 max-w-sm leading-relaxed">
              Intelligent hardware, autonomous systems, and software architectures. Built with React, Tailwind CSS, Framer Motion, and React Three Fiber.
            </p>
          </div>

          <div className="md:col-span-3 space-y-2 font-mono">
            <div className="text-white uppercase tracking-wider text-[11px] mb-2">
              NAVIGATION
            </div>
            <ul className="space-y-1.5 text-zinc-400">
              <li>
                <a href="#hero" className="hover:text-white transition-colors">
                  .01 About Me
                </a>
              </li>
              <li>
                <a href="#projects" className="hover:text-white transition-colors">
                  .02 Projects Carousel
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  .03 Contact &amp; Telemetry
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-2 font-mono">
            <div className="text-white uppercase tracking-wider text-[11px] mb-2">
              MODULE INDEX
            </div>
            <ul className="space-y-1.5 text-zinc-400">
              <li>GA-01 // LoopDay: AI Academic Assistant</li>
              <li>GR-01 // Friendly-Feud Recreation</li>
              <li>WIP-03..08 // Hardware &amp; AI Lab Modules</li>
            </ul>
          </div>
        </div>

        {/* Final Bottom Bar */}
        <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-zinc-500">
          <div>
            © {new Date().getFullYear()} MATTHEW // HK POLYTECHNIC UNIVERSITY (DSAI)
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/matthewchongg"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <GitHubIcon className="w-4 h-4" />
            </a>
            <a
              href={linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <LinkedInIcon className="w-4 h-4" />
            </a>
            <a
              href={`mailto:${contactEmail}`}
              aria-label="Email"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <EmailIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
