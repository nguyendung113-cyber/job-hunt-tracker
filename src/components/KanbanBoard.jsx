import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import toast from "react-hot-toast";

const KanbanBoard = () => {
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.log("Error:", error);
    else setJobs(data);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Hàm cập nhật trạng thái
  const handleStatusChange = async (jobId, newStatus) => {
    const { error } = await supabase
      .from("jobs")
      .update({ status: newStatus })
      .eq("id", jobId);

    if (!error) {
      // Cách 1: Cập nhật trực tiếp vào State hiện tại mà không cần load lại cả bảng
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.id === jobId ? { ...job, status: newStatus } : job,
        ),
      );
    }
  };

  const handleDelete = async (jobId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa công việc này?")) {
      console.log("🚀 Đang gửi yêu cầu xóa ID:", jobId);

      const { error, status } = await supabase
        .from("jobs")
        .delete()
        .eq("id", jobId);

      if (error) {
        console.error("❌ Lỗi xóa:", error.message);
        alert("Lỗi từ hệ thống: " + error.message);
      } else {
        console.log("✅ Xóa thành công! Mã trạng thái:", status);
        // Load lại dữ liệu để cập nhật giao diện
        fetchJobs();
      }
    }
  };
  // Hàm để render màu sắc cho từng trạng thái
  const getStatusStyle = (status) => {
    switch (status) {
      case "Applied":
        return "status-applied";
      case "Interviewing":
        return "status-interviewing";
      case "Offered":
        return "status-offered";
      case "Rejected":
        return "status-rejected";
      default:
        return "";
    }
  };

  return (
    <div className="table-container">
      <table className="job-table">
        <thead>
          <tr>
            <th>Công ty</th>
            <th>Vị trí</th>
            <th>Trình độ Nhật ngữ</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
            <th>Ghi chú</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id}>
              <td data-label="Công ty">
                <span className="company-name">{job.company_name}</span>
              </td>
              <td data-label="Vị trí">
                <span>{job.position}</span>
              </td>
              <td data-label="Trình độ">
                <span className="jlpt-badge">{job.japanese_level}</span>
              </td>
              {/* Cột Trạng thái: Chỉ hiển thị dạng Text Badge */}
              <td data-label="Trạng thái">
                <span
                  className={`status-pill status-${job.status?.toLowerCase()}`}
                >
                  {job.status}
                </span>
              </td>

              {/* Cột Thao tác: Nơi chứa các nút chức năng */}
              <td data-label="Thao tác" className="actions-cell">
                <div className="action-buttons">
                  {/* Nút Update nhanh trạng thái */}
                  <select
                    className="action-select"
                    value={job.status}
                    onChange={(e) => handleStatusChange(job.id, e.target.value)}
                    title="Cập nhật trạng thái"
                  >
                    <option value="" disabled>
                      Đổi trạng thái...
                    </option>
                    <option value="Applied">Applied</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Offered">Offered</option>
                    <option value="Rejected">Rejected</option>
                  </select>

                  {/* Nút Xóa */}
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(job.id)}
                    title="Xóa công việc"
                  >
                    🗑️
                  </button>
                </div>
              </td>
              <td data-label="Ghi chú" className="note-cell">
                {job.notes || "---"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default KanbanBoard;
