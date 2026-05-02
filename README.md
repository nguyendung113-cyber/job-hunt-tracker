# 🚀 JobUp PRO - Smart Job Application Tracker

**JobUp PRO** là nền tảng quản lý hành trình tìm việc hiện đại, giúp ứng viên theo dõi, tối ưu và chinh phục các cơ hội nghề nghiệp một cách chuyên nghiệp. Ứng dụng được thiết kế với tư duy **SaaS-first**, tập trung vào trải nghiệm người dùng mượt mà và khả năng quản lý dữ liệu thời gian thực.

---

## ✨ Tính năng nổi bật

### 📋 Quản lý Kanban thông minh
Theo dõi tiến trình ứng tuyển qua mô hình Kanban trực quan:
- **Kéo thả mượt mà:** Chuyển đổi trạng thái từ *Đã nộp đơn* sang *Phỏng vấn* hoặc *Nhận Offer*.
- **Cập nhật nhanh:** Tích hợp lịch hẹn phỏng vấn ngay trên thẻ công việc.

### 📊 Phân tích & Trực quan hóa dữ liệu
Hệ thống báo cáo chi tiết giúp bạn hiểu rõ hiệu suất tìm việc:
- **Biểu đồ tỷ lệ:** Theo dõi tỷ lệ chuyển đổi giữa các giai đoạn.
- **Xu hướng ứng tuyển:** Biểu đồ tần suất nộp đơn theo thời gian.
- **Chỉ số hiệu quả:** Đánh giá mức độ thành công của các hồ sơ.

### 📄 Quản lý tài liệu (CV Management)
- **Cloud Storage:** Upload và lưu trữ CV trực tiếp trên hệ thống (Supabase Storage).
- **Gắn thẻ thông minh:** Liên kết phiên bản CV cụ thể cho từng vị trí ứng tuyển.

### 🌓 Giao diện Premium & Dark Mode
- **Trải nghiệm đẳng cấp:** Giao diện được thiết kế theo phong cách hiện đại, tối giản.
- **Dark Mode toàn diện:** Bảo vệ mắt và tiết kiệm pin với hệ thống theme thông minh.

### 🔒 Bảo mật tuyệt đối
- **Row Level Security (RLS):** Dữ liệu của bạn được cô lập hoàn toàn, chỉ bạn mới có quyền truy cập.
- **Xác thực an toàn:** Hệ thống đăng nhập/đăng ký tiêu chuẩn qua Supabase Auth.

---

## 🛠 Tech Stack

- **Frontend:** 
  - React.js (Vite)
  - Context API (State Management)
  - Recharts (Data Visualization)
  - Lucide React (Icons)
  - React Hot Toast (Notifications)
- **Backend-as-a-Service:** 
  - Supabase (PostgreSQL, Auth, Storage, Real-time)
- **Testing:**
  - Vitest (Unit Testing)
  - React Testing Library
- **Styling:** 
  - Vanilla CSS (Custom Design System)

---

## 📦 Cài đặt và Chạy dự án

### 1. Yêu cầu hệ thống
- Node.js (v18+)
- Tài khoản Supabase (để cấu hình backend)

### 2. Cấu hình môi trường
Tạo file `.env` tại thư mục gốc và thêm các biến sau:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Chạy ứng dụng
```bash
# Cài đặt thư viện
npm install

# Chạy ở chế độ phát triển
npm run dev

# Build sản phẩm
npm run build
```

### 4. Chạy Kiểm thử (Unit Test)
```bash
# Chạy test terminal
npm test

# Mở giao diện test UI
npm run test:ui
```

---

## 📂 Cấu trúc thư mục

```text
src/
├── components/
│   ├── common/         # Các component dùng chung (Modal, Button...)
│   ├── features/       # Các tính năng chính (Kanban, Analytics, Settings...)
│   └── layouts/        # Layout tổng thể (Header, Footer, Sidebar)
├── contexts/           # Quản lý state toàn cục (Auth, Theme, Applications)
├── hooks/              # Custom hooks xử lý logic
├── lib/                # Cấu hình thư viện bên ngoài (Supabase)
├── services/           # Lớp xử lý API & Business Logic
├── utils/              # Các hàm tiện ích & Helpers
└── styles/             # Hệ thống Design System & Variables
```

---

## 📝 Giấy phép
Dự án được phát hành dưới giấy phép [MIT](LICENSE).

---
**JobUp PRO** - *Nâng tầm hành trình sự nghiệp của bạn.*