'use client';

import { useEffect } from "react";

export default function ParallaxEffect() {
  useEffect(() => {
    const handleScroll = () => {
      const parallaxItems = document.querySelectorAll('.parallax-item');
      
      parallaxItems.forEach(item => {
        const itemPosition = item.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (itemPosition < screenPosition) {
          item.classList.add('opacity-100');
          item.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    // Trigger once on load
    setTimeout(handleScroll, 100);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return null;
} 