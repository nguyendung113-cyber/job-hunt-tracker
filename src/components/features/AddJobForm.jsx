import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useApplications } from "../../hooks/useApplications";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";
import {
  JOB_STATUS_OPTIONS,
  JOB_TYPE_OPTIONS,
  WORK_MODE_OPTIONS,
  DEFAULT_JOB_DATA,
} from "../../utils/helpers";
import "./AddJobForm.css";

const AddJobForm = ({ onJobAdded, onClose }) => {
  const { user } = useAuth();
  const { addApplication, loading: isLoading } = useApplications(user?.id);
  const [formData, setFormData] = useState(DEFAULT_JOB_DATA);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Vui lòng đăng nhập để thêm công việc");
      return;
    }

    if (!formData.company_name || !formData.position) {
      toast.error("Vui lòng nhập tên công ty và vị trí");
      return;
    }

    try {
      // Tìm hoặc tạo company trước
      let companyId;

      // Tìm company theo tên
      const { data: existingCompanies } = await supabase
        .from("companies")
        .select("id")
        .eq("user_id", user.id)
        .ilike("name", `%${formData.company_name}%`)
        .limit(1);

      if (existingCompanies && existingCompanies.length > 0) {
        companyId = existingCompanies[0].id;
      } else {
        // Tạo company mới
        const { data: newCompany, error: companyError } = await supabase
          .from("companies")
          .insert([
            {
              user_id: user.id,
              name: formData.company_name,
              website: formData.job_url,
            },
          ])
          .select("id")
          .single();

        if (companyError) throw companyError;
        companyId = newCompany.id;
      }

      // Tạo application
      const applicationData = {
        user_id: user.id,
        company_id: companyId,
        job_title: formData.position,
        status: formData.status || "Applied",
        job_type: formData.job_type || "Full-time",
        work_mode: formData.work_mode || "On-site",
        location: formData.location || null,
        salary: formData.salary || null,
        job_url: formData.job_url || null,
        notes: formData.notes || null,
        applied_at: new Date().toISOString(),
      };

      const result = await addApplication(applicationData);

      if (result.success) {
        setFormData(DEFAULT_JOB_DATA);
        if (onJobAdded) onJobAdded(result.data);
        if (onClose) onClose();
      }
    } catch (err) {
      console.error("Error adding job:", err);
      toast.error(`Lỗi: ${err.message}`);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form className="add-job-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Tên công ty *</label>
        <input
          type="text"
          placeholder="VD: Google, Microsoft, FPT..."
          value={formData.company_name}
          onChange={(e) => handleChange("company_name", e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Vị trí ứng tuyển *</label>
        <input
          type="text"
          placeholder="VD: Frontend Developer, Backend Engineer..."
          value={formData.position}
          onChange={(e) => handleChange("position", e.target.value)}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Trạng thái</label>
          <select
            value={formData.status}
            onChange={(e) => handleChange("status", e.target.value)}
          >
            {JOB_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Loại hình</label>
          <select
            value={formData.job_type}
            onChange={(e) => handleChange("job_type", e.target.value)}
          >
            {JOB_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Hình thức làm việc</label>
          <select
            value={formData.work_mode}
            onChange={(e) => handleChange("work_mode", e.target.value)}
          >
            {WORK_MODE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Địa điểm</label>
          <input
            type="text"
            placeholder="VD: Hà Nội, TP.HCM, Remote..."
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Mức lương</label>
        <input
          type="text"
          placeholder="VD: 20-30 triệu, Thương lượng..."
          value={formData.salary}
          onChange={(e) => handleChange("salary", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Link JD (Job Description)</label>
        <input
          type="url"
          placeholder="https://..."
          value={formData.job_url}
          onChange={(e) => handleChange("job_url", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Ghi chú</label>
        <textarea
          placeholder="Ghi chú về văn hóa công ty, quy trình phỏng vấn, hoặc chuẩn bị..."
          value={formData.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
        />
      </div>

      <div className="form-actions">
        <button type="button" className="btn-cancel" onClick={onClose}>
          Hủy
        </button>
        <button type="submit" className="btn-submit" disabled={isLoading}>
          {isLoading ? "Đang lưu..." : "Lưu hồ sơ"}
        </button>
      </div>
    </form>
  );
};

export default AddJobForm;
