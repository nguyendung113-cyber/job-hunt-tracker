import React, { useState } from 'react';
import { User, Bell, Shield, Moon, Sun, Globe, Key, Check } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';
import './SettingsPage.css';

const SettingsPage = ({ user }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success('Đổi mật khẩu thành công');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error(error.message || 'Lỗi khi đổi mật khẩu');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-section">
        <div className="section-header">
          <User size={20} />
          <h3>Thông tin cá nhân</h3>
        </div>
        <div className="section-content">
          <div className="profile-preview">
            <div className="avatar-large">
              {user?.email?.[0].toUpperCase()}
            </div>
            <div className="profile-details">
              <p className="name">{user?.user_metadata?.name || 'Người dùng'}</p>
              <p className="email">{user?.email}</p>
            </div>
            <button className="btn-outline">Chỉnh sửa</button>
          </div>
        </div>
      </div>

      <div className="settings-grid">
        <div className="settings-section">
          <div className="section-header">
            <Bell size={20} />
            <h3>Thông báo</h3>
          </div>
          <div className="section-content">
            <div className="setting-toggle">
              <span>Email thông báo nhắc lịch</span>
              <button 
                className={`toggle ${notifications ? 'active' : ''}`}
                onClick={() => setNotifications(!notifications)}
              ></button>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <div className="section-header">
            {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
            <h3>Giao diện</h3>
          </div>
          <div className="section-content">
            <div className="setting-toggle">
              <span>Chế độ tối (Dark Mode)</span>
              <button 
                className={`toggle ${isDarkMode ? 'active' : ''}`}
                onClick={toggleTheme}
              ></button>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <div className="section-header">
          <Key size={20} />
          <h3>Đổi mật khẩu</h3>
        </div>
        <div className="section-content">
          <form className="password-form" onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label>Mật khẩu mới</label>
              <input 
                type="password" 
                placeholder="Nhập mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Xác nhận mật khẩu</label>
              <input 
                type="password" 
                placeholder="Xác nhận lại mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={isUpdatingPassword}
            >
              {isUpdatingPassword ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
