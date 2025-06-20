"use client";

import { useState, useEffect } from 'react';
import { Toaster } from "react-hot-toast";
import PreLoader from '../components/PreLoaderFixed';
import SectionLayout from '../components/SectionLayout';
import SimpleBackground from '@/components/SimpleBackground';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import AboutSection from '../components/AboutSection';
import CustomCursor from '../components/CustomCursor';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);  const sections = [
    {
      id: 'hero',
      component: <div>Test Hero Section</div>,
      title: 'Hero'
    }
    // {
    //   id: 'features',
    //   component: <FeaturesSection />,
    //   title: 'Features'
    // }
    // {
    //   id: 'about',
    //   component: <AboutSection />,
    //   title: 'About'
    // }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleSectionChange = (index: number) => {
    setCurrentSection(index);
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (    <main className="relative min-h-screen bg-black text-white overflow-hidden">      {/* Background */}
      {/* <SimpleBackground sectionIndex={currentSection} /> */}
      
      {/* Custom Cursor */}
      {/* <CustomCursor /> */}
        {/* Content */}
      {/* <SectionLayout 
        sections={sections} 
        onSectionChange={handleSectionChange}
      /> */}
      <div>Test content</div>
        {/* Toast Notifications */}
      {/* <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
          },
        }}
      /> */}
    </main>
  );
}
