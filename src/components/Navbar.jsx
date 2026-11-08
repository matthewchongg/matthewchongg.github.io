import React from 'react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const navItems = [
    { index: '.01', label: 'ABOUT ME', href: '#hero' },
    { index: '.02', label: 'PROJECTS', href: '#projects' },
    { index: '.03', label: 'CONTACT', href: '#contact' },
  ];

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-40 border-b border-white/[0.07] bg-[#050506]/80 backdrop-blur-xl select-none"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand Monogram with Circular Profile Icon */}
        <a
          href="#hero"
          className="flex items-center gap-3.5 group focus:outline-none"
        >
          <img
            src="./profile-icon.jpg"
            alt="Matthew Profile Icon"
            className="w-8 h-8 rounded-full object-cover border border-white/20 group-hover:border-white/60 transition-colors duration-300"
          />
          <div className="flex flex-col">
            <span className="font-display text-xs font-semibold tracking-[0.22em] text-white uppercase">
              MATTHEW
            </span>
            <span className="font-mono text-[10px] text-zinc-500 tracking-widest">
              HKPOLYU // DSAI
            </span>
          </div>
        </a>

        {/* Consistent Section Navigation (.01 ABOUT ME, .02 PROJECTS, .03 CONTACT) */}
        <nav className="flex items-center gap-2 sm:gap-4 font-mono text-xs tracking-wider">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="px-3.5 py-1.5 rounded-full border border-transparent hover:border-white/15 hover:bg-white/[0.05] text-zinc-400 hover:text-white transition-all flex items-center gap-1.5"
            >
              <span className="text-zinc-600">{item.index}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </div>
    </motion.header>
  );
}
