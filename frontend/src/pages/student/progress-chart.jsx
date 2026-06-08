import React, { useState, useEffect } from 'react';
import { api } from '../../api';
import '../../styles/student/progress-chart.css';

const weekLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const maxSessions = 7;

export default function ProgressChart() {
  const [subjectData, setSubjectData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSubject, setActiveSubject] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await api.get('/api/dashboard/progress');
        setSubjectData(data.map(s => ({
          name: s.name,
          color: s.color,
          total: s.total || 0,
          completed: s.completed || 0,
          progress: s.progress || 0,
          quizAvg: s.quizAvg || 0,
          sessions: s.weeklySessions || [0, 0, 0, 0, 0, 0, 0],
          chapters: s.chapters || []
        })));
      } catch (err) {
        console.error('Failed to load nursery progress data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  const displayed = activeSubject ? subjectData.filter(s => s.name === activeSubject) : subjectData;

  if (loading) {
    return (
      <div className="progress-panel text-center py-12">
        <span className="spinner-sketch text-4xl">🔄</span>
        <p className="handwritten text-lg mt-2">Checking Progress Nursery logs...</p>
      </div>
    );
  }

  return (
    <div className="progress-panel">
      <div className="panel-header">
        <h2 className="panel-title">📊 Progress Nursery</h2>
        <p className="panel-subtitle">Add subject data to see progress rings and charts here.</p>
      </div>

      {/* Subject Filter Pills */}
      <div className="subject-pills">
        <button onClick={() => setActiveSubject(null)} className={`pill-btn sketch-border-sm ${!activeSubject ? 'pill-active' : ''}`}>All Subjects</button>
        {subjectData.length === 0 ? (
          <span className="progress-empty handwriting">No subjects added yet. Add branches in Study Plan!</span>
        ) : subjectData.map(s => (
          <button key={s.name} onClick={() => setActiveSubject(s.name === activeSubject ? null : s.name)}
            className={`pill-btn sketch-border-sm ${activeSubject === s.name ? 'pill-active' : ''}`}
            style={{ '--pill-color': s.color }}>
            {s.name}
          </button>
        ))}
      </div>

      {/* Radial Progress Rings displaying Completed vs Total */}
      <div className="rings-grid">
        {displayed.length === 0 ? (
          <div className="progress-empty-card sketch-border-sm">No progress data yet.</div>
        ) : displayed.map(s => {
          const r = 46;
          const circ = 2 * Math.PI * r;
          const pct = s.total > 0 ? Math.round((s.completed / s.total) * 100) : 0;
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
                  <ul className="checklist-items-list text-xxs" style={{ padding: 0, listStyle: 'none' }}>
                    {s.chapters.length === 0 ? (
                      <li className="unchecked-item">No chapters added yet</li>
                    ) : s.chapters.map((ch, idx) => (
                      <li key={idx} className={ch.done ? 'checked-item' : 'unchecked-item'} style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '2px' }}>
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
                  <strong style={{ color: s.quizAvg >= 75 ? '#2e7d32' : s.quizAvg > 0 ? '#E6A817' : 'var(--wood-ink-muted)' }}>{s.quizAvg > 0 ? `${s.quizAvg}%` : 'no score'}</strong>
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
        
        {displayed.length === 0 ? (
          <div className="progress-empty-card sketch-border-sm">Add study blocks to see weekly sessions.</div>
        ) : displayed.map(s => (
          <div key={s.name} className="bar-chart-row mt-3">
            <span className="bar-subject-label font-bold">{s.name}</span>
            <div className="bars-container">
              {s.sessions.map((val, i) => {
                const height = Math.min(80, (val / maxSessions) * 80);
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
    </div>
  );
}
