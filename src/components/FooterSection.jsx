import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GitHubIcon, LinkedInIcon, EmailIcon, ArrowUpRightIcon } from './Icons';

function SocialIconLink({ href, label, handle, children }) {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      aria-label={label}
      className="group flex items-center justify-between p-4 rounded-xl bg-charcoal-900/80 border border-white/10 hover:border-white/40 hover:bg-charcoal-800 transition-all"
    >
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center text-zinc-300 group-hover:bg-white group-hover:text-black transition-colors">
          {children}
        </div>
        <div>
          <div className="font-display text-sm font-medium text-white">
            {label}
          </div>
          <div className="font-mono text-xs text-zinc-500 group-hover:text-zinc-300 transition-colors">
            {handle}
          </div>
        </div>
      </div>
      <ArrowUpRightIcon className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
    </a>
  );
}

export default function FooterSection() {
  // Controlled React state for Name, Email, and Message
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('IDLE'); // 'IDLE' | 'TRANSMITTING' | 'SENT'

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setStatus('TRANSMITTING');
    const subject = encodeURIComponent(`Portfolio Inquiry from ${name.trim()}`);
    const body = encodeURIComponent(
      `Name: ${name.trim()}\nEmail: ${email.trim()}\n\nMessage:\n${message.trim()}`
    );
    window.location.href = `mailto:matthewchong.dev@gmail.com?subject=${subject}&body=${body}`;

    setTimeout(() => {
      setStatus('SENT');
      setName('');
      setEmail('');
      setMessage('');
      setTimeout(() => setStatus('IDLE'), 4000);
    }, 650);
  };

  return (
    <footer
      id="contact"
      className="relative bg-[#040405] border-t border-white/10 pt-24 pb-12 px-6 overflow-hidden"
    >
      {/* Subtle Atmospheric Glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[820px] h-[340px] rounded-full pointer-events-none blur-[140px]"
        style={{
          background:
            'radial-gradient(circle, rgba(255,255,255,0.06) 0%, rgba(161,161,170,0.015) 65%, transparent 100%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto space-y-20">
        {/* Top Two-Column Contact & Controlled Form Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Structured Contact Info & Distinct SVG Social Channels */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 font-mono text-xs text-zinc-400 tracking-widest uppercase">
                <span className="text-white font-semibold">.03</span>
                <span>// COMM_LINK &amp; TRANSMISSION</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-white">
                Initiate Uplink
              </h2>
              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
                Open for collaborations in intelligent hardware, robotics firmware, autonomous systems, and Data Science &amp; AI research at HKPolyU.
              </p>
            </div>

            {/* Hardware Location & Academic Spec Readout */}
            <div className="p-5 rounded-xl bg-charcoal-900/60 border border-white/10 space-y-3 font-mono text-xs">
              <div className="flex justify-between py-1 border-b border-white/[0.07]">
                <span className="text-zinc-500">INSTITUTION</span>
                <span className="text-zinc-200">HK Polytechnic University</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.07]">
                <span className="text-zinc-500">DISCIPLINE</span>
                <span className="text-zinc-200">Data Science &amp; AI / Hardware</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-500">BASE_COORDINATES</span>
                <span className="text-white">22.3046° N, 114.1796° E (HKG)</span>
              </div>
            </div>

            {/* Distinct SVG Components for GitHub, LinkedIn, and Email */}
            <div className="space-y-3">
              <div className="font-mono text-[11px] text-zinc-500 uppercase tracking-widest">
                DIRECT CHANNELS
              </div>
              <div className="grid grid-cols-1 gap-3">
                <SocialIconLink
                  href="https://github.com/matthewchongg"
                  label="GitHub"
                  handle="github.com/matthewchongg"
                >
                  <GitHubIcon className="w-5 h-5" />
                </SocialIconLink>

                <SocialIconLink
                  href="https://linkedin.com/in/matthew"
                  label="LinkedIn"
                  handle="linkedin.com/in/matthew"
                >
                  <LinkedInIcon className="w-5 h-5" />
                </SocialIconLink>

                <SocialIconLink
                  href="mailto:matthewchong.dev@gmail.com"
                  label="Electronic Mail"
                  handle="matthewchong.dev@gmail.com"
                >
                  <EmailIcon className="w-5 h-5" />
                </SocialIconLink>
              </div>
            </div>
          </div>

          {/* Right Column: Minimalist Contact Form with Controlled React State */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 p-8 sm:p-10 rounded-2xl bg-charcoal-900/80 border border-white/15 shadow-hardware backdrop-blur-xl relative"
          >
            {/* Corner Brackets */}
            <span className="absolute top-3 left-3 w-2.5 h-2.5 border-t border-l border-white/40" />
            <span className="absolute top-3 right-3 w-2.5 h-2.5 border-t border-r border-white/40" />
            <span className="absolute bottom-3 left-3 w-2.5 h-2.5 border-b border-l border-white/40" />
            <span className="absolute bottom-3 right-3 w-2.5 h-2.5 border-b border-r border-white/40" />

            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
              <div>
                <h3 className="font-display text-xl font-semibold text-white tracking-wide uppercase">
                  Contact Form
                </h3>
                <p className="font-mono text-xs text-zinc-500 mt-0.5">
                  PACKET_TRANSMISSION // matthewchong.dev@gmail.com
                </p>
              </div>
              <span className="font-mono text-[11px] px-2.5 py-1 rounded bg-white/[0.06] border border-white/10 text-zinc-300">
                {status === 'SENT'
                  ? 'ACK_RECEIVED'
                  : status === 'TRANSMITTING'
                  ? 'SENDING...'
                  : 'READY'}
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div className="space-y-2">
                <label
                  htmlFor="contact-name"
                  className="block font-mono text-xs uppercase tracking-wider text-zinc-400"
                >
                  01. Name <span className="text-white">*</span>
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name or organization"
                  className="w-full bg-transparent border-b border-white/20 focus:border-white py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none transition-colors"
                />
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label
                  htmlFor="contact-email"
                  className="block font-mono text-xs uppercase tracking-wider text-zinc-400"
                >
                  02. Email <span className="text-white">*</span>
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full bg-transparent border-b border-white/20 focus:border-white py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none transition-colors"
                />
              </div>

              {/* Message Input */}
              <div className="space-y-2">
                <label
                  htmlFor="contact-message"
                  className="block font-mono text-xs uppercase tracking-wider text-zinc-400"
                >
                  03. Message <span className="text-white">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Specify hardware architecture, research inquiry, or project scope..."
                  className="w-full bg-transparent border-b border-white/20 focus:border-white py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Live Payload Telemetry Preview & Submit Button */}
              <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="font-mono text-[11px] text-zinc-500">
                  PAYLOAD_BYTES: {name.length + email.length + message.length}B
                </div>

                <button
                  type="submit"
                  disabled={status === 'TRANSMITTING'}
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-3 rounded-full bg-white text-black font-mono text-xs font-semibold uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-[0_0_25px_rgba(255,255,255,0.2)] disabled:opacity-50"
                >
                  <span>
                    {status === 'SENT'
                      ? 'TRANSMISSION COMPLETE ✓'
                      : status === 'TRANSMITTING'
                      ? 'TRANSMITTING...'
                      : 'SEND MESSAGE →'}
                  </span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>

        {/* Bottom Structured Multi-Column Directory & Copyright Bar */}
        <div className="pt-12 border-t border-white/10 grid grid-cols-1 md:grid-cols-12 gap-8 text-xs">
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
              href="https://linkedin.com/in/matthew"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <LinkedInIcon className="w-4 h-4" />
            </a>
            <a
              href="mailto:matthewchong.dev@gmail.com"
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
