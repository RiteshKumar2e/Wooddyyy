import React from 'react';

const stats = [
  { label: 'Total Subjects', value: '6', icon: '📚', color: 'var(--wood-accent)', change: 'Active branches' },
  { label: 'Ongoing Modules', value: '8', icon: '🔄', color: 'var(--wood-clay)', change: 'In progress' },
  { label: 'Completed Modules', value: '12', icon: '✅', color: 'var(--wood-sage)', change: '+3 this week' },
  { label: 'Topics Covered', value: '47', icon: '📖', color: 'var(--wood-sky)', change: '+5 this week' },
  { label: 'Quizzes Done', value: '23', icon: '📝', color: '#F3E5F5', change: '+3 this week' },
  { label: 'Study Hours', value: '38h', icon: '⏳', color: '#E8F3D6', change: '+2.5h this week' },
];

const subjectStatusData = [
  {
    subject: 'Biology 🧬',
    color: 'var(--wood-sage)',
    ongoing: ['Genetics & DNA', 'Ecology & Biomes'],
    completed: ['Cell Biology', 'Human Physiology']
  },
  {
    subject: 'Chemistry 🧪',
    color: 'var(--wood-clay)',
    ongoing: ['Electrochemistry'],
    completed: ['Organic Reactions', 'Atomic Structure', 'Periodic Table Trends']
  },
  {
    subject: 'Mathematics 📐',
    color: 'var(--wood-accent)',
    ongoing: ['Matrices & Determinants', 'Probability & Stats'],
    completed: ['Calculus Integrals']
  }
];

const recentActivity = [
  { time: '2h ago', action: 'Completed Quiz: Cell Biology Ch. 3', type: 'quiz' },
  { time: '5h ago', action: 'Added 12 revision notes for Organic Chemistry', type: 'revision' },
  { time: 'Yesterday', action: 'Updated Study Plan: Physics Thermodynamics', type: 'plan' },
  { time: '2 days ago', action: 'Completed Exam Prep Strategy for Biology', type: 'exam' },
  { time: '3 days ago', action: 'Logged 4h focus block in Timetable', type: 'time' },
];

const typeColor = { quiz: 'var(--wood-clay)', revision: 'var(--wood-sage)', plan: 'var(--wood-accent)', exam: 'var(--wood-sky)', time: '#F3E5F5' };
const typeIcon = { quiz: '📝', revision: '🔁', plan: '🗺️', exam: '🏆', time: '⏰' };

