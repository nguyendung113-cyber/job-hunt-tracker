import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useApplications } from "../../hooks/useApplications";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";
import {
  JLPT_OPTIONS,
  JOB_STATUS_OPTIONS,
  DEFAULT_JOB_DATA,
} from "../../utils/helpers";
import "./AddJobForm.css";

const AddJobForm = ({ onJobAdded }) => {
  const { user } = useAuth();
  const { addApplication, loading: isLoading } = useApplications(user?.id);
  const [formData, setFormData] = useState(DEFAULT_JOB_DATA);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Vui lòng đăng nhập để thêm công việc");
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
        job_title: formData.position || "Developer",
        status: formData.status || "Applied",
        applied_at: new Date().toISOString(),
      };

      const result = await addApplication(applicationData);

      if (result.success) {
        setFormData(DEFAULT_JOB_DATA);
        if (onJobAdded) onJobAdded(result.data);
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
