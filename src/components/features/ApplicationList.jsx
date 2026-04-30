import React, { useState } from "react";
import { useApplications } from "../../hooks/useApplications";
import { useCompanies } from "../../hooks/useCompanies";
import { useResumes } from "../../hooks/useResumes";
import {
  Briefcase,
  Building2,
  ChevronDown,
  ChevronUp,
  Trash2,
  Plus,
} from "lucide-react";
import { JOB_STATUS, STATUS_LABELS } from "../../constants/jobStatus";
import "./ApplicationList.css";

const ApplicationList = ({ userId }) => {
  const {
    applications,
    loading,
    addApplication,
    updateApplicationStatus,
    deleteApplication,
    getStatistics,
  } = useApplications(userId);

  const { companies } = useCompanies(userId);
  const { resumes } = useResumes(userId);

  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const [formData, setFormData] = useState({
    company_id: "",
    resume_id: "",
    job_title: "",
    status: JOB_STATUS.APPLIED,
  });

  const stats = getStatistics();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await addApplication({
      ...formData,
      company_id: formData.company_id || null,
      resume_id: formData.resume_id || null,
    });

    if (result.success) {
      setFormData({
        company_id: "",
        resume_id: "",
        job_title: "",
        status: JOB_STATUS.APPLIED,
      });
      setShowForm(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    await updateApplicationStatus(appId, newStatus);
  };

  const handleDelete = async (appId) => {
    await deleteApplication(appId);
  };

  const toggleExpand = (appId) => {
    setExpandedId(expandedId === appId ? null : appId);
  };

  const statusOptions = Object.entries(STATUS_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  return (
    <div className="application-list">
      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat-card total">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Tổng đơn</span>
        </div>
        <div className="stat-card applied">
          <span className="stat-value">{stats[JOB_STATUS.APPLIED]}</span>
          <span className="stat-label">Đã nộp</span>
        </div>
        <div className="stat-card interviewing">
          <span className="stat-value">{stats[JOB_STATUS.INTERVIEWING]}</span>
          <span className="stat-label">Phỏng vấn</span>
        </div>
        <div className="stat-card offered">
          <span className="stat-value">{stats[JOB_STATUS.OFFERED]}</span>
          <span className="stat-label">Offer</span>
        </div>
      </div>

      {/* Add Button */}
      <button
        className="add-application-btn"
        onClick={() => setShowForm(!showForm)}
      >
        <Plus size={18} />
        {showForm ? "Đóng form" : "Thêm đơn ứng tuyển"}
      </button>

      {/* Application Form */}
      {showForm && (
        <form className="application-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Tên công việc *</label>
              <input
                type="text"
                placeholder="VD: Frontend Developer"
                value={formData.job_title}
                onChange={(e) =>
                  setFormData({ ...formData, job_title: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Công ty</label>
              <select
                value={formData.company_id}
                onChange={(e) =>
                  setFormData({ ...formData, company_id: e.target.value })
                }
              >
                <option value="">Chọn công ty</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>CV sử dụng</label>
              <select
                value={formData.resume_id}
                onChange={(e) =>
                  setFormData({ ...formData, resume_id: e.target.value })
                }
              >
                <option value="">CV mặc định</option>
                {resumes.map((resume) => (
                  <option key={resume.id} value={resume.id}>
                    {resume.version_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Trạng thái</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Đang lưu..." : "Thêm đơn ứng tuyển"}
          </button>
        </form>
      )}

      {/* Applications */}
      <div className="applications">
        {loading && applications.length === 0 ? (
          <div className="loading">Đang tải...</div>
        ) : applications.length === 0 ? (
          <div className="empty-state">
            <Briefcase size={40} />
            <p>Chưa có đơn ứng tuyển nào</p>
            <span>Thêm đơn đầu tiên của bạn</span>
          </div>
        ) : (
          applications.map((app) => (
            <div key={app.id} className="application-card">
              <div className="card-header" onClick={() => toggleExpand(app.id)}>
                <div className="app-info">
                  <h4>{app.job_title}</h4>
                  <div className="app-meta">
                    {app.companies && (
                      <span className="company">
                        <Building2 size={14} />
                        {app.companies.name}
                      </span>
                    )}
                    <span className="date">
                      {new Date(app.applied_at).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </div>

                <div className="card-right">
                  <span className={`status-badge ${app.status?.toLowerCase()}`}>
                    {STATUS_LABELS[app.status] || app.status}
                  </span>
                  {expandedId === app.id ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </div>
              </div>

              {expandedId === app.id && (
                <div className="card-body">
                  <div className="detail-row">
                    <label>Trạng thái:</label>
                    <select
                      value={app.status}
                      onChange={(e) =>
                        handleStatusChange(app.id, e.target.value)
                      }
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {app.resumes && (
                    <div className="detail-row">
                      <label>CV:</label>
                      <span>{app.resumes.version_name}</span>
                    </div>
                  )}

                  <div className="card-actions">
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(app.id)}
                    >
                      <Trash2 size={16} />
                      Xóa
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ApplicationList;
