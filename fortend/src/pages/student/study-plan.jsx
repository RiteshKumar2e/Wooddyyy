import React, { useState } from 'react';

const initialSubjects = [
  {
    id: 1, name: 'Biology', color: 'var(--wood-sage)', progress: 60,
    chapters: [
      { id: 1, title: 'Cell Biology', done: true, notes: 'Mitosis & Meiosis covered', date: '2026-06-01', time: '09:00 AM - 10:30 AM' },
      { id: 2, title: 'Genetics & DNA', done: true, notes: 'Mendelian ratios revised', date: '2026-06-02', time: '11:00 AM - 12:30 PM' },
      { id: 3, title: 'Ecology & Biomes', done: false, notes: 'Revise trophic levels', date: '2026-06-03', time: '02:00 PM - 03:30 PM' },
      { id: 4, title: 'Human Physiology', done: false, notes: '', date: '2026-06-04', time: '04:00 PM - 05:30 PM' },
    ]
  },
  {
    id: 2, name: 'Mathematics', color: 'var(--wood-accent)', progress: 40,
    chapters: [
      { id: 1, title: 'Calculus Integrals', done: true, notes: 'Done integration by parts', date: '2026-06-01', time: '08:00 AM - 10:00 AM' },
      { id: 2, title: 'Matrices & Determinants', done: false, notes: 'Formulas and properties', date: '2026-06-03', time: '10:00 AM - 12:00 PM' },
      { id: 3, title: 'Probability & Stats', done: false, notes: '', date: '2026-06-05', time: '01:00 PM - 03:00 PM' },
      { id: 4, title: 'Trigonometry', done: false, notes: '', date: '2026-06-07', time: '03:00 PM - 05:00 PM' },
    ]
  },
  {
    id: 3, name: 'Chemistry', color: 'var(--wood-clay)', progress: 75,
    chapters: [
      { id: 1, title: 'Organic Reactions', done: true, notes: 'SN1 SN2 mechanisms covered', date: '2026-05-30', time: '09:30 AM - 11:30 AM' },
      { id: 2, title: 'Atomic Structure', done: true, notes: 'Bohr model revised', date: '2026-06-01', time: '11:30 AM - 01:30 PM' },
      { id: 3, title: 'Periodic Table Trends', done: true, notes: 'Electronegativity patterns', date: '2026-06-02', time: '02:30 PM - 04:30 PM' },
      { id: 4, title: 'Electrochemistry', done: false, notes: '', date: '2026-06-04', time: '05:00 PM - 07:00 PM' },
    ]
  },
];

