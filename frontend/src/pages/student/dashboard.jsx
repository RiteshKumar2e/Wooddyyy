import React, { useEffect, useState } from 'react';
import WelcomeCard from './welcome-card.jsx';
import Summary from './summary.jsx';
import StudyPlan from './study-plan.jsx';
import Revision from './revision.jsx';
import Quiz from './quiz.jsx';
import ProgressChart from './progress-chart.jsx';
import ExamPrepStrat from './exam-prep-strat.jsx';
import TimeTable from './time-table.jsx';
import Profile from './profile.jsx';

const defaultProfile = {
  fullName: '',
  email: '',
  phone: '',
  goal: '',
  timezone: '',
};

const navItems = [
  { id: 'welcome',  label: 'Welcome',            icon: '🏠', emoji: true },
  { id: 'summary',  label: 'Summary',             icon: '📋', emoji: true },
  { id: 'studyplan',label: 'Study Plan',          icon: '🗺️', emoji: true },
  { id: 'revision', label: 'Revision',            icon: '🔁', emoji: true },
  { id: 'quiz',     label: 'Quiz',                icon: '📝', emoji: true },
  { id: 'progress', label: 'Progress Chart',      icon: '📊', emoji: true },
  { id: 'examprep', label: 'Exam Prep Strategy',  icon: '🏆', emoji: true },
  { id: 'timetable',label: 'Timetable',           icon: '⏰', emoji: true },
  { id: 'profile',  label: 'Profile',            icon: '👤', emoji: true },
];

const componentMap = {
  welcome:   <WelcomeCard userName="Woody" />,
  summary:   <Summary />,
  studyplan: <StudyPlan />,
  revision:  <Revision />,
  quiz:      <Quiz />,
  progress:  <ProgressChart />,
  examprep:  <ExamPrepStrat />,
  timetable: <TimeTable />,
};

