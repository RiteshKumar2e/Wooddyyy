import React, { useState } from 'react';

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

  const strat = strategies.find(s => s.id === activeStrat);
  const phases = strat?.phases || [];
  const doneCount = phases.filter(p => p.done).length;
  const overallProgress = phases.length ? Math.round((doneCount / phases.length) * 100) : 0;

  // ---- Strategy CRUD ----
  const addStrategy = (e) => {
    e.preventDefault();
    if (!newSubject.trim()) return;
    const id = Date.now();
    const strategy = {
      id,
      subject: newSubject.trim(),
      color: newColor,
      examDate: newExamDate,
      phases: [],
      tips: [],
    };
    setStrategies([...strategies, strategy]);
    setActiveStrat(id);
    setNewSubject('');
    setNewExamDate('');
    setNewColor(SWATCHES[0]);
  };

  const deleteStrategy = (id) => {
    const remaining = strategies.filter(s => s.id !== id);
    setStrategies(remaining);
    if (activeStrat === id) setActiveStrat(remaining[0]?.id ?? null);
  };

  // ---- Phase CRUD ----
  const updateActive = (updater) => {
    setStrategies(strategies.map(s => s.id === activeStrat ? updater(s) : s));
  };

  const addPhase = (e) => {
    e.preventDefault();
    if (!strat || !newPhaseName.trim()) return;
    const tasks = newPhaseTasks
      .split('\n')
      .map(t => t.trim())
      .filter(Boolean);
    const phase = { id: Date.now(), phase: newPhaseName.trim(), weeks: newPhaseWeeks.trim(), tasks, done: false };
    updateActive(s => ({ ...s, phases: [...s.phases, phase] }));
    setNewPhaseName('');
    setNewPhaseWeeks('');
    setNewPhaseTasks('');
  };

  const togglePhase = (phaseId) => {
    updateActive(s => ({
      ...s,
      phases: s.phases.map(p => p.id === phaseId ? { ...p, done: !p.done } : p),
    }));
  };

  const deletePhase = (phaseId) => {
    updateActive(s => ({ ...s, phases: s.phases.filter(p => p.id !== phaseId) }));
  };

  const addTask = (phaseId) => {
    const value = (taskInputs[phaseId] || '').trim();
    if (!value) return;
    updateActive(s => ({
      ...s,
      phases: s.phases.map(p => p.id === phaseId ? { ...p, tasks: [...p.tasks, value] } : p),
    }));
    setTaskInputs({ ...taskInputs, [phaseId]: '' });
  };

  const deleteTask = (phaseId, taskIdx) => {
    updateActive(s => ({
      ...s,
      phases: s.phases.map(p => p.id === phaseId ? { ...p, tasks: p.tasks.filter((_, i) => i !== taskIdx) } : p),
    }));
  };

  // ---- Tips CRUD ----
  const addTip = (e) => {
    e.preventDefault();
    if (!strat || !newTip.trim()) return;
    updateActive(s => ({ ...s, tips: [...s.tips, newTip.trim()] }));
    setNewTip('');
  };

  const deleteTip = (idx) => {
    updateActive(s => ({ ...s, tips: s.tips.filter((_, i) => i !== idx) }));
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
          <div className="strat-completion-fill" style={{ width: `${overallProgress}%`, background: strat?.color }}></div>
        </div>
      </div>

      {/* Phase Roadmap Cards */}
      <div className="phases-timeline">
        {phases.length ? phases.map((p, idx) => (
          <div key={p.id} className={`phase-card sketch-border sketch-shadow ${p.done ? 'phase-done' : ''}`}>
            {idx < phases.length - 1 && <div className="timeline-connector"></div>}

            <div className="phase-header">
              <div className={`phase-circle sketch-border-sm ${p.done ? 'phase-circle-done' : ''}`} onClick={() => togglePhase(p.id)}>
                {p.done
                  ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8L7 12L13 4" stroke="#2D2C24" strokeWidth="2.5" strokeLinecap="round" /></svg>
                  : <span className="phase-num">{idx + 1}</span>
                }
              </div>
              <div className="phase-title-block" onClick={() => togglePhase(p.id)}>
                <h4 className="phase-name">{p.phase}</h4>
                {p.weeks && <span className="phase-weeks handwritten">{p.weeks}</span>}
              </div>
              <span className="phase-toggle-btn" onClick={() => togglePhase(p.id)}>{p.done ? '✅ Done' : '○ Mark Done'}</span>
              <button className="phase-del-btn" onClick={() => deletePhase(p.id)} aria-label="delete phase">🗑️</button>
            </div>

            <ul className="phase-tasks">
              {p.tasks.map((t, ti) => (
                <li key={ti} className="phase-task-item sketch-border-sm">
                  <span className="task-bullet" style={{ background: strat?.color }}></span>
                  <span className="task-text">{t}</span>
                  <button className="task-del" onClick={() => deleteTask(p.id, ti)} aria-label="delete task">✕</button>
                </li>
              ))}
              <li className="phase-task-add">
                <input
                  value={taskInputs[p.id] || ''}
                  onChange={e => setTaskInputs({ ...taskInputs, [p.id]: e.target.value })}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTask(p.id); } }}
                  placeholder="Add a task…" className="form-input sketch-border-sm task-add-input" />
                <button type="button" className="task-add-btn sketch-border-sm" onClick={() => addTask(p.id)}>+ Add</button>
              </li>
            </ul>
          </div>
        )) : <div className="exam-empty sketch-border-sm">{strat ? 'No phases yet — add one below.' : 'Select or add a strategy to see phases.'}</div>}
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

      <style>{`
        .exam-prep-panel { display: flex; flex-direction: column; gap: 26px; }

        .syllabus-upload-card { background: var(--wood-card); padding: 20px; display: flex; flex-direction: column; gap: 14px; }
        .upload-header { display: flex; gap: 14px; align-items: center; }
        .upload-icon { font-size: 32px; }
        .upload-text-block h3 { margin-bottom: 2px; }
        .upload-drag-area { background: var(--wood-bg); border: 2.5px dashed var(--wood-ink); padding: 24px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: all 0.2s; }
        .upload-drag-area:hover { background: #FFFDF0; }
        .upload-label-btn { font-family: var(--heading); font-weight: 700; color: var(--wood-primary-hover); font-size: 15px; }
        .hidden-file-input { display: none; }
        .upload-loading-area { background: var(--wood-bg); padding: 20px; border: 2px solid var(--wood-ink); border-radius: 6px; }
        .spinner-sketch { font-size: 32px; animation: spin 1.5s linear infinite; display: inline-block; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        .add-strat-form, .add-phase-form { background: var(--wood-card); padding: 20px; display: flex; flex-direction: column; }
        .add-strat-title { font-family: var(--heading); font-weight: 700; font-size: 16px; margin-bottom: 14px; }
        .add-strat-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
        .add-phase-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media (max-width: 700px) { .add-strat-grid, .add-phase-grid { grid-template-columns: 1fr; } }
        .form-group-sm { display: flex; flex-direction: column; gap: 4px; }
        .full-width { grid-column: 1 / -1; }

        .form-input { background: var(--wood-bg); min-height: 44px; padding: 10px 12px; font-size: 14px; border: 2px solid var(--wood-ink); color: var(--wood-ink); font-family: var(--sans); width: 100%; }
        textarea.form-input { min-height: 70px; resize: vertical; }
        .form-input::placeholder { color: var(--wood-ink-muted); opacity: 0.75; }
        .form-input:focus { background: #FFFDF0; border-color: var(--wood-primary) !important; box-shadow: 0 0 0 3px rgba(230, 168, 23, 0.12); outline: none; }

        .swatch-row { display: flex; gap: 8px; align-items: center; min-height: 44px; }
        .swatch { width: 28px; height: 28px; border: 2px solid var(--wood-ink); cursor: pointer; border-radius: 50%; transition: transform 0.15s; }
        .swatch:hover { transform: scale(1.12); }
        .swatch-active { box-shadow: 0 0 0 3px var(--wood-ink); transform: scale(1.12); }

        .exam-submit-btn, .exam-tip-btn { min-height: 46px; letter-spacing: -0.2px; }
        .exam-submit-btn:hover { transform: translateY(-1px); }

        .strat-tabs { display: flex; gap: 16px; flex-wrap: wrap; }
        .strat-tab { background: var(--wood-card); border: 2px solid var(--wood-ink); padding: 14px 24px; cursor: pointer; display: flex; flex-direction: column; gap: 4px; text-align: left; transition: all 0.2s; min-width: 160px; position: relative; }
        .strat-tab:hover { transform: translateY(-3px); }
        .strat-tab.strat-tab-active { background: var(--stab-color, var(--wood-accent)); box-shadow: 4px 4px 0 var(--wood-ink); }
        .strat-tab-del { position: absolute; top: 6px; right: 8px; background: transparent; border: none; cursor: pointer; font-size: 12px; color: var(--wood-ink-muted); opacity: 0; transition: opacity 0.15s; line-height: 1; }
        .strat-tab:hover .strat-tab-del { opacity: 1; }
        .strat-tab-del:hover { color: #c62828; }
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
        .phase-header { display: flex; align-items: center; gap: 16px; }
        .phase-circle { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background: var(--wood-bg); flex-shrink: 0; cursor: pointer; }
        .phase-circle.phase-circle-done { background: var(--wood-primary); }
        .phase-num { font-family: var(--heading); font-weight: 700; font-size: 16px; }
        .phase-title-block { flex: 1; cursor: pointer; }
        .phase-name { font-family: var(--heading); font-size: 18px; font-weight: 700; margin-bottom: 2px; }
        .phase-weeks { font-size: 16px; color: var(--wood-ink-muted); }
        .phase-toggle-btn { font-family: var(--heading); font-size: 13px; color: var(--wood-ink-muted); white-space: nowrap; cursor: pointer; }
        .phase-del-btn { background: transparent; border: none; cursor: pointer; font-size: 15px; opacity: 0.6; transition: opacity 0.15s; }
        .phase-del-btn:hover { opacity: 1; }

        .phase-tasks { list-style: none; display: flex; flex-direction: column; gap: 8px; padding-left: 52px; }
        .phase-task-item { background: var(--wood-bg); padding: 9px 14px; font-size: 14px; color: var(--wood-ink); display: flex; align-items: center; gap: 10px; }
        .task-bullet { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .task-text { flex: 1; }
        .task-del { background: transparent; border: none; cursor: pointer; font-size: 12px; color: var(--wood-ink-muted); opacity: 0.6; }
        .task-del:hover { color: #c62828; opacity: 1; }
        .phase-task-add { display: flex; gap: 8px; align-items: center; }
        .task-add-input { min-height: 38px; padding: 6px 12px; }
        .task-add-btn { background: var(--wood-bg); border: 2px solid var(--wood-ink); padding: 7px 14px; font-family: var(--heading); font-weight: 700; font-size: 13px; cursor: pointer; white-space: nowrap; transition: background 0.15s; }
        .task-add-btn:hover { background: var(--wood-accent); }

        .exam-empty { background: var(--wood-card); padding: 14px; color: var(--wood-ink-muted); }

        .exam-tips-section { display: flex; flex-direction: column; gap: 16px; }
        .card-section-title { font-family: var(--heading); font-size: 18px; }
        .tips-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; }
        .tip-post-it { background: var(--note-yellow); padding: 20px 18px 16px; position: relative; transition: all 0.2s; }
        .tip-post-it:hover { transform: rotate(0deg) scale(1.04) !important; }
        .tip-pin { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); font-size: 22px; }
        .tip-del { position: absolute; top: 6px; right: 8px; background: transparent; border: none; cursor: pointer; font-size: 12px; color: var(--wood-ink-muted); opacity: 0.6; }
        .tip-del:hover { color: #c62828; opacity: 1; }
        .tip-text { font-family: var(--sans); font-size: 14px; line-height: 1.5; color: var(--wood-ink); margin-top: 4px; }

        .add-tip-form { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
        .add-tip-form .form-input { flex: 1; min-width: 200px; }
        .exam-tip-btn { white-space: nowrap; }

        .color-primary { color: var(--wood-primary-hover); }
      `}</style>
    </div>
  );
}
