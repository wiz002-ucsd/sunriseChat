import React from 'react';
import { Sun, Heart } from 'lucide-react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <Sun className="logo-icon" />
          <h1>Sunrise Chat</h1>
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

