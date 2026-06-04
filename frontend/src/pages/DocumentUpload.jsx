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
    <div className="upload-shell">
      
      {/* STAR BORDER MOUNT ENGINE FRAME */}
      <div className="upload-panel">
        <StarBorder
          as="div"
          color="#38bdf8"
          speed="4s"
          thickness={2}
        >
          <div className="upload-card">
            
            <h2 style={{ fontSize: '30px', fontWeight: '800', color: '#ffffff', marginBottom: '8px', letterSpacing: '-0.02em', margin: '0 0 8px 0' }}>
              Upload Documents
            </h2>
            <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '32px', fontWeight: '500', margin: '0 0 32px 0' }}>
              Provide your study contents to start generating custom dashboards.
            </p>

            <div className="upload-form">
              
              {/* BLOCK 1: Notes/Papers Custom File Input */}
              <div className="upload-block" style={{ textAlign: 'left' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#cbd5e1', marginBottom: '8px', letterSpacing: '0.05em' }}>
                  Upload Papers / Notes <span style={{ color: '#38bdf8' }}>*</span>
                </label>
                <div className="upload-dropzone" style={{
                  border: notesFile ? '2px dashed #38bdf8' : '2px dashed rgba(56, 189, 248, 0.2)',
                  backgroundColor: notesFile ? 'rgba(56, 189, 248, 0.04)' : 'rgba(0,0,0,0.2)'
                }}>
                  <input 
                    type="file" 
                    accept=".pdf,image/*"
                    onChange={(e) => setNotesFile(e.target.files[0])}
                    style={{ position: 'absolute', inset: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer', zIndex: 10 }}
                  />
                  <span className="upload-file-icon">{notesFile ? '✅' : '📄'}</span>
                  <p className={`upload-file-name ${notesFile ? 'has-file' : ''}`}>
                    {notesFile ? notesFile.name : 'Choose PDF or Image file'}
                  </p>
                  <p className="upload-info">Max file size 25MB</p>
                </div>
              </div>

              {/* BLOCK 2: Syllabus Input (Optional) */}
              <div className="upload-block">
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#cbd5e1', marginBottom: '8px', letterSpacing: '0.05em' }}>
                  Upload Syllabus <span style={{ color: '#64748b', fontSize: '11px', fontWeight: '500', textTransform: 'lowercase' }}>(optional)</span>
                </label>
                <div className="upload-dropzone" style={{
                  border: syllabusFile ? '2px dashed #c084fc' : '2px dashed rgba(192, 132, 252, 0.2)',
                  backgroundColor: syllabusFile ? 'rgba(192, 132, 252, 0.04)' : 'rgba(0,0,0,0.2)'
                }}>
                  <input 
                    type="file" 
                    accept=".pdf,image/*"
                    onChange={(e) => setSyllabusFile(e.target.files[0])}
                    style={{ position: 'absolute', inset: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer', zIndex: 10 }}
                  />
                  <span className="upload-file-icon">{syllabusFile ? '🔮' : '🗺️'}</span>
                  <p className={`upload-file-name ${syllabusFile ? 'has-file' : ''}`}>
                    {syllabusFile ? syllabusFile.name : 'Choose curriculum plan file'}
                  </p>
                </div>
              </div>

              {/* Error Message Display */}
              {errorMessage && (
                <div className="error-box">
                  ⚠️ {errorMessage}
                </div>
              )}

              {/* Action Submit Button */}
              <button
                onClick={handleProcess}
                disabled={loading}
                className="page-button"
                style={{
                  backgroundColor: loading ? 'rgba(56, 189, 248, 0.15)' : notesFile ? '#38bdf8' : 'rgba(255,255,255,0.05)',
                  color: loading ? '#64748b' : notesFile ? '#070a13' : 'rgba(255,255,255,0.2)',
                  cursor: loading ? 'not-allowed' : notesFile ? 'pointer' : 'not-allowed',
                  boxShadow: notesFile && !loading ? '0 8px 24px -4px rgba(56, 189, 248, 0.35)' : 'none',
                  marginTop: '8px'
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