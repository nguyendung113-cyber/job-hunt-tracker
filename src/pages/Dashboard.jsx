import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useJobs } from '../hooks/useJobs';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import AddJobForm from '../components/features/AddJobForm';
import JobTable from '../components/features/JobTable';
import LoginModal from '../components/features/LoginModal';
import SignupModal from '../components/features/SignupModal';
import { Toaster } from 'react-hot-toast';
import '../styles/variables.css';
import '../styles/global.css';
import './Dashboard.css';

const Dashboard = () => {
  const { user, login, signup, logout } = useAuth();
  const { jobs, loading, addJob, updateJobStatus, deleteJob } = useJobs(user?.id);
  
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const openLogin = () => {
    setShowLogin(true);
    setShowSignup(false);
  };

  const openSignup = () => {
    setShowSignup(true);
    setShowLogin(false);
  };

  const handleJobAdded = (newJob) => {
    // Jobs will be updated automatically via useJobs hook
    console.log('Job added:', newJob);
  };

  return (
    <div className="dashboard-page">
      <Toaster
        toastOptions={{
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '8px',
            fontSize: '14px',
          },
          success: {
            duration: 3000,
            theme: { primary: '#10b981' },
          },
        }}
      />

      <Header 
        user={user} 
        onLogout={logout}
        onLoginClick={openLogin}
        onSignupClick={openSignup}
      />

      <main className="dashboard-container">
        {user ? (
          <>
            <AddJobForm onJobAdded={handleJobAdded} />
            <JobTable 
              jobs={jobs} 
              loading={loading}
              onStatusChange={updateJobStatus}
              onDelete={deleteJob}
            />
          </>
        ) : (
          <div className="welcome-section">
            <h1>Chào mừng đến với JobUp</h1>
            <p>Quản lý hành trình tìm việc của bạn một cách dễ dàng</p>
            <div className="auth-prompt">
              <button className="btn-primary" onClick={openLogin}>
                Đăng nhập
              </button>
              <button className="btn-secondary" onClick={openSignup}>
                Đăng ký miễn phí
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* Auth Modals */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToSignup={openSignup}
        onLogin={login}
      />

      <SignupModal
        isOpen={showSignup}
        onClose={() => setShowSignup(false)}
        onSwitchToLogin={openLogin}
        onSignup={signup}
      />
    </div>
  );
};

export default Dashboard;