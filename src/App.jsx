import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ProjectsSection from './components/ProjectsSection';
import FooterSection from './components/FooterSection';

export default function App() {
  const [activeGrabCard, setActiveGrabCard] = useState(null);

  return (
    <div className="min-h-screen bg-[#050506] text-white selection:bg-white selection:text-black">
      <Navbar activeGrabCard={activeGrabCard} />
      <main>
        <HeroSection />
        <ProjectsSection onActiveCardChange={setActiveGrabCard} />
      </main>
      <FooterSection />
    </div>
  );
}
