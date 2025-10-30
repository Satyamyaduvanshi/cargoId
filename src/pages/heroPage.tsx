import HeroSection from "../components/heroSection";
import AboutCards from "../components/About";
import TruckImage from "../components/TruckImage";
import ComingSoonFeatures from "../components/ComingSoonFeatures";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import Footer from "../components/Footer";

const HeroPage = () => {
  const arrowContainerRef = useRef<HTMLDivElement>(null);
  const arrow1Ref = useRef<HTMLDivElement>(null);
  const arrow2Ref = useRef<HTMLDivElement>(null);
  const arrow3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (arrowContainerRef.current && arrow1Ref.current && arrow2Ref.current && arrow3Ref.current) {
      // Create a staggered animation for the arrows
      gsap.to(arrowContainerRef.current, {
        y: 8,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });
      
      // Staggered opacity animation for each arrow
      gsap.to(
        [arrow1Ref.current, arrow2Ref.current, arrow3Ref.current],
        {
          opacity: 0.5,
          duration: 0.8,
          repeat: -1,
          yoyo: true,
          stagger: 0.2,
          ease: "power1.inOut"
        }
      );
    }
  }, []);

  const scrollToAbout = () => {
    document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen overflow-y-auto">
      <div className="relative">
        <HeroSection />
        <TruckImage />
      </div>
      
      {/* Animated arrows pointing down */}
      <div className="flex justify-center -mt-28 mb-8">
        <div 
          ref={arrowContainerRef} 
          className="cursor-pointer flex flex-col items-center filter drop-shadow-lg"
          onClick={scrollToAbout}
        >
          <div ref={arrow1Ref}>
            <ChevronDown size={36} className="text-gray-600" />
          </div>
          <div ref={arrow2Ref} className="-mt-4">
            <ChevronDown size={36} className="text-gray-800" />
          </div>
          <div ref={arrow3Ref} className="-mt-4">
            <ChevronDown size={36} className="text-gray-900" />
          </div>
        </div>
      </div>
      
      <div id="about-section" className="container mx-auto my-16 scroll-mt-16">
        <h2 className="text-3xl font-bold text-center mb-10 font-zentry">Why Choose Our Supply Chain Solution</h2>
        <AboutCards />
      </div>

      <div className="bg-gray-50 py-16">
        <div className="container mx-auto">
          <ComingSoonFeatures />
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default HeroPage;
