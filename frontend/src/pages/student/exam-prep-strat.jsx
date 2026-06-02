import React, { useState } from 'react';

const strategies = [
  {
    id: 'ecology',
    subject: '🌲 Forest Ecology',
    color: 'var(--wood-sage)',
    daysLeft: 5,
    phases: [
      {
        phase: 'Root Knowledge',
        weeks: 'Weeks 1-2',
        tasks: [
          'Read chapters 1-4 on forest biomes and soil microbiology',
          'Highlight key definitions of symbiosis and mycorrhizae',
          'Draw the nitrogen and carbon nutrient cycles by hand'
        ]
      },
      {
        phase: 'Canopy Deep-Dive',
        weeks: 'Weeks 3-4',
        tasks: [
          'Review tricky flashcards on plant and tree adaptations',
          'Take the mid-term practice test on ecosystem equilibrium',
          'Attend peer study group in the cabin library'
        ]
      },
      {
        phase: 'Harvest & Review',
        weeks: 'Exam Week',
        tasks: [
          'Solve 3 past exam essay question papers under timed conditions',
          'Conduct an active-recall session on all handwritten charts',
          'Get a full night of restful sleep before exam day ☕'
        ]
      }
    ],
    tips: [
      'Study in 45-minute blocks, then step outside to look at real green leaves to rest your eyes.',
      'Draw connections between topics as branching trees—it assists visual memory.',
      'Explain the nitrogen cycle aloud to your pet or a plush toy to test your teaching flow.'
    ]
  },
  {
    id: 'physics',
    subject: '🍃 Acoustic Physics',
    color: '#F4A261', // var(--wood-clay) equivalent
    daysLeft: 12,
    phases: [
      {
        phase: 'Wave Mechanics Foundation',
        weeks: 'Weeks 1-2',
        tasks: [
          'Derive core formulas for sound wave propagation and velocity',
          'Solve 20 fundamental mechanics questions on harmonics',
          'Visualize wave interference and superposition patterns'
        ]
      },
      {
        phase: 'Resonance & Resonance Decay',
        weeks: 'Weeks 3-4',
        tasks: [
          'Analyze acoustic properties of string and wind instruments',
          'Complete the mid-term mock acoustic assessment',
          'Create a single-page cheatsheet of wave equations'
        ]
      },
      {
        phase: 'Final Tuning',
        weeks: 'Exam Week',
        tasks: [
          'Review the physics formulas in the Revision Desk deck',
          'Re-solve all incorrect homework questions from the semester',
          'Relax, clear your mind, and listen to cozy ambient soundscapes'
        ]
      }
    ],
    tips: [
      'Try listening to instrumental acoustic guitar music while solving equation sets.',
      'Remember: frequency is the heartbeat of sound. Keep your study frequency steady!',
      'Formulas are easier to remember if you understand the physical relationship they describe.'
    ]
  },
  {
    id: 'literature',
    subject: '📜 Medieval Literature',
    color: 'var(--wood-accent)',
    daysLeft: 19,
    phases: [
      {
        phase: 'Manuscript Reading',
        weeks: 'Weeks 1-2',
        tasks: [
          'Finish reading "Beowulf" and "The Canterbury Tales"',
          'Take detailed notes on recurring archetypes and epic themes',
          'Research the socio-political context of 14th-century writers'
        ]
      },
      {
        phase: 'Thematic Analysis',
        weeks: 'Weeks 3-4',
        tasks: [
          'Write 3 short outlines comparing chivalry and courtly love',
          'Discuss major literary themes with peers or in a study forum',
          'Review lecture slides on Old and Middle English linguistics'
        ]
      },
      {
        phase: 'Scribe\'s Final Review',
        weeks: 'Exam Week',
        tasks: [
          'Memorize key literary quotes for textual support in essays',
          'Outline essay structures for 5 potential exam prompts',
          'Do a mock timed writing session to practice pacing'
        ]
      }
    ],
    tips: [
      'Write your essay outlines with pen and paper—it feels more medieval and aids memory retention!',
      'Don\'t just memorize the plot; focus on the *why* behind the characters\' choices.',
      'Keep a cup of warm tea nearby to stay cozy and focused during long reading sessions.'
    ]
  }
];

