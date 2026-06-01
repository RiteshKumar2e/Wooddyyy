import React, { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setFormSubmitted(true);
    setTimeout(() => {
      // Mock login navigation
      window.location.hash = '#student-dashboard';
    }, 1500);
  };

  const handleDemoLogin = () => {
    setEmail('guest@mansi.com');
    setPassword('cozyfocus123');
    setFormSubmitted(true);
    setTimeout(() => {
      window.location.hash = '#student-dashboard';
    }, 1500);
  };

  return (
    <div className="login-container">
      {/* Pinned Note Accent */}
      <div className="login-paper sketch-border sketch-shadow">
        {/* Binder Holes to look like physical paper */}
        <div className="paper-holes">
          <div className="hole"></div>
          <div className="hole"></div>
          <div className="hole"></div>
        </div>

        <div className="login-header">
          {/* Hand-drawn padlock SVG */}
          <div className="login-icon">
            <svg width="40" height="40" viewBox="0 0 36 36" fill="none">
              {/* Lock body */}
              <rect x="7" y="14" width="22" height="17" rx="3" fill="#FFFDF9" stroke="#2D2C24" strokeWidth="2.5" />
              {/* Shackle */}
              <path d="M12 14V9C12 5.5 14.5 3 18 3C21.5 3 24 5.5 24 9V14" stroke="#2D2C24" strokeWidth="2.5" strokeLinecap="round" />
              {/* Keyhole */}
              <circle cx="18" cy="21" r="2.5" fill="#2D2C24" />
              <line x1="18" y1="23.5" x2="18" y2="27" stroke="#2D2C24" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <h2 className="login-title">Enter Your Cabin</h2>
          <p className="login-subtitle">Pull up a chair, brew some tea, and settle into focus.</p>
        </div>

        {formSubmitted ? (
          <div className="mock-login-success text-center">
            <span className="handwritten" style={{ fontSize: '32px' }}>Opening cabinet drawer...</span>
            <div className="cabinet-animation-box mt-4">
              <svg width="80" height="60" viewBox="0 0 80 60" fill="none" className="cabinet-svg">
                {/* Wood cabinet */}
                <rect x="5" y="5" width="70" height="50" rx="4" fill="#FAF6E9" stroke="#2D2C24" strokeWidth="3" />
                {/* Drawer handle sliding */}
                <path d="M25 30H55" stroke="#E6A817" strokeWidth="4" strokeLinecap="round" />
                {/* Key */}
                <path d="M38 12C38 10 42 10 42 12V48" stroke="#2D2C24" strokeWidth="2" strokeDasharray="3 3" />
              </svg>
            </div>
            <p className="text-xs text-gray-500 mt-2">Preparing your study desk files...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="login-form">
            {/* Email Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                className="form-input sketch-border-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@school.com"
                required
              />
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="form-input sketch-border-sm pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                
                {/* Hand-sketched Password Eye Toggle */}
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    /* Open Eye Icon */
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2D2C24" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  ) : (
                    /* Closed Eye Icon (Lashes sketched) */
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2D2C24" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M17.6 17.6a10.9 10.9 0 0 1-5.6 1.4c-7 0-11-8-11-8a19.4 19.4 0 0 1 3.5-4.5"></path>
                      <path d="M23 12s-4 8-11 8a11 11 0 0 1-2.2-.2"></path>
                      <path d="M9.5 4.5A10.9 10.9 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-1.8 2.5"></path>
                      <circle cx="12" cy="12" r="3" style={{ opacity: 0.5 }}></circle>
                      {/* Lashes */}
                      <line x1="3" y1="3" x2="21" y2="21" stroke="#2D2C24" strokeWidth="2.5"></line>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Extra options */}
            <div className="form-sub-options">
              <label className="remember-me-label">
                <input type="checkbox" className="custom-checkbox" />
                <span className="ml-2">Keep my desk open</span>
              </label>
              <a href="#forgot" className="forgot-pass-link text-xs">Lost Key?</a>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn-sketch btn-sketch-primary sketch-border sketch-shadow w-full justify-center mt-4">
              <span>Enter Workspace</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>

            {/* Demo Login Button */}
            <button type="button" onClick={handleDemoLogin} className="btn-sketch sketch-border sketch-shadow w-full justify-center mt-2" style={{ backgroundColor: 'var(--wood-accent)' }}>
              <span>🔑 Try Demo Desk</span>
              <span className="handwritten ml-2 text-base" style={{ color: 'var(--wood-ink)' }}>quick preview!</span>
            </button>
          </form>
        )}

        <div className="login-footer">
          <span>New to the forest?</span>
          <a href="#register" className="register-redirect-link font-bold">
            Craft a workspace slowly &rarr;
          </a>
        </div>
      </div>

      {/* Decorative Candle Illustration on Side */}
      <div className="desk-candle-illustration">
        <svg width="60" height="90" viewBox="0 0 60 90" fill="none" className="candle-svg">
          {/* Flame flickering */}
          <path d="M30 15C32 2 34 8 32 0C28 8 28 2 30 15Z" fill="#E6A817" className="flicker-flame" />
          {/* Wick */}
          <line x1="30" y1="15" x2="30" y2="25" stroke="#2D2C24" strokeWidth="2" />
          {/* Candle body */}
          <rect x="22" y="25" width="16" height="50" rx="2" fill="#FFFDF9" stroke="#2D2C24" strokeWidth="2.5" />
          {/* Wax drippings */}
          <path d="M22 35C24 35 25 38 25 40C25 42 22 42 22 35Z" fill="#FFFDF9" stroke="#2D2C24" strokeWidth="2" />
          <path d="M38 30C36 30 35 34 35 36C35 38 38 38 38 30Z" fill="#FFFDF9" stroke="#2D2C24" strokeWidth="2" />
          {/* Wooden base holder */}
          <path d="M10 75H50" stroke="#2D2C24" strokeWidth="3" strokeLinecap="round" />
          <path d="M15 75C15 80 45 80 45 75" fill="#FAF6E9" stroke="#2D2C24" strokeWidth="2.5" />
        </svg>
        <span className="candle-text handwritten">Stay calm!</span>
      </div>

      <style>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 80vh;
          padding: 40px 20px;
          position: relative;
        }

        .login-paper {
          background-color: var(--wood-card);
          width: 100%;
          max-width: 480px;
          padding: 45px 36px 36px;
          position: relative;
          box-shadow: var(--wood-shadow);
          @media (max-width: 480px) {
            padding: 35px 24px 24px;
          }
        }

        /* Lined binder paper holes style */
        .paper-holes {
          position: absolute;
          top: 0;
          left: 40px;
          right: 40px;
          display: flex;
          justify-content: space-between;
          pointer-events: none;
        }

        .hole {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background-color: var(--wood-bg);
          border: 2px solid var(--wood-ink);
          transform: translateY(-8px);
        }

        .login-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 28px;
        }

        .login-icon {
          margin-bottom: 12px;
          transition: transform 0.3s;
        }

        .login-paper:hover .login-icon {
          transform: rotate(-5deg) scale(1.05);
        }

        .login-title {
          font-size: 28px;
          margin-bottom: 6px;
        }

        .login-subtitle {
          font-size: 14px;
          color: var(--wood-ink-muted);
          line-height: 1.4;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-label {
          font-family: var(--heading);
          font-weight: 600;
          font-size: 14px;
          color: var(--wood-ink);
        }

        .form-input {
          width: 100%;
          padding: 11px 16px;
          font-family: var(--sans);
          font-size: 15px;
          background-color: var(--wood-bg);
          color: var(--wood-ink);
          outline: none;
          box-sizing: border-box;
          border: 2px solid var(--wood-ink);
        }

        .form-input:focus {
          background-color: #FFFDF0;
          border-color: var(--wood-primary) !important;
        }

        .password-input-wrapper {
          position: relative;
          width: 100%;
        }

        .password-toggle-btn {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: var(--wood-ink-muted);
          display: flex;
          align-items: center;
          padding: 4px;
        }

        .password-toggle-btn:hover {
          color: var(--wood-ink);
        }

        .form-sub-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13.5px;
          margin-top: -2px;
        }

        .remember-me-label {
          display: flex;
          align-items: center;
          cursor: pointer;
        }

        .custom-checkbox {
          accent-color: var(--wood-primary);
          cursor: pointer;
        }

        .forgot-pass-link {
          font-family: var(--heading);
          color: var(--wood-ink-muted);
        }

        .forgot-pass-link:hover {
          color: var(--wood-ink);
          text-decoration: underline;
        }

        .login-footer {
          margin-top: 28px;
          border-top: 2px dashed var(--wood-border-light);
          padding-top: 18px;
          text-align: center;
          font-size: 14px;
          color: var(--wood-ink-muted);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .register-redirect-link {
          color: var(--wood-primary);
        }

        .register-redirect-link:hover {
          color: var(--wood-primary-hover);
        }

        /* Side Candle Animation */
        .desk-candle-illustration {
          position: absolute;
          left: -40px;
          bottom: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          @media (max-width: 900px) {
            display: none;
          }
        }

        .flicker-flame {
          animation: flicker 1.5s infinite alternate ease-in-out;
          transform-origin: bottom center;
        }

        @keyframes flicker {
          0% { transform: scale(0.9) skewX(-2deg); opacity: 0.95; }
          100% { transform: scale(1.1) skewX(2deg); fill: #FFA000; }
        }

        .candle-text {
          font-size: 18px;
          color: var(--wood-ink-muted);
          margin-top: 8px;
        }

        .cabinet-animation-box {
          height: 70px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .cabinet-svg {
          animation: slideOut 1s infinite alternate;
        }

        @keyframes slideOut {
          0% { transform: scale(1); }
          100% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
