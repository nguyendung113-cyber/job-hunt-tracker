import React, { useState } from 'react';
import Modal from '../common/Modal';
import './AuthModals.css';

const LoginModal = ({ isOpen, onClose, onSwitchToSignup, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    await onLogin(email, password);
    setLoading(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Chào mừng quay lại">
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Mật khẩu" 
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Đang kiểm tra...' : 'Đăng nhập'}
        </button>
      </form>
      <p className="toggle-text">
        Chưa có tài khoản? <span onClick={onSwitchToSignup}>Đăng ký ngay</span>
      </p>
    </Modal>
  );
};

export default LoginModal;