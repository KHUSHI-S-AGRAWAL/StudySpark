import { useState, useEffect } from 'react';
import API from '../../services/api';

function TextFeatureView({ contexts, featureKey, title, icon, onBack }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    API.post('/api/feature', { ...contexts, feature: featureKey })
      .then(res => {
        setContent(res.data.result);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [contexts, featureKey]);

  // Integrated native browser Text-to-Speech Engine
  const handleListen = () => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(content);
    utterance.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 bg-slate-800/40 p-8 rounded-2xl border border-slate-700/60 shadow-xl backdrop-blur-sm">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="text-sm text-indigo-400 hover:underline">← Back to Dashboard</button>
        
        {!loading && (
          <div className="flex gap-2">
            <button 
              onClick={handleListen}
              className={`px-4 py-1.5 rounded-lg font-bold text-xs transition-all ${isSpeaking ? 'bg-emerald-600 text-white' : 'bg-sky-400 text-slate-900 hover:bg-sky-300'}`}
            >
              🔊 Listen
            </button>
            <button 
              onClick={handleStop}
              className="px-4 py-1.5 bg-red-500 hover:bg-red-400 text-white rounded-lg font-bold text-xs transition-all"
            >
              ⏹️ Stop
            </button>
          </div>
        )}
      </div>

      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-100">
        <span>{icon}</span> {title}
      </h2>

      {loading ? (
        <p className="text-slate-400 animate-pulse">StudySpark is interpreting your context vectors...</p>
      ) : (
        <div className="text-slate-300 whitespace-pre-line leading-relaxed tracking-wide text-sm">
          {content}
        </div>
      )}
    </div>
  );
}

export default TextFeatureView;