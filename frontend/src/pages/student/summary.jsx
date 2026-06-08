import React, { useState, useEffect } from 'react';
import { api } from '../../api';

const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function Summary() {
  const [data, setData] = useState({
    subjects: 0,
    topics: { total: 0, completed: 0 },
    overallProgress: 0,
    quizzesTaken: 0,
    averageQuizScore: 0,
    upcomingTopics: [],
    recentQuizzes: []
  });
  const [weekHeat, setWeekHeat] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get('/api/dashboard');
        setData(res);
      } catch (err) {
        console.error('Failed to load summary details:', err);
      }
    };

    const fetchProgress = async () => {
      try {
        const progressData = await api.get('/api/dashboard/progress');
        const sumHeat = [0, 0, 0, 0, 0, 0, 0];
        progressData.forEach(sub => {
          if (Array.isArray(sub.weeklySessions)) {
            sub.weeklySessions.forEach((val, idx) => {
              if (idx < 7) sumHeat[idx] += val;
            });
          }
        });
        setWeekHeat(sumHeat);
      } catch (err) {
        console.error('Failed to aggregate weekly session hours:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
    fetchProgress();
  }, []);

  const stats = [
    { label: 'Study Subjects', value: data.subjects, icon: '🌿', color: '#E8F3D6', change: 'active' },
    { label: 'Completed Chapters', value: `${data.topics.completed}/${data.topics.total}`, icon: '🗺️', color: '#FAF6E9', change: `${data.overallProgress}% overall` },
    { label: 'Parchment Quizzes', value: data.quizzesTaken, icon: '📝', color: '#FFFDF9', change: `${data.averageQuizScore}% average` },
    { label: 'Global Progress', value: `${data.overallProgress}%`, icon: '📊', color: '#E3F2FD', change: 'growing' }
  ];

  const recentActivity = data.recentQuizzes.map((q, idx) => ({
    id: q._id || idx,
    type: 'quiz',
    action: `Took ${q.type} quiz on "${q.subjectName}" — Score: ${q.score}% (${q.correctCount || 0}/${q.totalQuestions || 0} right)`,
    time: q.completedAt ? new Date(q.completedAt).toLocaleDateString() : 'recently'
  }));

  const hasActivity = recentActivity.length > 0;
  const streakDays = data.topics.completed > 0 ? Math.min(7, data.topics.completed) : 0;

  if (loading) {
    return (
      <div className="summary-panel text-center py-12">
        <span className="spinner-sketch text-4xl">🔄</span>
        <p className="handwritten text-lg mt-2">Opening study logs drawer...</p>
      </div>
    );
  }

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
              <span className="streak-num">{streakDays}</span>
              <span className="streak-days-label">{streakDays === 1 ? 'day streak' : 'days streak'}</span>
            </div>
          </div>
          
          <div className="streak-details">
            <h3 className="font-bold text-base">
              {streakDays > 0 ? 'Your focus ember is glowing! 🌿' : 'No active streak yet'}
            </h3>
            <p className="text-xs text-gray-500">
              {streakDays > 0 ? 'Keep checking off study chapters daily to grow your forest.' : 'Start checking off chapters in your Study Plan to light the focus fire.'}
            </p>
            
            {/* Week Check-offs */}
            <div className="week-checks-row mt-3">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
                const checked = idx < streakDays;
                return (
                  <div key={day} className="day-check-item">
                    <span className="day-check-label text-xxs font-bold">{day}</span>
                    <div className={`day-check-dot sketch-border-sm ${checked ? 'checked' : ''}`}>
                      {checked && '✓'}
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

      {/* Upcoming Chapters List */}
      <div className="subject-milestones-card sketch-border sketch-shadow">
        <h3 className="card-section-title">📅 Upcoming Study Branches</h3>
        {data.upcomingTopics.length === 0 ? (
          <div className="empty-summary-card sketch-border-sm">No upcoming branches. You're all caught up! 🌿</div>
        ) : (
          <ul className="upcoming-list" style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', padding: 0 }}>
            {data.upcomingTopics.map(t => (
              <li key={t._id} className="upcoming-item sketch-border-sm" style={{ background: 'var(--wood-bg)', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1.5px solid var(--wood-ink)' }}>
                <div>
                  <span className="font-bold text-sm">🌿 {t.title}</span>
                  {t.date && <span className="meta-badge date-badge" style={{ marginLeft: '12px', fontSize: '11px', background: 'var(--wood-card)', border: '1px solid var(--wood-ink)', padding: '2px 6px', borderRadius: '4px' }}>📅 {t.date}</span>}
                </div>
                <span className="handwritten text-xs" style={{ color: 'var(--wood-primary-hover)', fontWeight: 'bold' }}>pending review</span>
              </li>
            ))}
          </ul>
        )}
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
                  style={{ height: `${Math.min(80, Math.max(10, val * 12))}px`, backgroundColor: val > 4 ? '#E6A817' : val > 0 ? '#FDF2CC' : '#F5F0E0' }}
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
          {!hasActivity ? (
            <div className="empty-summary-card sketch-border-sm">Nothing logged yet. Complete quizzes to fill activity logs.</div>
          ) : (
            <ul className="activity-list" style={{ padding: 0 }}>
              {recentActivity.map((a) => (
                <li key={a.id} className="activity-item sketch-border-sm" style={{ borderLeft: '4px solid var(--wood-accent)' }}>
                  <span className="activity-icon">📝</span>
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
        .day-check-dot { width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; background: var(--wood-bg); border-radius: 4px; font-weight: bold; font-size: 12px; border: 1.5px solid var(--wood-ink); }
        .day-check-dot.checked { background: var(--wood-primary); color: var(--wood-ink); }

        .stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 18px; }
        .empty-summary-card { background: var(--wood-bg); padding: 18px; font-size: 14px; color: var(--wood-ink-muted); }
        .stat-card { background: var(--wood-card); padding: 20px; display: flex; align-items: center; gap: 16px; }
        .stat-icon-bg { width: 54px; height: 54px; border: 2px solid var(--wood-ink); border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .stat-value { font-family: var(--heading); font-size: 28px; font-weight: 700; line-height: 1; }
        .stat-label { font-size: 12px; color: var(--wood-ink-muted); margin-top: 3px; }
        .stat-change { font-size: 11px; color: #2e7d32; font-weight: 600; margin-top: 2px; }
        
        .subject-milestones-card { background: var(--wood-card); padding: 24px; }
        
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
