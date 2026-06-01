import React, { useState, useEffect } from 'react';
import Navbar from './component/navbar.jsx';
import Landing from './pages/landing.jsx';
import LoginPage from './pages/login-page.jsx';
import RegisterPage from './pages/register-page.jsx';

function App() {
  const [view, setView] = useState('landing'); // landing, login, register

  // Listening to URL hash changes for robust browser routing without heavy external dependencies
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#login') {
        setView('login');
      } else if (hash === '#register') {
        setView('register');
      } else {
        setView('landing');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Initial parse of URL hash
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="app-workspace">
      {/* Dynamic Navbar Component */}
      <Navbar />

      {/* Main Content Area switches dynamically based on current URL hash state */}
      <main className="main-content">
        {view === 'landing' && <Landing />}
        {view === 'login' && <LoginPage />}
        {view === 'register' && <RegisterPage />}
      </main>

      {/* Styled Layout Helper for Main Wrapper */}
      <style>{`
        .app-workspace {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          width: 100%;
        }

        .main-content {
          flex: 1 0 auto;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding-bottom: 40px;
        }
      `}</style>
    </div>
  );
}

export default App;
