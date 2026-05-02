import React, { useState } from "react";
import { BriefcaseBusiness, Menu, X, LogOut } from "lucide-react";
import "./Header.css";

// Header.jsx - Đảm bảo header nằm trên cùng bên phải
const Header = ({ user, onLogout, onLoginClick, onSignupClick, onMenuClick, hideLogo }) => {
  return (
    <header className="header">
      <div className="header-container">
        {/* Logo bên trái */}
        <div className="header-left">
          {user && (
            <button className="mobile-menu-toggle" onClick={onMenuClick}>
              <Menu size={24} />
            </button>
          )}
          {!hideLogo && <h1 className="header-logo">JobUp</h1>}
        </div>

        {/* Navigation và user menu bên phải */}
        <div className="header-right">
          {user ? (
            <>
              <nav className="header-nav">
                <a href="#" className="nav-link">
                  Dashboard
                </a>
                <a href="#" className="nav-link">
                  Applications
                </a>
                <a href="#" className="nav-link">
                  Analytics
                </a>
              </nav>
              <div className="user-menu">
                <span className="user-email">{user.email}</span>
                <button onClick={onLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="auth-buttons">
              <button onClick={onLoginClick} className="login-btn">
                Login
              </button>
              <button onClick={onSignupClick} className="signup-btn">
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
