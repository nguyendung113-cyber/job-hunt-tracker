import React from 'react';
import { Shield, Eye, Lock, FileText } from 'lucide-react';
import './PolicyPages.css';

const PrivacyPage = () => {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <header className="policy-header">
          <Shield size={48} color="#3b82f6" />
          <h1>Chính sách bảo mật</h1>
          <p>Cập nhật lần cuối: 02/05/2026</p>
        </header>

        <section className="policy-section">
          <h2>1. Thu thập thông tin</h2>
          <p>Chúng tôi thu thập các thông tin sau khi bạn sử dụng JobUp:</p>
          <ul>
            <li>Thông tin tài khoản: Email, tên hiển thị.</li>
            <li>Dữ liệu ứng tuyển: Thông tin công ty, vị trí, mức lương, ghi chú.</li>
            <li>Tài liệu: File CV bạn upload lên hệ thống.</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>2. Cách chúng tôi sử dụng thông tin</h2>
          <p>Dữ liệu của bạn được sử dụng để:</p>
          <div className="policy-grid">
            <div className="policy-card">
              <Eye size={20} />
              <h4>Hiển thị dữ liệu</h4>
              <p>Giúp bạn quản lý và theo dõi quá trình tìm việc.</p>
            </div>
            <div className="policy-card">
              <Lock size={20} />
              <h4>Bảo mật</h4>
              <p>Đảm bảo chỉ bạn mới có quyền truy cập dữ liệu của mình.</p>
            </div>
          </div>
        </section>

        <section className="policy-section">
          <h2>3. Bảo mật dữ liệu</h2>
          <p>Tất cả dữ liệu được lưu trữ trên nền tảng Supabase với các tiêu chuẩn bảo mật cao nhất và mã hóa dữ liệu tại chỗ.</p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPage;