export default function StudyPlan() {
  const [subjects, setSubjects] = useState(initialSubjects);
  const [activeSubject, setActiveSubject] = useState(1);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  
  // Custom inputs for date and time
  const [newChapterDate, setNewChapterDate] = useState('2026-06-05');
  const [newChapterTime, setNewChapterTime] = useState('10:00 AM - 12:00 PM');
  const [newChapterNotes, setNewChapterNotes] = useState('');

  // Syllabus upload states
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [fileName, setFileName] = useState('');

  const active = subjects.find(s => s.id === activeSubject);

  const toggleChapter = (chapId) => {
    setSubjects(subjects.map(s => {
      if (s.id === activeSubject) {
        const updatedChapters = s.chapters.map(c => c.id === chapId ? { ...c, done: !c.done } : c);
        const doneCount = updatedChapters.filter(c => c.done).length;
        const totalCount = updatedChapters.length;
        const newProgress = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
        return { ...s, chapters: updatedChapters, progress: newProgress };
      }
      return s;
    }));
  };

  const addChapter = (e) => {
    e.preventDefault();
    if (!newChapterTitle.trim()) return;
    setSubjects(subjects.map(s => {
      if (s.id === activeSubject) {
        const newChapter = {
          id: Date.now(),
          title: newChapterTitle,
          done: false,
          notes: newChapterNotes,
          date: newChapterDate,
          time: newChapterTime
        };
        const updatedChapters = [...s.chapters, newChapter];
        const doneCount = updatedChapters.filter(c => c.done).length;
        const newProgress = Math.round((doneCount / updatedChapters.length) * 100);
        return { ...s, chapters: updatedChapters, progress: newProgress };
      }
      return s;
    }));
    setNewChapterTitle('');
    setNewChapterNotes('');
  };

  // Mock upload parser
  const handleSyllabusUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    setUploading(true);
    setUploadStatus('Carving syllabus lines... 📖');

    setTimeout(() => {
      setUploadStatus('Mapping syllabus milestones into calendar dates... 🕰️');
      setTimeout(() => {
        setUploadStatus('Populating cabin dashboard study branches... 🌲');
        setTimeout(() => {
          // Append 3 generated topics for the active subject
          const generatedTopics = [
            { id: Date.now() + 1, title: 'Syllabus Topic A: Advanced Overview', done: false, notes: 'Auto-carved from syllabus', date: '2026-06-08', time: '10:00 AM - 11:30 AM' },
            { id: Date.now() + 2, title: 'Syllabus Topic B: Deep Core Concepts', done: false, notes: 'Auto-carved from syllabus', date: '2026-06-09', time: '01:00 PM - 02:30 PM' },
            { id: Date.now() + 3, title: 'Syllabus Topic C: Mastery & Application', done: false, notes: 'Auto-carved from syllabus', date: '2026-06-10', time: '03:30 PM - 05:00 PM' }
          ];

          setSubjects(subjects.map(s => {
            if (s.id === activeSubject) {
              const updatedChapters = [...s.chapters, ...generatedTopics];
              const doneCount = updatedChapters.filter(c => c.done).length;
              const newProgress = Math.round((doneCount / updatedChapters.length) * 100);
              return { ...s, chapters: updatedChapters, progress: newProgress };
            }
            return s;
          }));

          setUploading(false);
          setUploadStatus('');
          setFileName('');
        }, 1200);
      }, 1200);
    }, 1200);
  };

  return (
    <div className="study-plan-panel">
      <div className="panel-header">
        <h2 className="panel-title">🗺️ Study Plan Branches</h2>
        <p className="panel-subtitle">Carve your syllabus into digestible chapters, allocate target dates, and map times.</p>
      </div>

      {/* Syllabus Upload Block */}
      <div className="syllabus-upload-card sketch-border sketch-shadow">
        <div className="upload-header">
          <span className="upload-icon">📂</span>
          <div className="upload-text-block">
            <h3 className="font-bold text-base">Autopilot Syllabus Planner</h3>
            <p className="text-xs text-gray-500">Upload your syllabus PDF/Image. The cabin wizard will map dates, times, and generate study branches automatically!</p>
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

      <div className="sp-layout">
        {/* Subject Tabs */}
        <div className="sp-subject-sidebar">
          {subjects.map(s => (
            <button key={s.id} onClick={() => setActiveSubject(s.id)}
              className={`sp-subject-tab sketch-border-sm ${activeSubject === s.id ? 'active-tab' : ''}`}
              style={{ '--tab-color': s.color }}>
              <span className="subject-name">{s.name}</span>
              <div className="subject-mini-progress">
                <div className="subject-mini-fill" style={{ width: `${s.progress}%`, background: s.color }}></div>
              </div>
              <span className="subject-pct">{s.progress}%</span>
            </button>
          ))}
        </div>

        {/* Chapter List */}
        <div className="sp-chapter-col sketch-border sketch-shadow">
          <div className="sp-chapter-header" style={{ borderBottom: `3px solid ${active?.color}` }}>
            <h3 className="font-bold text-xl">{active?.name} — Scheduled Branches</h3>
            <div className="sp-overall-bar sketch-border-sm">
              <div className="sp-overall-fill" style={{ width: `${active?.progress}%`, background: active?.color }}></div>
            </div>
            <p className="text-xs text-gray-500">{active?.progress}% of study branches harvested</p>
          </div>

          <ul className="chapter-list">
            {active?.chapters.map((ch) => (
              <li key={ch.id} className={`chapter-item sketch-border-sm ${ch.done ? 'chapter-done' : ''}`} onClick={() => toggleChapter(ch.id)}>
                <div className="chapter-check sketch-border-sm">
                  {ch.done && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke="#2D2C24" strokeWidth="2.5" strokeLinecap="round" /></svg>}
                </div>
                <div className="chapter-body">
                  <div className="chapter-title-row">
                    <p className="chapter-title">{ch.title}</p>
                    <div className="chapter-meta">
                      <span className="meta-badge date-badge">📅 {ch.date}</span>
                      <span className="meta-badge time-badge">⏰ {ch.time}</span>
                    </div>
                  </div>
                  {ch.notes && <p className="chapter-note handwritten">✏️ {ch.notes}</p>}
                </div>
                <span className="chapter-status">{ch.done ? '✅' : '○'}</span>
              </li>
            ))}
          </ul>

          {/* Add Chapter Form */}
          <form onSubmit={addChapter} className="add-chapter-form-expanded sketch-border-sm">
            <h4 className="font-bold text-sm mb-3">Carve Custom Branch Manually</h4>
            <div className="manual-form-grid">
              <div className="form-group-sm">
                <label className="text-xxs font-bold">Branch Title *</label>
                <input value={newChapterTitle} onChange={e => setNewChapterTitle(e.target.value)}
                  placeholder="e.g. Thermodynamics basics" className="form-input sketch-border-sm" required />
              </div>
              <div className="form-group-sm">
                <label className="text-xxs font-bold">Target Date</label>
                <input type="date" value={newChapterDate} onChange={e => setNewChapterDate(e.target.value)}
                  className="form-input sketch-border-sm" />
              </div>
              <div className="form-group-sm">
                <label className="text-xxs font-bold">Study Time slot</label>
                <input value={newChapterTime} onChange={e => setNewChapterTime(e.target.value)}
                  placeholder="e.g. 10:00 AM - 12:00 PM" className="form-input sketch-border-sm" />
              </div>
              <div className="form-group-sm full-width">
                <label className="text-xxs font-bold">Quick Memo</label>
                <input value={newChapterNotes} onChange={e => setNewChapterNotes(e.target.value)}
                  placeholder="e.g. Focus on past formulas" className="form-input sketch-border-sm" />
              </div>
            </div>
            <button type="submit" className="btn-sketch btn-sketch-primary sketch-border-sm sketch-shadow mt-3 w-full justify-center">
              + Plant Study Branch
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .study-plan-panel { display: flex; flex-direction: column; gap: 24px; }
        
        .syllabus-upload-card { background: var(--wood-card); padding: 20px; display: flex; flex-direction: column; gap: 14px; }
        .upload-header { display: flex; gap: 14px; align-items: center; }
        .upload-icon { font-size: 32px; }
        .upload-text-block h3 { margin-bottom: 2px; }
        
        .upload-drag-area {
          background: var(--wood-bg);
          border: 2.5px dashed var(--wood-ink);
          padding: 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .upload-drag-area:hover { background: #FFFDF0; }
        .upload-label-btn { font-family: var(--heading); font-weight: 700; color: var(--wood-primary-hover); font-size: 15px; }
        .hidden-file-input { display: none; }
        
        .upload-loading-area {
          background: var(--wood-bg);
          padding: 20px;
          border: 2px solid var(--wood-ink);
          border-radius: 6px;
        }
        .spinner-sketch { font-size: 32px; animation: spin 1.5s linear infinite; display: inline-block; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        .sp-layout { display: grid; grid-template-columns: 220px 1fr; gap: 22px; }
        @media (max-width: 768px) { .sp-layout { grid-template-columns: 1fr; } }
        .sp-subject-sidebar { display: flex; flex-direction: column; gap: 12px; }
        .sp-subject-tab { background: var(--wood-card); border: 2px solid var(--wood-ink); padding: 14px 16px; cursor: pointer; text-align: left; display: flex; flex-direction: column; gap: 6px; transition: all 0.2s; }
        .sp-subject-tab:hover { transform: translateX(3px); }
        .sp-subject-tab.active-tab { background: var(--tab-color, var(--wood-accent)); box-shadow: 3px 3px 0 var(--wood-ink); }
        
        .subject-name { font-family: var(--heading); font-weight: 700; font-size: 15px; }
        .subject-mini-progress { height: 6px; background: rgba(45,44,36,0.1); border: 1px solid var(--wood-ink); border-radius: 3px; overflow: hidden; }
        .subject-mini-fill { height: 100%; transition: width 0.4s; }
        .subject-pct { font-size: 11px; font-family: var(--heading); color: var(--wood-ink-muted); }
        
        .sp-chapter-col { background: var(--wood-card); padding: 24px; display: flex; flex-direction: column; gap: 16px; }
        .sp-chapter-header { padding-bottom: 14px; display: flex; flex-direction: column; gap: 6px; }
        .sp-overall-bar { height: 12px; background: var(--wood-bg); overflow: hidden; }
        .sp-overall-fill { height: 100%; transition: width 0.4s; }
        
        .chapter-list { list-style: none; display: flex; flex-direction: column; gap: 10px; }
        .chapter-item { display: flex; align-items: flex-start; gap: 12px; padding: 14px 16px; background: var(--wood-bg); cursor: pointer; transition: all 0.2s; }
        .chapter-item:hover { background: #FFFDF0; transform: translateX(3px); }
        .chapter-item.chapter-done { opacity: 0.7; background: var(--wood-sage); }
        .chapter-check { width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; background: var(--wood-card); flex-shrink: 0; margin-top: 2px; }
        .chapter-body { flex: 1; display: flex; flex-direction: column; gap: 4px; }
        .chapter-title-row { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
        .chapter-title { font-family: var(--heading); font-size: 15px; font-weight: 700; color: var(--wood-ink); }
        .chapter-item.chapter-done .chapter-title { text-decoration: line-through; }
        .chapter-meta { display: flex; gap: 8px; flex-wrap: wrap; }
        .meta-badge { font-size: 11px; font-weight: bold; background: var(--wood-card); border: 1.5px solid var(--wood-ink); padding: 1px 6px; border-radius: 4px; }
        .chapter-note { font-size: 15px; color: var(--wood-ink-muted); margin-top: 1px; }
        .chapter-status { font-size: 16px; align-self: center; }
        
        .add-chapter-form-expanded { background: var(--wood-bg); padding: 18px; border: 2.5px solid var(--wood-ink); display: flex; flex-direction: column; }
        .manual-form-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        @media (max-width: 600px) { .manual-form-grid { grid-template-columns: 1fr; } }
        .form-group-sm { display: flex; flex-direction: column; gap: 4px; }
        .full-width { grid-column: span 3; }
        @media (max-width: 600px) { .full-width { grid-column: span 1; } }
        
        .color-primary { color: var(--wood-primary-hover); }
      `}</style>
    </div>
  );
}
