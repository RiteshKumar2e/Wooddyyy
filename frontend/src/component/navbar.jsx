import React, { useState } from 'react';
import '../styles/navbar.css';

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
          <span className="logo-text">Woody</span>
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

    </nav>
  );
}
