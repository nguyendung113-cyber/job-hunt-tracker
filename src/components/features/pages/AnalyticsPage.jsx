import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { TrendingUp, PieChart as PieIcon, Activity, DollarSign } from 'lucide-react';
import './AnalyticsPage.css';

const AnalyticsPage = ({ applications = [] }) => {
  const statusData = useMemo(() => {
    const counts = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [applications]);

  const timelineData = useMemo(() => {
    const days = applications.reduce((acc, app) => {
      const date = new Date(app.applied_at).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' });
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(days)
      .map(([date, count]) => ({ date, count }))
      .slice(-10); // Last 10 days
  }, [applications]);

  const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444'];

  return (
    <div className="analytics-page">
      <div className="analytics-grid">
        {/* Status Distribution */}
        <div className="analytics-card">
          <div className="card-header">
            <PieIcon size={20} />
            <h3>Tỷ lệ trạng thái</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Timeline Chart */}
        <div className="analytics-card">
          <div className="card-header">
            <TrendingUp size={20} />
            <h3>Tần suất ứng tuyển</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Conversion Stats */}
        <div className="analytics-card stats-summary">
          <div className="card-header">
            <Activity size={20} />
            <h3>Chỉ số hiệu quả</h3>
          </div>
          <div className="stats-list">
            <div className="stat-item">
              <span className="label">Tỷ lệ phản hồi</span>
              <div className="progress-bar">
                <div className="progress" style={{ width: '45%' }}></div>
              </div>
              <span className="value">45%</span>
            </div>
            <div className="stat-item">
              <span className="label">Tỷ lệ Phỏng vấn</span>
              <div className="progress-bar">
                <div className="progress" style={{ width: '20%', background: '#f59e0b' }}></div>
              </div>
              <span className="value">20%</span>
            </div>
            <div className="stat-item">
              <span className="label">Tỷ lệ Offer</span>
              <div className="progress-bar">
                <div className="progress" style={{ width: '5%', background: '#10b981' }}></div>
              </div>
              <span className="value">5%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
