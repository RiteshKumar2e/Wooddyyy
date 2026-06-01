import React, { useState, useEffect, useRef } from 'react';

export default function Quiz() {
  // Setup States
  const [setupMode, setSetupMode] = useState(true);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [fileName, setFileName] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generateStep, setGenerateStep] = useState('');
  const [quizType, setQuizType] = useState('objective'); // 'objective' or 'subjective'
  const [subjectFilter, setSubjectFilter] = useState('All');

  // Quiz running States
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [subjectiveInput, setSubjectiveInput] = useState('');
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);

  // Timers
  const [timeLeft, setTimeLeft] = useState(30);
  const timerRef = useRef(null);

  // Results
  const [answeredRecords, setAnsweredRecords] = useState([]); // Array of { qId, correct, selection, selfGrade, subjectiveAnswer }
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Setup timers
  useEffect(() => {
    if (setupMode || quizCompleted || showAnswerFeedback) {
      clearInterval(timerRef.current);
      return;
    }

    // Set time limits per question type
    const initialTimeLimit = quizType === 'objective' ? 30 : 180; // 30 sec or 3 minutes (180s)
    setTimeLeft(initialTimeLimit);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [currentIndex, setupMode, quizCompleted, showAnswerFeedback]);

  // Handle timeout
  const handleTimeout = () => {
    if (quizType === 'objective') {
      // Unanswered counts as wrong
      const currentQ = quizQuestions[currentIndex];
      setAnsweredRecords(prev => [...prev, {
        questionId: currentQ.id,
        correct: false,
        selection: null,
        timeout: true
      }]);
      setShowAnswerFeedback(true);
    } else {
      // Force submit subjective answer
      submitSubjective();
    }
  };

  // Mock Upload Syllabus / Notes / Question Bank
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    setFileUploaded(true);
  };

  // Question generator
  const triggerGeneration = () => {
    if (!fileUploaded) {
      setQuizQuestions([]);
      setSetupMode(true);
      return;
    }

    setGenerating(true);
    setGenerateStep('Opening file binder... 📁');
    setTimeout(() => {
      setGenerateStep('Jotting down parsed topics & formulas... 📝');
      setTimeout(() => {
        setGenerateStep('Carving custom choices and solution rubrics... 🌿');
        setTimeout(() => {
          const generatedQuestion = quizType === 'objective'
            ? {
                id: 998,
                subject: subjectFilter === 'All' ? 'Uploaded File' : subjectFilter,
                question: `Your uploaded file, ${fileName.substring(0, 10)}, is ready for a real quiz generator. Connect a question source to continue.`,
                options: ['No questions available', 'Upload more files', 'Connect a backend generator', 'All of the above'],
                correct: 3,
                explanation: 'Demo question banks were removed. This placeholder only reflects uploaded content.'
              }
            : {
                id: 999,
                subject: subjectFilter === 'All' ? 'Uploaded File' : subjectFilter,
                question: `Your uploaded file, ${fileName.substring(0, 10)}, is ready for a real quiz generator. Connect a question source to continue.`,
                sampleAnswer: 'No demo answer is bundled here.',
                explanation: 'Demo question banks were removed. This placeholder only reflects uploaded content.'
              };

          setQuizQuestions([generatedQuestion]);
          setCurrentIndex(0);
          setSelectedOption(null);
          setSubjectiveInput('');
          setAnsweredRecords([]);
          setShowAnswerFeedback(false);
          setGenerating(false);
          setSetupMode(false);
        }, 1200);
      }, 1200);
    }, 1200);
  };

  // Select option for Objective
  const selectObjectiveOption = (idx) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    const q = quizQuestions[currentIndex];
    const isCorrect = idx === q.correct;
    
    setAnsweredRecords(prev => [...prev, {
      questionId: q.id,
      correct: isCorrect,
      selection: idx,
      timeout: false
    }]);
    
    setShowAnswerFeedback(true);
  };

  // Submit Subjective
  const submitSubjective = () => {
    setShowAnswerFeedback(true);
  };

  // Grade Subjective self-assessment
  const gradeSubjective = (grade) => {
    const q = quizQuestions[currentIndex];
    setAnsweredRecords(prev => [...prev, {
      questionId: q.id,
      subjectiveAnswer: subjectiveInput,
      selfGrade: grade // 'perfect', 'partial', 'missed'
    }]);

    moveToNext();
  };

  // Go to next question
  const moveToNext = () => {
    if (currentIndex + 1 >= quizQuestions.length) {
      setQuizCompleted(true);
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setSubjectiveInput('');
      setShowAnswerFeedback(false);
    }
  };

  // Reset Quiz Setup
  const resetQuizSession = () => {
    setSetupMode(true);
    setQuizCompleted(false);
    setFileUploaded(false);
    setFileName('');
  };

  // Format time
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  // GET CLASS FOR OBJECTIVE OPTION
  const getOptionClass = (idx) => {
    const q = quizQuestions[currentIndex];
    if (selectedOption === null) return 'quiz-option sketch-border-sm';
    if (idx === q.correct) return 'quiz-option option-correct sketch-border-sm';
    if (idx === selectedOption) return 'quiz-option option-wrong sketch-border-sm';
    return 'quiz-option option-faded sketch-border-sm';
  };

  // RENDER SETUP VIEW
  if (setupMode) {
    return (
      <div className="quiz-panel">
        <div className="panel-header">
          <h2 className="panel-title">📝 Modular Study Cabin Quiz</h2>
          <p className="panel-subtitle">Upload your own file to build a quiz. No sample bank is bundled here.</p>
        </div>

        {generating ? (
          <div className="quiz-generating-card sketch-border sketch-shadow text-center py-8">
            <div className="carving-icon">🌿</div>
            <h3 className="handwritten text-2xl mt-3 text-gold">{generateStep}</h3>
            <p className="text-xs text-gray-500 mt-2">Allocating objective cards and subjective grading guides...</p>
          </div>
        ) : (
          <div className="quiz-setup-grid">
            
            {/* Syllabus/Notes Uploader */}
            <div className="uploader-card sketch-border sketch-shadow">
              <div className="upload-header">
                <span className="upload-main-icon">📄</span>
                <h3 className="font-bold text-base">File-to-Quiz Wizard</h3>
              </div>
              <p className="text-xs text-gray-600 mb-4">Upload your own syllabus or notes to build a quiz from your content.</p>
              
              {fileUploaded ? (
                <div className="file-success-badge sketch-border-sm">
                  <span>✅ Ready: {fileName.substring(0, 20)}...</span>
                  <button onClick={() => setFileUploaded(false)} className="text-xs ml-auto text-red-500 hover:underline">Remove</button>
                </div>
              ) : (
                <div className="drag-upload-box sketch-border-sm">
                  <label className="cursor-pointer font-bold block text-sm color-primary">
                    📁 Click to upload PDF or Image
                    <input type="file" onChange={handleFileUpload} accept=".pdf,.png,.jpg,.jpeg" className="hidden-file-input" />
                  </label>
                  <span className="text-xxs text-gray-500 mt-1">Supports PDF, JPG, PNG (Max 5MB)</span>
                </div>
              )}
            </div>

            {/* Config Panel */}
            <div className="config-card sketch-border sketch-shadow">
              <h3 className="font-bold text-base mb-3">🛠️ Quiz Configurator</h3>
              
              <div className="config-group">
                <label className="config-label">Question Type</label>
                <div className="config-options">
                  <button onClick={() => setQuizType('objective')} className={`config-btn sketch-border-sm ${quizType === 'objective' ? 'active' : ''}`}>
                    🎯 Objective
                  </button>
                  <button onClick={() => setQuizType('subjective')} className={`config-btn sketch-border-sm ${quizType === 'subjective' ? 'active' : ''}`}>
                    📝 Subjective
                  </button>
                </div>
              </div>

              <div className="config-row-2 mt-4">
                <div className="config-group">
                  <label className="config-label">Subject Scope</label>
                  <select value={subjectFilter} onChange={e => setSubjectFilter(e.target.value)} className="config-select sketch-border-sm">
                    <option value="All">All Subjects</option>
                  </select>
                </div>
              </div>

              <button onClick={triggerGeneration} className="btn-sketch btn-sketch-primary sketch-border sketch-shadow w-full justify-center mt-6">
                🔥 Build Quiz From Upload
              </button>
            </div>

          </div>
        )}
        
        <style>{`
          .quiz-setup-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
          @media (max-width: 768px) { .quiz-setup-grid { grid-template-columns: 1fr; } }
          
          .uploader-card, .config-card { background: var(--wood-card); padding: 24px; display: flex; flex-direction: column; }
          .upload-header { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
          .upload-main-icon { font-size: 28px; }
          
          .drag-upload-box {
            background: var(--wood-bg);
            border: 2px dashed var(--wood-ink);
            padding: 24px 16px;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .file-success-badge {
            background: var(--wood-sage);
            padding: 10px 14px;
            display: flex;
            align-items: center;
            font-size: 13px;
            font-weight: 700;
          }
          .hidden-file-input { display: none; }

          .config-group { display: flex; flex-direction: column; gap: 6px; }
          .config-label { font-family: var(--heading); font-weight: 700; font-size: 13px; }
          .config-options { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
          .config-btn {
            background: var(--wood-bg);
            border: 2px solid var(--wood-ink);
            padding: 10px 4px;
            font-family: var(--heading);
            font-size: 12px;
            font-weight: bold;
            cursor: pointer;
            text-align: center;
            transition: all 0.2s;
          }
          .config-btn:hover { background: var(--wood-accent); }
          .config-btn.active { background: var(--wood-primary); box-shadow: 2px 2px 0 var(--wood-ink); }
          
          .config-select {
            padding: 8px 12px;
            font-family: var(--sans);
            font-size: 13.5px;
            background: var(--wood-bg);
            border: 2px solid var(--wood-ink);
            outline: none;
            width: 100%;
          }
          
          .quiz-generating-card { background: var(--wood-card); padding: 48px; }
          .carving-icon { font-size: 48px; animation: heartbeat 1.2s infinite alternate; }
          @keyframes heartbeat { 0% { transform: scale(0.9); } 100% { transform: scale(1.1); } }
          .text-gold { color: var(--wood-primary-hover); }
          .color-primary { color: var(--wood-primary-hover); }
        `}</style>
      </div>
    );
  }

  // RENDER RESULTS PANEL
  if (quizCompleted) {
    // Math indicators
    const totalQ = quizQuestions.length;
    let rightCount = 0;
    let wrongCount = 0;
    let timeoutCount = 0;
    
    // Subjective counts
    let perfectCount = 0;
    let partialCount = 0;
    let missedCount = 0;

    answeredRecords.forEach(rec => {
      if (quizType === 'objective') {
        if (rec.correct) rightCount++;
        else if (rec.timeout) timeoutCount++;
        else wrongCount++;
      } else {
        if (rec.selfGrade === 'perfect') perfectCount++;
        else if (rec.selfGrade === 'partial') partialCount++;
        else missedCount++;
      }
    });

    const successPct = quizType === 'objective'
      ? Math.round((rightCount / totalQ) * 100)
      : Math.round(((perfectCount + (partialCount * 0.5)) / totalQ) * 100);

    return (
      <div className="quiz-panel">
        <div className="quiz-result-wrapper sketch-border sketch-shadow">
          <div className="result-tape"></div>
          <h2 className="panel-title text-center">🎉 Assessment Report Card</h2>
          <p className="text-center text-xs text-gray-500 mt-1">Carved on {new Date().toLocaleDateString()}</p>

          <div className="results-summary-row">
            {/* Score Ring SVG */}
            <div className="result-score-ring">
              <svg width="140" height="140" viewBox="0 0 140 140">
                <circle cx="70" cy="70" r="55" fill="none" stroke="var(--wood-border-light)" strokeWidth="12" />
                <circle cx="70" cy="70" r="55" fill="none" stroke="var(--wood-primary)" strokeWidth="12"
                  strokeDasharray={`${successPct * 3.456} 345.6`} strokeLinecap="round"
                  strokeDashoffset="86.4" transform="rotate(-90 70 70)" />
                <text x="70" y="67" textAnchor="middle" fontSize="26" fontFamily="var(--heading)" fontWeight="700" fill="var(--wood-ink)">{successPct}%</text>
                <text x="70" y="88" textAnchor="middle" fontSize="12" fontFamily="var(--sans)" fill="var(--wood-ink-muted)">
                  {quizType === 'objective' ? `${rightCount}/${totalQ} right` : `${perfectCount} perfect`}
                </text>
              </svg>
            </div>

            {/* Score Details list */}
            <div className="score-breakdown-details sketch-border-sm">
              <h4 className="font-bold text-sm border-bottom pb-2">Milestone Harvest</h4>
              {quizType === 'objective' ? (
                <div className="breakdown-grid mt-2">
                  <div className="break-item"><span className="bullet green">●</span> Right: {rightCount}</div>
                  <div className="break-item"><span className="bullet red">●</span> Wrong: {wrongCount}</div>
                  <div className="break-item"><span className="bullet yellow">●</span> Time Outs: {timeoutCount}</div>
                </div>
              ) : (
                <div className="breakdown-grid mt-2">
                  <div className="break-item"><span className="bullet green">●</span> Perfect: {perfectCount}</div>
                  <div className="break-item"><span className="bullet yellow">●</span> Partial: {partialCount}</div>
                  <div className="break-item"><span className="bullet red">●</span> Missed: {missedCount}</div>
                </div>
              )}
            </div>
          </div>

          <p className="handwritten text-center text-xl my-4 text-gray-700">
            {successPct >= 80 ? '🌟 Excellent focus cabin harvesting!' : successPct >= 60 ? '🌱 Steady growth. Sprout more branches!' : '💧 Gaps found. Review flashcards and retry!'}
          </p>

          {/* Details list of each question with correct answers */}
          <div className="results-review-section">
            <h3 className="font-bold text-base mb-3 border-bottom pb-2">📋 Details Review</h3>
            <ul className="results-review-list">
              {quizQuestions.map((q, idx) => {
                const record = answeredRecords.find(r => r.questionId === q.id) || {};
                return (
                  <li key={q.id} className="review-question-item sketch-border-sm">
                    <div className="review-q-header">
                      <span className="badge-small bg-yellow mr-2">Q{idx + 1}</span>
                      <span className="badge-small bg-sky">{q.subject}</span>
                    </div>
                    <p className="font-bold text-sm mt-2">{q.question}</p>
                    
                    {quizType === 'objective' ? (
                      <div className="review-answers-box mt-2">
                        <p className="text-xs">
                          <span className="font-bold">Your selection:</span>{' '}
                          {record.timeout ? (
                            <span className="color-red font-bold">⚠️ Time Out (Unanswered)</span>
                          ) : (
                            <span className={record.correct ? 'color-green font-bold' : 'color-red font-bold'}>
                              {String.fromCharCode(65 + record.selection)}. {q.options[record.selection]}
                            </span>
                          )}
                        </p>
                        {!record.correct && (
                          <p className="text-xs mt-1">
                            <span className="font-bold">Correct choice:</span>{' '}
                            <span className="color-green font-bold">
                              {String.fromCharCode(65 + q.correct)}. {q.options[q.correct]}
                            </span>
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="review-answers-box mt-2">
                        <p className="text-xs font-bold">Your Response:</p>
                        <blockquote className="subjective-user-quote handwritten text-sm">
                          "{record.subjectiveAnswer || 'No response logged'}"
                        </blockquote>
                        <p className="text-xs font-bold mt-2">Cabin Sample Answer:</p>
                        <blockquote className="subjective-sample-quote text-sm text-gray-700">
                          "{q.sampleAnswer}"
                        </blockquote>
                        <p className="text-xs mt-2">
                          <span className="font-bold">Self-Grade Evaluation:</span>{' '}
                          <span className={`badge-small font-bold ${
                            record.selfGrade === 'perfect' ? 'bg-sage color-green' : record.selfGrade === 'partial' ? 'bg-yellow color-yellow' : 'bg-pink color-red'
                          }`}>
                            {record.selfGrade}
                          </span>
                        </p>
                      </div>
                    )}
                    <p className="text-xs italic text-gray-500 mt-2 bg-yellow-soft p-2 sketch-border-sm">
                      ✏️ <span className="font-bold">Explanation:</span> {q.explanation}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>

          <button onClick={resetQuizSession} className="btn-sketch btn-sketch-primary sketch-border sketch-shadow mt-6 mx-auto display-flex">
            🔄 Return to Cabin Setup
          </button>
        </div>

        <style>{`
          .quiz-result-wrapper { background: var(--wood-card); padding: 36px; display: flex; flex-direction: column; max-width: 600px; margin: 0 auto; position: relative; }
          .result-tape { position: absolute; top: -12px; left: 50%; transform: translateX(-50%) rotate(-1deg); width: 90px; height: 22px; background: rgba(253,242,204,0.7); border: 1px dashed rgba(45,44,36,0.2); }
          .results-summary-row { display: grid; grid-template-columns: 140px 1fr; gap: 24px; margin-top: 18px; align-items: center; }
          @media (max-width: 500px) { .results-summary-row { grid-template-columns: 1fr; justify-items: center; } }
          
          .score-breakdown-details { background: var(--wood-bg); padding: 14px; width: 100%; box-sizing: border-box; }
          .breakdown-grid { display: flex; flex-direction: column; gap: 8px; }
          .break-item { font-size: 13px; font-weight: bold; display: flex; align-items: center; gap: 8px; }
          .bullet { font-size: 14px; }
          .bullet.green { color: #2e7d32; }
          .bullet.red { color: #c62828; }
          .bullet.yellow { color: #ef6c00; }
          
          .results-review-list { list-style: none; display: flex; flex-direction: column; gap: 16px; margin-top: 10px; }
          .review-question-item { background: var(--wood-bg); padding: 18px; display: flex; flex-direction: column; }
          .review-q-header { display: flex; gap: 6px; }
          .review-answers-box { background: var(--wood-card); padding: 12px; border-left: 3px solid var(--wood-ink); margin-top: 8px; }
          
          .subjective-user-quote { color: #5d4037; padding: 6px 12px; border-left: 2px dashed var(--wood-ink-muted); margin: 4px 0 8px; }
          .subjective-sample-quote { padding: 6px 12px; background: rgba(255,255,255,0.4); border-left: 2px solid var(--wood-primary); margin: 4px 0 8px; }
          .bg-yellow-soft { background: #FFFDE7; }
          .display-flex { display: flex; }
          .mx-auto { margin-left: auto; margin-right: auto; }
          
          .color-green { color: #2e7d32; }
          .color-red { color: #c62828; }
          .color-yellow { color: #ef6c00; }
        `}</style>
      </div>
    );
  }

  // RENDER ACTIVE QUIZ VIEW
  const q = quizQuestions[currentIndex];

  if (!q) {
    return (
      <div className="quiz-panel">
        <div className="panel-header">
          <h2 className="panel-title">📝 Parchment Active Assessment</h2>
          <p className="panel-subtitle">Upload your own file to start a quiz. No bundled question data is shown here.</p>
        </div>
        <div className="quiz-empty-state sketch-border sketch-shadow">
          <p className="handwritten text-xl">No quiz content yet.</p>
          <p className="text-sm mt-2">Upload a syllabus or notes file above to generate your own questions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-panel">
      <div className="panel-header">
        <h2 className="panel-title">📝 Parchment Active Assessment</h2>
        <p className="panel-subtitle">Maintain steady focus. Timer keeps you anchored to quick, active retrieval.</p>
      </div>

      {/* Timer Bar & Question Progress */}
      <div className="quiz-stats-row sketch-border-sm">
        <div className="timer-block flex items-center gap-2">
          <span className="timer-icon">⏳</span>
          <span className={`timer-text font-mono font-bold text-lg ${timeLeft <= 10 && quizType === 'objective' ? 'timer-warning' : ''}`}>
            {formatTime(timeLeft)}
          </span>
          <span className="text-xxs text-gray-500">remaining</span>
        </div>

        <div className="progress-fraction font-bold font-mono">
          Question {currentIndex + 1} of {quizQuestions.length}
        </div>
      </div>

      {/* Visual countdown progress */}
      <div className="timer-progressbar-wrap sketch-border-sm">
        <div className={`timer-progressbar-fill ${timeLeft <= 10 && quizType === 'objective' ? 'fill-warning' : ''}`}
          style={{ width: `${(timeLeft / (quizType === 'objective' ? 30 : 180)) * 100}%` }}></div>
      </div>

      <div className="question-card sketch-border sketch-shadow">
        <div className="q-subject-badge">{q?.subject}</div>
        <h3 className="q-text">{q?.question}</h3>

        {/* TYPE 1: OBJECTIVE MODE */}
        {quizType === 'objective' && (
          <div className="options-grid">
            {q?.options.map((opt, idx) => (
              <button key={idx} onClick={() => selectObjectiveOption(idx)} className={getOptionClass(idx)}>
                <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                <span className="option-text">{opt}</span>
                {selectedOption !== null && idx === q.correct && <span className="option-tick">✅</span>}
                {selectedOption === idx && idx !== q.correct && <span className="option-tick">❌</span>}
              </button>
            ))}
          </div>
        )}

        {/* TYPE 2: SUBJECTIVE MODE */}
        {quizType === 'subjective' && (
          <div className="subjective-input-area mt-2">
            {!showAnswerFeedback ? (
              <div className="subjective-form flex flex-col gap-3">
                <textarea
                  value={subjectiveInput}
                  onChange={e => setSubjectiveInput(e.target.value)}
                  placeholder="Jot down your comprehensive response here..."
                  className="form-input subjective-textarea sketch-border-sm"
                  rows={6}
                />
                <button onClick={submitSubjective} className="btn-sketch btn-sketch-primary sketch-border sketch-shadow self-end">
                  🔐 Submit Response
                </button>
              </div>
            ) : (
              <div className="subjective-reveal-box sketch-border-sm mt-3">
                <div className="rubric-header border-bottom pb-2">
                  <h4 className="font-bold text-sm">🔍 Cabin Rubric Assessment</h4>
                  <p className="text-xxs text-gray-500">Compare your response against the cabinet sample answer and self-evaluate.</p>
                </div>
                
                <div className="rubric-comparison-grid mt-3">
                  <div className="rubric-column">
                    <span className="handwritten text-xs font-bold">Your Response:</span>
                    <blockquote className="user-response-quote font-sans text-xs mt-1">
                      "{subjectiveInput || 'No response entered'}"
                    </blockquote>
                  </div>
                  <div className="rubric-column">
                    <span className="handwritten text-xs font-bold">Sample Key Solutions:</span>
                    <blockquote className="sample-response-quote font-sans text-xs mt-1">
                      "{q?.sampleAnswer}"
                    </blockquote>
                  </div>
                </div>

                <div className="self-grade-selection mt-4 border-top pt-3 text-center">
                  <p className="font-bold text-xs mb-3">Rate your coverage level truthfully:</p>
                  <div className="self-grade-buttons">
                    <button onClick={() => gradeSubjective('perfect')} className="grade-btn bg-sage border-green">
                      ✅ Covered perfectly (Full score)
                    </button>
                    <button onClick={() => gradeSubjective('partial')} className="grade-btn bg-yellow border-yellow">
                      ⚠️ Covered partially (Half score)
                    </button>
                    <button onClick={() => gradeSubjective('missed')} className="grade-btn bg-pink border-red">
                      ❌ Missed core items (Zero score)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* FEEDBACK EXPLANATION BOX (Objective) */}
        {quizType === 'objective' && showAnswerFeedback && (
          <div className="explanation-box sketch-border-sm">
            <span className="explain-label handwritten">explanation ✏️</span>
            <p className="explain-text">{q?.explanation}</p>
          </div>
        )}

        {/* NAVIGATION CONTROL (Objective) */}
        {quizType === 'objective' && showAnswerFeedback && (
          <button onClick={moveToNext} className="btn-sketch btn-sketch-primary sketch-border sketch-shadow next-btn">
            {currentIndex + 1 >= quizQuestions.length ? '🏁 Finish & Grade' : 'Next Question →'}
          </button>
        )}
      </div>

      <style>{`
        .quiz-panel { display: flex; flex-direction: column; gap: 20px; }
        
        .quiz-stats-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 16px; background: var(--wood-card); }
        .timer-block { display: flex; align-items: center; gap: 6px; }
        .timer-warning { color: #d32f2f; animation: pulse 0.8s infinite alternate; }
        @keyframes pulse { 0% { opacity: 0.7; } 100% { opacity: 1; transform: scale(1.05); } }
        
        .timer-progressbar-wrap { height: 8px; background: var(--wood-bg); overflow: hidden; }
        .timer-progressbar-fill { height: 100%; background: var(--wood-primary); transition: width 1s linear; }
        .fill-warning { background: #d32f2f !important; }

        .question-card { background: var(--wood-card); padding: 30px; display: flex; flex-direction: column; gap: 20px; position: relative; }
        .q-subject-badge { display: inline-block; background: var(--wood-accent); border: 1.5px solid var(--wood-ink); padding: 3px 12px; font-family: var(--heading); font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; align-self: flex-start; }
        .q-text { font-family: var(--heading); font-size: 19px; line-height: 1.45; }
        
        .options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        @media (max-width: 640px) { .options-grid { grid-template-columns: 1fr; } }
        
        .quiz-option { background: var(--wood-bg); border: 2px solid var(--wood-ink); padding: 14px 16px; cursor: pointer; display: flex; align-items: center; gap: 12px; text-align: left; transition: all 0.2s; font-family: var(--sans); }
        .quiz-option:hover { background: var(--wood-accent); transform: translateX(2px); }
        .option-correct { background: var(--wood-sage) !important; border-color: #2e7d32 !important; }
        .option-wrong { background: #FFEBEE !important; border-color: #c62828 !important; }
        .option-faded { opacity: 0.55; cursor: not-allowed; }
        .option-letter { font-family: var(--heading); font-weight: 700; font-size: 16px; width: 24px; flex-shrink: 0; }
        .option-text { flex: 1; font-size: 14px; line-height: 1.4; }
        .option-tick { font-size: 18px; flex-shrink: 0; }
        
        .subjective-textarea { background: var(--wood-bg); padding: 14px; font-family: var(--sans); width: 100%; border: 2.5px solid var(--wood-ink); outline: none; }
        .subjective-reveal-box { background: var(--wood-bg); padding: 18px; border: 2.5px solid var(--wood-ink); }
        .rubric-comparison-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 600px) { .rubric-comparison-grid { grid-template-columns: 1fr; } }
        
        .rubric-column { display: flex; flex-direction: column; gap: 4px; }
        .user-response-quote { background: var(--wood-card); padding: 10px; border-left: 3px dashed var(--wood-ink-muted); margin: 0; font-style: italic; line-height: 1.4; }
        .sample-response-quote { background: var(--wood-card); padding: 10px; border-left: 3px solid var(--wood-primary); margin: 0; line-height: 1.4; }
        
        .self-grade-buttons { display: flex; flex-direction: column; gap: 10px; align-items: center; }
        .grade-btn {
          width: 80%;
          max-width: 400px;
          padding: 8px 12px;
          border: 2px solid var(--wood-ink);
          font-family: var(--heading);
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.2s;
        }
        .grade-btn:hover { transform: translateY(-2px); box-shadow: 2px 2px 0 var(--wood-ink); }
        
        .bg-sage { background: var(--wood-sage); }
        .bg-yellow { background: #FFF9C4; }
        .bg-pink { background: #FFEBEE; }
        
        .explanation-box { background: #FFFDE7; padding: 16px; position: relative; }
        .explain-label { position: absolute; top: -15px; left: 16px; background: var(--wood-card); border: 1.5px solid var(--wood-ink); padding: 2px 8px; font-size: 16px; }
        .explain-text { font-size: 14px; color: var(--wood-ink); line-height: 1.5; margin-top: 4px; }
        .next-btn { align-self: flex-end; }
        .self-end { align-self: flex-end; }
      `}</style>
    </div>
  );
}
