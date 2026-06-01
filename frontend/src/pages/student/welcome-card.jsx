import React, { useState, useEffect } from 'react';

export default function WelcomeCard({ userName = '' }) {
  const [mood, setMood] = useState('focused'); // calm, focused, tired, inspired
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const quotes = {
    calm: '“Nature does not hurry, yet everything is accomplished.” — Lao Tzu',
    focused: '“Concentrate all your thoughts upon the work at hand.” — Alexander Graham Bell',
    tired: '“It is okay to rest. A carved wheel travels further after a grease check.”',
    inspired: '“The mind is not a vessel to be filled, but a fire to be kindled.” — Plutarch'
  };

  return (
    <div className="welcome-card-panel sketch-border sketch-shadow">
      {/* Tape Accent */}
      <div className="welcome-tape"></div>

      <div className="welcome-layout">
        <div className="welcome-main-col">
          <h2 className="welcome-greet">
            {userName ? `Welcome back to your cabin, ${userName}! ☕` : 'Welcome back to your cabin ☕'}
          </h2>
          <p className="welcome-time-text font-mono">
            Desk Time: <span className="highlight-text">{timeString}</span>
          </p>

          <div className="quote-board sketch-border-sm">
            <span className="quote-badge handwritten">mindful thought</span>
            <p className="quote-text">{quotes[mood]}</p>
          </div>

          {/* Daily Mindfulness Challenge */}
          <div className="daily-challenge sketch-border-sm">
            <h4 className="font-bold flex items-center gap-2">
              <span>🌸</span> Today's Desk Ritual
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              Water your study seedling by checking off at least 2 planning items. Take a deep, 5-second breath before starting each focus block.
            </p>
          </div>
        </div>

        {/* Mood Logger */}
        <div className="welcome-mood-col sketch-border-sm">
          <h3 className="mood-title font-bold text-center">Desk Mood</h3>
          <p className="text-xxs text-center text-gray-500 mb-3">How does focus feel today?</p>
          
          <div className="mood-grid">
            <button onClick={() => setMood('focused')} className={`mood-btn ${mood === 'focused' ? 'active' : ''}`}>
              <span className="mood-emoji">🎯</span>
              <span className="mood-label">Focused</span>
            </button>
            <button onClick={() => setMood('calm')} className={`mood-btn ${mood === 'calm' ? 'active' : ''}`}>
              <span className="mood-emoji">🍃</span>
              <span className="mood-label">Calm</span>
            </button>
            <button onClick={() => setMood('tired')} className={`mood-btn ${mood === 'tired' ? 'active' : ''}`}>
              <span className="mood-emoji">💤</span>
              <span className="mood-label">Tired</span>
            </button>
            <button onClick={() => setMood('inspired')} className={`mood-btn ${mood === 'inspired' ? 'active' : ''}`}>
              <span className="mood-emoji">✨</span>
              <span className="mood-label">Inspired</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .welcome-card-panel {
          background-color: var(--wood-card);
          padding: 36px 30px;
          position: relative;
          width: 100%;
          box-sizing: border-box;
        }

        .welcome-tape {
          position: absolute;
          top: -12px;
          left: 40px;
          width: 100px;
          height: 24px;
          background-color: rgba(253, 242, 204, 0.7);
          border: 1px dashed rgba(45, 44, 36, 0.2);
          transform: rotate(-2deg);
        }

        .welcome-layout {
          display: grid;
          grid-template-columns: 1.3fr 0.7fr;
          gap: 30px;
          @media (max-width: 768px) {
            grid-template-columns: 1fr;
          }
        }

        .welcome-greet {
          font-size: 26px;
          margin-bottom: 5px;
        }

        .welcome-time-text {
          font-size: 15px;
          color: var(--wood-ink-muted);
          margin-bottom: 20px;
        }

        .quote-board {
          background-color: var(--wood-bg);
          padding: 20px;
          position: relative;
          margin-bottom: 20px;
        }

        .quote-badge {
          position: absolute;
          top: -15px;
          right: 20px;
          background-color: var(--wood-card);
          border: 1.5px solid var(--wood-ink);
          padding: 2px 8px;
          font-size: 16px;
        }

        .quote-text {
          font-family: var(--sans);
          font-style: italic;
          color: var(--wood-ink);
          font-size: 15px;
          line-height: 1.5;
        }

        .daily-challenge {
          background-color: var(--wood-sage);
          padding: 16px;
          border-color: var(--wood-ink);
        }

        .welcome-mood-col {
          background-color: #FAF7EA;
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          border-color: var(--wood-ink);
        }

        .mood-title {
          font-size: 18px;
        }

        .mood-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .mood-btn {
          background-color: var(--wood-card);
          border: 2px solid var(--wood-ink);
          border-radius: 8px;
          padding: 10px 4px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          transition: all 0.2s;
        }

        .mood-btn:hover {
          transform: translateY(-2px);
          background-color: var(--wood-accent);
        }

        .mood-btn.active {
          background-color: var(--wood-primary);
          box-shadow: 2px 2px 0px var(--wood-ink);
        }

        .mood-emoji {
          font-size: 24px;
        }

        .mood-label {
          font-family: var(--heading);
          font-weight: 600;
          font-size: 12px;
          color: var(--wood-ink);
        }
      `}</style>
    </div>
  );
}
