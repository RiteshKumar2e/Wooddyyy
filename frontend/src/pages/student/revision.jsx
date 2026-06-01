import React, { useState } from 'react';

const initialNotes = [];

const tags = ['all', 'must-revise', 'tricky', 'formula'];
const colors = { yellow: 'var(--note-yellow)', pink: 'var(--note-pink)', green: 'var(--note-green)' };
const tagColors = { 'must-revise': '#FFE082', tricky: '#FFAB91', formula: '#A5D6A7' };

export default function Revision() {
  const [notes, setNotes] = useState(initialNotes);
  const [activeTag, setActiveTag] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState('deck'); // 'deck' or 'subject-wise'
  
  // Attached resource state
  const [selectedFileMock, setSelectedFileMock] = useState('');

  const [form, setForm] = useState({ 
    subject: '', 
    keyword: '', 
    detail: '', 
    tag: 'must-revise', 
    color: 'yellow', 
    date: '', 
    time: '',
    resource: 'None'
  });
  
  const [flipped, setFlipped] = useState({});
  const [activeResourcePreview, setActiveResourcePreview] = useState(null); // resource file preview name

  const filtered = activeTag === 'all' ? notes : notes.filter(n => n.tag === activeTag);

  const toggleFlip = (id) => setFlipped(f => ({ ...f, [id]: !f[id] }));

  const addNote = (e) => {
    e.preventDefault();
    if (!form.keyword || !form.detail || !form.subject) return;
    const finalForm = { ...form, id: Date.now(), resource: selectedFileMock || 'None' };
    setNotes([...notes, finalForm]);
    setForm({ subject: '', keyword: '', detail: '', tag: 'must-revise', color: 'yellow', date: '', time: '', resource: 'None' });
    setSelectedFileMock('');
    setShowForm(false);
  };

  const deleteNote = (id, e) => {
    e.stopPropagation();
    setNotes(notes.filter(n => n.id !== id));
  };

  const groupSubjectWise = () => {
    const grouped = {};
    filtered.forEach(note => {
      const sub = note.subject || 'General';
      if (!grouped[sub]) grouped[sub] = [];
      grouped[sub].push(note);
    });
    return grouped;
  };

  const handleResourceUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFileMock(file.name);
    }
  };

  const groupedNotes = groupSubjectWise();

  return (
    <div className="revision-panel">
      <div className="panel-header">
        <h2 className="panel-title">🔁 Revision Desk</h2>
        <p className="panel-subtitle">Create revision cards from your own notes.</p>
      </div>

      {/* Mode Switches */}
      <div className="mode-switch-row">
        <button onClick={() => setViewMode('deck')} className={`mode-btn sketch-border-sm ${viewMode === 'deck' ? 'mode-active' : ''}`}>
          🎴 Flashcard Deck
        </button>
        <button onClick={() => setViewMode('subject-wise')} className={`mode-btn sketch-border-sm ${viewMode === 'subject-wise' ? 'mode-active' : ''}`}>
          📅 Subject-Wise Planner
        </button>
      </div>

      {/* Tag Filter & Add Form Toggle */}
      <div className="tag-filter-row">
        {tags.map(t => (
          <button key={t} onClick={() => setActiveTag(t)}
            className={`tag-filter-btn sketch-border-sm ${activeTag === t ? 'tag-active' : ''}`}>
            {t === 'all' ? '📚 All' : t === 'must-revise' ? '⭐ Must Revise' : t === 'tricky' ? '🌀 Tricky' : '📐 Formula'}
          </button>
        ))}
        <button onClick={() => setShowForm(!showForm)} className="btn-sketch btn-sketch-primary sketch-border-sm sketch-shadow ml-auto">
          {showForm ? '✕ Cancel' : '+ New Revision Card'}
        </button>
      </div>

      {/* Resource Preview modal */}
      {activeResourcePreview && (
        <div className="resource-preview-modal sketch-border sketch-shadow">
          <div className="modal-header border-bottom pb-2">
            <h4 className="font-bold text-sm">📎 Preview: {activeResourcePreview}</h4>
            <button onClick={() => setActiveResourcePreview(null)} className="close-preview-btn">✕</button>
          </div>
          <div className="modal-body text-center py-6">
            <span className="folder-large-icon">📂</span>
            <p className="handwritten mt-2">Attach a resource to preview your notes.</p>
            <div className="mock-file-content sketch-border-sm mt-3">
              <p className="text-xxs font-bold text-gray-500 uppercase border-bottom pb-1">Milestone Highlights</p>
              <ul className="text-left text-xs list-disc pl-4 mt-2 leading-relaxed">
                <li>No attached resource is loaded yet.</li>
                <li>Upload a resource to see a preview.</li>
                <li>Add your own revision notes to build the deck.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Add Note Form */}
      {showForm && (
        <form onSubmit={addNote} className="add-note-form sketch-border sketch-shadow">
          <div className="add-note-tape"></div>
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Subject *</label>
              <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="Subject" className="form-input sketch-border-sm" required />
            </div>
            <div className="form-group">
              <label className="form-label">Keyword / Topic *</label>
              <input value={form.keyword} onChange={e => setForm({ ...form, keyword: e.target.value })} placeholder="Keyword / Topic" className="form-input sketch-border-sm" required />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Revision Details / Core takeaways *</label>
            <textarea value={form.detail} onChange={e => setForm({ ...form, detail: e.target.value })} placeholder="Revision notes" className="form-input sketch-border-sm" rows={3} required />
          </div>

          {/* Sibling File upload for Revision Planning */}
          <div className="form-group">
            <label className="form-label">📎 Associate Revision Resource (Syllabus/Notes/PDF)</label>
            <div className="mock-upload-row">
              <label className="upload-label-small sketch-border-sm">
                📁 Select syllabus sheet or PDF notes
                <input type="file" onChange={handleResourceUpload} accept=".pdf,.png,.jpg,.jpeg,.txt" className="hidden-file-input" />
              </label>
              {selectedFileMock && (
                <span className="selected-mock-filename font-bold text-xs color-primary">
                  📄 {selectedFileMock.substring(0, 20)}...
                </span>
              )}
            </div>
            <p className="text-xxs text-gray-500 mt-1">Linking a reference sheet lets you plan precisely when and how to revise the chapter details.</p>
          </div>

          <div className="form-row-3">
            <div className="form-group">
              <label className="form-label">Target Date *</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="form-input sketch-border-sm" required />
            </div>
            <div className="form-group">
              <label className="form-label">Target Time *</label>
              <input value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} placeholder="Target time" className="form-input sketch-border-sm" required />
            </div>
            <div className="form-group">
              <label className="form-label">Tag</label>
              <select value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })} className="form-input sketch-border-sm">
                <option value="must-revise">⭐ Must Revise</option>
                <option value="tricky">🌀 Tricky</option>
                <option value="formula">📐 Formula</option>
              </select>
            </div>
          </div>
          
          <button type="submit" className="btn-sketch btn-sketch-primary sketch-border sketch-shadow mt-2">Carve This Revision Note</button>
        </form>
      )}

      {/* VIEW 1: Flashcard Deck view */}
      {viewMode === 'deck' && (
        <div className="flashcards-grid">
          {filtered.length === 0 ? (
            <div className="empty-revision-state sketch-border-sm">No revision cards yet. Add one from your own notes.</div>
          ) : filtered.map(n => (
            <div key={n.id} className={`flashcard-wrap ${flipped[n.id] ? 'is-flipped' : ''}`} onClick={() => toggleFlip(n.id)}>
              <div className="flashcard-inner">
                {/* Front */}
                <div className="flashcard-face flashcard-front sketch-border sketch-shadow" style={{ background: colors[n.color] }}>
                  <div className="card-tag-badge" style={{ background: tagColors[n.tag] }}>{n.tag}</div>
                  <div className="card-subject">{n.subject}</div>
                  <h3 className="card-keyword">{n.keyword}</h3>
                  <div className="card-schedule-tag">
                    <span>📅 {n.date}</span>
                    <span>⏰ {n.time}</span>
                  </div>
                  {n.resource && n.resource !== 'None' && (
                    <button onClick={(e) => { e.stopPropagation(); setActiveResourcePreview(n.resource); }} className="card-resource-clip-badge handwritten text-xxs">
                      📎 {n.resource.substring(0, 12)}...
                    </button>
                  )}
                  <p className="card-flip-hint handwritten">tap to reveal ↩</p>
                  <button className="card-delete-btn" onClick={(e) => deleteNote(n.id, e)}>✕</button>
                </div>
                {/* Back */}
                <div className="flashcard-face flashcard-back sketch-border sketch-shadow" style={{ background: colors[n.color] }}>
                  <div className="card-tag-badge" style={{ background: tagColors[n.tag] }}>{n.tag}</div>
                  <p className="card-detail">{n.detail}</p>
                  <div className="card-schedule-tag text-xs text-gray-500 font-mono mt-4">
                    <span>Target: {n.date} at {n.time}</span>
                  </div>
                  {n.resource && n.resource !== 'None' && (
                    <button onClick={(e) => { e.stopPropagation(); setActiveResourcePreview(n.resource); }} className="resource-preview-btn-back sketch-border-sm mt-2 justify-center">
                      📁 Open Attached Resource
                    </button>
                  )}
                  <p className="card-flip-hint handwritten">tap to flip back ↩</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 2: Subject-Wise Timeline View */}
      {viewMode === 'subject-wise' && (
        <div className="subject-wise-container">
          {Object.keys(groupedNotes).map(sub => (
            <div key={sub} className="subject-group-folder sketch-border sketch-shadow">
              <div className="subject-folder-tab sketch-border-sm">
                <span>📁 {sub}</span>
                <span className="folder-count">{groupedNotes[sub].length} topics</span>
              </div>
              <div className="subject-folder-sheet">
                <ul className="folder-note-list">
                  {groupedNotes[sub].map(n => (
                    <li key={n.id} className="folder-note-item sketch-border-sm" style={{ borderLeft: `5px solid ${tagColors[n.tag]}` }}>
                      <div className="note-item-main">
                        <div className="note-title-row">
                          <h4 className="note-item-title font-bold text-base">{n.keyword}</h4>
                          {n.resource && n.resource !== 'None' && (
                            <button onClick={() => setActiveResourcePreview(n.resource)} className="badge-small bg-sky text-xxs font-bold cursor-pointer inline-flex items-center gap-1">
                              📎 {n.resource}
                            </button>
                          )}
                        </div>
                        <p className="note-item-desc text-xs text-gray-600 mt-1">{n.detail}</p>
                        
                        {/* Target revision schedule details in the list item! */}
                        <div className="note-item-schedule-row mt-3 text-xxs font-bold">
                          <span className="sched-badge border-green">📅 Revision Target Date: {n.date}</span>
                          <span className="sched-badge border-sky ml-2">⏰ Revision Time: {n.time}</span>
                        </div>
                      </div>
                      
                      <div className="note-item-status flex flex-col items-end gap-1">
                        <span className="badge-small text-xxs font-bold" style={{ background: tagColors[n.tag] }}>{n.tag}</span>
                        <button className="note-item-delete-inline mt-4" onClick={(e) => deleteNote(n.id, e)}>✕ Delete</button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}

          {Object.keys(groupedNotes).length === 0 && (
            <div className="empty-state sketch-border-sm">
              <span style={{ fontSize: 40 }}>📭</span>
              <p className="handwritten" style={{ fontSize: 22 }}>No revision cards to group. Carve one!</p>
            </div>
          )}
        </div>
      )}

      {filtered.length === 0 && viewMode === 'deck' && (
        <div className="empty-state sketch-border-sm">
          <span style={{ fontSize: 40 }}>📭</span>
          <p className="handwritten" style={{ fontSize: 22 }}>No cards yet for this tag. Carve one!</p>
        </div>
      )}

      <style>{`
        .revision-panel { display: flex; flex-direction: column; gap: 24px; }
        
        .empty-revision-state { background: var(--wood-card); padding: 18px; color: var(--wood-ink-muted); }
        .mode-switch-row { display: flex; gap: 12px; border-bottom: 2px dashed var(--wood-border-light); padding-bottom: 12px; }
        .mode-btn { background: var(--wood-card); border: 2px solid var(--wood-ink); padding: 8px 16px; font-family: var(--heading); font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .mode-btn.mode-active { background: var(--wood-accent); box-shadow: 2px 2px 0 var(--wood-ink); }

        .tag-filter-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .tag-filter-btn { font-family: var(--heading); font-weight: 600; font-size: 13px; padding: 7px 14px; background: var(--wood-card); cursor: pointer; border: 2px solid var(--wood-ink); transition: all 0.2s; }
        .tag-filter-btn.tag-active { background: var(--wood-primary); box-shadow: 2px 2px 0 var(--wood-ink); }
        .ml-auto { margin-left: auto; }
        
        .add-note-form { background: var(--wood-card); padding: 28px; display: flex; flex-direction: column; gap: 16px; position: relative; }
        .add-note-tape { position: absolute; top: -12px; left: 50%; transform: translateX(-50%) rotate(-1deg); width: 90px; height: 22px; background: rgba(253,242,204,0.7); border: 1px dashed rgba(45,44,36,0.2); }
        
        .mock-upload-row { display: flex; gap: 12px; align-items: center; margin-top: 2px; }
        .upload-label-small { cursor: pointer; background: var(--wood-bg); border: 2.5px dashed var(--wood-ink); padding: 8px 12px; font-size: 13px; font-family: var(--heading); font-weight: bold; }
        .hidden-file-input { display: none; }
        
        .form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-row-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        @media (max-width: 600px) { 
          .form-row-2, .form-row-3 { grid-template-columns: 1fr; gap: 12px; } 
        }
        .form-group { display: flex; flex-direction: column; gap: 5px; }
        .form-label { font-family: var(--heading); font-weight: 600; font-size: 13px; }
        .form-input { padding: 9px 12px; font-family: var(--sans); font-size: 14px; background: var(--wood-bg); color: var(--wood-ink); border: 2px solid var(--wood-ink); outline: none; box-sizing: border-box; width: 100%; }
        .form-input:focus { background: #FFFDF0; }
        
        .color-picker-row { display: flex; gap: 10px; padding: 4px 0; }
        .color-dot-btn { width: 28px; height: 28px; border-radius: 50%; border: 2px solid var(--wood-ink); cursor: pointer; transition: transform 0.2s; }
        .color-dot-btn.selected { transform: scale(1.2); box-shadow: 0 0 0 3px var(--wood-ink); }
        
        .flashcards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 24px; }
        .flashcard-wrap { height: 240px; perspective: 1000px; cursor: pointer; }
        .flashcard-inner { position: relative; width: 100%; height: 100%; transition: transform 0.55s cubic-bezier(0.4,0,0.2,1); transform-style: preserve-3d; }
        .flashcard-wrap.is-flipped .flashcard-inner { transform: rotateY(180deg); }
        .flashcard-face { position: absolute; inset: 0; backface-visibility: hidden; padding: 20px; display: flex; flex-direction: column; justify-content: center; }
        .flashcard-back { transform: rotateY(180deg); }
        
        .card-tag-badge { position: absolute; top: 10px; right: 10px; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 10px; border: 1px solid var(--wood-ink); text-transform: uppercase; }
        .card-subject { font-family: var(--heading); font-size: 12px; color: var(--wood-ink-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
        .card-keyword { font-family: var(--heading); font-size: 24px; font-weight: 700; margin-bottom: 8px; }
        
        .card-schedule-tag { display: flex; gap: 8px; margin-top: auto; font-family: var(--heading); font-size: 11px; font-weight: bold; color: var(--wood-ink-muted); }
        .card-schedule-tag span { border: 1px solid var(--wood-ink); background: rgba(255,255,255,0.4); padding: 1px 6px; border-radius: 4px; }

        .card-resource-clip-badge {
          position: absolute;
          bottom: 12px;
          left: 14px;
          border: 1px dashed var(--wood-primary-hover);
          background: #E8F3D6;
          padding: 2px 6px;
          cursor: pointer;
          font-weight: 700;
        }

        .resource-preview-btn-back {
          display: flex;
          align-items: center;
          font-family: var(--heading);
          font-size: 11px;
          font-weight: 700;
          padding: 5px;
          background: var(--wood-bg);
          border: 1.5px solid var(--wood-ink);
          cursor: pointer;
          color: var(--wood-ink);
        }

        .card-flip-hint { font-size: 15px; color: var(--wood-ink-muted); position: absolute; bottom: 12px; right: 14px; }
        .card-detail { font-size: 14px; line-height: 1.55; color: var(--wood-ink); }
        .card-delete-btn { position: absolute; top: 10px; left: 10px; background: none; border: none; font-size: 14px; cursor: pointer; color: var(--wood-ink-muted); padding: 2px 5px; }
        .card-delete-btn:hover { color: #c62828; }
        
        .subject-wise-container { display: flex; flex-direction: column; gap: 24px; }
        .subject-group-folder { background: var(--wood-card); padding: 20px; display: flex; flex-direction: column; position: relative; }
        .subject-folder-tab { background: var(--wood-accent); border: 2px solid var(--wood-ink); font-family: var(--heading); font-weight: 700; font-size: 16px; padding: 6px 16px; align-self: flex-start; margin-top: -34px; margin-left: -2px; display: flex; gap: 14px; box-shadow: 2px -2px 0 var(--wood-ink); }
        .folder-count { font-size: 11px; font-weight: bold; background: rgba(255,255,255,0.4); padding: 1px 6px; border-radius: 4px; }
        
        .subject-folder-sheet { background: var(--wood-bg); border: 2px solid var(--wood-ink); padding: 18px; margin-top: 10px; }
        .folder-note-list { list-style: none; display: flex; flex-direction: column; gap: 12px; }
        .folder-note-item { background: var(--wood-card); padding: 14px; display: flex; justify-content: space-between; gap: 14px; align-items: flex-start; transition: all 0.2s; }
        .folder-note-item:hover { transform: translateX(2px); }
        
        .note-title-row { display: flex; align-items: center; gap: 12px; }
        .note-item-main { flex: 1; }
        
        .note-item-schedule-row { display: flex; gap: 10px; }
        .sched-badge { border: 1.5px solid var(--wood-ink); padding: 2px 6px; border-radius: 4px; }
        .border-green { background: #E8F3D6; }
        .border-sky { background: #E0F7FA; }

        .badge-small { font-size: 10px; font-weight: bold; font-family: var(--heading); border: 1px solid var(--wood-ink); padding: 1px 6px; border-radius: 4px; text-transform: uppercase; text-align: center; }
        .bg-yellow { background: #FFF9C4; }
        .bg-sky { background: #E0F7FA; }
        
        .note-item-delete-inline { background: none; border: none; cursor: pointer; color: #c62828; font-family: var(--heading); font-size: 11px; font-weight: bold; }
        .note-item-delete-inline:hover { text-decoration: underline; }

        .resource-preview-modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: var(--wood-card);
          padding: 20px;
          z-index: 999;
          width: 320px;
        }
        .close-preview-btn { background: none; border: none; font-size: 16px; cursor: pointer; color: var(--wood-ink); font-weight: bold; }
        .folder-large-icon { font-size: 40px; }
        .mock-file-content { background: var(--wood-bg); padding: 12px; }
        
        .empty-state { background: var(--wood-card); padding: 40px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px; }
        .color-primary { color: var(--wood-primary-hover); }
      `}</style>
    </div>
  );
}
