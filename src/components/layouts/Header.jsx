import React, { useState } from 'react';
import { BriefcaseBusiness, Menu, X, LogOut } from 'lucide-react';
import './Header.css';

const Header = ({ user, onLogout, onLoginClick, onSignupClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="header-wrapper">
      <div className="header-content">
        {/* Logo */}
        <div className="logo-section">
          <div className="logo-icon">
            <BriefcaseBusiness size={22} />
          </div>
          <h1 className="logo-text">Job<span>Up</span></h1>
        </div>

        {/* Hamburger (Mobile) */}
        <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Auth Buttons */}
        <div className={`auth-buttons ${isMenuOpen ? 'active' : ''}`}>
          {user ? (
            <div className="user-profile-nav">
              <span className="user-email-display">{user.email}</span>
              <button className="btn-logout" onClick={onLogout}>
                <LogOut size={18} />
                <span>Đăng xuất</span>
              </button>
            </div>
          ) : (
            <>
              <button className="btn-login" onClick={onLoginClick}>
                Log in
              </button>
              <button className="btn-signup" onClick={onSignupClick}>
                Sign up free
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;