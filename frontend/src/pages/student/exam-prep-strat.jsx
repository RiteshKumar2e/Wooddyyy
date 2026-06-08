import React, { useState, useEffect } from 'react';
import { api } from '../../api';

const SWATCHES = ['#E6A817', '#7BA05B', '#C97B5A', '#5A8CA0', '#B05A8C', '#8C7BA0'];

const computeDaysLeft = (dateStr) => {
  if (!dateStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exam = new Date(dateStr);
  exam.setHours(0, 0, 0, 0);
  return Math.ceil((exam - today) / (1000 * 60 * 60 * 24));
};

const daysLabel = (d) => {
  if (d === null) return 'no date set';
  if (d < 0) return `${Math.abs(d)}d ago`;
  if (d === 0) return 'exam today!';
  return `${d}d until exam`;
};

export default function ExamPrepStrat() {
  const [strategies, setStrategies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStrat, setActiveStrat] = useState(null);

  // New strategy form
  const [newSubject, setNewSubject] = useState('');
  const [newColor, setNewColor] = useState(SWATCHES[0]);
  const [newExamDate, setNewExamDate] = useState('');

  // New phase form
  const [newPhaseName, setNewPhaseName] = useState('');
  const [newPhaseWeeks, setNewPhaseWeeks] = useState('');
  const [newPhaseTasks, setNewPhaseTasks] = useState('');

  // New tip + per-phase task inputs
  const [newTip, setNewTip] = useState('');
  const [taskInputs, setTaskInputs] = useState({});

  // Syllabus upload states (mock)
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [fileName, setFileName] = useState('');

  // Fetch strategies on mount
  useEffect(() => {
    const fetchStrategies = async () => {
      try {
        const data = await api.get('/api/strategies');
        const mapped = data.map(s => ({
          id: s._id,
          subject: s.subject,
          color: s.color,
          examDate: s.examDate ? s.examDate.split('T')[0] : '',
          phases: s.phases || [],
          tips: s.tips || []
        }));
        setStrategies(mapped);
        if (mapped.length > 0) {
          setActiveStrat(mapped[0].id);
        }
      } catch (err) {
        console.error('Failed to load exam strategies:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStrategies();
  }, []);

  const strat = strategies.find(s => s.id === activeStrat);
  const phases = strat?.phases || [];
  const doneCount = phases.filter(p => p.done).length;
  const overallProgress = phases.length ? Math.round((doneCount / phases.length) * 100) : 0;

  // ---- Strategy CRUD ----
  const addStrategy = async (e) => {
    e.preventDefault();
    if (!newSubject.trim()) return;
    try {
      const payload = {
        subject: newSubject.trim(),
        color: newColor,
        examDate: newExamDate || undefined,
        phases: [],
        tips: []
      };
      const created = await api.post('/api/strategies', payload);
      const newStrat = {
        id: created._id,
        subject: created.subject,
        color: created.color,
        examDate: created.examDate ? created.examDate.split('T')[0] : '',
        phases: created.phases || [],
        tips: created.tips || []
      };
      setStrategies(prev => [...prev, newStrat]);
      setActiveStrat(newStrat.id);
      setNewSubject('');
      setNewExamDate('');
      setNewColor(SWATCHES[0]);
    } catch (err) {
      console.error('Failed to create new exam strategy:', err);
    }
  };

  const deleteStrategy = async (id) => {
    try {
      await api.delete(`/api/strategies/${id}`);
      const remaining = strategies.filter(s => s.id !== id);
      setStrategies(remaining);
      if (activeStrat === id) setActiveStrat(remaining[0]?.id ?? null);
    } catch (err) {
      console.error('Failed to delete strategy:', err);
    }
  };

  // ---- Phase CRUD ----
  const addPhase = async (e) => {
    e.preventDefault();
    if (!strat || !newPhaseName.trim()) return;
    const tasks = newPhaseTasks
      .split('\n')
      .map(t => t.trim())
      .filter(Boolean);
    const nextPhases = [...strat.phases, { phase: newPhaseName.trim(), weeks: newPhaseWeeks.trim(), tasks, done: false }];
    
    try {
      const updated = await api.put(`/api/strategies/${activeStrat}`, { phases: nextPhases });
      setStrategies(prev => prev.map(s => s.id === activeStrat ? { ...s, phases: updated.phases } : s));
      setNewPhaseName('');
      setNewPhaseWeeks('');
      setNewPhaseTasks('');
    } catch (err) {
      console.error('Failed to add preparation phase:', err);
    }
  };

  const togglePhase = async (phaseId) => {
    if (!strat) return;
    try {
      const updated = await api.patch(`/api/strategies/${activeStrat}/phases/${phaseId}/toggle`);
      setStrategies(prev => prev.map(s => s.id === activeStrat ? { ...s, phases: updated.phases } : s));
    } catch (err) {
      console.error('Failed to toggle phase status:', err);
    }
  };

  const deletePhase = async (phaseId) => {
    const nextPhases = strat.phases.filter(p => (p._id || p.id) !== phaseId);
    try {
      const updated = await api.put(`/api/strategies/${activeStrat}`, { phases: nextPhases });
      setStrategies(prev => prev.map(s => s.id === activeStrat ? { ...s, phases: updated.phases } : s));
    } catch (err) {
      console.error('Failed to delete phase:', err);
    }
  };

  const addTask = async (phaseId) => {
    const value = (taskInputs[phaseId] || '').trim();
    if (!value) return;
    const nextPhases = strat.phases.map(p => (p._id || p.id) === phaseId ? { ...p, tasks: [...p.tasks, value] } : p);
    try {
      const updated = await api.put(`/api/strategies/${activeStrat}`, { phases: nextPhases });
      setStrategies(prev => prev.map(s => s.id === activeStrat ? { ...s, phases: updated.phases } : s));
      setTaskInputs({ ...taskInputs, [phaseId]: '' });
    } catch (err) {
      console.error('Failed to append task:', err);
    }
  };

  const deleteTask = async (phaseId, taskIdx) => {
    const nextPhases = strat.phases.map(p => (p._id || p.id) === phaseId ? { ...p, tasks: p.tasks.filter((_, i) => i !== taskIdx) } : p);
    try {
      const updated = await api.put(`/api/strategies/${activeStrat}`, { phases: nextPhases });
      setStrategies(prev => prev.map(s => s.id === activeStrat ? { ...s, phases: updated.phases } : s));
    } catch (err) {
      console.error('Failed to remove task:', err);
    }
  };

  // ---- Tips CRUD ----
  const addTip = async (e) => {
    e.preventDefault();
    if (!strat || !newTip.trim()) return;
    const nextTips = [...strat.tips, newTip.trim()];
    try {
      const updated = await api.put(`/api/strategies/${activeStrat}`, { tips: nextTips });
      setStrategies(prev => prev.map(s => s.id === activeStrat ? { ...s, tips: updated.tips } : s));
      setNewTip('');
    } catch (err) {
      console.error('Failed to post tip:', err);
    }
  };

  const deleteTip = async (idx) => {
    const nextTips = strat.tips.filter((_, i) => i !== idx);
    try {
      const updated = await api.put(`/api/strategies/${activeStrat}`, { tips: nextTips });
      setStrategies(prev => prev.map(s => s.id === activeStrat ? { ...s, tips: updated.tips } : s));
    } catch (err) {
      console.error('Failed to remove tip:', err);
    }
  };

  // ---- Mock upload parser ----
  const handleSyllabusUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    setUploading(true);
    setUploadStatus('Reading your exam syllabus... 📖');
    setTimeout(() => {
      setUploadStatus('Mapping out preparation phases... 🗺️');
      setTimeout(() => {
        setUploadStatus('Ready to add your own phases. 🏆');
        setTimeout(() => {
          setUploading(false);
          setUploadStatus('');
          setFileName('');
        }, 1200);
      }, 1200);
    }, 1200);
  };

  if (loading) {
    return (
      <div className="exam-prep-panel text-center py-12">
        <span className="spinner-sketch text-4xl">🔄</span>
        <p className="handwritten text-lg mt-2">Opening exam roadmap ledger...</p>
      </div>
    );
  }

  return (
    <div className="exam-prep-panel">
      <div className="panel-header">
        <h2 className="panel-title">🏆 Exam Preparation Strategy</h2>
        <p className="panel-subtitle">Build your own exam roadmap from scratch.</p>
      </div>

      {/* Syllabus Upload Block */}
      <div className="syllabus-upload-card sketch-border sketch-shadow">
        <div className="upload-header">
          <span className="upload-icon">📂</span>
          <div className="upload-text-block">
            <h3 className="font-bold text-base">Autopilot Exam Planner</h3>
            <p className="text-xs text-gray-500">Upload your syllabus PDF/Image to prepare your exam phases.</p>
          </div>
        </div>

        {uploading ? (
          <div className="upload-loading-area text-center py-4">
            <div className="spinner-sketch">🔄</div>
            <p className="handwritten text-lg mt-2 color-primary">{uploadStatus}</p>
            <span className="text-xxs text-gray-500">File: {fileName}</span>
          </div>
        ) : (
          <div className="upload-drag-area sketch-border-sm">
            <label className="upload-label-btn cursor-pointer">
              <span>📄 Click to Upload Syllabus / Notes</span>
              <input type="file" onChange={handleSyllabusUpload} accept=".pdf,.png,.jpg,.jpeg,.txt" className="hidden-file-input" />
            </label>
            <span className="text-xxs text-gray-500 mt-1">Accepts PDF, JPG, PNG, TXT (Max 5MB)</span>
          </div>
        )}
      </div>

      {/* Add Strategy Form */}
      <form onSubmit={addStrategy} className="add-strat-form sketch-border sketch-shadow">
        <h4 className="add-strat-title">➕ Add an Exam Strategy</h4>
        <div className="add-strat-grid">
          <div className="form-group-sm">
            <label className="text-xxs font-bold">Subject *</label>
            <input value={newSubject} onChange={e => setNewSubject(e.target.value)}
              placeholder="e.g. Mathematics" className="form-input sketch-border-sm" required />
          </div>
          <div className="form-group-sm">
            <label className="text-xxs font-bold">Exam Date</label>
            <input type="date" value={newExamDate} onChange={e => setNewExamDate(e.target.value)}
              className="form-input sketch-border-sm" />
          </div>
          <div className="form-group-sm">
            <label className="text-xxs font-bold">Tab Color</label>
            <div className="swatch-row">
              {SWATCHES.map(c => (
                <button type="button" key={c} onClick={() => setNewColor(c)}
                  className={`swatch ${newColor === c ? 'swatch-active' : ''}`}
                  style={{ background: c }} aria-label={`color ${c}`} />
              ))}
            </div>
          </div>
        </div>
        <button type="submit" className="btn-sketch btn-sketch-primary sketch-border-sm sketch-shadow mt-3 w-full justify-center exam-submit-btn">
          + Add Strategy
        </button>
      </form>

      {/* Subject Tab Selector */}
      <div className="strat-tabs">
        {strategies.length === 0 ? (
          <div className="exam-empty sketch-border-sm">No exam strategy added yet.</div>
        ) : strategies.map(s => {
          const d = computeDaysLeft(s.examDate);
          return (
            <div key={s.id}
              className={`strat-tab sketch-border sketch-shadow ${activeStrat === s.id ? 'strat-tab-active' : ''}`}
              onClick={() => setActiveStrat(s.id)}
              style={{ '--stab-color': s.color }}>
              <button className="strat-tab-del" onClick={(e) => { e.stopPropagation(); deleteStrategy(s.id); }} aria-label="delete strategy">✕</button>
              <span className="stab-name">{s.subject}</span>
              <span className="stab-days" style={{ color: d !== null && d <= 7 ? '#c62828' : 'var(--wood-ink-muted)' }}>
                {daysLabel(d)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Overall Completion Bar */}
      <div className="strat-completion-bar-wrap">
        <span className="strat-completion-label">
          Strategy Completion: {overallProgress}%{strat ? ` — ${strat.subject}` : ''}
        </span>
        <div className="strat-completion-bar sketch-border-sm">
          <div className="strat-completion-fill" style={{ width: `${overallProgress}%`, background: strat?.color || 'var(--wood-accent)' }}></div>
        </div>
      </div>

      {/* Phase Roadmap Cards */}
      <div className="phases-timeline">
        {phases.length ? phases.map((p, idx) => {
          const pId = p._id || p.id;
          return (
            <div key={pId} className={`phase-card sketch-border sketch-shadow ${p.done ? 'phase-done' : ''}`}>
              {idx < phases.length - 1 && <div className="timeline-connector"></div>}

              <div className="phase-header">
                <div className={`phase-circle sketch-border-sm ${p.done ? 'phase-circle-done' : ''}`} onClick={() => togglePhase(pId)}>
                  {p.done
                    ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8L7 12L13 4" stroke="#2D2C24" strokeWidth="2.5" strokeLinecap="round" /></svg>
                    : <span className="phase-num">{idx + 1}</span>
                  }
                </div>
                <div className="phase-title-block" onClick={() => togglePhase(pId)}>
                  <h4 className="phase-name">{p.phase}</h4>
                  {p.weeks && <span className="phase-weeks handwritten">{p.weeks}</span>}
                </div>
                <span className="phase-toggle-btn" onClick={() => togglePhase(pId)}>{p.done ? '✅ Done' : '○ Mark Done'}</span>
                <button className="phase-del-btn" onClick={() => deletePhase(pId)} aria-label="delete phase">🗑️</button>
              </div>

              <ul className="phase-tasks">
                {p.tasks.map((t, ti) => (
                  <li key={ti} className="phase-task-item sketch-border-sm">
                    <span className="task-bullet" style={{ background: strat?.color || 'var(--wood-accent)' }}></span>
                    <span className="task-text">{t}</span>
                    <button className="task-del" onClick={() => deleteTask(pId, ti)} aria-label="delete task">✕</button>
                  </li>
                ))}
                <li className="phase-task-add">
                  <input
                    value={taskInputs[pId] || ''}
                    onChange={e => setTaskInputs({ ...taskInputs, [pId]: e.target.value })}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTask(pId); } }}
                    placeholder="Add a task…" className="form-input sketch-border-sm task-add-input" />
                  <button type="button" className="task-add-btn sketch-border-sm" onClick={() => addTask(pId)}>+ Add</button>
                </li>
              </ul>
            </div>
          );
        }) : <div className="exam-empty sketch-border-sm">{strat ? 'No phases yet — add one below.' : 'Select or add a strategy to see phases.'}</div>}
      </div>

      {/* Add Phase Form */}
      {strat && (
        <form onSubmit={addPhase} className="add-phase-form sketch-border sketch-shadow">
          <h4 className="add-strat-title">🧩 Add a Phase to {strat.subject}</h4>
          <div className="add-phase-grid">
            <div className="form-group-sm">
              <label className="text-xxs font-bold">Phase Name *</label>
              <input value={newPhaseName} onChange={e => setNewPhaseName(e.target.value)}
                placeholder="e.g. Foundation Building" className="form-input sketch-border-sm" required />
            </div>
            <div className="form-group-sm">
              <label className="text-xxs font-bold">Duration</label>
              <input value={newPhaseWeeks} onChange={e => setNewPhaseWeeks(e.target.value)}
                placeholder="e.g. Weeks 1–2" className="form-input sketch-border-sm" />
            </div>
            <div className="form-group-sm full-width">
              <label className="text-xxs font-bold">Tasks (one per line)</label>
              <textarea value={newPhaseTasks} onChange={e => setNewPhaseTasks(e.target.value)}
                placeholder={"Revise chapter 1\nSolve 20 practice problems"} rows={3}
                className="form-input sketch-border-sm" />
            </div>
          </div>
          <button type="submit" className="btn-sketch btn-sketch-primary sketch-border-sm sketch-shadow mt-3 w-full justify-center exam-submit-btn">
            + Add Phase
          </button>
        </form>
      )}

      {/* Cozy Exam Tips Post-It */}
      <div className="exam-tips-section">
        <h3 className="card-section-title">📌 Cozy Expert Tips{strat ? ` for ${strat.subject}` : ''}</h3>
        <div className="tips-grid">
          {strat?.tips?.length ? strat.tips.map((tip, i) => (
            <div key={i} className="tip-post-it sketch-border-sm" style={{ transform: `rotate(${i % 2 === 0 ? '-1.5' : '1'}deg)` }}>
              <span className="tip-pin">📌</span>
              <button className="tip-del" onClick={() => deleteTip(i)} aria-label="delete tip">✕</button>
              <p className="tip-text">{tip}</p>
            </div>
          )) : <div className="exam-empty sketch-border-sm">{strat ? 'No tips yet — add one below.' : 'Add a strategy to start adding tips.'}</div>}
        </div>

        {strat && (
          <form onSubmit={addTip} className="add-tip-form">
            <input value={newTip} onChange={e => setNewTip(e.target.value)}
              placeholder="Write a cozy study tip…" className="form-input sketch-border-sm" />
            <button type="submit" className="btn-sketch btn-sketch-primary sketch-border-sm sketch-shadow exam-tip-btn">+ Add Tip</button>
          </form>
        )}
      </div>
    </div>
  );
}
