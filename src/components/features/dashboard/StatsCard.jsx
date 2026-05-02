import React from "react";
import "./DashboardOverview.css";

const StatsCard = ({ title, value, icon, color, trend, trendValue }) => {
  return (
    <div className="stats-card">
      <div className="stats-card-header">
        <div className="stats-card-icon" style={{ backgroundColor: `${color}15`, color: color }}>
          {icon}
        </div>
        {trend && (
          <div className={`stats-card-trend ${trend}`}>
            {trend === "up" ? "↑" : "↓"} {trendValue}%
          </div>
        )}
      </div>
      <div className="stats-card-body">
        <h3 className="stats-card-value">{value}</h3>
        <p className="stats-card-title">{title}</p>
      </div>
    </div>
  );
};

export default StatsCard;
