import React, { useState } from 'react';

const subjectData = [
  { 
    name: 'Biology', 
    completed: 3, 
    total: 5, 
    quizAvg: 78, 
    color: '#88C088', 
    sessions: [3, 5, 2, 4, 6, 3, 5],
    chapters: [
      { title: 'Cell Biology', done: true },
      { title: 'Genetics & DNA', done: true },
      { title: 'Ecology & Biomes', done: false },
      { title: 'Human Physiology', done: true },
      { title: 'Plant Anatomy', done: false }
    ]
  },
  { 
    name: 'Chemistry', 
    completed: 4, 
    total: 6, 
    quizAvg: 84, 
    color: '#E6A817', 
    sessions: [4, 3, 5, 6, 4, 2, 6],
    chapters: [
      { title: 'Organic Reactions', done: true },
      { title: 'Atomic Structure', done: true },
      { title: 'Periodic Table Trends', done: true },
      { title: 'Electrochemistry', done: true },
      { title: 'Thermodynamics', done: false },
      { title: 'Chemical Kinetics', done: false }
    ]
  },
  { 
    name: 'Mathematics', 
    completed: 2, 
    total: 5, 
    quizAvg: 65, 
    color: '#F4A261', 
    sessions: [2, 1, 3, 2, 4, 3, 2],
    chapters: [
      { title: 'Calculus Integrals', done: true },
      { title: 'Matrices & Determinants', done: true },
      { title: 'Probability & Stats', done: false },
      { title: 'Trigonometry', done: false },
      { title: 'Linear Algebra', done: false }
    ]
  },
  { 
    name: 'History', 
    completed: 3, 
    total: 4, 
    quizAvg: 72, 
    color: '#A8DADC', 
    sessions: [3, 4, 2, 3, 2, 4, 3],
    chapters: [
      { title: 'Medieval Revolutions', done: true },
      { title: 'Ancient Civilizations', done: true },
      { title: 'Industrialization Ages', done: true },
      { title: 'Modern Alliances', done: false }
    ]
  },
];

const weekLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const maxSessions = 7;

