import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { Project } from './types';

export default function App() {
  const [, setActiveProject] = useState<Project | null>(null);

  return (
    <div className="min-h-screen bg-[#050506] text-white selection:bg-white selection:text-black">
      <Header />
      <main>
        <Hero />
        <Projects onActiveCardChange={setActiveProject} />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
