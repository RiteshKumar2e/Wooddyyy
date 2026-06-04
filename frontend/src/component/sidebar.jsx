import React from 'react';

export default function Sidebar({ sidebarOpen, setSidebarOpen, active, setActive, navItems }) {
  return (
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
  );
}