export default function ProgressChart() {
  const [activeSubject, setActiveSubject] = useState(null);
  const displayed = activeSubject ? subjectData.filter(s => s.name === activeSubject) : subjectData;

  return (
    <div className="progress-panel">
      <div className="panel-header">
        <h2 className="panel-title">📊 Progress Nursery</h2>
        <p className="panel-subtitle">Watch your subjects sprout and grow. Review exact chapter completed vs total counts per subject scope.</p>
      </div>

      {/* Subject Filter Pills */}
      <div className="subject-pills">
        <button onClick={() => setActiveSubject(null)} className={`pill-btn sketch-border-sm ${!activeSubject ? 'pill-active' : ''}`}>All Subjects</button>
        {subjectData.map(s => (
          <button key={s.name} onClick={() => setActiveSubject(s.name === activeSubject ? null : s.name)}
            className={`pill-btn sketch-border-sm ${activeSubject === s.name ? 'pill-active' : ''}`}
            style={{ '--pill-color': s.color }}>
            {s.name}
          </button>
        ))}
      </div>

      {/* Radial Progress Rings displaying Completed vs Total */}
      <div className="rings-grid">
        {displayed.map(s => {
          const r = 46;
          const circ = 2 * Math.PI * r;
          const pct = Math.round((s.completed / s.total) * 100);
          const studied = (pct / 100) * circ;
          
          return (
            <div key={s.name} className="ring-card sketch-border sketch-shadow" onClick={() => setActiveSubject(s.name === activeSubject ? null : s.name)}>
              <div className="card-top-row">
                <h4 className="ring-subject-name">{s.name}</h4>
                <span className="badge-small bg-sky text-xxs font-bold">{s.completed} of {s.total} chapters</span>
              </div>
              
              <div className="card-ring-body mt-2">
                <svg width="130" height="130" viewBox="0 0 130 130">
                  {/* Background ring */}
                  <circle cx="65" cy="65" r={r} fill="none" stroke="var(--wood-border-light)" strokeWidth="10" />
                  {/* Progress ring */}
                  <circle cx="65" cy="65" r={r} fill="none" stroke={s.color} strokeWidth="10"
                    strokeDasharray={`${studied} ${circ - studied}`} strokeDashoffset={0}
                    strokeLinecap="round" transform="rotate(-90 65 65)" />
                  <text x="65" y="62" textAnchor="middle" fontSize="20" fontFamily="var(--heading)" fontWeight="700" fill="var(--wood-ink)">{pct}%</text>
                  <text x="65" y="80" textAnchor="middle" fontSize="10" fontFamily="var(--sans)" fill="var(--wood-ink-muted)">Harvested</text>
                </svg>
                
                {/* Chapter Checklist tracker inside card! */}
                <div className="ring-card-chapters-checklist sketch-border-sm mt-3">
                  <p className="checklist-title font-bold text-xxs border-bottom pb-1 mb-2">Chapters Tracking</p>
                  <ul className="checklist-items-list text-xxs">
                    {s.chapters.map((ch, idx) => (
                      <li key={idx} className={ch.done ? 'checked-item' : 'unchecked-item'}>
                        <span>{ch.done ? '✅' : '○'}</span>
                        <span className="chk-label">{ch.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="ring-info mt-3 border-top pt-2 w-full text-center">
                <div className="ring-quiz-avg">
                  <span>Quiz Average Score: </span>
                  <strong style={{ color: s.quizAvg >= 75 ? '#2e7d32' : '#c62828' }}>{s.quizAvg}%</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Weekly Session Bar Chart / Growth Nursery */}
      <div className="bar-chart-card sketch-border sketch-shadow">
        <h3 className="card-section-title">📅 Weekly Study Nursery (Sessions vs Sprouts)</h3>
        <p className="text-xs text-gray-500 mb-2">Each completed hour feeds your subject sprout, causing it to blossom higher on the canvas!</p>
        
        {displayed.map(s => (
          <div key={s.name} className="bar-chart-row mt-3">
            <span className="bar-subject-label font-bold">{s.name}</span>
            <div className="bars-container">
              {s.sessions.map((val, i) => {
                const height = (val / maxSessions) * 80;
                return (
                  <div key={i} className="bar-col">
                    <div className="bar-tooltip">{val} hours</div>
                    
                    {/* Flower sprout top accent */}
                    {val >= 4 && <span className="nursery-flower-sprout" style={{ transform: `translateY(-${height}px)` }}>🌸</span>}
                    {val < 4 && val >= 2 && <span className="nursery-flower-sprout" style={{ transform: `translateY(-${height}px)` }}>🌱</span>}
                    
                    <div className="bar-fill sketch-border-sm"
                      style={{ height: `${height}px`, background: s.color }}>
                    </div>
                    <span className="bar-day-label">{weekLabels[i]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .progress-panel { display: flex; flex-direction: column; gap: 26px; }
        
        .subject-pills { display: flex; gap: 10px; flex-wrap: wrap; }
        .pill-btn { font-family: var(--heading); font-weight: 600; font-size: 13px; padding: 7px 16px; background: var(--wood-card); cursor: pointer; border: 2px solid var(--wood-ink); transition: all 0.2s; }
        .pill-btn:hover { background: var(--pill-color, var(--wood-accent)); transform: translateY(-2px); }
        .pill-btn.pill-active { background: var(--pill-color, var(--wood-primary)); box-shadow: 3px 3px 0 var(--wood-ink); }
        
        .rings-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 22px; }
        .ring-card { background: var(--wood-card); padding: 20px; display: flex; flex-direction: column; cursor: pointer; transition: all 0.25s; }
        .ring-card:hover { transform: translateY(-4px); }
        
        .card-top-row { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px dashed var(--wood-border-light); padding-bottom: 8px; }
        .ring-subject-name { font-family: var(--heading); font-size: 16px; font-weight: 700; }
        
        .card-ring-body { display: grid; grid-template-columns: 130px 1fr; gap: 14px; align-items: center; }
        @media (max-width: 500px) { .card-ring-body { grid-template-columns: 1fr; justify-items: center; } }
        
        .ring-card-chapters-checklist { background: var(--wood-bg); padding: 10px; height: 110px; overflow-y: auto; width: 100%; box-sizing: border-box; }
        .checklist-items-list { list-style: none; display: flex; flex-direction: column; gap: 4px; padding-left: 2px; }
        .checklist-items-list li { display: flex; gap: 6px; align-items: center; }
        .checked-item .chk-label { text-decoration: line-through; color: var(--wood-ink-muted); }
        .unchecked-item .chk-label { font-weight: bold; color: var(--wood-ink); }

        .ring-quiz-avg { font-size: 12px; color: var(--wood-ink-muted); }
        .badge-small { font-size: 10px; font-weight: bold; font-family: var(--heading); border: 1px solid var(--wood-ink); padding: 1px 6px; border-radius: 4px; text-transform: uppercase; }
        .bg-sky { background: #E0F7FA; }

        .bar-chart-card { background: var(--wood-card); padding: 26px; display: flex; flex-direction: column; gap: 14px; }
        .card-section-title { font-family: var(--heading); font-size: 18px; }
        
        .bar-chart-row { display: flex; align-items: flex-end; gap: 16px; }
        .bar-subject-label { font-family: var(--heading); font-size: 13px; width: 95px; flex-shrink: 0; text-align: right; }
        .bars-container { display: flex; gap: 12px; align-items: flex-end; height: 110px; position: relative; }
        .bar-col { display: flex; flex-direction: column; align-items: center; gap: 4px; position: relative; }
        
        .nursery-flower-sprout {
          position: absolute;
          font-size: 15px;
          bottom: 24px;
          left: 50%;
          transform-origin: bottom center;
          animation: sway 2s infinite alternate ease-in-out;
        }
        @keyframes sway { 0% { transform: translate(-50%, 0) rotate(-4deg); } 100% { transform: translate(-50%, 0) rotate(4deg); } }

        .bar-col:hover .bar-tooltip { opacity: 1; }
        .bar-tooltip { position: absolute; top: -24px; font-size: 11px; font-family: var(--heading); font-weight: 700; background: var(--wood-ink); color: #fff; padding: 2px 6px; border-radius: 3px; opacity: 0; transition: opacity 0.2s; white-space: nowrap; z-index: 10; }
        .bar-fill { width: 26px; transition: height 0.5s cubic-bezier(0.4,0,0.2,1); }
        .bar-day-label { font-size: 10px; font-family: var(--heading); color: var(--wood-ink-muted); }
      `}</style>
    </div>
  );
}
