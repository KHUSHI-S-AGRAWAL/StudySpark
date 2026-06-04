import { useState, useEffect } from 'react';
import API from '../../services/api';

function VideoResources({ data, onBack }) {
  const [videos, setVideos] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.post('/api/feature', {
      feature: 'video',
      full_context: data?.full_context || "",
      syllabus_context: data?.syllabus_context || ""
    })
    .then(res => {
      setVideos(res.data.result);
      setLoading(false);
    })
    .catch(err => {
      console.error("Video resources loading failed:", err);
      setLoading(false);
    });
  }, [data]);

  const renderCleanVideosWithLinks = (text) => {
    if (!text) return null;
    return text.split('\n').filter(line => line.trim()).map((line, idx) => {
      const cleanLine = line.replace(/\*\*/g, '').replace(/\*/g, '').trim();
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const parts = cleanLine.split(urlRegex);

      return (
        <div 
          key={idx} 
          style={{ 
            padding: '16px 20px', 
            backgroundColor: 'rgba(30,41,59,0.3)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '12px',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            transition: 'border-color 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.25)'}
          onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)'}
        >
          <span style={{ fontSize: '24px', userSelect: 'none' }}>📺</span>
          <p style={{ margin: 0, fontSize: '14px', color: '#e2e8f0', lineHeight: '1.6' }}>
            {parts.map((part, i) => {
              if (part.match(urlRegex)) {
                return (
                  <a
                    key={i}
                    href={part}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#38bdf8',
                      textDecoration: 'none',
                      fontWeight: '700',
                      borderBottom: '1px dashed rgba(56, 189, 248, 0.4)',
                      transition: 'color 0.2s',
                      marginLeft: '4px'
                    }}
                    onMouseOver={(e) => e.target.style.color = '#0ea5e9'}
                    onMouseOut={(e) => e.target.style.color = '#38bdf8'}
                  >
                    👉 Open Video Resource 🔗
                  </a>
                );
              }
              return part;
            })}
          </p>
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
        <span style={{ fontSize: '32px' }}>🎥</span>
        <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#ffffff', margin: 0 }}>Recommended Video Resources</h2>
      </div>

      {loading ? (
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>Formulating ideal search parameters...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {renderCleanVideosWithLinks(videos)}
        </div>
      )}
    </div>
  );
}

export default VideoResources;