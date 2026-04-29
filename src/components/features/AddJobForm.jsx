import React, { useState } from "react";
import { useJobs } from "../../hooks/useJobs";
import {
  JLPT_OPTIONS,
  JOB_STATUS_OPTIONS,
  DEFAULT_JOB_DATA,
} from "../../utils/helpers";
import "./AddJobForm.css";

const AddJobForm = ({ onJobAdded }) => {
  const { addJob, loading: isLoading } = useJobs();
  const [formData, setFormData] = useState(DEFAULT_JOB_DATA);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await addJob(formData);

    if (result.success) {
      setFormData(DEFAULT_JOB_DATA);
      if (onJobAdded) onJobAdded(result.data);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form className="add-job-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          placeholder="Tên công ty (VD: Rakuten, FPT...)"
          value={formData.company_name}
          onChange={(e) => handleChange("company_name", e.target.value)}
          required
        />
      </div>

      <div className="form-row">
        <select
          value={formData.japanese_level}
          onChange={(e) => handleChange("japanese_level", e.target.value)}
        >
          {JLPT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

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

      <textarea
        placeholder="Ghi chú về văn hóa công ty hoặc chuẩn bị phỏng vấn..."
        value={formData.notes}
        onChange={(e) => handleChange("notes", e.target.value)}
      />

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Đang lưu..." : "Thêm công việc"}
      </button>
    </form>
  );
};

export default AddJobForm;
