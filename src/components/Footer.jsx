import React from "react";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-section brand">
          <div className="footer-logo">
            <div className="logo-icon-small">💼</div>
            <span>
              JobUp <small>JP</small>
            </span>
          </div>
          <p>Hỗ trợ kỹ sư Việt chinh phục sự nghiệp tại Nhật Bản.</p>
        </div>

        <div className="footer-section links">
          <h4>Liên kết</h4>
          <ul>
            <li>
              <a href="#dashboard">Bảng điều khiển</a>
            </li>
            <li>
              <a href="#stats">Thống kê</a>
            </li>
            <li>
              <a href="#resources">Tài liệu IT Nhật</a>
            </li>
          </ul>
        </div>

        <div className="footer-section contact">
          <h4>Liên hệ</h4>
          <p>Email: support@jobup.jp</p>
          <div className="social-icons">
            <span>🌐</span> <span>📱</span> <span>✉️</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} JobUp JP. All rights reserved.</p>
        <p>Made with ❤️ for Developers</p>
      </div>
    </footer>
  );
};

export default Footer;
