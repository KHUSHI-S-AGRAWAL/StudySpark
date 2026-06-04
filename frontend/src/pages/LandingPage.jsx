import { useState, useEffect } from 'react';
import './features/MagicRings.css'; // Path to your concentric rings background animation
import TextPressure from './features/TextPressure'; 
import TextType from './features/TextType'; 
<img src="/book_icon.png" alt="StudySpark Icon" /> // Imports your custom asset file directly

const SUBTITLES = [
  "Generate practice quizzes instantly",
  "Transform notes into interactive resources",
  "Your ultimate AI-powered study companion"
];

function LandingPage({ onGetStarted }) {
  const [textIndex, setTextIndex] = useState(0);
  const [fadeState, setFadeState] = useState('opacity-100 translate-y-0');

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeState('opacity-0 translate-y-2');
      setTimeout(() => {
        setTextIndex((prev) => (prev + 1) % SUBTITLES.length);
        setFadeState('opacity-100 translate-y-0');
      }, 400);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="landing-page">
      
      {/* BACKGROUND GRAPHICS CONTAINER */}
      <div className="magic-rings-container">
        <div className="ring ring-1"></div>
        <div className="ring ring-2"></div>
        <div className="ring ring-3"></div>
        <div className="ring ring-4"></div>
        <div className="ring ring-5"></div>
        <div className="ring ring-6"></div>
      </div>

      {/* CENTRAL TYPOGRAPHY CARD CONTENT */}
      <div className="landing-card">
        
        {/* CUSTOM IMAGE ICON: 
            Replaced the standard unicode emoji string with an HTML img asset link wrapper 
            while preserving the identical absolute centering constraints.
        */}
        <div style={{ 
          position: 'absolute', 
          top: '-45px', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          width: '76px',
          height: 'auto',
          margin: 0,
          filter: 'drop-shadow(0 10px 25px rgba(99,102,241,0.25))' 
        }}>
          <img 
            src={bookIcon} 
            alt="StudySpark Icon" 
            style={{ width: '100%', height: 'auto', display: 'block' }} 
          />
        </div>
        
        {/* Dynamic Text Pressure Header Title */}
        <div className="landing-header">
          <TextPressure
            text="StudySpark"
            flex={true}
            alpha={false}
            stroke={false}
            width={true}
            weight={true}
            italic={true}
            textColor="#ffffff"
            minFontSize={48}
          />
        </div>
        
        {/* Text Type Subtitle Tracker */}
        <div className="landing-subtitle">
          <TextType
            text={SUBTITLES}
            typingSpeed={65}
            deletingSpeed={40}
            pauseDuration={2000}
            showCursor={true}
            cursorCharacter="_"
            style={{ fontSize: '24px', fontWeight: '700', color: '#f1f5f9', letterSpacing: '-0.01em', margin: 0 }}
          />
        </div>

        {/* Platform Description Paragraph */}
        <p className="landing-description">
          Transform your notes and syllabus into an interactive learning experience. Upload 
          your documents to instantly generate analytics, smart summaries, practice quizzes, 
          and get personalized video recommendations.
        </p>

        {/* Wide Sky-Blue Action Pill Button */}
        <div className="action-wrapper">
          <button
            onClick={onGetStarted}
            className="page-button"
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#0ea5e9';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 12px 28px -4px rgba(14, 165, 233, 0.5), 0 0 30px rgba(14, 165, 233, 0.25)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#38bdf8';
              e.target.style.transform = 'translateY(0px)';
              e.target.style.boxShadow = '0 8px 24px -4px rgba(56, 189, 248, 0.35), 0 0 20px rgba(56, 189, 248, 0.15)';
            }}
            onMouseDown={(e) => {
              e.target.style.transform = 'translateY(1px) scale(0.99)';
            }}
          >
            🚀 Let's Get Started
          </button>
        </div>
        
      </div>
    </div>
  );
}

export default LandingPage;