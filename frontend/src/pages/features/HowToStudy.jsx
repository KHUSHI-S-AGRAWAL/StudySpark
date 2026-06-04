import { useState, useEffect } from 'react';
import API from '../../services/api';

function HowToStudy({ data, onBack }) {
  const [strategy, setStrategy] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.post('/api/feature', {
      feature: 'study',
      full_context: data?.full_context || "",
      syllabus_context: data?.syllabus_context || ""
    })
    .then(res => {
      setStrategy(res.data.result);
      setLoading(false);
    })
    .catch(err => {
      console.error("Study strategy compilation failed:", err);
      setLoading(false);
    });
  }, [data]);

  const renderCleanBlocks = (text) => {
    if (!text) return null;
    return text.split(/(?=\d+\.\s+\*\*)/).map((block, i) => {
      const match = block.match(/\*\*([^*]+)\*\*/);
      const title = match ? match[1].replace(/^\d+\.\s+/, '') : `Phase 0${i + 1}`;
      const body = block.replace(/\*\*([^*]+)\*\*/, '').replace(/\*\*/g, '').replace(/\*/g, '').trim();
      return (
        <div key={i} style={{ backgroundColor: 'rgba(30, 41, 59, 0.35)', backdropFilter: 'blur(16px)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', padding: '24px', marginBottom: '16px' }}>
          <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#f87171', margin: '0 0 8px 0' }}>💡 {title}</h4>
          <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.6', margin: 0, whiteSpace: 'pre-line' }}>{body}</p>
        </div>
      );
    });
  };

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
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <span style={{ fontSize: '32px' }}>🧠</span>
        <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#ffffff', margin: 0 }}>AI Learning Strategy</h2>
      </div>

      {loading ? (
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>Analyzing document density to formulate an ideal study roadmap...</p>
      ) : (
        <div>{renderCleanBlocks(strategy)}</div>
      )}
    </div>
  );
}

export default HowToStudy;