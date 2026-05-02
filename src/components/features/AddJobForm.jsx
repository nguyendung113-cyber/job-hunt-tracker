import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useApplications } from "../../hooks/useApplications";
import { useResumes } from "../../hooks/useResumes";
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
  const { resumes, addResume } = useResumes(user?.id);
  const [formData, setFormData] = useState(DEFAULT_JOB_DATA);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadData, setUploadData] = useState({
    file: null,
    versionName: ""
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Vui lòng đăng nhập để thêm công việc");
      return;
    }

    if (!formData.company_name?.trim() || !formData.position?.trim()) {
      toast.error("Vui lòng nhập tên công ty và vị trí ứng tuyển");
      return;
    }

    const formattedSalary = formData.salary_type === "negotiable" 
      ? "Thương lượng" 
      : `${Number(formData.salary_value).toLocaleString()} ${formData.salary_currency}`;

    try {
      setIsUploading(true);
      let resumeId = formData.resume_id;

      // Nếu người dùng chọn upload CV mới
      if (showUpload && uploadData.file) {
        if (!uploadData.versionName.trim()) {
          toast.error("Vui lòng nhập tên phiên bản CV mới");
          setIsUploading(false);
          return;
        }

        const file = uploadData.file;
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('resumes')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Create resume record
        const resumeResult = await addResume({
          file_path: filePath,
          version_name: uploadData.versionName,
          is_active: false
        });

        if (resumeResult.success) {
          resumeId = resumeResult.data.id;
        } else {
          throw resumeResult.error;
        }
      }
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
        salary: formattedSalary,
        job_url: formData.job_url || null,
        notes: formData.notes || null,
        resume_id: resumeId || null,
        interview_at: formData.status === "Interviewing" ? formData.interview_at : null,
        applied_at: new Date().toISOString(),
      };

      const result = await addApplication(applicationData);

      if (result.success) {
        setFormData(DEFAULT_JOB_DATA);
        setUploadData({ file: null, versionName: "" });
        setShowUpload(false);
        if (onJobAdded) onJobAdded(result.data);
        if (onClose) onClose();
      }
    } catch (err) {
      console.error("Error adding job:", err);
      toast.error(`Lỗi: ${err.message}`);
    } finally {
      setIsUploading(false);
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

      <div className="form-group">
        <div className="label-with-action">
          <label>CV sử dụng</label>
          <button 
            type="button" 
            className="btn-inline-action"
            onClick={() => setShowUpload(!showUpload)}
          >
            {showUpload ? "Chọn CV có sẵn" : "+ Tải CV mới"}
          </button>
        </div>

        {!showUpload ? (
          <select
            value={formData.resume_id}
            onChange={(e) => handleChange("resume_id", e.target.value)}
          >
            <option value="">Chọn CV hoặc dùng CV mặc định</option>
            {resumes.map((resume) => (
              <option key={resume.id} value={resume.id}>
                {resume.version_name} {resume.is_active ? "(Mặc định)" : ""}
              </option>
            ))}
          </select>
        ) : (
          <div className="inline-upload-form">
            <input
              type="text"
              placeholder="Tên phiên bản (VD: CV 2024...)"
              value={uploadData.versionName}
              onChange={(e) => setUploadData({ ...uploadData, versionName: e.target.value })}
              className="mb-2"
            />
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setUploadData({ ...uploadData, file: e.target.files[0] })}
            />
          </div>
        )}
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

      <div className="form-row">
        <div className="form-group">
          <label>Mức lương</label>
          <div className="salary-input-group">
            <div className="salary-type-toggle">
              <label className="radio-label">
                <input
                  type="radio"
                  name="salary_type"
                  checked={formData.salary_type === "negotiable"}
                  onChange={() => handleChange("salary_type", "negotiable")}
                />
                <span>Thương lượng</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="salary_type"
                  checked={formData.salary_type === "fixed"}
                  onChange={() => handleChange("salary_type", "fixed")}
                />
                <span>Cố định</span>
              </label>
            </div>
            
            {formData.salary_type === "fixed" && (
              <div className="salary-value-input">
                <input
                  type="number"
                  placeholder="Nhập số tiền..."
                  value={formData.salary_value}
                  onChange={(e) => handleChange("salary_value", e.target.value)}
                  min="0"
                  required={formData.salary_type === "fixed"}
                />
                <select 
                  value={formData.salary_currency} 
                  onChange={(e) => handleChange("salary_currency", e.target.value)}
                  className="currency-select"
                >
                  <option value="VNĐ">VNĐ</option>
                  <option value="USD">USD</option>
                  <option value="JPY">JPY</option>
                </select>
              </div>
            )}
          </div>
        </div>
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

      {formData.status === "Interviewing" && (
        <div className="form-group">
          <label>Ngày & Giờ phỏng vấn</label>
          <input
            type="datetime-local"
            value={formData.interview_at}
            onChange={(e) => handleChange("interview_at", e.target.value)}
            required={formData.status === "Interviewing"}
          />
        </div>
      )}

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
        <button type="submit" className="btn-submit" disabled={isLoading || isUploading}>
          {isLoading || isUploading ? "Đang xử lý..." : "Lưu hồ sơ"}
        </button>
      </div>
      <style>{`
        .salary-input-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: #f9fafb;
          padding: 16px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }
        .salary-type-toggle {
          display: flex;
          gap: 20px;
        }
        .radio-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-weight: 500;
          color: #374151;
        }
        .radio-label input {
          width: 18px !important;
          height: 18px;
          cursor: pointer;
        }
        .salary-value-input {
          display: flex;
          gap: 8px;
          animation: slideIn 0.2s ease-out;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .currency-select {
          width: 100px;
          padding: 8px;
          border-radius: 6px;
          border: 1px solid #d1d5db;
        }
        @media (min-width: 768px) {
          .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }
        }
        .label-with-action {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .label-with-action label {
          margin-bottom: 0;
        }
        .btn-inline-action {
          background: none;
          border: none;
          color: #3b82f6;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
        }
        .btn-inline-action:hover {
          text-decoration: underline;
        }
        .inline-upload-form {
          background: #f3f4f6;
          padding: 12px;
          border-radius: 8px;
          border: 1px dashed #d1d5db;
        }
        .mb-2 {
          margin-bottom: 8px;
        }
      `}</style>
    </form>
  );
};

export default AddJobForm;
