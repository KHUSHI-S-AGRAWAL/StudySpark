import { useState } from 'react';
import API from '../../services/api';

function SmartPlanner({ data, onBack }) {
  const [days, setDays] = useState(14);
  const [schedule, setSchedule] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    API.post('/api/feature', {
      feature: 'planner',
      full_context: data?.full_context || "",
      syllabus_context: data?.syllabus_context || ""
    })
    .then(res => {
      setSchedule(res.data.result);
      setLoading(false);
    })
    .catch(err => {
      console.error("Planner schedule generation failed:", err);
      setLoading(false);
    });
  };

  const renderCleanSchedule = (text) => {
    if (!text) return null;
    return text.split(/(?=Day\s+\d+:|Week\s+\d+:)/i).map((item, idx) => {
      if (!item.trim()) return null;
      const cleanBlock = item.replace(/\*\*/g, '').replace(/\*/g, '').trim();
      return (
        <div key={idx} style={{ backgroundColor: 'rgba(15,23,42,0.3)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '14px' }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#cbd5e1', whiteSpace: 'pre-line', lineHeight: '1.65' }}>{cleanBlock}</p>
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
      
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#ffffff', margin: 0 }}>📅 Smart Study Planner</h2>
        <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0 0' }}>Auto-generate a prioritized study schedule emphasizing coverage gaps and high-frequency trends.</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px', backgroundColor: 'rgba(30,41,59,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <label style={{ fontSize: '14px', fontWeight: '600', color: '#cbd5e1' }}>Days available for study:</label>
          <input 
            type="number" 
            value={days} 
            onChange={(e) => setDays(Number(e.target.value))}
            min="1" max="60"
            style={{ marginTop: '8px', padding: '10px', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none' }}
          />
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{ padding: '12px 24px', alignSelf: 'flex-end', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer', transition: 'opacity 0.2s' }}
        >
          {loading ? 'Optimizing Schedule...' : 'Generate Smart Schedule'}
        </button>
      </div>

      {schedule && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>{renderCleanSchedule(schedule)}</div>
      )}
    </div>
  );
}

export default SmartPlanner;