export default function ExamPrepStrat() {
  const [activeStrat, setActiveStrat] = useState(strategies[0]?.id || null);
  const [phasesDone, setPhasesDone] = useState({});

  const strat = strategies.find(s => s.id === activeStrat);
  const done = phasesDone[activeStrat] || (strat ? new Array(strat.phases.length).fill(false) : []);

  const togglePhase = (idx) => {
    const updated = done.map((d, i) => i === idx ? !d : d);
    setPhasesDone({ ...phasesDone, [activeStrat]: updated });
  };

  const overallProgress = done.length ? Math.round((done.filter(Boolean).length / done.length) * 100) : 0;

  return (
    <div className="exam-prep-panel">
      <div className="panel-header">
        <h2 className="panel-title">🏆 Exam Preparation Strategy</h2>
        <p className="panel-subtitle">Build your own exam roadmap from scratch.</p>
      </div>

      {/* Subject Tab Selector */}
      <div className="strat-tabs">
        {strategies.length === 0 ? (
          <div className="exam-empty sketch-border-sm">No exam strategy added yet.</div>
        ) : strategies.map(s => (
          <button key={s.id} onClick={() => setActiveStrat(s.id)}
            className={`strat-tab sketch-border sketch-shadow ${activeStrat === s.id ? 'strat-tab-active' : ''}`}
            style={{ '--stab-color': s.color }}>
            <span className="stab-name">{s.subject}</span>
            <span className="stab-days" style={{ color: s.daysLeft <= 7 ? '#c62828' : 'var(--wood-ink-muted)' }}>
              {s.daysLeft}d until exam
            </span>
          </button>
        ))}
      </div>

      {/* Overall Completion Bar */}
      <div className="strat-completion-bar-wrap">
        <span className="strat-completion-label">Strategy Completion: {overallProgress}%</span>
        <div className="strat-completion-bar sketch-border-sm">
          <div className="strat-completion-fill" style={{ width: `${overallProgress}%`, background: strat?.color || 'var(--wood-accent)' }}></div>
        </div>
      </div>

      {/* Phase Roadmap Cards */}
      <div className="phases-timeline">
        {strat?.phases?.length ? strat.phases.map((p, idx) => (
          <div key={idx} className={`phase-card sketch-border sketch-shadow ${done[idx] ? 'phase-done' : ''}`}>
            {/* Connector line */}
            {idx < strat.phases.length - 1 && <div className="timeline-connector"></div>}

            <div className="phase-header" onClick={() => togglePhase(idx)}>
              <div className={`phase-circle sketch-border-sm ${done[idx] ? 'phase-circle-done' : ''}`}>
                {done[idx]
                  ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8L7 12L13 4" stroke="#2D2C24" strokeWidth="2.5" strokeLinecap="round" /></svg>
                  : <span className="phase-num">{idx + 1}</span>
                }
              </div>
              <div className="phase-title-block">
                <h4 className="phase-name">{p.phase}</h4>
                <span className="phase-weeks handwritten">{p.weeks}</span>
              </div>
              <span className="phase-toggle-btn">{done[idx] ? '✅ Done' : '○ Mark Done'}</span>
            </div>

            <ul className="phase-tasks">
              {p.tasks.map((t, ti) => (
                <li key={ti} className="phase-task-item sketch-border-sm">
                  <span className="task-bullet" style={{ background: strat?.color || 'var(--wood-accent)' }}></span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        )) : <div className="exam-empty sketch-border-sm">Select or add a strategy to see phases.</div>}
      </div>

      {/* Cozy Exam Tips Post-It */}
      <div className="exam-tips-section">
        <h3 className="card-section-title">📌 Cozy Expert Tips{strat ? ` for ${strat.subject}` : ''}</h3>
        <div className="tips-grid">
          {strat?.tips?.length ? strat.tips.map((tip, i) => (
            <div key={i} className="tip-post-it sketch-border-sm" style={{ transform: `rotate(${i % 2 === 0 ? '-1.5' : '1'}deg)` }}>
              <span className="tip-pin">📌</span>
              <p className="tip-text">{tip}</p>
            </div>
          )) : <div className="exam-empty sketch-border-sm">Add your own tips to see them here.</div>}
        </div>
      </div>

      <style>{`
        .exam-prep-panel { display: flex; flex-direction: column; gap: 26px; }
        .strat-tabs { display: flex; gap: 16px; flex-wrap: wrap; }
        .strat-tab { background: var(--wood-card); border: 2px solid var(--wood-ink); padding: 14px 24px; cursor: pointer; display: flex; flex-direction: column; gap: 4px; text-align: left; transition: all 0.2s; min-width: 160px; }
        .strat-tab:hover { transform: translateY(-3px); }
        .strat-tab.strat-tab-active { background: var(--stab-color, var(--wood-accent)); box-shadow: 4px 4px 0 var(--wood-ink); }
        .stab-name { font-family: var(--heading); font-weight: 700; font-size: 17px; }
        .stab-days { font-family: var(--heading); font-size: 12px; font-weight: 600; }
        .strat-completion-bar-wrap { display: flex; flex-direction: column; gap: 6px; }
        .strat-completion-label { font-family: var(--heading); font-size: 14px; font-weight: 600; color: var(--wood-ink-muted); }
        .strat-completion-bar { height: 14px; background: var(--wood-bg); overflow: hidden; }
        .strat-completion-fill { height: 100%; transition: width 0.5s ease; }
        .phases-timeline { display: flex; flex-direction: column; gap: 0; position: relative; }
        .phase-card { background: var(--wood-card); padding: 22px; display: flex; flex-direction: column; gap: 14px; position: relative; margin-bottom: 4px; transition: all 0.2s; }
        .phase-card.phase-done { background: var(--wood-sage); opacity: 0.85; }
        .timeline-connector { position: absolute; bottom: -4px; left: 36px; width: 2px; height: 8px; background: var(--wood-ink); z-index: 1; }
        .phase-header { display: flex; align-items: center; gap: 16px; cursor: pointer; }
        .phase-circle { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background: var(--wood-bg); flex-shrink: 0; }
        .phase-circle.phase-circle-done { background: var(--wood-primary); }
        .phase-num { font-family: var(--heading); font-weight: 700; font-size: 16px; }
        .phase-title-block { flex: 1; }
        .phase-name { font-family: var(--heading); font-size: 18px; font-weight: 700; margin-bottom: 2px; }
        .phase-weeks { font-size: 16px; color: var(--wood-ink-muted); }
        .phase-toggle-btn { font-family: var(--heading); font-size: 13px; color: var(--wood-ink-muted); white-space: nowrap; }
        .phase-tasks { list-style: none; display: flex; flex-direction: column; gap: 8px; padding-left: 52px; }
        .phase-task-item { background: var(--wood-bg); padding: 9px 14px; font-size: 14px; color: var(--wood-ink); display: flex; align-items: center; gap: 10px; }
        .task-bullet { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .exam-tips-section { display: flex; flex-direction: column; gap: 16px; }
        .card-section-title { font-family: var(--heading); font-size: 18px; }
        .tips-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; }
        .tip-post-it { background: var(--note-yellow); padding: 20px 18px 16px; position: relative; transition: all 0.2s; }
        .tip-post-it:hover { transform: rotate(0deg) scale(1.04) !important; }
        .tip-pin { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); font-size: 22px; }
        .tip-text { font-family: var(--sans); font-size: 14px; line-height: 1.5; color: var(--wood-ink); margin-top: 4px; }
      `}</style>
    </div>
  );
}
