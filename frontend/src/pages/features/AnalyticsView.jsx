import { useState, useEffect } from 'react';
import API from '../../services/api';

function AnalyticsView({ data, onBack }) {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.post('/api/feature', {
      feature: 'analytics',
      full_context: data?.full_context || "",
      syllabus_context: data?.syllabus_context || ""
    })
    .then(res => {
      setAnalyticsData(res.data.data);
      setLoading(false);
    })
    .catch(err => {
      console.error("Analytics network retrieval failed:", err);
      setLoading(false);
    });
  }, [data]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', color: '#94a3b8', fontFamily: 'sans-serif' }}>
        <span style={{ fontSize: '32px', marginBottom: '12px' }}>📊</span>
        <p style={{ fontSize: '14px', fontWeight: '600', margin: 0 }}>StudySpark Exam Analyst is rendering visual charts...</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto', paddingTop: '40px', fontFamily: 'system-ui, sans-serif', boxSizing: 'border-box' }}>
      
      {/* LEFT ACCENT CONTROLS CAPER HEADER */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px', marginBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '24px' }}>
        <button 
          onClick={onBack}
          style={{ 
            background: 'rgba(30, 41, 59, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.1)', 
            color: '#38bdf8', 
            cursor: 'pointer', 
            fontWeight: '700', 
            fontSize: '14px', 
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

        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#ffffff', margin: 0 }}>📊 AI Pattern Analytics</h2>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0 0' }}>Analyzing historical paper weights against exam boundaries.</p>
        </div>
      </div>

      <div style={{ backgroundColor: 'rgba(30,41,59,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '24px', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#f1f5f9', margin: '0 0 24px 0' }}>📈 Topic Frequency & Importance</h3>
        
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '12px', height: '260px', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px', padding: '20px', overflowX: 'auto' }}>
          {analyticsData?.topics?.map((topic, idx) => {
            const score = topic.importance_score || 0;
            const barHeight = `${Math.min(Math.max(score, 15), 100)}%`;
            
            return (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', minWidth: '70px' }}>
                <div style={{ width: '100%', height: '180px', display: 'flex', alignItems: 'flex-end', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px', overflow: 'hidden' }}>
                  <div style={{ width: '100%', height: barHeight, background: 'linear-gradient(to top, #2563eb, #6366f1)', borderRadius: '8px 8px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <span style={{ fontSize: '10px', fontWeight: '800', color: '#fff', bottom: '6px', position: 'absolute' }}>{score}%</span>
                  </div>
                </div>
                <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', margin: '8px 0 0 0', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', width: '100%', textAlign: 'center' }} title={topic.name}>{topic.name}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <div style={{ backgroundColor: 'rgba(30,41,59,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '24px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#f1f5f9', margin: '0 0 20px 0' }}>📋 Question Types Breakdown</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {analyticsData?.question_types?.map((qType, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: '600', marginBottom: '6px', color: '#cbd5e1' }}>
                  <span>{qType.type}</span>
                  <span style={{ color: '#38bdf8', fontWeight: '800' }}>{qType.percentage}%</span>
                </div>
                <div style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.2)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${qType.percentage}%`, height: '100%', backgroundColor: '#38bdf8', borderRadius: '4px' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ backgroundColor: 'rgba(30,41,59,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '24px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#f1f5f9', margin: '0 0 16px 0' }}>⚠️ Identified Syllabus Coverage Gaps</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '200px', overflowY: 'auto' }}>
            {analyticsData?.coverage_gaps && analyticsData.coverage_gaps.length > 0 ? (
              analyticsData.coverage_gaps.map((gap, idx) => (
                <div key={idx} style={{ padding: '12px', backgroundColor: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: '10px', fontSize: '13px', color: '#fbbf24', lineHeight: '1.4' }}>
                  ⚠️ {gap}
                </div>
              ))
            ) : (
              <p style={{ fontSize: '13px', color: '#10b981', margin: 0, fontWeight: '600' }}>🎉 Perfect Syllabus Alignment Verified!</p>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}

export default AnalyticsView;