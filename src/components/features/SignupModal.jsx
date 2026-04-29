import React, { useState } from 'react';
import Modal from '../common/Modal';
import './AuthModals.css';

const SignupModal = ({ isOpen, onClose, onSwitchToLogin, onSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    await onSignup(email, password);
    setLoading(false);
    onClose();
    // Switch to login after successful signup
    if (onSwitchToLogin) onSwitchToLogin();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tạo tài khoản mới">
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
          placeholder="Mật khẩu (ít nhất 6 ký tự)" 
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Đang tạo...' : 'Đăng ký'}
        </button>
      </form>
      <p className="toggle-text">
        Đã có tài khoản? <span onClick={onSwitchToLogin}>Đăng nhập</span>
      </p>
    </Modal>
  );
};

export default SignupModal;