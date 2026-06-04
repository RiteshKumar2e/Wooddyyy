import React, { useState, useEffect } from 'react';
import Navbar from './component/navbar.jsx';
import Footer from './component/footer.jsx';
import Landing from './pages/landing.jsx';
import LoginPage from './pages/login-page.jsx';
import RegisterPage from './pages/register-page.jsx';
import Dashboard from './pages/student/dashboard.jsx';
import './App.css';

function App() {
  const [view, setView] = useState('landing');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#login') {
        setView('login');
      } else if (hash === '#register') {
        setView('register');
      } else if (hash === '#student-dashboard') {
        setView('dashboard');
      } else {
        setView('landing');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // parse on first load

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Dashboard gets its own full-page layout (no shared navbar)
  if (view === 'dashboard') {
    return <Dashboard />;
  }

  return (
    <div className="app-workspace">
      <Navbar />
      <main className="main-content">
        {view === 'landing'   && <Landing />}
        {view === 'login'     && <LoginPage />}
        {view === 'register'  && <RegisterPage />}
      </main>
      <Footer />
    </div>
  );
}

export default App;
