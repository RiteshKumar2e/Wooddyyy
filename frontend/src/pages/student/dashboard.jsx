import React, { useEffect, useState } from 'react';
import Sidebar from '../../component/sidebar.jsx';
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
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        active={active} 
        setActive={setActive} 
        navItems={navItems} 
      />

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
