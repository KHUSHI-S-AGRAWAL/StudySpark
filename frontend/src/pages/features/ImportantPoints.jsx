import { useState, useEffect } from 'react';
import API from '../../services/api';

function ImportantPoints({ data, onBack }) {
  const [points, setPoints] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.post('/api/feature', {
      feature: 'points',
      full_context: data?.full_context || "",
      syllabus_context: data?.syllabus_context || ""
    })
    .then(res => {
      setPoints(res.data.result);
      setLoading(false);
    })
    .catch(err => {
      console.error("Important points extraction failed:", err);
      setLoading(false);
    });
  }, [data]);

  const renderCleanPoints = (text) => {
    if (!text) return null;
    return text.split('\n').filter(line => line.trim()).map((line, idx) => {
      const cleanLine = line.replace(/\*\*/g, '').replace(/\*/g, '').trim();
      return (
        <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '14px 18px', backgroundColor: 'rgba(30, 41, 59, 0.25)', borderLeft: '3px solid #fb923c', borderRadius: '4px 12px 12px 4px', marginBottom: '12px' }}>
          <span style={{ color: '#fb923c' }}>📌</span>
          <p style={{ margin: 0, fontSize: '14px', color: '#e2e8f0', lineHeight: '1.5' }}>{cleanLine}</p>
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
        <span style={{ fontSize: '32px' }}>🎯</span>
        <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#ffffff', margin: 0 }}>Important Points & Formulas</h2>
      </div>

      {loading ? (
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>Extracting critical formulas and key notes from your material...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>{renderCleanPoints(points)}</div>
      )}
    </div>
  );
}

export default ImportantPoints;