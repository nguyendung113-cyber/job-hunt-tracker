🚀 JobUp - Job Application Tracker
JobUp là một ứng dụng web giúp người dùng theo dõi và quản lý quá trình ứng tuyển công việc, đặc biệt tối ưu cho lộ trình chinh phục các công ty Nhật Bản. Hệ thống cho phép quản lý trạng thái từ lúc nộp đơn đến khi nhận Offer thông qua mô hình Kanban trực quan.

🛠 Tech Stack
Frontend: React.js (Vite), Lucide React (Icons), React Hot Toast (Notifications).

Backend as a Service: Supabase (Auth & PostgreSQL).

DevOps: Docker & Docker Compose.

Security: Row Level Security (RLS) đảm bảo dữ liệu riêng tư cho từng user.

✨ Tính năng hiện có
[x] Authentication: Đăng ký, đăng nhập và đăng xuất qua Supabase Auth.

[x] Real-time Notify: Thông báo trạng thái hoạt động qua Toast.

[x] User Privacy: Mỗi người dùng chỉ quản lý và nhìn thấy dữ liệu của riêng mình.

[x] Responsive Design: Giao diện hoạt động tốt trên cả Desktop và Mobile.

[x] Containerized: Triển khai nhanh chóng với Docker.

[x] Unit Testing: Hệ thống test suite với Vitest & React Testing Library.

📦 Cài đặt và Chạy dự án
1. Yêu cầu hệ thống
Node.js (v18+)
Docker & Docker Compose

2. Chạy ứng dụng
```bash
npm install
npm run dev
```

3. Chạy Unit Test
```bash
# Chạy test một lần
npm test

# Chạy test với giao diện UI trực quan
npm run test:ui
```

Tài khoản Supabase