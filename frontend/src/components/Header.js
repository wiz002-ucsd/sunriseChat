import React from 'react';
import { Sun, Heart, PhoneCall } from 'lucide-react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <Sun className="logo-icon" />
          <h1>Sunrise Chat</h1>
        </div>
        <div className="lifeline">
          <a
            className="lifeline-badge"
            href="tel:0800543354"
            aria-label="Call Lifeline 0800 543 354"
            title="Call Lifeline now"
          >
            <span className="lifeline-pulse" aria-hidden="true" />
            <PhoneCall className="lifeline-icon" />
            <span className="lifeline-text">
              <span className="lifeline-label">Lifeline</span>
              <span className="lifeline-number">0800 543 354</span>
            </span>
          </a>
          <div className="lifeline-help">
            If you’re in immediate danger, call 111 (NZ) or your local emergency number.
          </div>
        </div>
        <div className="tagline">
          <Heart className="heart-icon" />
          <span>Your compassionate AI companion</span>
        </div>
      </div>
    </header>
  );
};

export default Header;

