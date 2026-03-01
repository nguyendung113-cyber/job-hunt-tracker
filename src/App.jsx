import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import Header from './components/Header.jsx'
import { Toaster } from 'react-hot-toast';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 1. Kiểm tra session ngay khi load trang (để giữ đăng nhập khi F5)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // 2. Lắng nghe thay đổi trạng thái (Đây là phần quan trọng nhất!)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null); // Cập nhật user ngay khi Login thành công
    });

    return () => subscription.unsubscribe();
  }, []);
  
  return (
    <div className="app-container">
      {/* CHỖ CẦN SỬA: Truyền biến user xuống cho Header */}
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
      <Header user={user} />
      
      <main style={{ maxWidth: '1280px', margin: '0 auto', paddingTop: '100px', paddingLeft: '24px', paddingRight: '24px' }}>
        {/* Lời chào cá nhân hóa dựa trên trạng thái đăng nhập */}
        {user ? (
          <div className="welcome-section">
            <h2 style={{ fontSize: '2rem', color: '#111827' }}>
              Chào mừng trở lại, <span style={{ color: '#2563eb' }}>{user.email.split('@')[0]}</span>! 👋
            </h2>
            <p style={{ color: '#6b7280' }}>Hôm nay bạn muốn nộp đơn vào công ty nào?</p>
          </div>
        ) : (
          <h2 style={{ fontSize: '2rem', color: '#111827' }}>Chào mừng bạn đến với JobUp!</h2>
        )}
        
        {/* Code Kanban của bạn sẽ ở đây */}
      </main>
    </div>
  );
}

export default App