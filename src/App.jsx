import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import Header from "./components/Header.jsx";
import { Toaster } from "react-hot-toast";
import AddJobForm from "./components/AddJobForm";
import KanbanBoard from "./components/KanbanBoard";
import "./App.css";
import Footer from "./components/Footer"; // Thêm dòng này ở đầu file

function App() {
  const [user, setUser] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleJobAdded = () => {
    setRefreshKey((prev) => prev + 1); // Không cần window.location.reload() nữa
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="app-container">
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
      <Header user={user} />

      {/* Bọc toàn bộ nội dung vào dashboard-container để căn giữa */}
      <main className="dashboard-container">
        {user ? (
          <>
            <div className="dashboard-header">
              <h2>
                Bảng điều khiển công việc <span className="jp-badge">JP</span>
              </h2>
              <AddJobForm onJobAdded={handleJobAdded} />
            </div>

            <div className="board-wrapper">
              <KanbanBoard key={refreshKey} />
            </div>
          </>
        ) : (
          <div className="hero-section">
            <h1>Bắt đầu hành trình sự nghiệp tại Nhật Bản cùng JobUp</h1>
            <p>
              Đăng nhập để quản lý các đơn ứng tuyển của bạn một cách khoa học.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
