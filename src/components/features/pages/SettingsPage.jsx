import React, { useState } from 'react';
import { User, Bell, Moon, Sun, Key, LogOut, Mail, Calendar, ShieldCheck } from 'lucide-react';
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
    <div className="settings-container">
      <div className="settings-header">
        <h1>Cài đặt hệ thống</h1>
        <p>Quản lý tài khoản và tùy chỉnh trải nghiệm của bạn</p>
      </div>

      <div className="settings-main">
        {/* Left column: Profile & Preferences */}
        <div className="settings-column">
          <section className="settings-card profile-card">
            <div className="card-header">
              <User size={20} className="icon-blue" />
              <h3>Thông tin tài khoản</h3>
            </div>
            <div className="card-body">
              <div className="user-profile-header">
                <div className="user-avatar">
                  {user?.email?.[0].toUpperCase()}
                </div>
                <div className="user-info">
                  <h4>{user?.user_metadata?.name || 'Thành viên JobUp'}</h4>
                  <p><Mail size={14} /> {user?.email}</p>
                  <p><Calendar size={14} /> Gia nhập: 2026</p>
                </div>
              </div>
              <button className="btn-edit-profile">Chỉnh sửa hồ sơ</button>
            </div>
          </section>

          <section className="settings-card">
            <div className="card-header">
              <ShieldCheck size={20} className="icon-green" />
              <h3>Tùy chỉnh hệ thống</h3>
            </div>
            <div className="card-body">
              <div className="setting-item">
                <div className="setting-label">
                  <Moon size={18} />
                  <div>
                    <span className="label-text">Chế độ tối (Dark Mode)</span>
                    <span className="label-desc">Tiết kiệm pin và bảo vệ mắt</span>
                  </div>
                </div>
                <button 
                  className={`toggle-switch ${isDarkMode ? 'active' : ''}`}
                  onClick={toggleTheme}
                >
                  <span className="switch-knob"></span>
                </button>
              </div>

              <div className="setting-item">
                <div className="setting-label">
                  <Bell size={18} />
                  <div>
                    <span className="label-text">Thông báo đẩy</span>
                    <span className="label-desc">Nhận tin nhắn về lịch phỏng vấn</span>
                  </div>
                </div>
                <button 
                  className={`toggle-switch ${notifications ? 'active' : ''}`}
                  onClick={() => setNotifications(!notifications)}
                >
                  <span className="switch-knob"></span>
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Right column: Security */}
        <div className="settings-column">
          <section className="settings-card">
            <div className="card-header">
              <Key size={20} className="icon-orange" />
              <h3>Bảo mật tài khoản</h3>
            </div>
            <div className="card-body">
              <form className="security-form" onSubmit={handlePasswordChange}>
                <div className="form-input-group">
                  <label>Mật khẩu mới</label>
                  <input 
                    type="password" 
                    placeholder="Tối thiểu 6 ký tự"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-input-group">
                  <label>Xác nhận mật khẩu</label>
                  <input 
                    type="password" 
                    placeholder="Nhập lại mật khẩu mới"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn-save-password" 
                  disabled={isUpdatingPassword}
                >
                  {isUpdatingPassword ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
                </button>
              </form>
            </div>
          </section>

          <section className="settings-card danger-card">
            <div className="card-header">
              <LogOut size={20} className="icon-red" />
              <h3>Đăng xuất</h3>
            </div>
            <div className="card-body">
              <p>Bạn sẽ cần đăng nhập lại để truy cập vào dữ liệu của mình.</p>
              <button className="btn-logout" onClick={() => supabase.auth.signOut()}>
                Đăng xuất ngay
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
