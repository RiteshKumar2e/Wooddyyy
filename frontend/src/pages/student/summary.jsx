import React from 'react';

const stats = [];
const subjectStatusData = [];
const recentActivity = [];
const typeColor = {};
const typeIcon = {};
const weekHeat = [];
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
              <span className="streak-num">0</span>
              <span className="streak-days-label">day streak</span>
            </div>
          </div>
          
          <div className="streak-details">
            <h3 className="font-bold text-base">No active streak yet</h3>
            <p className="text-xs text-gray-500">Start using the workspace to build a progress streak.</p>
            
            {/* Week Check-offs */}
            <div className="week-checks-row mt-3">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
                return (
                  <div key={day} className="day-check-item">
                    <span className="day-check-label text-xxs font-bold">{day}</span>
                    <div className="day-check-dot sketch-border-sm">
                      
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
        {stats.length === 0 && (
          <div className="empty-summary-card sketch-border-sm">
            No summary data yet. Add study activity to populate this dashboard.
          </div>
        )}
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
        <p className="text-xs text-gray-500 mb-4">No subject data yet. Add chapters in Study Plan to see milestones here.</p>
        <div className="empty-summary-card sketch-border-sm">Subject milestones will appear after you add study topics.</div>
      </div>

      <div className="summary-bottom-grid">
        {/* Weekly Activity Heatmap */}
        <div className="heatmap-card sketch-border sketch-shadow">
          <h3 className="card-section-title">This Week's Focus Heat</h3>
          {weekHeat.length === 0 ? (
            <div className="empty-summary-card sketch-border-sm">No weekly activity yet.</div>
          ) : (
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
          )}
          <div className="heatmap-legend">
            <span className="legend-dot" style={{ background: '#F5F0E0' }}></span> Low
            <span className="legend-dot ml-2" style={{ background: '#FDF2CC' }}></span> Mid
            <span className="legend-dot ml-2" style={{ background: '#E6A817' }}></span> High
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="activity-card sketch-border sketch-shadow">
          <h3 className="card-section-title">Recent Desk Activity</h3>
          {recentActivity.length === 0 ? (
            <div className="empty-summary-card sketch-border-sm">Nothing logged yet.</div>
          ) : (
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
          )}
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
        .empty-summary-card { background: var(--wood-bg); padding: 18px; font-size: 14px; color: var(--wood-ink-muted); }
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