const weekHeat = [3, 5, 2, 6, 4, 1, 5];
const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function Summary() {
  return (
    <div className="summary-panel">
      <div className="panel-header">
        <h2 className="panel-title">📋 Cabin Summary</h2>
        <p className="panel-subtitle">Your desk at a glance — progress, active streaks, rhythms, and recent carvings.</p>
      </div>

      {/* Streak Dashboard Flame */}
      <div className="streak-dashboard-card sketch-border sketch-shadow">
        <div className="streak-main-row">
          <div className="streak-flame-wrapper">
            <span className="flame-large">🔥</span>
            <div className="streak-count-box">
              <span className="streak-num">5</span>
              <span className="streak-days-label">day streak</span>
            </div>
          </div>
          
          <div className="streak-details">
            <h3 className="font-bold text-base">Cabin Focus Candle is Lit! 🕯️</h3>
            <p className="text-xs text-gray-500">You are doing fantastic. Settle into your quiet study environment and maintain your daily rhythm today!</p>
            
            {/* Week Check-offs */}
            <div className="week-checks-row mt-3">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
                const isCompleted = idx < 5; // Mon to Fri done
                return (
                  <div key={day} className="day-check-item">
                    <span className="day-check-label text-xxs font-bold">{day}</span>
                    <div className={`day-check-dot sketch-border-sm ${isCompleted ? 'checked' : ''}`}>
                      {isCompleted ? '✓' : ''}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="stats-row">
        {stats.map((s, i) => (
          <div key={i} className="stat-card sketch-border sketch-shadow" style={{ '--card-color': s.color }}>
            <div className="stat-icon-bg" style={{ backgroundColor: s.color }}>
              <span style={{ fontSize: 28 }}>{s.icon}</span>
            </div>
            <div className="stat-info">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-change">↑ {s.change}</div>
            </div>
          </div>
        ))}
      </div>

      {/* In which subject what is ongoing vs completed */}
      <div className="subject-milestones-card sketch-border sketch-shadow">
        <h3 className="card-section-title">📂 Subject Milestones (Ongoing vs Completed)</h3>
        <p className="text-xs text-gray-500 mb-4">Track which chapters are currently open on your study desk vs those completely locked in.</p>
        
        <div className="subject-milestones-grid">
          {subjectStatusData.map((data) => (
            <div key={data.subject} className="subject-milestone-column sketch-border-sm" style={{ borderTop: `4px solid ${data.color}` }}>
              <h4 className="font-bold text-sm mb-3 text-center">{data.subject}</h4>
              
              <div className="milestone-block bg-yellow-soft sketch-border-sm">
                <span className="milestone-badge bg-orange">🔄 Ongoing</span>
                <ul className="milestone-list text-xs">
                  {data.ongoing.map((item) => <li key={item}>✏️ {item}</li>)}
                  {data.ongoing.length === 0 && <li className="text-gray-400 italic">No active topics</li>}
                </ul>
              </div>

              <div className="milestone-block bg-sage-soft sketch-border-sm mt-3">
                <span className="milestone-badge bg-green">✅ Completed</span>
                <ul className="milestone-list text-xs">
                  {data.completed.map((item) => <li key={item}>🌿 {item}</li>)}
                  {data.completed.length === 0 && <li className="text-gray-400 italic">No completed topics</li>}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="summary-bottom-grid">
        {/* Weekly Activity Heatmap */}
        <div className="heatmap-card sketch-border sketch-shadow">
          <h3 className="card-section-title">This Week's Focus Heat</h3>
          <div className="heatmap-row">
            {weekHeat.map((val, i) => (
              <div key={i} className="heatmap-col">
                <div
                  className="heat-bar sketch-border-sm"
                  style={{ height: `${val * 12}px`, backgroundColor: val > 4 ? '#E6A817' : val > 2 ? '#FDF2CC' : '#F5F0E0' }}
                  title={`${val}h on ${days[i]}`}
                ></div>
                <span className="heat-day">{days[i]}</span>
              </div>
            ))}
          </div>
          <div className="heatmap-legend">
            <span className="legend-dot" style={{ background: '#F5F0E0' }}></span> Low
            <span className="legend-dot ml-2" style={{ background: '#FDF2CC' }}></span> Mid
            <span className="legend-dot ml-2" style={{ background: '#E6A817' }}></span> High
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="activity-card sketch-border sketch-shadow">
          <h3 className="card-section-title">Recent Desk Activity</h3>
          <ul className="activity-list">
            {recentActivity.map((a, i) => (
              <li key={i} className="activity-item sketch-border-sm" style={{ borderLeft: `4px solid ${typeColor[a.type]}` }}>
                <span className="activity-icon">{typeIcon[a.type]}</span>
                <div className="activity-body">
                  <p className="activity-action">{a.action}</p>
                  <span className="activity-time">{a.time}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style>{`
        .summary-panel { display: flex; flex-direction: column; gap: 28px; width: 100%; }
        
        .streak-dashboard-card { background: var(--wood-card); padding: 20px; }
        .streak-main-row { display: flex; gap: 24px; align-items: center; }
        @media (max-width: 600px) { .streak-main-row { flex-direction: column; text-align: center; } }
        
        .streak-flame-wrapper { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
        .flame-large { font-size: 54px; animation: flicker 1s infinite alternate ease-in-out; }
        @keyframes flicker {
          0% { transform: scale(0.9) skewX(-2deg); }
          100% { transform: scale(1.1) skewX(2deg); }
        }
        .streak-count-box { display: flex; flex-direction: column; line-height: 1; }
        .streak-num { font-family: var(--heading); font-size: 40px; font-weight: 900; color: #E6A817; }
        .streak-days-label { font-size: 11px; font-weight: bold; color: var(--wood-ink-muted); text-transform: uppercase; }
        
        .week-checks-row { display: flex; gap: 10px; }
        @media (max-width: 600px) { .week-checks-row { justify-content: center; } }
        .day-check-item { display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .day-check-dot { width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; background: var(--wood-bg); border-radius: 4px; font-weight: bold; font-size: 12px; }
        .day-check-dot.checked { background: var(--wood-primary); color: var(--wood-ink); }

        .stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 18px; }
        .stat-card { background: var(--wood-card); padding: 20px; display: flex; align-items: center; gap: 16px; }
        .stat-icon-bg { width: 54px; height: 54px; border: 2px solid var(--wood-ink); border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .stat-value { font-family: var(--heading); font-size: 28px; font-weight: 700; line-height: 1; }
        .stat-label { font-size: 12px; color: var(--wood-ink-muted); margin-top: 3px; }
        .stat-change { font-size: 11px; color: #2e7d32; font-weight: 600; margin-top: 2px; }
        
        .subject-milestones-card { background: var(--wood-card); padding: 24px; }
        .subject-milestones-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        @media (max-width: 800px) { .subject-milestones-grid { grid-template-columns: 1fr; } }
        
        .subject-milestone-column { background: var(--wood-bg); padding: 16px; display: flex; flex-direction: column; }
        .milestone-block { padding: 12px; display: flex; flex-direction: column; gap: 6px; }
        .bg-yellow-soft { background: #FFFDE7; }
        .bg-sage-soft { background: #E8F3D6; }
        .milestone-badge { font-size: 10px; font-family: var(--heading); font-weight: bold; color: var(--wood-ink); border: 1px solid var(--wood-ink); padding: 1px 6px; border-radius: 4px; align-self: flex-start; text-transform: uppercase; }
        .bg-orange { background: #FFE082; }
        .bg-green { background: #A5D6A7; }
        .milestone-list { list-style: none; display: flex; flex-direction: column; gap: 4px; padding-left: 2px; }

        .summary-bottom-grid { display: grid; grid-template-columns: 1fr 1.4fr; gap: 22px; }
        @media (max-width: 800px) { .summary-bottom-grid { grid-template-columns: 1fr; } }
        .heatmap-card, .activity-card { background: var(--wood-card); padding: 24px; }
        .card-section-title { font-family: var(--heading); font-size: 18px; margin-bottom: 16px; }
        .heatmap-row { display: flex; align-items: flex-end; gap: 10px; height: 90px; }
        .heatmap-col { display: flex; flex-direction: column; align-items: center; gap: 6px; flex: 1; }
        .heat-bar { width: 100%; transition: all 0.3s; cursor: pointer; }
        .heat-bar:hover { opacity: 0.7; }
        .heat-day { font-family: var(--heading); font-size: 11px; color: var(--wood-ink-muted); }
        .heatmap-legend { display: flex; align-items: center; gap: 6px; margin-top: 14px; font-size: 12px; color: var(--wood-ink-muted); }
        .legend-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; border: 1px solid var(--wood-ink); }
        .ml-2 { margin-left: 8px; }
        .activity-list { list-style: none; display: flex; flex-direction: column; gap: 10px; }
        .activity-item { display: flex; align-items: flex-start; gap: 10px; padding: 10px 12px; background: var(--wood-bg); }
        .activity-icon { font-size: 18px; flex-shrink: 0; }
        .activity-body { flex: 1; }
        .activity-action { font-size: 13px; color: var(--wood-ink); line-height: 1.4; }
        .activity-time { font-size: 11px; color: var(--wood-ink-muted); font-family: var(--heading); }
      `}</style>
    </div>
  );
}
