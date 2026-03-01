import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { X } from 'lucide-react';
import './AuthModal.css'; // Dùng chung file CSS cũ
import toast from 'react-hot-toast';

const LoginModal = ({ isOpen, onClose, switchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            toast.error(`Đăng nhập thất bại: ${error.message}`);
        } else {
            toast.success('Chào mừng bạn quay trở lại! 🇯🇵');
            onClose();
        }
        setLoading(false);
    };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="close-btn" onClick={onClose}><X /></button>
        <h2>Chào mừng quay lại</h2>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Mật khẩu" onChange={e => setPassword(e.target.value)} required />
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Đang kiểm tra...' : 'Đăng nhập'}
          </button>
        </form>
        <p className="toggle-text">Chưa có tài khoản? <span onClick={switchToSignup}>Đăng ký ngay</span></p>
      </div>
    </div>
  );
};

export default LoginModal;