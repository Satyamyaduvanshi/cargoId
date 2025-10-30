import { useRef, useEffect } from "react";
import gsap from "gsap";

const TruckImage = () => {
  // Create a reference to the truck image container
  const truckContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (truckContainerRef.current) {
      // Initial position off-screen to the left
      gsap.set(truckContainerRef.current, { 
        x: -1000, // Start off-screen to the left
        opacity: 0 
      });
      
      // Animate to the final position with opacity increasing as it approaches
      gsap.to(truckContainerRef.current, {
        x: 0,
        opacity: 1,
        duration: 1.5,
        ease: "power2.out",
        delay: 0.5,
        onUpdate: function() {
          // Calculate progress (0 to 1)
          const progress = this.progress();
          // Set opacity based on progress (0 to 1)
          if (truckContainerRef.current) {
            truckContainerRef.current.style.opacity = String(progress);
          }
        }
      });
    }
  }, []);

  return (
    <div 
      ref={truckContainerRef}
      className="z-20 absolute pointer-events-none transition-all duration-700 ease-in-out
        /* Mobile first approach */
        w-[250px] right-1/2 top-[20%] translate-x-1/2
        /* Small tablets */
        sm:w-[300px] sm:top-[15%]
        /* Tablets */
        md:w-[400px] md:right-[100px] md:top-[10%] md:translate-x-0
        /* Laptops */
        lg:w-[500px] lg:right-[150px] lg:top-[5%]
        /* Desktops */
        xl:w-[600px] xl:right-[180px] xl:top-[5%]
        /* Large Desktops */
        2xl:w-[700px] 2xl:right-[230px] 2xl:top-[5%]"
    >
      <img 
        src="/truckImg.png" 
        alt="Truck" 
        className="w-full h-auto object-contain animate-float transition-all duration-700 ease-in-out"
        style={{ 
          filter: "drop-shadow(0 25px 25px rgb(0 0 0 / 0.15))"
        }} 
      />
    </div>
  );
};

export default TruckImage; 