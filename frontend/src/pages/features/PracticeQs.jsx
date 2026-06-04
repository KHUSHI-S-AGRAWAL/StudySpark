import { useState, useEffect } from 'react';
import API from '../../services/api';

function PracticeQs({ data, onBack }) {
  const [questions, setQuestions] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.post('/api/feature', {
      feature: 'practice',
      full_context: data?.full_context || "",
      syllabus_context: data?.syllabus_context || ""
    })
    .then(res => {
      setQuestions(res.data.result);
      setLoading(false);
    })
    .catch(err => {
      console.error("Practice questions extraction failed:", err);
      setLoading(false);
    });
  }, [data]);

  const renderCleanQuestions = (text) => {
    if (!text) return null;
    return text.split(/(?=Q\d+:|Question\s+\d+:)/i).map((item, index) => {
      if (!item.trim()) return null;
      const cleanText = item.replace(/\*\*/g, '').replace(/\*/g, '').trim();
      return (
        <div key={index} style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255,255,255,0.06)', padding: '20px', borderRadius: '14px', marginBottom: '16px' }}>
          <p style={{ margin: 0, fontSize: '14.5px', color: '#f1f5f9', lineHeight: '1.6', whiteSpace: 'pre-line' }}>{cleanText}</p>
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
      
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span>💡</span> Targeted Practice Questions
        </h2>
        <p style={{ fontSize: '13px', color: '#94a3b8', margin: '6px 0 0 0' }}>
          Recommended test variants focusing on high-priority historical exam weights.
        </p>
      </div>

      {loading ? (
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>Drafting probabilistic exam variants based on trend analytics...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>{renderCleanQuestions(questions)}</div>
      )}
    </div>
  );
}

export default PracticeQs;