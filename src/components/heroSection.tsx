import { useEffect, useState } from "react";

const words = ["Solana speed.", "just one scan.", "blockchain transparency."];

const HeroSection = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentText, setCurrentText] = useState("");

  useEffect(() => {
    const currentWord = words[currentWordIndex];
    let typeSpeed = isDeleting ? 50 : 80;

    const timeout = setTimeout(() => {
      if (!isDeleting && charIndex < currentWord.length) {
        setCurrentText(currentWord.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      } else if (isDeleting && charIndex > 0) {
        setCurrentText(currentWord.slice(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      } else {
        if (!isDeleting) {
          setTimeout(() => setIsDeleting(true), 1500);
        } else {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, currentWordIndex]);

  return (
    <div className="relative w-screen min-h-screen overflow-hidden">
    <div className="absolute bottom-56 left-0 z-20 flex flex-col items-start px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 ml-4 sm:ml-8 md:ml-12 lg:ml-14 xl:ml-16 text-gray-800 transition-all duration-700 ease-in-out">
      <div className="text-left max-w-[90vw] sm:max-w-[85vw] md:max-w-[80vw] lg:max-w-[75vw] xl:max-w-[70vw]">
        <h1 className="uppercase text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-none tracking-tighter font-['Founders_Grotesk'] font-medium transition-all duration-700 ease-in-out">
          Track your
        </h1>
        <h1 className="uppercase mt-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-none tracking-tighter font-['Founders_Grotesk'] font-medium transition-all duration-700 ease-in-out">
          cargo in real-time
        </h1>
        <h1 className="uppercase mt-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-none tracking-tighter font-['Founders_Grotesk'] font-medium transition-all duration-700 ease-in-out">
          <span className="text-gray-800">with </span>
          <span className="text-primary transition-all duration-700 ease-in-out inline-block">
            {currentText}
          </span>
          <span className="inline-block w-1 animate-blink text-primary">|</span>
        </h1>
      </div>
    </div>
  </div>
  )
};

export default HeroSection;
