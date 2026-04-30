import React, { useState } from "react";
import { useCompanies } from "../../hooks/useCompanies";
import "./CompanyForm.css";

const CompanyForm = ({ onCompanyAdded, editCompany = null }) => {
  const { addCompany, updateCompany, loading } = useCompanies();

  const [formData, setFormData] = useState({
    name: editCompany?.name || "",
    website: editCompany?.website || "",
    notes: editCompany?.notes || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    let result;
    if (editCompany) {
      result = await updateCompany(editCompany.id, formData);
    } else {
      result = await addCompany(formData);
    }

    if (result.success) {
      setFormData({ name: "", website: "", notes: "" });
      if (onCompanyAdded) onCompanyAdded(result.data);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form className="company-form" onSubmit={handleSubmit}>
      <h3>{editCompany ? "Sửa thông tin công ty" : "Thêm công ty mới"}</h3>

      <div className="form-group">
        <label htmlFor="companyName">Tên công ty *</label>
        <input
          id="companyName"
          type="text"
          placeholder="VD: Rakuten, FPT Japan..."
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="companyWebsite">Website</label>
        <input
          id="companyWebsite"
          type="url"
          placeholder="https://company.com"
          value={formData.website}
          onChange={(e) => handleChange("website", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="companyNotes">Ghi chú</label>
        <textarea
          id="companyNotes"
          placeholder="Thông tin thêm về công ty..."
          value={formData.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          rows={3}
        />
      </div>

      <div className="form-actions">Ư
        <button type="submit" disabled={loading}>
          {loading ? "Đang lưu..." : editCompany ? "Cập nhật" : "Thêm công ty"}
        </button>
      </div>
    </form>
  );
};

export default CompanyForm;
