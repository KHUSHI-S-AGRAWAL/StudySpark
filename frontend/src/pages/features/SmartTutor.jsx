import React from 'react';

function SmartTutor({ data, onBack }) {
  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', paddingTop: '40px', fontFamily: 'system-ui, sans-serif' }}>
      <button 
        onClick={onBack}
        style={{ 
          background: 'rgba(30, 41, 59, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.1)', 
          color: '#38bdf8', 
          cursor: 'pointer', 
          fontWeight: '700', 
          fontSize: '14px', 
          marginBottom: '24px',
          padding: '10px 18px',
          borderRadius: '10px',
          display: 'inline-flex',
          alignItems: 'center',
          position: 'relative',
          zIndex: 9999,
          pointerEvents: 'auto'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(56, 189, 248, 0.1)'}
        onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(30, 41, 59, 0.6)'}
      >
        ← Back to Features
      </button>
      
      <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '40px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
        <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>🤖</span>
        <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#ffffff', margin: '0 0 12px 0', letterSpacing: '-0.02em' }}>
          Smart Tutor Engine
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '14.5px', lineHeight: '1.6', margin: 0, maxWidth: '480px', margin: '0 auto' }}>
          AI Classroom environment initialized. Your custom 1-on-1 tutoring configuration is compiling text vectors now.
        </p>
      </div>
    </div>
  );
}

export default SmartTutor;