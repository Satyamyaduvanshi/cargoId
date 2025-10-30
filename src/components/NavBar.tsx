import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Menu, X } from "lucide-react"; // for hamburger icons
import gsap from "gsap";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Register", path: "/register" },
  { name: "Update", path: "/update" },
  { name: "Verify", path: "/verify" },
];


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const navRef = useRef(null);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const isScrollingDown = currentScrollPos > prevScrollPos;
      
      // Only trigger animation if we've scrolled more than 10px
      if (Math.abs(currentScrollPos - prevScrollPos) < 10) {
        setPrevScrollPos(currentScrollPos);
        return;
      }
      
      // Update visibility based on scroll direction
      if (isScrollingDown && currentScrollPos > 80) {
        setVisible(false); // Hide when scrolling down
      } else {
        setVisible(true); // Show when scrolling up
      }
      
      // Update previous scroll position
      setPrevScrollPos(currentScrollPos);
    };

    // Add scroll event listener with throttling
    let scrollTimer: ReturnType<typeof setTimeout> | null = null;
    const throttledScroll = () => {
      if (!scrollTimer) {
        scrollTimer = setTimeout(() => {
          handleScroll();
          scrollTimer = null;
        }, 100); // Throttle to 100ms
      }
    };
    
    window.addEventListener('scroll', throttledScroll);
    
    // Clean up
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (scrollTimer) clearTimeout(scrollTimer);
    };
  }, [prevScrollPos]);

  // Use GSAP for smoother animation
  useEffect(() => {
    if (navRef.current) {
      gsap.to(navRef.current, {
        y: visible ? 0 : -100,
        opacity: visible ? 1 : 0,
        duration: 0.5,
        ease: "power3.out"
      });
    }
  }, [visible]);

  return (
    <div 
      ref={navRef}
      className="fixed inset-x-0 top-4 z-50 sm:inset-x-6"
    >
      <header className="w-full bg-transparent">
        <nav className="flex items-center justify-between p-4 bg-opacity-80 r rounded-xl ">
          {/* Logo */}
          <NavLink
            to="/"
            className="text-primary font-zentry font-bold text-4xl hover:cursor-pointer transition duration-300 ease-in-out transform hover:scale-110"
            onClick={closeMenu}
          >
            cargoID
          </NavLink>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium font-zentry">
            {navItems.map(({ name, path }) => (
              <NavLink
                key={name}
                to={path}
                className={({ isActive }) =>
                  `transition px-3 py-1.5 rounded-lg ${
                    isActive
                      ? "text-primary font-semibold bg-primary/10"
                      : "text-black hover:text-primary"
                  }`
                }
              >
                {name}
              </NavLink>
            ))}
            <WalletMultiButton className="py-2 px-3 flex items-center font-zentry" />
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              aria-label="Toggle menu"
              className="focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="md:hidden mt-2 bg-white bg-opacity-90 backdrop-blur shadow-lg rounded-xl p-4 space-y-3">
            {navItems.map(({ name, path }) => (
              <NavLink
                key={name}
                to={path}
                className="block text-black hover:text-primary font-medium"
                onClick={closeMenu}
              >
                {name}
              </NavLink>
            ))}
            <WalletMultiButton className="w-full py-2 px-3 flex items-center justify-center font-zentry" />
          </div>
        )}
      </header>
    </div>
  );
};

export default Navbar;
