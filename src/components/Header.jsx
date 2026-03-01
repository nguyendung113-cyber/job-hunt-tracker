import React, { useState } from 'react';
import { BriefcaseBusiness, Menu, X, LogOut } from 'lucide-react'; // Thêm icon LogOut cho đẹp
import './Header.css';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';
import { supabase } from '../supabaseClient'; // Import supabase để làm hàm Logout
import toast from 'react-hot-toast';


// BƯỚC 1: Thêm { user } vào tham số của hàm Header
const Header = ({ user }) => { 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const openLogin = () => {
    setShowLogin(true);
    setShowSignup(false);
    setIsMenuOpen(false);
  };

  const openSignup = () => {
    setShowSignup(true);
    setShowLogin(false);
    setIsMenuOpen(false);
  };

  // Hàm xử lý đăng xuất
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      toast.success('Đã đăng xuất. Hẹn gặp lại bạn sớm!');
    } else {
      toast.error('Có lỗi khi đăng xuất.');
    }
  };

  return (
    <>
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
          <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {/* BƯỚC 2: Kiểm tra điều kiện user */}
          <div className={`auth-buttons ${isMenuOpen ? 'active' : ''}`}>
            {user ? (
              /* TRẠNG THÁI ĐÃ ĐĂNG NHẬP */
              <div className="user-profile-nav">
                <span className="user-email-display">{user.email}</span>
                <button className="btn-logout" onClick={handleLogout}>
                  <LogOut size={18} />
                  <span>Đăng xuất</span>
                </button>
              </div>
            ) : (
              /* TRẠNG THÁI CHƯA ĐĂNG NHẬP */
              <>
                <button className="btn-login" onClick={openLogin}>Log in</button>
                <button className="btn-signup" onClick={openSignup}>Sign up free</button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)} 
        switchToSignup={openSignup} 
      />

      {/* Signup Modal */}
      <SignupModal 
        isOpen={showSignup} 
        onClose={() => setShowSignup(false)} 
        switchToLogin={openLogin} 
      />
    </>
  );
};

export default Header;