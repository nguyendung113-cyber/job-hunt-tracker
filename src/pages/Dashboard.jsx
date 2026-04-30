import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useApplications } from "../hooks/useApplications";
import Header from "../components/layouts/Header";
import Footer from "../components/layouts/Footer";
import Sidebar from "../components/layouts/Sidebar";
import AddJobForm from "../components/features/AddJobForm";
import KanbanBoard from "../components/features/kanban/KanbanBoard";
import ApplicationList from "../components/features/ApplicationList";
import LoginModal from "../components/features/LoginModal";
import SignupModal from "../components/features/SignupModal";
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
  const [activeView, setActiveView] = useState(view || "kanban");

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
          onViewChange={handleViewChange}
          applications={applications}
          userName={user?.user_metadata?.name || "User"}
          userEmail={user?.email || "user@example.com"}
          onLogout={logout}
        />
      )}

      <div className="dashboard-layout">
        <main className="dashboard-main">
          {user ? (
            <>
              <Header
                user={user}
                onLogout={logout}
                onLoginClick={openLogin}
                onSignupClick={openSignup}
              />

              <div className="dashboard-content">
                <div className="dashboard-header">
                  <h2 className="dashboard-title">
                    {activeView === "kanban" ? "Kanban Board" : "Table View"}
                  </h2>
                </div>

                <AddJobForm onJobAdded={handleJobAdded} />

                {activeView === "kanban" ? (
                  <KanbanBoard
                    jobs={applications}
                    onJobsUpdate={handleJobsUpdate}
                  />
                ) : (
                  <ApplicationList userId={user.id} />
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
    </div>
  );
};

export default Dashboard;
