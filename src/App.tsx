import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HeroPage from "./pages/heroPage";
import ManufacturePage from "./pages/manufacturePage";
import VerifyPage from "./pages/verifyPage";
import UpdatePage from "./pages/updatePage";
import TruckScene from "./components/TruckScene";
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';
import { RoleProvider } from './context/RoleContext';
import Navbar from "./components/NavBar";
import Onboarding from "./components/Onboarding";
import OnboardingButton from "./components/OnboardingButton";

const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Page not found</p>
      <a
        href="/"
        className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
      >
        Go Home
      </a>
    </div>
  </div>
);

function App() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    if (!onboardingCompleted) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  const handleRestartOnboarding = () => {
    localStorage.removeItem('onboardingCompleted');
    setShowOnboarding(true);
  };

  const network = WalletAdapterNetwork.Devnet;
  const endpoint = clusterApiUrl(network);


  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <RoleProvider>
            <Router>
              <div className="flex flex-col min-h-screen relative overflow-x-hidden">
                <div className="absolute inset-0 z-0 pointer-events-none">
                  <TruckScene />
                </div>
                <div className="relative z-10 flex flex-col flex-grow">
                  <Navbar />
                  <main className="flex-grow">
                    <Routes>
                      <Route path="/" element={<HeroPage />} />
                      <Route path="/register" element={<ManufacturePage />} />
                      <Route path="/verify" element={<VerifyPage />} />
                      <Route path="/update" element={<UpdatePage />} />
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </main>
                </div>
                {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}
                {!showOnboarding && <OnboardingButton onClick={handleRestartOnboarding} />}
              </div>
            </Router>
          </RoleProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
