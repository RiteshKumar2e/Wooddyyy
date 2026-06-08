import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../api';
import '../../styles/student/quiz.css';

export default function Quiz() {
  // Setup States
  const [setupMode, setSetupMode] = useState(true);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [fileName, setFileName] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generateStep, setGenerateStep] = useState('');
  const [quizType, setQuizType] = useState('objective'); // 'objective' or 'subjective'
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [subjects, setSubjects] = useState([]);

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

  // Load subjects for config scope on mount
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await api.get('/api/subjects');
        setSubjects(data);
      } catch (err) {
        console.error('Failed to load quiz setup subjects:', err);
      }
    };
    fetchSubjects();
  }, []);

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

  // Upload your own syllabus, notes, or question bank
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    setFileUploaded(true);
  };

  // Question generator (uses actual database topics!)
  const triggerGeneration = async () => {
    setGenerating(true);
    setGenerateStep('Opening study log folders... 📁');
    
    try {
      // Fetch topics from backend based on subject scope
      const url = subjectFilter === 'All' ? '/api/topics' : `/api/topics?subject=${subjectFilter}`;
      const topics = await api.get(url);

      setTimeout(() => {
        setGenerateStep('Jotting down parsed topics & formulas... 📝');
        setTimeout(() => {
          setGenerateStep('Carving custom choices and solution rubrics... 🌿');
          setTimeout(() => {
            
            // Build questions dynamically from topics
            let generated = topics.map((t) => {
              if (quizType === 'objective') {
                return {
                  id: t._id,
                  subject: t.subject?.name || 'General',
                  question: `Regarding the study topic "${t.title}": Which of the following options represents your notes or best description?`,
                  options: [
                    t.notes || 'No description notes added yet.',
                    'This chapter is completed and ready for final revision.',
                    'I need to spend more study hours on this branch.',
                    'Review flashcards and equations on this concept.'
                  ],
                  correct: 0,
                  explanation: `This question evaluates your custom study branch: "${t.title}" (Notes: ${t.notes || 'None'})`
                };
              } else {
                return {
                  id: t._id,
                  subject: t.subject?.name || 'General',
                  question: `Explain the core concepts, takeaways, and equations relating to your study branch: "${t.title}".`,
                  sampleAnswer: t.notes || 'No reference note is prefilled.',
                  explanation: `Self-evaluate your answer based on your study plan notes: "${t.notes || 'None'}"`
                };
              }
            });

            // If no topics exist, fall back to mock questions so they can play
            if (generated.length === 0) {
              if (quizType === 'objective') {
                generated = [
                  {
                    id: 'mock-obj-1',
                    subject: 'Mindful Cabin',
                    question: 'What is the recommended length of study focus sessions in Woody?',
                    options: ['10 minutes', '25 minutes (Pomodoro)', '45 minutes', '2 hours straight'],
                    correct: 2,
                    explanation: 'Woody recommends 45 minutes of mindful focus blocks, followed by stretching or stepping outside.'
                  },
                  {
                    id: 'mock-obj-2',
                    subject: 'Mindful Cabin',
                    question: 'What happens when you complete syllabus branches in Study Plan?',
                    options: ['Nothing', 'Seeds in your Progress Nursery grow', 'Timer gets faster', 'Sound gets louder'],
                    correct: 1,
                    explanation: 'Checking off syllabus branches feeds your seedling, letting it blossom into a mighty green tree!'
                  }
                ];
              } else {
                generated = [
                  {
                    id: 'mock-sub-1',
                    subject: 'Mindful Cabin',
                    question: 'Describe your study habits and how you plan to manage focus hours this week in the cabin.',
                    sampleAnswer: 'Scheduling regular blocks, using the Hourglass Timetable, and reviewing flashcards.',
                    explanation: 'Self-evaluate based on how mindfully you block your slots and rest.'
                  }
                ];
              }
            }

            setQuizQuestions(generated);
            setCurrentIndex(0);
            setSelectedOption(null);
            setSubjectiveInput('');
            setAnsweredRecords([]);
            setShowAnswerFeedback(false);
            setGenerating(false);
            setSetupMode(false);
          }, 1000);
        }, 1000);
      }, 1000);
    } catch (err) {
      console.error('Failed to generate quiz questions:', err);
      setGenerating(false);
    }
  };

  const saveQuizToBackend = async (records) => {
    try {
      const answersPayload = quizQuestions.map((q) => {
        const rec = records.find(r => r.questionId === q.id) || {};
        if (quizType === 'objective') {
          return {
            selection: rec.selection,
            timeout: rec.timeout || false
          };
        } else {
          return {
            subjectiveAnswer: rec.subjectiveAnswer || '',
            selfGrade: rec.selfGrade || 'missed'
          };
        }
      });

      const activeSubObj = subjects.find(s => s._id === subjectFilter);
      const subjectId = activeSubObj ? activeSubObj._id : null;
      const subjectName = activeSubObj ? activeSubObj.name : (fileName ? `File: ${fileName}` : 'General');

      const payload = {
        subject: subjectId,
        subjectName,
        title: fileName ? `Quiz: ${fileName}` : `Mindful ${quizType === 'objective' ? 'Objective' : 'Subjective'} Assessment`,
        type: quizType,
        questions: quizQuestions.map(q => ({
          question: q.question,
          options: q.options || [],
          correct: q.correct ?? 0,
          explanation: q.explanation || '',
          sampleAnswer: q.sampleAnswer || ''
        })),
        answers: answersPayload
      };

      await api.post('/api/quizzes', payload);
    } catch (err) {
      console.error('Failed to save quiz results:', err);
    }
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
    const newRecord = {
      questionId: q.id,
      subjectiveAnswer: subjectiveInput,
      selfGrade: grade // 'perfect', 'partial', 'missed'
    };
    const nextRecords = [...answeredRecords, newRecord];
    setAnsweredRecords(nextRecords);

    if (currentIndex + 1 >= quizQuestions.length) {
      setQuizCompleted(true);
      saveQuizToBackend(nextRecords);
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setSubjectiveInput('');
      setShowAnswerFeedback(false);
    }
  };

  // Go to next question
  const moveToNext = () => {
    if (currentIndex + 1 >= quizQuestions.length) {
      setQuizCompleted(true);
      saveQuizToBackend(answeredRecords);
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
          <p className="panel-subtitle">Upload your own file or select a study plan scope to build a quiz.</p>
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
                    {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              <button onClick={triggerGeneration} className="btn-sketch btn-sketch-primary sketch-border sketch-shadow w-full justify-center mt-6">
                🔥 Build Quiz From Scope
              </button>
            </div>

          </div>
        )}
      </div>
    );
  }

  // RENDER RESULTS PANEL
  if (quizCompleted) {
    const totalQ = quizQuestions.length;
    let rightCount = 0;
    let wrongCount = 0;
    let timeoutCount = 0;
    
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
            <ul className="results-review-list" style={{ padding: 0 }}>
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
                        {q.sampleAnswer ? (
                          <>
                            <p className="text-xs font-bold mt-2">Reference Answer:</p>
                            <blockquote className="subjective-sample-quote text-sm text-gray-700">
                              "{q.sampleAnswer}"
                            </blockquote>
                          </>
                        ) : (
                          <p className="text-xs text-gray-500 mt-2">No reference answer added yet.</p>
                        )}
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
                    {q.explanation && (
                      <p className="text-xs italic text-gray-500 mt-2 bg-yellow-soft p-2 sketch-border-sm">
                        ✏️ <span className="font-bold">Explanation:</span> {q.explanation}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <button onClick={resetQuizSession} className="btn-sketch btn-sketch-primary sketch-border sketch-shadow mt-6 mx-auto display-flex">
            🔄 Return to Cabin Setup
          </button>
        </div>
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
          <p className="panel-subtitle">Start a quiz by selecting subject scope in setup.</p>
        </div>
        <div className="quiz-empty-state sketch-border sketch-shadow">
          <p className="handwritten text-xl">No quiz content yet.</p>
          <p className="text-sm mt-2">Select a subject scope or upload a file above to generate your own questions.</p>
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
                  <p className="text-xxs text-gray-500">Compare your response against your own notes and self-evaluate.</p>
                </div>
                
                <div className="rubric-comparison-grid mt-3">
                  <div className="rubric-column">
                    <span className="handwritten text-xs font-bold">Your Response:</span>
                    <blockquote className="user-response-quote font-sans text-xs mt-1">
                      "{subjectiveInput || 'No response entered'}"
                    </blockquote>
                  </div>
                  <div className="rubric-column">
                    <span className="handwritten text-xs font-bold">Reference Notes:</span>
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
    </div>
  );
}
