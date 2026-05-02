import React from "react";
import { Github, Twitter, Linkedin, Mail, Heart, Globe, Briefcase } from "lucide-react";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer-modern">
      <div className="footer-main">
        <div className="footer-brand-section">
          <div className="footer-logo">
            <div className="logo-icon">
              <Briefcase size={20} color="white" />
            </div>
            <span>JobUp <small>PRO</small></span>
          </div>
          <p className="brand-description">
            Nền tảng quản lý sự nghiệp tối ưu cho kỹ sư phần mềm. 
            Giúp bạn theo dõi, phân tích và chinh phục những cơ hội việc làm tốt nhất.
          </p>
          <div className="social-links">
            <a href="#" className="social-icon" aria-label="Github"><Github size={18} /></a>
            <a href="#" className="social-icon" aria-label="Twitter"><Twitter size={18} /></a>
            <a href="#" className="social-icon" aria-label="Linkedin"><Linkedin size={18} /></a>
          </div>
        </div>

        <div className="footer-nav-section">
          <h4>Sản phẩm</h4>
          <ul>
            <li><a href="/overview">Tổng quan</a></li>
            <li><a href="/kanban">Kanban Board</a></li>
            <li><a href="/analytics">Phân tích dữ liệu</a></li>
            <li><a href="/favorites">Việc làm yêu thích</a></li>
          </ul>
        </div>

        <div className="footer-nav-section">
          <h4>Hỗ trợ</h4>
          <ul>
            <li><a href="/help">Trung tâm trợ giúp</a></li>
            <li><a href="/settings">Cài đặt tài khoản</a></li>
            <li><a href="/privacy">Chính sách bảo mật</a></li>
            <li><a href="/terms">Điều khoản sử dụng</a></li>
          </ul>
        </div>

        <div className="footer-contact-section">
          <h4>Liên hệ</h4>
          <div className="contact-info">
            <div className="contact-item">
              <Mail size={16} />
              <span>support@jobup.pro</span>
            </div>
            <div className="contact-item">
              <Globe size={16} />
              <span>www.jobup.pro</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <div className="footer-copyright">
          &copy; {currentYear} JobUp Pro. All rights reserved.
        </div>
        <div className="footer-made-with">
          Made with <Heart size={14} fill="#ef4444" color="#ef4444" /> for modern developers
        </div>
      </div>
    </footer>
  );
};

export default Footer;
