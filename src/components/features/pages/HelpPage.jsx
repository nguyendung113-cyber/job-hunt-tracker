import React from 'react';
import { HelpCircle, MessageSquare, Book, Mail } from 'lucide-react';
import './HelpPage.css';

const HelpPage = () => {
  const faqs = [
    { q: 'Làm thế nào để thêm CV mới?', a: 'Bạn có thể chọn "Tải CV mới" ngay trong form tạo hồ sơ ứng tuyển.' },
    { q: 'Làm thế nào để đặt lịch phỏng vấn?', a: 'Khi kéo thả một thẻ công việc vào cột "Interviewing", một bảng chọn ngày giờ sẽ hiện ra.' },
    { q: 'Dữ liệu có được đồng bộ không?', a: 'Có, mọi thay đổi của bạn đều được lưu trữ và đồng bộ thời gian thực qua Supabase.' }
  ];

  return (
    <div className="help-page">
      <div className="help-grid">
        <div className="help-section main-faq">
          <div className="section-header">
            <HelpCircle size={20} />
            <h3>Câu hỏi thường gặp</h3>
          </div>
          <div className="faq-list">
            {faqs.map((faq, i) => (
              <div key={i} className="faq-item">
                <p className="question">{faq.q}</p>
                <p className="answer">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="help-sidebar">
          <div className="help-section contact-support">
            <div className="section-header">
              <MessageSquare size={20} />
              <h3>Liên hệ hỗ trợ</h3>
            </div>
            <div className="contact-options">
              <div className="contact-card">
                <Mail size={18} />
                <span>Email: support@jobup.com</span>
              </div>
              <div className="contact-card">
                <Book size={18} />
                <span>Tài liệu hướng dẫn</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
