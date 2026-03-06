import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import toast from "react-hot-toast";

const AddJobForm = ({ onJobAdded }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company_name: "",
    position: "Developer",
    status: "Applied",
    japanese_level: "N3", // Phải khớp chính xác tên cột trong SQL
    notes: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Lưu ý: user_id sẽ tự động được Supabase điền nhờ vào thiết lập RLS chúng ta đã làm
    const { data, error } = await supabase
      .from("jobs")
      .insert([formData])
      .select();

    if (error) {
      toast.error("Lỗi khi lưu: " + error.message);
    } else {
      toast.success("Đã thêm công việc mới! 🇯🇵");
      setFormData({
        company_name: "",
        position: "Developer",
        status: "Applied",
        japanese_level: "N3",
        notes: "",
      });
      if (onJobAdded) onJobAdded(data[0]); // Cập nhật danh sách hiển thị
    }
    setLoading(false);
  };

  return (
    <form className="add-job-form" onSubmit={handleSubmit}>
      <div className="form-group">
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

      <div className="form-row">
        <select
          value={formData.japanese_level}
          onChange={(e) =>
            setFormData({ ...formData, japanese_level: e.target.value })
          }
        >
          <option value="N1">N1</option>
          <option value="N2">N2</option>
          <option value="N3">N3</option>
          <option value="N4">N4</option>
          <option value="No JLPT">Không yêu cầu</option>
        </select>

        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          <option value="Applied">Đã nộp đơn</option>
          <option value="Interviewing">Phỏng vấn</option>
          <option value="Offered">Nhận Offer</option>
          <option value="Rejected">Từ chối</option>
        </select>
      </div>

      <textarea
        placeholder="Ghi chú về văn hóa công ty hoặc chuẩn bị phỏng vấn..."
        value={formData.notes}
        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Đang lưu..." : "Thêm công việc"}
      </button>
    </form>
  );
};

export default AddJobForm;
