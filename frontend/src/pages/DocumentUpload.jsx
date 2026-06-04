import { useState } from 'react';
import API from '../services/api'; // Preserves your live backend API instance
import StarBorder from './features/StarBorder'; // Path to your star frame component

function DocumentUpload({ onProcessingComplete }) {
  const [notesFile, setNotesFile] = useState(null);
  const [syllabusFile, setSyllabusFile] = useState(null);
  const [loading, setLoading] = useState(false); // Preserves your live loader state
  const [errorMessage, setErrorMessage] = useState('');

  const handleProcess = async () => {
    if (!notesFile) {
      setErrorMessage('Please upload at least one note/paper to proceed.');
      return;
    }

    setErrorMessage('');
    setLoading(true);

    const formData = new FormData();
    formData.append('files', notesFile);
    if (syllabusFile) {
      formData.append('syllabus', syllabusFile);
    }

    try {
      const response = await API.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onProcessingComplete(response.data);
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to connect or process documents. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: '105px',
      paddingBottom: '40px',
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      boxSizing: 'border-box'
    }}>
      
      {/* STAR BORDER MOUNT ENGINE FRAME */}
      <div style={{ width: '100%', maxWidth: '500px', boxSizing: 'border-box' }}>
        <StarBorder
          as="div"
          color="#38bdf8"
          speed="4s"
          thickness={2}
        >
          <div style={{
            width: '100%',
            padding: '40px',
            textAlign: 'center',
            boxSizing: 'border-box',
            backgroundColor: 'rgba(30, 41, 59, 0.4)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)'
          }}>
            
            <h2 style={{ fontSize: '30px', fontWeight: '800', color: '#ffffff', marginBottom: '8px', letterSpacing: '-0.02em', margin: '0 0 8px 0' }}>
              Upload Documents
            </h2>
            <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '32px', fontWeight: '500', margin: '0 0 32px 0' }}>
              Provide your study contents to start generating custom dashboards.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* BLOCK 1: Notes/Papers Custom File Input */}
              <div style={{ textAlign: 'left' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#cbd5e1', marginBottom: '8px', letterSpacing: '0.05em' }}>
                  Upload Papers / Notes <span style={{ color: '#38bdf8' }}>*</span>
                </label>
                <div style={{
                  position: 'relative',
                  /* INTERNAL EFFECTS: Adds a clean neon outline glow around the interior block */
                  border: notesFile ? '2px dashed #38bdf8' : '2px dashed rgba(56, 189, 248, 0.2)', 
                  backgroundColor: notesFile ? 'rgba(56, 189, 248, 0.04)' : 'rgba(0,0,0,0.2)',
                  borderRadius: '16px',
                  padding: '24px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: 'inset 0 0 10px rgba(0,0,0,0.3)'
                }}>
                  <input 
                    type="file" 
                    accept=".pdf,image/*"
                    onChange={(e) => setNotesFile(e.target.files[0])}
                    style={{ position: 'absolute', inset: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer', zIndex: 10 }}
                  />
                  <span style={{ fontSize: '32px', display: 'block', marginBottom: '4px' }}>{notesFile ? '✅' : '📄'}</span>
                  <p style={{ fontSize: '14px', color: notesFile ? '#ffffff' : '#94a3b8', fontWeight: '600', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: '0 8px' }}>
                    {notesFile ? notesFile.name : 'Choose PDF or Image file'}
                  </p>
                  <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', marginBottom: 0 }}>Max file size 25MB</p>
                </div>
              </div>

              {/* BLOCK 2: Syllabus Input (Optional) */}
              <div style={{ textAlign: 'left' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#cbd5e1', marginBottom: '8px', letterSpacing: '0.05em' }}>
                  Upload Syllabus <span style={{ color: '#64748b', fontSize: '11px', fontWeight: '500', textTransform: 'lowercase' }}>(optional)</span>
                </label>
                <div style={{
                  position: 'relative',
                  /* INTERNAL EFFECTS: Adds a clean purple outline glow around the interior block */
                  border: syllabusFile ? '2px dashed #c084fc' : '2px dashed rgba(192, 132, 252, 0.2)', 
                  backgroundColor: syllabusFile ? 'rgba(192, 132, 252, 0.04)' : 'rgba(0,0,0,0.2)',
                  borderRadius: '16px',
                  padding: '24px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: 'inset 0 0 10px rgba(0,0,0,0.3)'
                }}>
                  <input 
                    type="file" 
                    accept=".pdf,image/*"
                    onChange={(e) => setSyllabusFile(e.target.files[0])}
                    style={{ position: 'absolute', inset: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer', zIndex: 10 }}
                  />
                  <span style={{ fontSize: '32px', display: 'block', marginBottom: '4px' }}>{syllabusFile ? '🔮' : '🗺️'}</span>
                  <p style={{ fontSize: '14px', color: syllabusFile ? '#ffffff' : '#94a3b8', fontWeight: '600', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: '0 8px' }}>
                    {syllabusFile ? syllabusFile.name : 'Choose curriculum plan file'}
                  </p>
                </div>
              </div>

              {/* Error Message Display */}
              {errorMessage && (
                <div style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  color: '#f87171',
                  padding: '14px',
                  borderRadius: '12px',
                  textAlign: 'left'
                }}>
                  ⚠️ {errorMessage}
                </div>
              )}

              {/* Action Submit Button */}
              <button
                onClick={handleProcess}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '16px 0',
                  backgroundColor: loading ? 'rgba(56, 189, 248, 0.15)' : notesFile ? '#38bdf8' : 'rgba(255,255,255,0.05)',
                  color: loading ? '#64748b' : notesFile ? '#070a13' : 'rgba(255,255,255,0.2)',
                  border: 'none',
                  borderRadius: '14px',
                  fontSize: '15px',
                  fontWeight: '800',
                  cursor: loading ? 'not-allowed' : notesFile ? 'pointer' : 'not-allowed',
                  letterSpacing: '0.02em',
                  boxShadow: notesFile && !loading ? '0 8px 24px -4px rgba(56, 189, 248, 0.35)' : 'none',
                  transition: 'all 0.2s ease',
                  marginTop: '8px'
                }}
                onMouseOver={(e) => {
                  if (notesFile && !loading) {
                    e.target.style.backgroundColor = '#0ea5e9';
                    e.target.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseOut={(e) => {
                  if (notesFile && !loading) {
                    e.target.style.backgroundColor = '#38bdf8';
                    e.target.style.transform = 'translateY(0px)';
                  }
                }}
              >
                {loading ? '⚡ Processing Analytics Engine...' : '⚡ Process Documents'}
              </button>

            </div>
          </div>
        </StarBorder>
      </div>

    </div>
  );
}

export default DocumentUpload;