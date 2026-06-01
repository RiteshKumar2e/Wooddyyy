import React, { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="cozy-navbar sketch-border-sm">
      <div className="nav-container">
        {/* Brand Logo */}
        <a href="/" className="nav-logo">
          <svg className="logo-svg" width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Tree Stump Rings (Hand-drawn style) */}
            <path d="M18 3C9.7 3 3 8.4 3 15C3 21.6 9.7 27 18 27C26.3 27 33 21.6 33 15C33 8.4 26.3 3 18 3Z" stroke="#2D2C24" strokeWidth="2.5" fill="#FFFDF9" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M18 7C12.5 7 8 10.6 8 15C8 19.4 12.5 23 18 23C23.5 23 28 19.4 28 15C28 10.6 23.5 7 18 7Z" stroke="#2D2C24" strokeWidth="2" strokeDasharray="3 3" strokeLinecap="round" />
            <path d="M18 11C14.7 11 12 12.8 12 15C12 17.2 14.7 19 18 19C21.3 19 24 17.2 24 15C24 12.8 21.3 11 18 11Z" stroke="#2D2C24" strokeWidth="1.5" strokeLinecap="round" />
            {/* Wooden Sprouts representing growth */}
            <path d="M22 25C22.5 28 25 30 28 30" stroke="#2D2C24" strokeWidth="2" strokeLinecap="round" />
            <path d="M14 25C13.5 28 11 30 8 30" stroke="#2D2C24" strokeWidth="2" strokeLinecap="round" />
            <path d="M18 13C18 14 18.5 15 19 15C19.5 15 20 14 20 13" stroke="#2D2C24" strokeWidth="1.5" strokeLinecap="round" />
            {/* Little plant growing out of stump */}
            <path d="M18 3.5V0" stroke="#2D2C24" strokeWidth="2" strokeLinecap="round" />
            <path d="M18 1.5C18.8 0.5 20 0 21 0" stroke="#2D2C24" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M18 2C17.2 1 16 0.5 15 0.5" stroke="#2D2C24" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <span className="logo-text">Woodyy</span>
        </a>

        {/* Desktop Menu Links */}
        <div className="nav-links-desktop">
          <a href="#" className="nav-link">Home</a>
          <a href="#about" className="nav-link">About</a>
          <a href="#features" className="nav-link">Features</a>
          <a href="#how-it-works" className="nav-link">How It Works</a>
          <a href="#contact" className="nav-link">Contact</a>
        </div>

        {/* CTA Actions */}
        <div className="nav-actions-desktop">
          <a href="#login" className="nav-btn-text">Sign In</a>
          <div className="cta-wrapper">
            <a href="#register" className="btn-sketch btn-sketch-primary sketch-border-sm sketch-shadow">
              <span>Enter Workspace</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
            <span className="cta-note handwritten">slowly!</span>
          </div>
        </div>

        {/* Hamburger Mobile Toggle (Hand-drawn Hamburger) */}
        <button onClick={toggleMenu} className="nav-toggle" aria-label="Toggle menu">
          {isOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="3" y1="8" x2="21" y2="8" strokeDasharray="1 1.5"></line>
              <line x1="3" y1="13" x2="21" y2="13"></line>
              <line x1="3" y1="18" x2="15" y2="18"></line>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="nav-menu-mobile sketch-border-sm">
          <a href="#" onClick={toggleMenu} className="mobile-link">Home</a>
          <a href="#about" onClick={toggleMenu} className="mobile-link">About</a>
          <a href="#features" onClick={toggleMenu} className="mobile-link">Features</a>
          <a href="#how-it-works" onClick={toggleMenu} className="mobile-link">How It Works</a>
          <a href="#contact" onClick={toggleMenu} className="mobile-link">Contact</a>
          <div className="mobile-divider"></div>
          <a href="#login" onClick={toggleMenu} className="mobile-link text-center font-bold">Sign In</a>
          <a href="#register" onClick={toggleMenu} className="btn-sketch btn-sketch-primary sketch-border-sm sketch-shadow text-center w-full justify-center">
            Enter Workspace
          </a>
        </div>
      )}

      {/* Scoped CSS Styles for Navbar */}
      <style>{`
        .cozy-navbar {
          background-color: var(--wood-card);
          margin: 15px;
          padding: 10px 24px;
          position: sticky;
          top: 15px;
          z-index: 1000;
          box-shadow: 3px 3px 0px var(--wood-ink);
        }

        .nav-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 50px;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--heading);
          font-weight: 700;
          font-size: 24px;
          color: var(--wood-ink);
        }

        .logo-svg {
          transition: transform 0.4s ease;
        }

        .nav-logo:hover .logo-svg {
          transform: rotate(15deg) scale(1.1);
        }

        .logo-text {
          letter-spacing: -0.5px;
        }

        .nav-links-desktop {
          display: flex;
          align-items: center;
          gap: 30px;
        }

        .nav-link {
          font-family: var(--heading);
          font-weight: 600;
          font-size: 16px;
          color: var(--wood-ink);
          padding: 6px 12px;
          border-radius: 8px;
          position: relative;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 12px;
          right: 12px;
          height: 6px;
          background-color: var(--wood-accent);
          z-index: -1;
          transform: scaleX(0);
          transform-origin: bottom left;
          transition: transform 0.25s ease-out;
          border-radius: 4px;
        }

        .nav-link:hover::after {
          transform: scaleX(1);
        }

        .nav-link:hover {
          color: var(--wood-ink);
        }

        .nav-actions-desktop {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .nav-btn-text {
          font-family: var(--heading);
          font-weight: 600;
          color: var(--wood-ink-muted);
          padding: 8px 16px;
          border-radius: 8px;
        }

        .nav-btn-text:hover {
          color: var(--wood-ink);
          background-color: rgba(45, 44, 36, 0.05);
        }

        .cta-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .cta-note {
          position: absolute;
          right: -45px;
          bottom: -18px;
          color: var(--wood-ink-muted);
          font-size: 20px;
        }

        .nav-toggle {
          display: none;
          background: none;
          border: none;
          color: var(--wood-ink);
          cursor: pointer;
          padding: 8px;
        }

        .nav-menu-mobile {
          display: none;
          position: absolute;
          top: calc(100% + 10px);
          left: 0;
          right: 0;
          background-color: var(--wood-card);
          padding: 20px;
          flex-direction: column;
          gap: 15px;
          box-shadow: 5px 5px 0px var(--wood-ink);
        }

        .mobile-link {
          font-family: var(--heading);
          font-weight: 600;
          font-size: 18px;
          color: var(--wood-ink);
          padding: 8px 12px;
          border-radius: 8px;
        }

        .mobile-link:hover {
          background-color: var(--wood-accent);
          padding-left: 18px;
        }

        .mobile-divider {
          height: 2px;
          border-bottom: 2px dashed var(--wood-border-light);
          margin: 5px 0;
        }

        @media (max-width: 1024px) {
          .nav-links-desktop,
          .nav-actions-desktop {
            display: none;
          }

          .nav-toggle {
            display: block;
          }

          .nav-menu-mobile {
            display: flex;
          }
        }
      `}</style>
    </nav>
  );
}
