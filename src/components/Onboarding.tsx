import { useState} from 'react';
import { X, ArrowRight, Package, Truck, Shield, Globe } from 'lucide-react';

const Onboarding = ({ onComplete }: { onComplete: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const steps = [
    {
      title: "Welcome to CargoID! 🚀",
      description: "Track your products on the Solana blockchain with real-time updates and complete transparency.",
      icon: <Truck className="w-12 h-12 text-primary animate-bounce" />,
      bgColor: "from-blue-500/10 to-purple-500/10",
    },
    {
      title: "Register Your Products",
      description: "Start by registering your products with unique blockchain addresses for secure tracking.",
      icon: <Package className="w-12 h-12 text-primary animate-pulse" />,
      bgColor: "from-purple-500/10 to-pink-500/10",
    },
    {
      title: "Verify Authenticity",
      description: "Use our verification system to confirm product authenticity and track its journey.",
      icon: <Shield className="w-12 h-12 text-primary animate-pulse" />,
      bgColor: "from-pink-500/10 to-red-500/10",
    },
    {
      title: "Real-time Updates",
      description: "Get instant updates on product location and delivery status.",
      icon: <Globe className="w-12 h-12 text-primary animate-spin-slow" />,
      bgColor: "from-red-500/10 to-orange-500/10",
    },
  ];

  const handleNext = () => {
    setIsAnimating(true);
    setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setIsVisible(false);
        onComplete();
        localStorage.setItem('onboardingCompleted', 'true');
      }
      setIsAnimating(false);
    }, 300);
  };

  const handleSkip = () => {
    setIsVisible(false);
    onComplete();
    localStorage.setItem('onboardingCompleted', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        className={`bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative transform transition-all duration-300 ${
          isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className={`mb-8 p-6 rounded-full bg-gradient-to-br ${steps[currentStep].bgColor} transform transition-all duration-500`}>
            {steps[currentStep].icon}
          </div>
          
          <h2 className="text-3xl font-bold mb-4 text-gray-800 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            {steps[currentStep].title}
          </h2>
          
          <p className="text-gray-600 mb-8 text-lg leading-relaxed">
            {steps[currentStep].description}
          </p>

          <div className="flex items-center gap-6 w-full">
            <div className="flex-1 flex gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    index === currentStep 
                      ? 'bg-gradient-to-r from-primary to-blue-600' 
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              className="bg-gradient-to-r from-primary to-blue-600 text-white px-8 py-3 rounded-xl flex items-center gap-2 hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
              <ArrowRight size={20} className="animate-pulse" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding; 