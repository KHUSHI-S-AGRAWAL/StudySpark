import { useState, useEffect } from 'react';
import API from '../../services/api';

function QuizPanel({ data, onBack }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.post('/api/feature/quiz', {
      feature: 'quiz',
      full_context: data?.full_context || "",
      syllabus_context: data?.syllabus_context || ""
    })
    .then(res => {
      setQuestions(res.data.quiz);
      setLoading(false);
    })
    .catch(err => {
      console.error("Quiz generation failed:", err);
      setLoading(false);
    });
  }, [data]);

  const handleOptionClick = (option) => {
    if (selectedOption) return;
    setSelectedOption(option);
    if (option === questions[currentIndex].answer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setQuizComplete(true);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '80px', color: '#94a3b8', fontFamily: 'sans-serif', fontSize: '15px' }}>
        📚 Gemini is reading your files to generate custom questions...
      </div>
    );
  }

  if (!loading && questions.length === 0) {
    return (
      <div style={{ maxWidth: '500px', margin: '40px auto', backgroundColor: 'rgba(30,41,59,0.4)', border: '1px solid rgba(255,255,255,0.08)', padding: '32px', borderRadius: '16px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <p style={{ color: '#cbd5e1', margin: '0 0 16px 0' }}>Could not generate a quiz. Make sure your uploaded files have enough context text.</p>
        <button onClick={onBack} style={{ padding: '8px 20px', backgroundColor: '#334155', border: 'none', color: '#fff', borderRadius: '8px', cursor: 'pointer' }}>Go Back</button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div style={{ width: '100%', maxWidth: '640px', margin: '0 auto', paddingTop: '40px', fontFamily: 'system-ui, sans-serif' }}>
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

      {!quizComplete ? (
        <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span style={{ color: '#818cf8' }}>Score: {score}</span>
          </div>

          <h3 style={{ fontSize: '19px', fontWeight: '700', color: '#ffffff', margin: '0 0 24px 0', lineHeight: '1.5' }}>
            {currentQ?.question}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {currentQ?.options?.map((option, idx) => {
              let borderStyle = '1px solid rgba(255,255,255,0.1)';
              let bgStyle = 'rgba(15, 23, 42, 0.3)';
              let textColor = '#cbd5e1';

              if (selectedOption) {
                if (option === currentQ.answer) {
                  borderStyle = '1px solid #10b981';
                  bgStyle = 'rgba(16, 185, 129, 0.08)';
                  textColor = '#10b981';
                } else if (option === selectedOption) {
                  borderStyle = '1px solid #ef4444';
                  bgStyle = 'rgba(239, 68, 68, 0.08)';
                  textColor = '#ef4444';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(option)}
                  disabled={!!selectedOption}
                  style={{ width: '100%', textAlign: 'left', padding: '16px', borderRadius: '12px', background: bgStyle, border: borderStyle, color: textColor, fontSize: '14px', cursor: selectedOption ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {selectedOption && (
            <div style={{ marginTop: '24px' }}>
              {currentQ?.explanation && (
                <div style={{ padding: '16px', backgroundColor: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: '12px', fontSize: '13.5px', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '20px' }}>
                  <span style={{ fontWeight: '800', color: '#818cf8', display: 'block', marginBottom: '4px' }}>💡 Explanation:</span>
                  {currentQ.explanation}
                </div>
              )}
              <button
                onClick={handleNext}
                style={{ width: '100%', padding: '14px 0', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}
              >
                {currentIndex + 1 === questions.length ? "Finish Quiz" : "Next Question →"}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '32px', backgroundColor: 'rgba(30, 41, 59, 0.4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px' }}>
          <span style={{ fontSize: '48px' }}>🏆</span>
          <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#fff', margin: '16px 0 8px 0' }}>Quiz Completed!</h3>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '15px' }}>
            You scored <span style={{ color: '#38bdf8', fontWeight: '800', fontSize: '18px' }}>{score}</span> out of {questions.length}
          </p>
          <button onClick={onBack} style={{ marginTop: '24px', padding: '10px 24px', backgroundColor: '#334155', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}>Return to Features</button>
        </div>
      )}
    </div>
  );
}

export default QuizPanel;