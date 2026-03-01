import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { X } from 'lucide-react';
import './AuthModal.css'; // Dùng chung file CSS cũ
import toast from 'react-hot-toast';

const SignupModal = ({ isOpen, onClose, switchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) {
            toast.error(`Lỗi đăng ký: ${error.message}`);
        } else {
            toast.success('Đăng ký thành công! Hãy bắt đầu hành trình sự nghiệp.');
            switchToLogin();
        }
        setLoading(false);
    };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="close-btn" onClick={onClose}><X /></button>
        <h2>Tạo tài khoản mới</h2>
        <form onSubmit={handleSignup}>
          <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Mật khẩu (ít nhất 6 ký tự)" onChange={e => setPassword(e.target.value)} required />
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Đang tạo...' : 'Đăng ký'}
          </button>
        </form>
        <p className="toggle-text">Đã có tài khoản? <span onClick={switchToLogin}>Đăng nhập</span></p>
      </div>
    </div>
  );
};

export default SignupModal;