import React, { useState } from "react";
import "./JobForm.css";

const JobForm = ({ onAddJob }) => {
  const [formData, setFormData] = useState({
    company_name: "",
    position: "",
    status: "pending",
    note: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddJob(formData);
    setFormData({
      company_name: "",
      position: "",
      status: "pending",
      note: "",
    });
  };

  return (
    <form className="job-form-container" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-group full-width">
          <input
            type="text"
            placeholder="Tên công ty (VD: Rakuten, FPT...)"
            value={formData.company_name}
            onChange={(e) =>
              setFormData({ ...formData, company_name: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Vị trí ứng tuyển (VD: ReactJS Developer)"
            value={formData.position}
            onChange={(e) =>
              setFormData({ ...formData, position: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
          >
            <option value="pending">Đã nộp đơn</option>
            <option value="interviewing">Phỏng vấn</option>
            <option value="offer">Nhận Offer</option>
            <option value="declined">Từ chối</option>
          </select>
        </div>

        <div className="form-group full-width">
          <textarea
            placeholder="Ghi chú về văn hóa công ty hoặc chuẩn bị phỏng vấn..."
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
          />
        </div>
      </div>

      <button type="submit" className="btn-submit">
        Thêm công việc
      </button>
    </form>
  );
};

export default JobForm;
