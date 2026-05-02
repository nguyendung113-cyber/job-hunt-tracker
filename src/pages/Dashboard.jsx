import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useApplications } from "../hooks/useApplications";
import Header from "../components/layouts/Header";
import Footer from "../components/layouts/Footer";
import Sidebar from "../components/layouts/Sidebar";
import AddJobForm from "../components/features/AddJobForm";
import Modal from "../components/common/Modal";
import KanbanBoard from "../components/features/kanban/KanbanBoard";
import LoginModal from "../components/features/LoginModal";
import SignupModal from "../components/features/SignupModal";
import DashboardOverview from "../components/features/dashboard/DashboardOverview";
import AnalyticsPage from "../components/features/pages/AnalyticsPage";
import FavoritesPage from "../components/features/pages/FavoritesPage";
import SettingsPage from "../components/features/pages/SettingsPage";
import HelpPage from "../components/features/pages/HelpPage";
import PrivacyPage from "../components/features/pages/PrivacyPage";
import TermsPage from "../components/features/pages/TermsPage";
import { Toaster } from "react-hot-toast";
import "../styles/variables.css";
import "../styles/global.css";
import "./Dashboard.css";

const Dashboard = ({ view }) => {
  const navigate = useNavigate();
  const { user, login, signup, logout } = useAuth();
  const {
    applications,
    loading,
    addApplication,
    updateApplicationStatus,
    deleteApplication,
    refresh,
  } = useApplications(user?.id);

  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showAddJob, setShowAddJob] = useState(false);
  const [activeView, setActiveView] = useState(view || "overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sync activeView with view prop
  useEffect(() => {
    if (view) {
      setActiveView(view);
    }
  }, [view]);

  const openLogin = () => {
    setShowLogin(true);
    setShowSignup(false);
  };

  const openSignup = () => {
    setShowSignup(true);
    setShowLogin(false);
  };

  const handleJobAdded = (newJob) => {
    console.log("Job added:", newJob);
    // refresh() is handled by real-time subscription in useApplications
  };

  const handleJobsUpdate = (updatedJobs) => {
    console.log("Jobs updated:", updatedJobs);
  };

  const handleViewChange = (newView) => {
    setActiveView(newView);
    navigate(`/${newView}`);
  };

  return (
    <div className="dashboard-page">
      <Toaster
        toastOptions={{
          style: {
            background: "#363636",
            color: "#fff",
            borderRadius: "8px",
            fontSize: "14px",
          },
          success: {
            duration: 3000,
            theme: { primary: "#10b981" },
          },
        }}
      />

      {user && (
        <Sidebar
          activeView={activeView}
          onViewChange={(v) => {
            handleViewChange(v);
            setIsMobileMenuOpen(false);
          }}
          applications={applications}
          userName={user?.user_metadata?.name || "User"}
          userEmail={user?.email || "user@example.com"}
          onLogout={logout}
          isMobileOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className="dashboard-layout">
        <main className={`dashboard-main ${user ? "with-sidebar" : ""}`}>
          {user ? (
            <>
               <Header
                user={user}
                onLogout={logout}
                onLoginClick={openLogin}
                onSignupClick={openSignup}
                onMenuClick={() => setIsMobileMenuOpen(true)}
                hideLogo={true}
              />

              <div className="dashboard-content">
                <div className="dashboard-header">
                  <h2 className="dashboard-title">
                    {activeView === "overview" ? "Tổng quan" : 
                     activeView === "kanban" ? "Kanban Board" : 
                     activeView === "favorites" ? "Yêu thích" :
                     activeView === "analytics" ? "Phân tích" :
                     activeView === "settings" ? "Cài đặt" :
                     activeView === "privacy" ? "Chính sách bảo mật" :
                     activeView === "terms" ? "Điều khoản sử dụng" : "Trợ giúp"}
                  </h2>
                  {activeView === "overview" && (
                    <button
                      className="btn-add-job"
                      onClick={() => setShowAddJob(true)}
                    >
                      + Tạo hồ sơ mới
                    </button>
                  )}
                </div>

                {activeView === "overview" ? (
                  <DashboardOverview 
                    applications={applications} 
                  />
                ) : activeView === "kanban" ? (
                  <KanbanBoard
                    jobs={applications}
                    onJobsUpdate={handleJobsUpdate}
                    onStatusChange={refresh}
                  />
                ) : activeView === "favorites" ? (
                  <FavoritesPage userId={user.id} />
                ) : activeView === "analytics" ? (
                  <AnalyticsPage applications={applications} />
                ) : activeView === "settings" ? (
                  <SettingsPage user={user} />
                ) : activeView === "privacy" ? (
                  <PrivacyPage />
                ) : activeView === "terms" ? (
                  <TermsPage />
                ) : (
                  <HelpPage />
                )}
              </div>

              <Footer />
            </>
          ) : (
            <>
              <Header
                user={user}
                onLogout={logout}
                onLoginClick={openLogin}
                onSignupClick={openSignup}
              />

              <div className="welcome-section">
                <div className="welcome-content">
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
              </div>

              <Footer />
            </>
          )}
        </main>
      </div>

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

      {/* Add Job Modal */}
      <Modal
        isOpen={showAddJob}
        onClose={() => setShowAddJob(false)}
        title="Tạo hồ sơ ứng tuyển mới"
        className="large"
      >
        <AddJobForm
          onJobAdded={handleJobAdded}
          onClose={() => setShowAddJob(false)}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;
