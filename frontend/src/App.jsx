import { useState } from "react";
import LandingPage from "./pages/LandingPage";
import DocumentUpload from "./pages/DocumentUpload.jsx";
import DashboardGrid from "./pages/DashboardGrid.jsx";
import Navbar from "./components/Navbar.jsx";

function App() {
  const [currentStep, setCurrentStep] = useState('landing');
  const [processedData, setProcessedData] = useState(null);

  // If we are on the landing page step, render it standalone
  if (currentStep === 'landing') {
    return <LandingPage onGetStarted={() => setCurrentStep('upload')} />;
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans antialiased">
      {/* FIX: Set onHome to route back to 'landing' so it hits the very first screen layout */}
      <Navbar onHome={() => setCurrentStep('landing')} />
      
      {/* The main container wrapper now applies exclusively to upload layouts and dashboard grids */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {currentStep === 'upload' && (
          <DocumentUpload onProcessingComplete={(data) => {
            setProcessedData(data);
            setCurrentStep('dashboard');
          }} />
        )}

        {currentStep === 'dashboard' && (
          <DashboardGrid data={processedData} />
        )}
      </main>
    </div>
  );
}

export default App;