export default function Dashboard() {
  const [active, setActive] = useState('welcome');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profile, setProfile] = useState(defaultProfile);

  useEffect(() => {
    try {
      const storedProfile = window.localStorage.getItem('woody-profile');
      if (storedProfile) {
        setProfile({ ...defaultProfile, ...JSON.parse(storedProfile) });
      }
    } catch {
      setProfile(defaultProfile);
    }
  }, []);

  const handleProfileSave = (nextProfile) => {
    const mergedProfile = { ...defaultProfile, ...nextProfile };
    setProfile(mergedProfile);
    try {
      window.localStorage.setItem('woody-profile', JSON.stringify(mergedProfile));
    } catch {
      // Ignore storage failures and keep the session state working.
    }
  };

  const activeItem = navItems.find(n => n.id === active);
  const displayName = profile.fullName?.trim() || 'Set profile name';

  return (
    <div className="dashboard-shell">
      {/* ─── SIDEBAR ─────────────────────────────────────────────── */}
      <aside className={`dashboard-sidebar sketch-border ${sidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
        {/* Brand strip */}
        <div className="sidebar-brand">
          <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
            <path d="M18 3C9.7 3 3 8.4 3 15C3 21.6 9.7 27 18 27C26.3 27 33 21.6 33 15C33 8.4 26.3 3 18 3Z"
              stroke="#2D2C24" strokeWidth="2.5" fill="#FFFDF9" />
            <path d="M18 7C12.5 7 8 10.6 8 15C8 19.4 12.5 23 18 23C23.5 23 28 19.4 28 15C28 10.6 23.5 7 18 7Z"
              stroke="#2D2C24" strokeWidth="1.5" strokeDasharray="3 3" />
            <path d="M18 3.5V0" stroke="#2D2C24" strokeWidth="2" strokeLinecap="round" />
            <path d="M18 1.5C18.8 0.5 20 0 21 0" stroke="#2D2C24" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M18 2C17.2 1 16 0.5 15 0.5" stroke="#2D2C24" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          {sidebarOpen && <span className="sidebar-brand-name">Woody</span>}
        </div>

        {/* Collapse toggle */}
        <button className="sidebar-collapse-btn sketch-border-sm" onClick={() => setSidebarOpen(!sidebarOpen)}
          title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}>
          {sidebarOpen
            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
          }
        </button>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActive(item.id)}
              className={`sidebar-nav-btn ${active === item.id ? 'nav-btn-active' : ''}`}
              title={!sidebarOpen ? item.label : ''}>
              <span className="nav-btn-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-btn-label">{item.label}</span>}
              {sidebarOpen && active === item.id && <span className="nav-btn-active-dot"></span>}
            </button>
          ))}
        </nav>

        {/* Logout at bottom */}
        <div className="sidebar-footer">
          <button className="sidebar-logout-btn sketch-border-sm"
            onClick={() => { window.location.hash = ''; }}>
            <span>🚪</span>
            {sidebarOpen && <span>Leave Cabin</span>}
          </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ────────────────────────────────────────── */}
      <main className="dashboard-main">
        {/* Top breadcrumb bar */}
        <div className="dash-topbar sketch-border-sm">
          <div className="dash-topbar-left">
            {/* Mobile sidebar toggle */}
            <button className="mobile-sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="3" y1="8" x2="21" y2="8"></line>
                <line x1="3" y1="13" x2="21" y2="13"></line>
                <line x1="3" y1="18" x2="15" y2="18"></line>
              </svg>
            </button>
            <span className="topbar-breadcrumb">
              <span className="topbar-home">Woody Cabin</span>
              <span className="topbar-sep">›</span>
              <span className="topbar-current">{activeItem?.label}</span>
            </span>
          </div>
          <div className="topbar-user-chip sketch-border-sm">
            <span className="user-avatar-emoji">🌿</span>
            <span className="user-name-chip">{displayName}</span>
          </div>
        </div>

        {/* Page Header Banner */}
        <div className="dash-page-header sketch-border sketch-shadow">
          <div className="page-header-tape"></div>
          <span className="page-header-icon" role="img" aria-label={activeItem?.label}>
            {activeItem?.icon}
          </span>
          <div>
            <h1 className="page-header-title">{activeItem?.label}</h1>
            <p className="page-header-sub handwritten">
              {active === 'welcome'   && 'Your cozy starting point for the day ☕'}
              {active === 'summary'   && 'All your numbers at a glance 📋'}
              {active === 'studyplan' && 'Branch out your syllabus 🗺️'}
              {active === 'revision'  && 'Flip through your knowledge cards 🔁'}
              {active === 'quiz'      && 'Test yourself without the panic 📝'}
              {active === 'progress'  && 'Watch your subjects grow 🌱'}
              {active === 'examprep'  && 'Your 3-phase exam roadmap 🏆'}
              {active === 'timetable' && 'Slow, mindful weekly schedule ⏰'}
              {active === 'profile'   && 'Update your details and preferences 👤'}
            </p>
          </div>
        </div>

        {/* Page Content */}
        <div className="dash-content">
          {active === 'profile'
            ? <Profile profile={profile} onSave={handleProfileSave} />
            : active === 'welcome'
              ? <WelcomeCard userName={displayName} />
              : componentMap[active]
          }
        </div>
      </main>

      {/* ─── SCOPED STYLES ───────────────────────────────────────── */}
      <style>{`
        /* Panel header shared styles (used by all sub-pages) */
        .panel-header { margin-bottom: 4px; }
        .panel-title { font-family: var(--heading); font-size: 28px; font-weight: 700; margin-bottom: 5px; }
        .panel-subtitle { font-size: 14px; color: var(--wood-ink-muted); line-height: 1.5; }

        /* ── Shell Layout ── */
        .dashboard-shell {
          display: flex;
          min-height: 100dvh;
          background-color: var(--wood-bg);
          width: 100%;
          box-sizing: border-box;
          position: relative;
        }

        /* ── Sidebar ── */
        .dashboard-sidebar {
          background-color: var(--wood-card);
          display: flex;
          flex-direction: column;
          transition: width 0.28s cubic-bezier(0.4,0,0.2,1);
          position: sticky;
          top: 0;
          height: 100vh;
          flex-shrink: 0;
          overflow: hidden;
          z-index: 200;
          box-shadow: 3px 0 0 var(--wood-ink);
        }

        .sidebar-open { width: 220px; }
        .sidebar-collapsed { width: 62px; }

        @media (max-width: 1024px) {
          .dashboard-shell {
            flex-direction: column;
          }

          .dashboard-sidebar {
            position: relative;
            width: 100% !important;
            height: auto;
            max-height: none;
            z-index: 150;
          }

          .sidebar-collapsed {
            width: 100% !important;
          }

          .sidebar-brand,
          .sidebar-nav,
          .sidebar-footer {
            width: 100%;
          }

          .dashboard-main {
            width: 100%;
          }
        }

        @media (max-width: 768px) {
          .sidebar-open { width: 200px; position: fixed; top: 0; left: 0; height: 100vh; }
          .sidebar-collapsed { width: 0; overflow: hidden; }
          .mobile-sidebar-toggle { display: flex !important; }

          .dash-topbar {
            padding: 10px 16px;
            align-items: flex-start;
            flex-direction: column;
          }

          .dash-topbar-left {
            width: 100%;
          }

          .topbar-breadcrumb {
            font-size: 14px;
            flex-wrap: wrap;
          }

          .topbar-user-chip {
            width: 100%;
            justify-content: center;
          }

          .dash-page-header {
            margin: 16px 16px 0;
            padding: 18px 18px;
            align-items: flex-start;
            flex-direction: column;
          }

          .page-header-icon {
            font-size: 36px;
          }

          .page-header-title {
            font-size: 22px;
          }

          .page-header-sub {
            font-size: 15px;
          }

          .dash-content {
            padding: 16px;
          }
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 18px 14px 12px;
          border-bottom: 2px dashed var(--wood-border-light);
          overflow: hidden;
          white-space: nowrap;
        }

        .sidebar-brand-name {
          font-family: var(--heading);
          font-weight: 700;
          font-size: 20px;
          letter-spacing: -0.4px;
        }

        .sidebar-collapse-btn {
          align-self: flex-end;
          margin: 8px 10px 0;
          background: var(--wood-bg);
          border: 1.5px solid var(--wood-ink);
          width: 26px;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--wood-ink);
          transition: background 0.2s;
          flex-shrink: 0;
        }

        .sidebar-collapse-btn:hover { background: var(--wood-accent); }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 10px 8px;
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
        }

        .sidebar-nav-btn {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 10px 12px;
          background: none;
          border: none;
          cursor: pointer;
          border-radius: 8px;
          text-align: left;
          color: var(--wood-ink);
          transition: all 0.18s;
          white-space: nowrap;
          position: relative;
          width: 100%;
        }

        .sidebar-nav-btn:hover {
          background-color: var(--wood-accent);
          transform: translateX(2px);
        }

        .nav-btn-active {
          background-color: var(--wood-primary) !important;
          box-shadow: 2px 2px 0 var(--wood-ink);
        }

        .nav-btn-icon { font-size: 20px; flex-shrink: 0; }

        .nav-btn-label {
          font-family: var(--heading);
          font-weight: 600;
          font-size: 14px;
          flex: 1;
        }

        .nav-btn-active-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--wood-ink);
          flex-shrink: 0;
        }

        .sidebar-footer {
          padding: 12px 8px;
          border-top: 2px dashed var(--wood-border-light);
        }

        .sidebar-logout-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          background: none;
          border: 1.5px solid var(--wood-ink);
          border-radius: 8px;
          cursor: pointer;
          color: var(--wood-ink-muted);
          font-family: var(--heading);
          font-size: 13px;
          font-weight: 600;
          width: 100%;
          transition: all 0.2s;
          white-space: nowrap;
          overflow: hidden;
        }

        .sidebar-logout-btn:hover {
          background: #FFEBEE;
          color: #c62828;
          border-color: #c62828;
        }

        /* ── Main content ── */
        .dashboard-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          overflow-x: hidden;
        }

        /* Top bar */
        .dash-topbar {
          background: var(--wood-card);
          padding: 10px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 2px 0 var(--wood-ink);
        }

        .dash-topbar-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .mobile-sidebar-toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--wood-ink);
          padding: 4px;
        }

        .topbar-breadcrumb {
          font-family: var(--heading);
          font-size: 15px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .topbar-home { color: var(--wood-ink-muted); }
        .topbar-sep { color: var(--wood-border-light); font-size: 18px; }
        .topbar-current { font-weight: 700; color: var(--wood-ink); }

        .topbar-user-chip {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 5px 12px;
          background: var(--wood-accent);
          font-family: var(--heading);
          font-size: 13px;
          font-weight: 600;
          border: 1.5px solid var(--wood-ink);
        }

        /* Page Header Banner */
        .dash-page-header {
          margin: 20px 24px 0;
          background: var(--wood-card);
          padding: 22px 28px;
          display: flex;
          align-items: center;
          gap: 20px;
          position: relative;
          box-shadow: var(--wood-shadow);
        }

        .page-header-tape {
          position: absolute;
          top: -11px;
          left: 36px;
          width: 80px;
          height: 22px;
          background: rgba(253,242,204,0.75);
          border: 1px dashed rgba(45,44,36,0.2);
          transform: rotate(-1.5deg);
        }

        .page-header-icon {
          font-size: 42px;
          line-height: 1;
          flex-shrink: 0;
        }

        .page-header-title {
          font-family: var(--heading);
          font-size: 26px;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .page-header-sub {
          font-size: 18px;
          color: var(--wood-ink-muted);
        }

        /* Page content */
        .dash-content {
          flex: 1;
          padding: 24px;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
}
