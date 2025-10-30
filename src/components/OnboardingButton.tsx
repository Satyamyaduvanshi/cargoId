import { HelpCircle } from 'lucide-react';

const OnboardingButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-gradient-to-r from-primary to-blue-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-40 group"
      title="Start Tour"
    >
      <HelpCircle size={24} className="animate-pulse" />
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white text-gray-800 px-3 py-1 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-md">
        Start Tour
      </span>
    </button>
  );
};

export default OnboardingButton; 