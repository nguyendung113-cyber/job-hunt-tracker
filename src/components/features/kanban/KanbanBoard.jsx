import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import toast from "react-hot-toast";
import { GripVertical, AlertTriangle } from "lucide-react";
import { JOB_STATUS, KANBAN_COLUMNS } from "../../../constants/jobStatus";
import "./KanbanBoard.css";

const KanbanBoard = ({ jobs = [], onJobsUpdate, onStatusChange }) => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [localJobs, setLocalJobs] = useState(jobs);
  const [loading, setLoading] = useState(true); // Thêm state loading

  // Sync local jobs with props
  useEffect(() => {
    console.log("Received jobs:", jobs); // Log dữ liệu jobs để kiểm tra
    setLocalJobs(jobs);
  }, [jobs]);

  useEffect(() => {
    // Fetch latest jobs from server when component mounts
    const fetchLatestJobs = async () => {
      try {
        setLoading(true); // Bắt đầu loading
        const { data, error } = await supabase.from("applications").select(`
            *,
            companies (id, name, website),
            resumes (id, version_name)
          `);

        if (error) throw error;

        setLocalJobs(data || []);
      } catch (err) {
        console.error("Error fetching latest jobs:", err);
        toast.error("Không thể tải dữ liệu mới nhất từ server.");
      } finally {
        setLoading(false); // Kết thúc loading
      }
    };

    fetchLatestJobs();
  }, []);

  if (loading) {
    return (
      <div className="kanban-loading">
        <div className="spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  const handleDragStart = (e, job) => {
    setDraggedItem(job);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", job.id);
    e.target.classList.add("is-dragging");
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove("is-dragging");
    setDraggedItem(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    if (columnId !== dragOverColumn) {
      setDragOverColumn(columnId);
    }
  };

  const handleDragLeave = (e, columnId) => {
    // Only set to null if we're actually leaving the column
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setDragOverColumn(null);
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    setDragOverColumn(null);

    if (!draggedItem || draggedItem.status === newStatus) return;

    const applicationId = draggedItem.id;

    // WIP Limit check for "In Progress" column
    if (newStatus === JOB_STATUS.INTERVIEWING) {
      const inProgressCount = localJobs.filter(
        (j) => j.status === JOB_STATUS.INTERVIEWING,
      ).length;
      if (inProgressCount >= 4) {
        toast.error("Đã đạt giới hạn WIP cho cột In Progress (4)");
        return;
      }
    }

    // Optimistic Update
    const updatedJobs = localJobs.map((job) =>
      job.id === applicationId ? { ...job, status: newStatus } : job,
    );
    setLocalJobs(updatedJobs);
    onJobsUpdate?.(updatedJobs);

    try {
      const { data, error } = await supabase
        .from("applications")
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", applicationId).select(`
          *,
          companies (id, name, website),
          resumes (id, version_name)
        `);

      if (error) throw error;

      toast.success(
        `Đã chuyển sang ${KANBAN_COLUMNS.find((c) => c.id === newStatus)?.title}`,
      );

      // Trigger callback to refresh sidebar stats
      onStatusChange?.();

      // Update with server data
      if (data && data.length > 0) {
        setLocalJobs((prev) =>
          prev.map((job) => (job.id === applicationId ? data[0] : job)),
        );
      }
    } catch (err) {
      console.error("Error updating job status:", err);

      // Rollback on error
      setLocalJobs(jobs);
      onJobsUpdate?.(jobs);

      toast.error("Lỗi cập nhật trạng thái. Vui lòng thử lại!");
    }
  };

  const getColumnCount = (columnId) => {
    return localJobs.filter((j) => j.status === columnId).length;
  };

  const isWipLimitReached = (column) => {
    if (!column.wipLimit) return false;
    return getColumnCount(column.id) >= column.wipLimit;
  };

  return (
    <div className="kanban-container">
      {/* Main Kanban Board */}
      <div className="kanban-board">
        {KANBAN_COLUMNS.map((col) => {
          const columnJobs = localJobs.filter((j) => j.status === col.id);
          const count = columnJobs.length;
          const isOverLimit = isWipLimitReached(col);

          return (
            <div
              key={col.id}
              className={`kanban-column ${dragOverColumn === col.id ? "is-dragging-over" : ""}`}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDrop={(e) => handleDrop(e, col.id)}
              onDragLeave={(e) => handleDragLeave(e, col.id)}
            >
              <div
                className="column-header"
                style={{ backgroundColor: col.color }}
              >
                <span className="status-icon">{col.icon}</span>
                <span>{col.title}</span>
                <span className="column-count">{count}</span>
              </div>

              <div className="column-content">
                {columnJobs.map((job) => (
                  <div
                    key={job.id}
                    className="job-card"
                    draggable
                    onDragStart={(e) => handleDragStart(e, job)}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="card-drag-handle">
                      <GripVertical size={16} />
                    </div>
                    <div className="card-info">
                      <h4 className="company-name">
                        {job.companies?.name ||
                          job.company_name ||
                          "Chưa có tên công ty"}
                      </h4>
                      <p className="job-position">
                        {job.job_title || job.position || "Chưa có vị trí"}
                      </p>
                      {job.japanese_level && (
                        <span
                          className={`level-badge ${job.japanese_level.toLowerCase()}`}
                        >
                          {job.japanese_level}
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {columnJobs.length === 0 && (
                  <div
                    style={{
                      padding: "20px",
                      textAlign: "center",
                      color: "#9ca3af",
                      border: "2px dashed #d1d5db",
                      borderRadius: "6px",
                    }}
                  >
                    Kéo thả công việc vào đây
                  </div>
                )}
              </div>

              {isOverLimit && (
                <div className="wip-limit-warning">
                  <AlertTriangle
                    size={12}
                    style={{ display: "inline", marginRight: "4px" }}
                  />
                  Đã đạt giới hạn WIP
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KanbanBoard;
