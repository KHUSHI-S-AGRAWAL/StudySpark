import { useState } from 'react';
import SummaryView from './features/SummaryView.jsx';
import QuizPanel from './features/QuizPanel.jsx';
import SmartPlanner from './features/SmartPlanner.jsx';
import AnalyticsView from './features/AnalyticsView.jsx';
import ImportantPoints from './features/ImportantPoints.jsx';
import HowToStudy from './features/HowToStudy.jsx';
import PracticeQs from './features/PracticeQs.jsx';
import VideoResources from './features/VideoResources.jsx';
import SmartTutor from './features/SmartTutor.jsx'; // Imports your interactive tutor panel view

import GlassIcons from './features/GlassIcons.jsx'; 

function DashboardGrid({ data }) {
  const [activeFeature, setActiveFeature] = useState(null);

  // Feature Router - Mounts the specific sub-panels when clicked
  if (activeFeature === 'analytics') return <AnalyticsView data={data} onBack={() => setActiveFeature(null)} />;
  if (activeFeature === 'planner') return <SmartPlanner data={data} onBack={() => setActiveFeature(null)} />;
  if (activeFeature === 'summary') return <SummaryView data={data} onBack={() => setActiveFeature(null)} />;
  if (activeFeature === 'points') return <ImportantPoints data={data} onBack={() => setActiveFeature(null)} />;
  if (activeFeature === 'study') return <HowToStudy data={data} onBack={() => setActiveFeature(null)} />;
  if (activeFeature === 'practice') return <PracticeQs data={data} onBack={() => setActiveFeature(null)} />;
  if (activeFeature === 'quiz') return <QuizPanel data={data} onBack={() => setActiveFeature(null)} />;
  if (activeFeature === 'tutor') return <SmartTutor data={data} onBack={() => setActiveFeature(null)} />;
  if (activeFeature === 'video') return <VideoResources data={data} onBack={() => setActiveFeature(null)} />;

  // All 9 system features mapped cleanly to feed the 3x3 layout array grid
  const featureItems = [
    { id: 'analytics', icon: '📊', color: 'blue', label: 'Analytics Dashboard', onClick: () => setActiveFeature('analytics') },
    { id: 'planner', icon: '📅', color: 'purple', label: 'Smart Planner', onClick: () => setActiveFeature('planner') },
    { id: 'summary', icon: '📝', color: 'green', label: 'Summary', onClick: () => setActiveFeature('summary') },
    { id: 'points', icon: '🎯', color: 'orange', label: 'Important Points', onClick: () => setActiveFeature('points') },
    { id: 'study', icon: '🧠', color: 'red', label: 'How to Study', onClick: () => setActiveFeature('study') },
    { id: 'practice', icon: '💡', color: 'orange', label: 'Practice Qs', onClick: () => setActiveFeature('practice') },
    { id: 'quiz', icon: '❓', color: 'indigo', label: 'Quiz', onClick: () => setActiveFeature('quiz') },
    { id: 'tutor', icon: '👨‍🏫', color: 'green', label: 'Smart Tutor', onClick: () => setActiveFeature('tutor') },
    { id: 'video', icon: '🎥', color: 'blue', label: 'Video Resources', onClick: () => setActiveFeature('video') }
  ];

  return (
    <div className="dashboard-shell">
      
      <div className="dashboard-intro">
        <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#ffffff', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
          Choose a Feature
        </h2>
        <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0, fontWeight: '500' }}>
          Select any AI module below to dive deep into your parsed content.
        </p>
      </div>

      {/* Expanded 3D Glass Layout Grid Container Matrix */}
      <div className="dashboard-grid">
        <GlassIcons items={featureItems} />
      </div>

    </div>
  );
}

export default DashboardGrid;