import React, { useEffect, useState } from 'react';
import '../../styles/student/dashboard.css';
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
    </div>
  );
}
