import React from 'react';
import { Scale, CheckCircle, AlertCircle } from 'lucide-react';
import './PolicyPages.css';

const TermsPage = () => {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <header className="policy-header">
          <Scale size={48} color="#3b82f6" />
          <h1>Điều khoản sử dụng</h1>
          <p>Cập nhật lần cuối: 02/05/2026</p>
        </header>

        <section className="policy-section">
          <h2>1. Chấp nhận điều khoản</h2>
          <p>Bằng việc đăng ký tài khoản tại JobUp, bạn đồng ý tuân thủ các điều khoản và điều kiện được nêu tại đây.</p>
        </section>

        <section className="policy-section">
          <h2>2. Trách nhiệm người dùng</h2>
          <p>Bạn chịu trách nhiệm bảo mật thông tin đăng nhập và mọi nội dung bạn upload lên hệ thống.</p>
          <div className="info-box">
            <CheckCircle size={20} />
            <p>Chúng tôi khuyến khích sử dụng mật khẩu mạnh và không chia sẻ tài khoản.</p>
          </div>
        </section>

        <section className="policy-section">
          <h2>3. Giới hạn trách nhiệm</h2>
          <p>JobUp là công cụ hỗ trợ theo dõi. Chúng tôi không đảm bảo bạn sẽ có được việc làm thông qua việc sử dụng ứng dụng này.</p>
        </section>

        <section className="policy-section warning">
          <div className="section-header">
            <AlertCircle size={20} />
            <h3>Thay đổi điều khoản</h3>
          </div>
          <p>Chúng tôi có quyền cập nhật các điều khoản này bất cứ lúc nào. Các thay đổi sẽ có hiệu lực ngay khi được đăng tải.</p>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;
