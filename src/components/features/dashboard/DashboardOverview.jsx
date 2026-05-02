import React from "react";
import { 
  Briefcase, 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp,
  Calendar,
  ArrowRight
} from "lucide-react";
import StatsCard from "./StatsCard";
import { JOB_STATUS, STATUS_COLORS } from "../../../constants/jobStatus";
import "./DashboardOverview.css";

const DashboardOverview = ({ applications = [] }) => {
  // Helpers for trend calculation
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);

  // Calculate stats
  const total = applications.length;
  const interviewing = applications.filter(j => j.status === JOB_STATUS.INTERVIEWING).length;
  const offered = applications.filter(j => j.status === JOB_STATUS.OFFERED).length;
  const rejected = applications.filter(j => j.status === JOB_STATUS.REJECTED).length;

  // Calculate trends (comparing total count today vs total count up to yesterday)
  const appsBeforeToday = applications.filter(app => new Date(app.created_at) < startOfToday).length;
  const totalTrend = appsBeforeToday > 0 
    ? Math.round(((total - appsBeforeToday) / appsBeforeToday) * 100) 
    : 0;

  const offersBeforeToday = applications.filter(app => 
    app.status === JOB_STATUS.OFFERED && new Date(app.created_at) < startOfToday
  ).length;
  const offersTrend = offersBeforeToday > 0 
    ? Math.round(((offered - offersBeforeToday) / offersBeforeToday) * 100) 
    : 0;

  // Recent applications (top 5)
  const recentApplications = [...applications]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  return (
    <div className="dashboard-overview">
      <div className="overview-welcome">
        <div>
          <h1>Xin chào! 👋</h1>
          <p>Dưới đây là tóm tắt tiến trình tìm việc của bạn.</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatsCard 
          title="Tổng số hồ sơ" 
          value={total} 
          icon={<Briefcase size={20} />} 
          color="#3b82f6" 
          trend={totalTrend > 0 ? "up" : totalTrend < 0 ? "down" : null}
          trendValue={Math.abs(totalTrend)}
        />
        <StatsCard 
          title="Đang phỏng vấn" 
          value={interviewing} 
          icon={<Clock size={20} />} 
          color="#f59e0b" 
        />
        <StatsCard 
          title="Nhận Offer" 
          value={offered} 
          icon={<CheckCircle size={20} />} 
          color="#10b981" 
          trend={offersTrend > 0 ? "up" : offersTrend < 0 ? "down" : null}
          trendValue={Math.abs(offersTrend)}
        />
        <StatsCard 
          title="Bị từ chối" 
          value={rejected} 
          icon={<XCircle size={20} />} 
          color="#ef4444" 
        />
      </div>

      <div className="overview-content-grid">
        <div className="recent-apps-section">
          <div className="section-header">
            <h3>Hồ sơ gần đây</h3>
            <button className="btn-text">Xem tất cả <ArrowRight size={14} /></button>
          </div>
          <div className="apps-list">
            {recentApplications.length > 0 ? (
              recentApplications.map(app => (
                <div key={app.id} className="app-item">
                  <div className="app-info">
                    <div>
                      <div className="app-company">{app.companies?.name || "Công ty chưa xác định"}</div>
                      <div className="app-position">{app.position}</div>
                      {app.interview_at && (
                        <div className="app-interview-date">
                          📅 Phỏng vấn: {new Date(app.interview_at).toLocaleString('vi-VN', { 
                            day: '2-digit', 
                            month: '2-digit', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="app-status-badge" style={{ 
                    backgroundColor: `${STATUS_COLORS[app.status]}15`,
                    color: STATUS_COLORS[app.status]
                  }}>
                    {app.status}
                  </div>
                  <div className="app-date">
                    {new Date(app.created_at).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">Chưa có hồ sơ nào. Hãy bắt đầu ngay!</div>
            )}
          </div>
        </div>

        <div className="insights-section">
          <div className="section-header">
            <h3>Phân tích nhanh</h3>
          </div>
          <div className="insight-card">
            <div className="insight-icon"><TrendingUp size={20} /></div>
            <div className="insight-text">
              <h4>Tỷ lệ phản hồi</h4>
              <p>Tăng 15% so với tháng trước</p>
            </div>
            <div className="insight-value">68%</div>
          </div>
          <div className="insight-card">
            <div className="insight-icon"><Calendar size={20} /></div>
            <div className="insight-text">
              <h4>Sự kiện sắp tới</h4>
              <p>Phỏng vấn với Google vào Thứ 4</p>
            </div>
            <div className="insight-value">2</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
