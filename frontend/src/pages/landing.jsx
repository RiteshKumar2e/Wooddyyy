import React, { useState } from 'react';

export default function Landing() {
  // Mini Interactive Widget States
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Carve out Study Plan for Biology', completed: false, category: 'study' },
    { id: 2, text: 'Draft 5 paper trial quizzes in Math', completed: true, category: 'quiz' },
    { id: 3, text: 'Plan afternoon focus hour on Physics', completed: false, category: 'timetable' },
    { id: 4, text: 'Review revision keywords', completed: false, category: 'revision' }
  ]);
  const [inputText, setInputText] = useState('');
  const [noteContent, setNoteContent] = useState('Keep it slow. Focus is a seedling that needs watering everyday. 🌸');
  const [noteType, setNoteType] = useState('yellow'); // yellow, pink, green

  // Active Desk Elements (for hover/click states)
  const [isWatered, setIsWatered] = useState(false);
  const [teaSips, setTeaSips] = useState(3);
  const [hourlySand, setHourlySand] = useState(100); // percentage of sand in bottom

  // Handle tasks
  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setTasks([...tasks, {
      id: Date.now(),
      text: inputText,
      completed: false,
      category: 'study'
    }]);
    setInputText('');
  };

  const waterPlant = () => {
    setIsWatered(true);
    setTimeout(() => setIsWatered(false), 2500);
  };

  const drinkTea = () => {
    if (teaSips > 0) setTeaSips(teaSips - 1);
  };

  const refillTea = () => setTeaSips(3);

  const flipHourglass = () => {
    setHourlySand(0);
    // Simulating sand falling
    let current = 0;
    const interval = setInterval(() => {
      current += 10;
      if (current >= 100) {
        setHourlySand(100);
        clearInterval(interval);
      } else {
        setHourlySand(current);
      }
    }, 150);
  };

  // Percentage of completed tasks for desk plant growth
  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100) || 0;

  return (
    <div className="landing-page">
      {/* 1. HERO SECTION */}
      <section className="hero-section" id="home">
        <div className="hero-content">
          <div className="tag-container">
            <span className="organic-tag sketch-border-sm">
              🌱 Natural Productivity
            </span>
          </div>

          <h1 className="hero-title">
            A Cozy Space to <span className="highlight-text">Plan</span>, Learn, and <span className="highlight-text-green">Grow</span>.
            {/* Custom SVG Highlight Loop under title */}
            <svg className="svg-scribble-line" width="320" height="15" viewBox="0 0 320 15" fill="none">
              <path d="M5 10C80 4 160 3 315 11C230 13 130 9 10 13" stroke="#E6A817" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </h1>

          <p className="hero-subtitle">
            Say goodbye to cold, robotic, notification-heavy dashboards. <strong>woodyy</strong> is a mindful digital study cabinet crafted with warm wood rings, hand-drawn planners, tactile quizzes, and revision branches designed to make focus feel organic and calming.
          </p>

          <div className="hero-actions">
            <div className="cta-group">
              <a href="#register" className="btn-sketch btn-sketch-primary sketch-border sketch-shadow hero-main-btn">
                <span>Craft Your Workspace</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
                </svg>
              </a>
              <span className="cta-arrow-note handwritten">
                <svg width="40" height="40" viewBox="0 0 50 50" fill="none" className="arrow-svg">
                  <path d="M10 10C20 15 35 15 40 30M40 30L32 28M40 30L38 20" stroke="#2D2C24" strokeWidth="2" strokeLinecap="round" />
                </svg>
                carve your path!
              </span>
            </div>
            <a href="#demo" className="btn-sketch sketch-border sketch-shadow hero-sub-btn">
              <span>Try Interactive Desk</span>
            </a>
          </div>
        </div>

        {/* 2. THE TACTILE STUDY DESK PREVIEW (STYLISH CSS & SVG) */}
        <div className="desk-showcase-container">
          <div className="desk-board sketch-border">
            {/* Desk Backboard Grid Lines */}
            <div className="desk-grid"></div>

            {/* Pinned Polaroid Photo (Handmade Visual) */}
            <div className="pinned-polaroid sketch-border-sm">
              <div className="polaroid-image">
                {/* Custom SVG Sketch of a small cozy forest path */}
                <svg width="100%" height="100%" viewBox="0 0 100 80" fill="none">
                  <rect width="100" height="80" fill="#E8F3D6" />
                  <path d="M10 80C25 50 35 30 50 30C65 30 75 50 90 80" fill="#FDF2CC" stroke="#2D2C24" strokeWidth="2" />
                  <path d="M30 80C40 65 45 55 55 55C65 55 70 65 80 80" fill="#F7E7D9" stroke="#2D2C24" strokeWidth="1.5" />
                  {/* Puffy clouds */}
                  <path d="M20 20C22 17 28 17 30 20C32 20 35 22 34 25C30 27 15 27 20 20Z" fill="#FFFDF9" stroke="#2D2C24" strokeWidth="1.5" />
                  <path d="M70 15C72 12 78 12 80 15C82 15 85 17 84 20C80 22 65 22 70 15Z" fill="#FFFDF9" stroke="#2D2C24" strokeWidth="1.5" />
                  <circle cx="50" cy="15" r="5" fill="#E6A817" stroke="#2D2C24" strokeWidth="1.5" />
                </svg>
              </div>
              <p className="polaroid-text handwritten">Quiet Workspace</p>
              <div className="polaroid-pin">📌</div>
            </div>

            {/* 2A. AN ACTIVE COZY SHELF */}
            <div className="desk-shelf">
              <div className="shelf-plank"></div>
              {/* Books on the shelf */}
              <div className="shelf-books">
                <div className="book book-1 sketch-border-sm" title="Study planner notebook">
                  <span className="book-spine">BIO</span>
                </div>
                <div className="book book-2 sketch-border-sm" title="Quiz compiler">
                  <span className="book-spine">MATH</span>
                </div>
                <div className="book book-3 sketch-border-sm" title="Revision notes">
                  <span className="book-spine">CHEM</span>
                </div>
                <div className="book book-4 sketch-border-sm" title="Growth records">
                  <span className="book-spine">HIST</span>
                </div>
              </div>

              {/* Wooden Hourglass (Mindful block scheduler indicator) */}
              <div className="hourglass-widget" onClick={flipHourglass} title="Click to flip Hourglass!">
                <svg width="34" height="48" viewBox="0 0 34 48" fill="none">
                  {/* Top & Bottom bases */}
                  <rect x="2" y="1" width="30" height="4" rx="2" fill="#E6A817" stroke="#2D2C24" strokeWidth="2" />
                  <rect x="2" y="43" width="30" height="4" rx="2" fill="#E6A817" stroke="#2D2C24" strokeWidth="2" />
                  {/* Glass bulbs */}
                  <path d="M5 5C5 18 16 23 16 24C16 25 5 30 5 43H29C29 30 18 25 18 24C18 23 29 18 29 5H5Z" fill="rgba(255,253,249,0.5)" stroke="#2D2C24" strokeWidth="2" />
                  {/* Sand falling simulation */}
                  {hourlySand > 0 && (
                    <>
                      {/* Top sand bulb */}
                      <path d={`M7 6C8 14 ${34 - 8} 14 27 6`} fill="#FDF2CC" stroke="#2D2C24" strokeWidth="1.5" style={{ opacity: hourlySand < 100 ? 0.6 : 1 }} />
                      {/* Bottom sand pile */}
                      <path d="M8 42C10 38 24 38 26 42H8Z" fill="#FDF2CC" stroke="#2D2C24" strokeWidth="1.5" />
                      {/* Sand trickle line */}
                      <line x1="17" y1="20" x2="17" y2="40" stroke="#E6A817" strokeWidth="2" strokeDasharray="3 3" />
                    </>
                  )}
                </svg>
                <span className="hourglass-tooltip handwritten">Click to Focus!</span>
              </div>
            </div>

            {/* 2B. COZY TEA CUP & STEAM */}
            <div className="tea-cup-widget" onClick={drinkTea} title="Click to take a sip of cozy tea!">
              <div className="cup-steam">
                {teaSips > 0 && (
                  <>
                    <span className="steam-line steam-1">~</span>
                    <span className="steam-line steam-2">~</span>
                    <span className="steam-line steam-3">~</span>
                  </>
                )}
              </div>
              <svg width="45" height="34" viewBox="0 0 45 34" fill="none">
                {/* Tea Liquid level based on sips */}
                <path d="M4 10C4 22 10 30 20 30C30 30 36 22 36 10H4Z" fill={teaSips === 3 ? '#E6A817' : teaSips === 2 ? '#FDF2CC' : teaSips === 1 ? '#FFFDF9' : 'transparent'} stroke="#2D2C24" strokeWidth="2.5" />
                {/* Cup handle */}
                <path d="M36 10C41 10 43 14 43 17C43 20 41 23 36 23" stroke="#2D2C24" strokeWidth="2.5" strokeLinecap="round" />
                {/* Saucer plate */}
                <path d="M1 32H39" stroke="#2D2C24" strokeWidth="3" strokeLinecap="round" />
              </svg>
              {teaSips === 0 ? (
                <span className="tea-bubble handwritten" onClick={(e) => { e.stopPropagation(); refillTea(); }}>Refill ☕</span>
              ) : (
                <span className="tea-bubble text-xs">Sips: {teaSips}</span>
              )}
            </div>

            {/* 2C. SPROUTING SEEDLING IN POT (Reacts to task completion) */}
            <div className="plant-widget" onClick={waterPlant} title="Click to water the seedling!">
              <div className="plant-pot">
                {/* Pot */}
                <svg width="40" height="30" viewBox="0 0 40 30" fill="none">
                  <path d="M4 1L36 1L32 29L8 29L4 1Z" fill="#F7E7D9" stroke="#2D2C24" strokeWidth="2.5" />
                  <line x1="2" y1="5" x2="38" y2="5" stroke="#2D2C24" strokeWidth="2" />
                </svg>
              </div>

              {/* Plant leaves that grow based on progressPercent */}
              <div className="plant-stem-container">
                <svg width="60" height="70" viewBox="0 0 60 70" fill="none" className="plant-svg">
                  {/* Stem */}
                  <path d="M30 70C30 50 28 35 30 15" stroke="#2C5E3B" strokeWidth="3.5" strokeLinecap="round" />

                  {/* Leaf Level 1 (Always visible, small sprout) */}
                  <path d="M30 50C20 45 12 45 10 48C8 51 14 55 30 53" fill="#E8F3D6" stroke="#2D2C24" strokeWidth="2" />

                  {/* Leaf Level 2 (Grows if progress > 25%) */}
                  {progressPercent >= 25 && (
                    <path d="M30 40C40 35 48 35 50 38C52 41 46 45 30 43" fill="#A4D0A4" stroke="#2D2C24" strokeWidth="2" />
                  )}

                  {/* Leaf Level 3 (Grows if progress > 50%) */}
                  {progressPercent >= 50 && (
                    <path d="M28 28C15 22 10 16 12 12C14 8 22 18 28 26" fill="#88C088" stroke="#2D2C24" strokeWidth="2" />
                  )}

                  {/* Leaf Level 4 - Flowering Bud (Grows if progress > 75%) */}
                  {progressPercent >= 75 && (
                    <path d="M30 18C45 12 48 6 46 3C44 0 38 10 30 16" fill="#A4D0A4" stroke="#2D2C24" strokeWidth="2" />
                  )}

                  {/* Sprouted Flower Blossom! (Only if 100%) */}
                  {progressPercent === 100 && (
                    <g transform="translate(23, -5)">
                      <circle cx="7" cy="7" r="5" fill="#E6A817" stroke="#2D2C24" strokeWidth="1.5" />
                      <circle cx="7" cy="1" r="3" fill="#FFFDF9" stroke="#2D2C24" strokeWidth="1" />
                      <circle cx="1" cy="7" r="3" fill="#FFFDF9" stroke="#2D2C24" strokeWidth="1" />
                      <circle cx="13" cy="7" r="3" fill="#FFFDF9" stroke="#2D2C24" strokeWidth="1" />
                      <circle cx="7" cy="13" r="3" fill="#FFFDF9" stroke="#2D2C24" strokeWidth="1" />
                    </g>
                  )}
                </svg>
              </div>

              {/* Water droplet animations when watered */}
              {isWatered && (
                <div className="water-drops">
                  <span className="drop drop-1">💧</span>
                  <span className="drop drop-2">💧</span>
                  <span className="drop drop-3">💧</span>
                </div>
              )}

              <span className="plant-tag sketch-border-sm handwritten">Water me!</span>
            </div>

            {/* Open desk book with text display */}
            <div className="desk-notebook sketch-border-sm">
              <div className="notebook-binder"></div>
              <div className="notebook-page-left">
                <h4 className="notebook-h4">Woodyy Desk</h4>
                <p className="notebook-p">Interactive study objects react to your focus routine.</p>
                <div className="paper-doodle">
                  <svg width="70" height="20" viewBox="0 0 70 20" fill="none">
                    <path d="M2 15C10 5 25 4 35 15C45 5 58 5 68 15" stroke="#2D2C24" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
              <div className="notebook-page-right">
                <div className="flex flex-col h-full justify-between">
                  <div className="progress-desk-indicator">
                    <span className="font-bold text-sm">Growth Progress:</span>
                    <div className="desk-progress-bar sketch-border-sm">
                      <div className="desk-progress-fill" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                    <span className="text-xs font-bold text-center block mt-1">{progressPercent}% Completed</span>
                  </div>
                  <span className="text-xxs block text-right font-mono text-gray-500">Page 1 of 1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE FEATURES SHELF */}
      <section className="features-section" id="features">
        <div className="section-header">
          <h2 className="section-title">Carved For Slow & Mindful Learning</h2>
          <p className="section-subtitle">
            Every feature is hand-crafted with structured, organic wooden flows that reduce academic overwhelm and emphasize comprehension.
          </p>
        </div>

        <div className="features-grid">
          {/* Feature 1: Study Plan */}
          <div className="feature-card sketch-border sketch-shadow">
            <div className="feature-icon-wrapper bg-yellow">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"></path>
                <path d="M6 6h10"></path>
                <path d="M6 10h10"></path>
                <path d="M13 15h3"></path>
              </svg>
            </div>
            <h3 className="feature-card-title">1. Branching Study Plans</h3>
            <p className="feature-card-text">
              Carve your study subjects into digestible routes. Map out chapters, keywords, and reference materials that connect naturally like root branches.
            </p>
            <div className="feature-tag sketch-border-sm font-bold bg-cream">Woodwork Tree</div>
          </div>

          {/* Feature 2: Tactile Quizzes */}
          <div className="feature-card sketch-border sketch-shadow" id="quizzes">
            <div className="feature-icon-wrapper bg-clay">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="m9.09 9 1-1a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <h3 className="feature-card-title">2. Tactile Paper Trials</h3>
            <p className="feature-card-text">
              Create and tackle focused paper quizzes without timer panic. Perfect for self-evaluation, key concepts validation, and stress-free revision schedules.
            </p>
            <div className="feature-tag sketch-border-sm font-bold bg-cream">Parchment Tests</div>
          </div>

          {/* Feature 3: Mindful Timetable */}
          <div className="feature-card sketch-border sketch-shadow" id="timetable">
            <div className="feature-icon-wrapper bg-sky">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <h3 className="feature-card-title">3. Mindful Hourglass Scheduling</h3>
            <p className="feature-card-text">
              Plan your week in customizable focus blocks. No jarring alarm noises—just a peaceful visual hourglass tracking your morning and afternoon study routines.
            </p>
            <div className="feature-tag sketch-border-sm font-bold bg-cream">Sandglass Blocks</div>
          </div>

          {/* Feature 4: Nursery Progress Dashboard */}
          <div className="feature-card sketch-border sketch-shadow" id="progress">
            <div className="feature-icon-wrapper bg-green">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20"></path>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
            <h3 className="feature-card-title">4. Progress Nursery</h3>
            <p className="feature-card-text">
              Watch your subjects grow in a digital garden. When you complete quizzes and check off syllabus topics, your seedling branches out into a mighty green tree!
            </p>
            <div className="feature-tag sketch-border-sm font-bold bg-cream">Subject Sprouts</div>
          </div>
        </div>
      </section>

      {/* 4. TACTILE INTERACTIVE WORKSPACE WIDGET DEMO */}
      <section className="demo-section" id="how-it-works">
        <div className="demo-outer sketch-border sketch-shadow">
          <div className="demo-grid-split">
            {/* Left Column: Interactive Checkbox List & Plant Grow Demo */}
            <div className="demo-list-col">
              <div className="post-it-title-wrapper">
                <h3 className="demo-section-h3">Try the Interactive Desk Planner</h3>
                <p className="text-sm">Check off items to grow the wooden seedling and progress bar above!</p>
              </div>

              {/* Task Adding Input Form */}
              <form onSubmit={addTask} className="demo-form">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Carve a new task..."
                  className="demo-input sketch-border-sm"
                />
                <button type="submit" className="btn-sketch btn-sketch-primary sketch-border-sm sketch-shadow">
                  <span>Carve It</span>
                </button>
              </form>

              {/* Task List */}
              <div className="demo-task-list">
                {tasks.map(t => (
                  <div key={t.id} className={`demo-task-item sketch-border-sm ${t.completed ? 'completed' : ''}`} onClick={() => toggleTask(t.id)}>
                    <div className="demo-checkbox sketch-border-sm">
                      {t.completed && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6L5 9L10 3" stroke="#2D2C24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span className="task-text">{t.text}</span>
                    <span className="task-category-tag">{t.category}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Custom Pinned Handwritten Notes Widget */}
            <div className="demo-note-col">
              <h3 className="demo-section-h3 text-center">Interactive Sketch Note</h3>
              <p className="text-sm text-center mb-4">Draft a custom thought. Pin it in your workspace!</p>

              {/* Note Selector */}
              <div className="note-selector">
                <button onClick={() => setNoteType('yellow')} className={`note-tab-btn yellow ${noteType === 'yellow' ? 'active' : ''}`} title="Yellow paper"></button>
                <button onClick={() => setNoteType('pink')} className={`note-tab-btn pink ${noteType === 'pink' ? 'active' : ''}`} title="Pink paper"></button>
                <button onClick={() => setNoteType('green')} className={`note-tab-btn green ${noteType === 'green' ? 'active' : ''}`} title="Green paper"></button>
              </div>

              {/* Editable Pinned Post-It */}
              <div className={`post-it sketch-border-sm editable-post-it ${noteType}`}>
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="post-it-textarea handwritten"
                  maxLength={150}
                  placeholder="Jot down a slow, encouraging thought..."
                />
                <div className="post-it-charcount font-mono">{noteContent.length}/150</div>
              </div>

              <div className="note-doodle-hint handwritten text-center">
                ✨ Just type on the paper note above!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CORKBOARD POLAROID TESTIMONIALS */}
      <section className="testimonials-section" id="about">
        <div className="section-header">
          <span className="handwritten" style={{ fontSize: '32px' }}>What students are crafting...</span>
          <h2 className="section-title">Word from Pinned Desks</h2>
        </div>

        <div className="testimonials-corkboard sketch-border">
          {/* Corkboard texture patterns */}
          <div className="corkboard-grain"></div>

          {/* Testimonial Polaroid 1 */}
          <div className="polaroid-card card-rotate-left sketch-border-sm sketch-shadow">
            <div className="pushpin">📌</div>
            <div className="avatar-placeholder bg-yellow">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <p className="testimonial-text">
              "Building study plan roadmaps with woodyy feels like organizing my desk drawer. It is so visual, slow, and therapeutic. My study plants are thriving!"
            </p>
            <h4 className="student-name handwritten">- Aarav S., Biology Undergrad</h4>
          </div>

          {/* Testimonial Polaroid 2 */}
          <div className="polaroid-card card-rotate-right sketch-border-sm sketch-shadow">
            <div className="pushpin">📌</div>
            <div className="avatar-placeholder bg-green">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <p className="testimonial-text">
              "The tactile paper trials quizzes are so peaceful. No game timers flashing red or screeching points. Just peaceful learning at my own page rhythm."
            </p>
            <h4 className="student-name handwritten">- Kiara M., Prep Student</h4>
          </div>

          {/* Testimonial Polaroid 3 */}
          <div className="polaroid-card card-rotate-slightly sketch-border-sm sketch-shadow">
            <div className="pushpin">📌</div>
            <div className="avatar-placeholder bg-clay">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <p className="testimonial-text">
              "Having the hourglass blocks instead of harsh alarms is a complete mindset shift. I set my timetable, flip the sand glass, and sink into my chemistry books."
            </p>
            <h4 className="student-name handwritten">- Dev K., MCAT Candidate</h4>
          </div>
        </div>
      </section>

      {/* 6. COZY WOODBLOCK FOOTER */}
      <footer className="cozy-footer sketch-border" id="contact">
        <div className="footer-container">
          <div className="footer-brand-col">
            <div className="footer-logo">
              <svg width="28" height="28" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 3C9.7 3 3 8.4 3 15C3 21.6 9.7 27 18 27C26.3 27 33 21.6 33 15C33 8.4 26.3 3 18 3Z" stroke="#2D2C24" strokeWidth="2.5" fill="#FFFDF9" />
                <path d="M18 3.5V0" stroke="#2D2C24" strokeWidth="2" />
                <path d="M18 1.5C18.8 0.5 20 0 21 0" stroke="#2D2C24" strokeWidth="1.8" />
              </svg>
              <span className="font-bold">woodyy</span>
            </div>
            <p className="footer-desc text-xs mt-2">
              A calm, structure-focused learning cabinet. Carving beautiful routines, organic plans, and mindful progress records.
            </p>
            <div className="made-by-humans-badge sketch-border-sm handwritten">
              🎨 100% human-crafted CSS/SVG design
            </div>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-h4">Workspace</h4>
            <ul className="footer-links-list">
              <li><a href="#study-plan">Branching Plans</a></li>
              <li><a href="#quizzes">Parchment Quizzes</a></li>
              <li><a href="#timetable">Hourglass Blocks</a></li>
              <li><a href="#progress">Nursery dashboard</a></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-h4">Mindfulness</h4>
            <p className="text-xs">
              Take regular breaks, brew a warm cup of herbal tea, stretch, and step outside. Study is a journey of rings, like a growing tree trunk.
            </p>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <p className="text-xxs font-mono text-center">
            &copy; {new Date().getFullYear()} woodyy Planner Cabin. Hand-crafted in light yellowish theme. Keep carving knowledge slowly.
          </p>
        </div>
      </footer>

      {/* Embedded landing-specific Styles */}
      <style>{`
        .landing-page {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 60px;
          max-width: 100%;
          box-sizing: border-box;
        }

        /* 1. HERO SECTION */
        .hero-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: center;
          padding: 20px 0;
          @media (max-width: 1024px) {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 50px;
          }
        }

        .hero-content {
          display: flex;
          flex-direction: column;
          gap: 20px;
          align-items: flex-start;
          text-align: left;
          @media (max-width: 1024px) {
            align-items: center;
            text-align: center;
          }
        }

        .tag-container {
          display: inline-block;
        }

        .organic-tag {
          font-family: var(--heading);
          font-weight: 600;
          font-size: 14px;
          color: var(--wood-ink);
          background-color: var(--wood-accent);
          padding: 6px 14px;
          display: inline-flex;
        }

        .hero-title {
          font-size: 50px;
          line-height: 1.15;
          position: relative;
          color: var(--wood-ink);
          margin-bottom: 5px;
          @media (max-width: 768px) {
            font-size: 38px;
          }
        }

        .highlight-text {
          background-color: var(--wood-accent);
          padding: 0 8px;
          border-radius: 6px;
        }

        .highlight-text-green {
          background-color: var(--wood-sage);
          padding: 0 8px;
          border-radius: 6px;
        }

        .svg-scribble-line {
          position: absolute;
          bottom: -12px;
          left: 10px;
          @media (max-width: 1024px) {
            left: 50%;
            transform: translateX(-50%);
          }
        }

        .hero-subtitle {
          font-size: 18px;
          color: var(--wood-ink-muted);
          line-height: 1.6;
        }

        .hero-actions {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-top: 15px;
          flex-wrap: wrap;
          @media (max-width: 1024px) {
            justify-content: center;
            width: 100%;
          }
        }

        .cta-group {
          position: relative;
          display: flex;
          align-items: center;
        }

        .hero-main-btn {
          font-size: 18px;
          padding: 12px 28px;
        }

        .cta-arrow-note {
          position: absolute;
          left: 45px;
          bottom: -48px;
          font-size: 22px;
          display: flex;
          align-items: center;
          gap: 5px;
          color: var(--wood-ink-muted);
          white-space: nowrap;
        }

        .arrow-svg {
          transform: scaleY(-1) rotate(60deg) translateY(5px);
        }

        .hero-sub-btn {
          font-size: 18px;
          padding: 12px 24px;
          background-color: var(--wood-card);
        }

        /* 2. THE TACTILE STUDY DESK PREVIEW */
        .desk-showcase-container {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .desk-board {
          position: relative;
          width: 530px;
          height: 380px;
          background-color: #FAF6E9; /* cream wooden board texture */
          box-shadow: 6px 6px 0px var(--wood-ink);
          overflow: hidden;
          padding: 20px;
          max-width: 100%;
          @media (max-width: 560px) {
            height: 420px;
          }
        }

        .desk-grid {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(45, 44, 36, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(45, 44, 36, 0.04) 1px, transparent 1px);
          background-size: 30px 30px;
          pointer-events: none;
        }

        /* Pinned Polaroid */
        .pinned-polaroid {
          position: absolute;
          top: 15px;
          right: 25px;
          width: 130px;
          background-color: var(--wood-card);
          padding: 8px;
          box-shadow: 2px 2px 0px var(--wood-ink);
          z-index: 10;
        }

        .polaroid-image {
          width: 114px;
          height: 90px;
          border: 1.5px solid var(--wood-ink);
          overflow: hidden;
        }

        .polaroid-text {
          font-size: 15px;
          text-align: center;
          margin-top: 6px;
          color: var(--wood-ink);
        }

        .polaroid-pin {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 20px;
          cursor: pointer;
        }

        /* Active Shelf Plank */
        .desk-shelf {
          position: absolute;
          left: 25px;
          top: 130px;
          width: 320px;
          height: 60px;
          z-index: 5;
        }

        .shelf-plank {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 12px;
          background-color: var(--wood-accent);
          border: 2px solid var(--wood-ink);
          border-radius: 4px;
          box-shadow: 0px 3px 0px rgba(45,44,36,0.15);
        }

        .shelf-books {
          position: absolute;
          bottom: 12px;
          left: 20px;
          display: flex;
          gap: 4px;
          align-items: flex-end;
        }

        .book {
          width: 20px;
          height: 65px;
          color: var(--wood-ink);
          font-family: var(--heading);
          font-weight: 700;
          font-size: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 1px -1px 0px var(--wood-ink);
        }

        .book:hover {
          transform: translateY(-8px) rotate(-5deg);
        }

        .book-1 { height: 75px; background-color: var(--wood-accent); }
        .book-2 { height: 60px; background-color: var(--wood-sage); }
        .book-3 { height: 70px; background-color: var(--wood-clay); }
        .book-4 { height: 65px; background-color: var(--wood-sky); }

        .book-spine {
          transform: rotate(-90deg);
          white-space: nowrap;
        }

        .hourglass-widget {
          position: absolute;
          bottom: 12px;
          right: 35px;
          cursor: pointer;
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .hourglass-widget:hover {
          transform: rotate(180deg);
        }

        .hourglass-tooltip {
          position: absolute;
          top: -24px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 16px;
          width: 90px;
          text-align: center;
          opacity: 0;
          transition: opacity 0.2s;
          pointer-events: none;
        }

        .hourglass-widget:hover .hourglass-tooltip {
          opacity: 1;
        }

        /* Tea Cup Widget */
        .tea-cup-widget {
          position: absolute;
          bottom: 15px;
          left: 30px;
          cursor: pointer;
          z-index: 8;
          transition: transform 0.2s;
        }

        .tea-cup-widget:hover {
          transform: scale(1.05);
        }

        .cup-steam {
          position: absolute;
          top: -15px;
          left: 12px;
          display: flex;
          gap: 4px;
        }

        .steam-line {
          font-family: monospace;
          color: var(--wood-ink-muted);
          font-size: 16px;
          display: inline-block;
          animation: floatSteam 2s infinite ease-in-out;
        }

        .steam-2 { animation-delay: 0.4s; }
        .steam-3 { animation-delay: 0.8s; }

        @keyframes floatSteam {
          0% { transform: translateY(0px) scale(0.8); opacity: 0; }
          50% { opacity: 0.7; }
          100% { transform: translateY(-12px) scale(1.2); opacity: 0; }
        }

        .tea-bubble {
          position: absolute;
          top: -20px;
          right: -25px;
          background-color: var(--wood-card);
          border: 1.5px solid var(--wood-ink);
          border-radius: 6px;
          padding: 2px 6px;
          font-size: 12px;
          white-space: nowrap;
          box-shadow: 1px 1px 0px var(--wood-ink);
        }

        /* Sprouting Seedling Plant Pot */
        .plant-widget {
          position: absolute;
          bottom: 15px;
          right: 35px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 8;
        }

        .plant-pot {
          position: relative;
          z-index: 5;
        }

        .plant-stem-container {
          position: absolute;
          bottom: 24px;
          z-index: 2;
        }

        .plant-svg {
          filter: drop-shadow(1px 1px 0px var(--wood-ink));
        }

        .water-drops {
          position: absolute;
          top: -30px;
          display: flex;
          gap: 6px;
        }

        .drop {
          font-size: 14px;
          animation: dropFall 0.8s infinite linear;
        }

        .drop-2 { animation-delay: 0.2s; }
        .drop-3 { animation-delay: 0.4s; }

        @keyframes dropFall {
          0% { transform: translateY(-20px); opacity: 0; }
          30% { opacity: 1; }
          100% { transform: translateY(15px); opacity: 0; }
        }

        .plant-tag {
          position: absolute;
          bottom: -22px;
          font-size: 18px;
          color: var(--wood-ink-muted);
          opacity: 0;
          transition: opacity 0.2s;
          pointer-events: none;
          white-space: nowrap;
        }

        .plant-widget:hover .plant-tag {
          opacity: 1;
        }

        /* Desk Open Notebook */
        .desk-notebook {
          position: absolute;
          bottom: 30px;
          left: 110px;
          width: 250px;
          height: 130px;
          background-color: var(--wood-card);
          box-shadow: 2px 2px 0px var(--wood-ink);
          z-index: 6;
          display: grid;
          grid-template-columns: 1fr 1fr;
          padding: 8px 12px;
          gap: 12px;
          transform: rotate(-1deg);
          box-sizing: border-box;
        }

        .notebook-binder {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 6px;
          border-left: 2px dashed rgba(45, 44, 36, 0.2);
          border-right: 2px dashed rgba(45, 44, 36, 0.2);
        }

        .notebook-h4 {
          font-size: 13px;
          margin-bottom: 2px;
          letter-spacing: -0.2px;
        }

        .notebook-p {
          font-size: 9px;
          line-height: 1.3;
          color: var(--wood-ink-muted);
        }

        .paper-doodle {
          margin-top: 5px;
          opacity: 0.6;
        }

        .progress-desk-indicator {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .desk-progress-bar {
          height: 10px;
          background-color: var(--wood-bg);
          overflow: hidden;
          width: 100%;
        }

        .desk-progress-fill {
          height: 100%;
          background-color: var(--wood-primary);
          transition: width 0.4s ease;
        }

        .text-xxs {
          font-size: 8px;
        }

        /* 3. CORE FEATURES SHELF */
        .features-section {
          padding: 20px 0;
        }

        .section-header {
          text-align: center;
          max-width: 650px;
          margin: 0 auto 40px;
        }

        .section-title {
          font-size: 34px;
          margin-bottom: 12px;
          letter-spacing: -0.5px;
        }

        .section-subtitle {
          font-size: 16px;
          color: var(--wood-ink-muted);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 28px;
        }

        .feature-card {
          background-color: var(--wood-card);
          padding: 28px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 15px;
          box-shadow: var(--wood-shadow);
        }

        .feature-icon-wrapper {
          width: 54px;
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--wood-ink);
          border-radius: 12px;
          color: var(--wood-ink);
        }

        .feature-icon-wrapper.bg-yellow { background-color: var(--wood-accent); }
        .feature-icon-wrapper.bg-clay { background-color: var(--wood-clay); }
        .feature-icon-wrapper.bg-sky { background-color: var(--wood-sky); }
        .feature-icon-wrapper.bg-green { background-color: var(--wood-sage); }

        .feature-card-title {
          font-size: 20px;
          margin-bottom: 2px;
        }

        .feature-card-text {
          font-size: 14.5px;
          line-height: 1.5;
          color: var(--wood-ink-muted);
        }

        .feature-tag {
          font-size: 12px;
          padding: 4px 10px;
          margin-top: auto;
          color: var(--wood-ink);
        }

        .bg-cream {
          background-color: var(--wood-bg);
        }

        /* 4. TACTILE INTERACTIVE WORKSPACE WIDGET DEMO */
        .demo-section {
          padding: 10px 0;
        }

        .demo-outer {
          background-color: #FAF7EA;
          padding: 36px;
          box-shadow: var(--wood-shadow);
          @media (max-width: 768px) {
            padding: 20px;
          }
        }

        .demo-grid-split {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 40px;
          @media (max-width: 900px) {
            grid-template-columns: 1fr;
            gap: 30px;
          }
        }

        .demo-list-col {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .post-it-title-wrapper {
          border-bottom: 2px dashed var(--wood-border-light);
          padding-bottom: 12px;
        }

        .demo-section-h3 {
          font-size: 24px;
          margin-bottom: 4px;
        }

        .demo-form {
          display: flex;
          gap: 12px;
          width: 100%;
        }

        .demo-input {
          flex: 1;
          padding: 10px 16px;
          font-family: var(--sans);
          font-size: 15px;
          background-color: var(--wood-card);
          color: var(--wood-ink);
          outline: none;
        }

        .demo-input:focus {
          border-color: var(--wood-primary) !important;
          background-color: #FFFDF5;
        }

        .demo-task-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: 250px;
          overflow-y: auto;
          padding-right: 5px;
        }

        .demo-task-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background-color: var(--wood-card);
          cursor: pointer;
          transition: all 0.2s;
        }

        .demo-task-item:hover {
          background-color: #FFFDF0;
          transform: translateX(3px);
        }

        .demo-checkbox {
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background-color: var(--wood-bg);
        }

        .demo-task-item.completed {
          opacity: 0.65;
        }

        .demo-task-item.completed .task-text {
          text-decoration: line-through;
          color: var(--wood-ink-muted);
        }

        .task-text {
          font-family: var(--heading);
          font-weight: 500;
          font-size: 15px;
          flex-grow: 1;
        }

        .task-category-tag {
          font-size: 11px;
          padding: 2px 8px;
          background-color: var(--wood-accent);
          border-radius: 6px;
          text-transform: capitalize;
          font-weight: bold;
        }

        .demo-note-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .note-selector {
          display: flex;
          gap: 10px;
          margin-bottom: 12px;
        }

        .note-tab-btn {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 1.5px solid var(--wood-ink);
          cursor: pointer;
          transition: transform 0.2s;
        }

        .note-tab-btn:hover {
          transform: scale(1.15);
        }

        .note-tab-btn.active {
          transform: scale(1.15);
          box-shadow: 0 0 0 2px var(--wood-ink);
        }

        .note-tab-btn.yellow { background-color: var(--note-yellow); }
        .note-tab-btn.pink { background-color: var(--note-pink); }
        .note-tab-btn.green { background-color: var(--note-green); }

        .editable-post-it {
          width: 100%;
          height: 200px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 24px 20px 12px;
          box-sizing: border-box;
          transform: rotate(1deg);
        }

        .editable-post-it.yellow { background-color: var(--note-yellow); }
        .editable-post-it.pink { background-color: var(--note-pink); }
        .editable-post-it.green { background-color: var(--note-green); }

        .post-it-textarea {
          width: 100%;
          height: 80%;
          background: transparent;
          border: none;
          outline: none;
          resize: none;
          font-size: 24px;
          line-height: 1.25;
          color: #333;
        }

        .post-it-charcount {
          font-size: 11px;
          text-align: right;
          opacity: 0.5;
        }

        .note-doodle-hint {
          font-size: 20px;
          color: var(--wood-ink-muted);
          margin-top: 15px;
        }

        /* 5. CORKBOARD POLAROID TESTIMONIALS */
        .testimonials-section {
          padding: 20px 0;
        }

        .testimonials-corkboard {
          position: relative;
          background-color: #E2CEAD; /* cork board color */
          padding: 50px 30px;
          box-shadow: inset 0 0 20px rgba(0,0,0,0.1), var(--wood-shadow);
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 40px;
          overflow: hidden;
          min-height: 320px;
        }

        .corkboard-grain {
          position: absolute;
          inset: 0;
          opacity: 0.15;
          background-image: 
            radial-gradient(#5C4D37 1px, transparent 0),
            radial-gradient(#5C4D37 1px, transparent 0);
          background-size: 8px 8px;
          background-position: 0 0, 4px 4px;
          pointer-events: none;
        }

        .polaroid-card {
          background-color: var(--wood-card);
          padding: 24px 20px 15px;
          box-shadow: 3px 6px 12px rgba(45,44,36,0.15);
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 12px;
          box-sizing: border-box;
        }

        .pushpin {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 24px;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .polaroid-card:hover .pushpin {
          transform: translateX(-50%) rotate(10deg) scale(1.1);
        }

        .card-rotate-left { transform: rotate(-3deg); }
        .card-rotate-right { transform: rotate(2.5deg); }
        .card-rotate-slightly { transform: rotate(-1deg); }

        .polaroid-card:hover {
          transform: rotate(0deg) scale(1.03);
          z-index: 20;
        }

        .avatar-placeholder {
          width: 44px;
          height: 44px;
          border: 2px solid var(--wood-ink);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--wood-ink);
        }

        .avatar-placeholder.bg-yellow { background-color: var(--wood-accent); }
        .avatar-placeholder.bg-green { background-color: var(--wood-sage); }
        .avatar-placeholder.bg-clay { background-color: var(--wood-clay); }

        .testimonial-text {
          font-size: 14.5px;
          line-height: 1.5;
          color: var(--wood-ink);
          font-style: italic;
        }

        .student-name {
          font-size: 20px;
          color: var(--wood-primary);
          text-align: right;
          margin-top: auto;
        }

        /* 6. COZY FOOTER */
        .cozy-footer {
          background-color: #FAF7EA;
          padding: 40px 40px 20px;
          box-shadow: var(--wood-shadow);
          margin-top: 20px;
          @media (max-width: 768px) {
            padding: 30px 20px 15px;
          }
        }

        .footer-container {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr;
          gap: 40px;
          @media (max-width: 768px) {
            grid-template-columns: 1fr;
            gap: 30px;
          }
        }

        .footer-brand-col {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--heading);
          font-size: 22px;
          color: var(--wood-ink);
        }

        .footer-desc {
          color: var(--wood-ink-muted);
          line-height: 1.5;
        }

        .made-by-humans-badge {
          background-color: var(--wood-card);
          padding: 6px 12px;
          font-size: 18px;
          color: var(--wood-ink-muted);
          margin-top: 10px;
        }

        .footer-links-col {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .footer-h4 {
          font-size: 18px;
          letter-spacing: -0.2px;
          border-bottom: 2px dashed var(--wood-border-light);
          padding-bottom: 5px;
          display: inline-block;
          align-self: flex-start;
        }

        .footer-links-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .footer-links-list a {
          font-family: var(--heading);
          font-size: 15px;
          color: var(--wood-ink-muted);
        }

        .footer-links-list a:hover {
          color: var(--wood-ink);
          padding-left: 5px;
        }

        .footer-divider {
          height: 2px;
          border-bottom: 2px dashed var(--wood-border-light);
          margin: 30px 0 15px;
        }

        .footer-bottom {
          color: var(--wood-ink-muted);
        }
      `}</style>
    </div>
  );
}
