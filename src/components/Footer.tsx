import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { Truck, Shield, Zap } from "lucide-react";

const links = [
  {
    href: "https://github.com/Satyamyaduvanshi",
    icon: <FaGithub />,
    label: "GitHub",
  },
  {
    href: "https://x.com/ysatyaa",
    icon: <FaX />,
    label: "Twitter",
  },
  {
    href: "https://www.linkedin.com/in/satyam-yadav-868375203/",
    icon: <FaLinkedin />,
    label: "LinkedIn",
  },
];

const features = [
  {
    icon: <Truck className="h-6 w-6 text-primary" />,
    title: "Fast Tracking",
    description: "Real-time updates on product location and status"
  },
  {
    icon: <Shield className="h-6 w-6 text-primary" />,
    title: "Secure & Immutable",
    description: "Blockchain-backed data that can't be tampered with"
  },
  {
    icon: <Zap className="h-6 w-6 text-primary" />,
    title: "Solana Powered",
    description: "Lightning-fast transactions with minimal fees"
  }
];

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-#dfdff0 to-gray-100 text-black">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-primary mb-2">Cargo ID</h2>
            <p className="text-gray-700 mb-6 max-w-md">
              A decentralized platform to track and verify products on the Solana blockchain — fast, transparent, and secure.
            </p>
            
            {/* Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              {features.map((feature, index) => (
                <div key={index} className="flex flex-col items-start">
                  <div className="mb-2">{feature.icon}</div>
                  <h4 className="text-sm font-semibold">{feature.title}</h4>
                  <p className="text-xs text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-primary">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#about" className="text-gray-600 hover:text-primary transition-colors">About</a></li>
              <li><a href="#features" className="text-gray-600 hover:text-primary transition-colors">Features</a></li>
              <li><a href="#demo" className="text-gray-600 hover:text-primary transition-colors">Live Demo</a></li>
              <li><a href="#contact" className="text-gray-600 hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
          
          {/* Connect Section */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-primary">Connect with Me</h3>
            <div className="flex gap-4">
              {links.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="bg-#dfdff0 p-3 scale-150 rounded-full text-gray-600 hover:bg-primary hover:text-white transition-all transform hover:scale-110"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-6">
        <div className="container mx-auto px-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-800">
            &copy; {new Date().getFullYear()} Cargo ID. All rights reserved.
          </p>
          <div className="mt-4 sm:mt-0">
            <p className="text-sm text-gray-800">
              Made with <span className="text-red-500">❤️</span> by <span className="text-primary font-semibold">Satyam Yadav</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
