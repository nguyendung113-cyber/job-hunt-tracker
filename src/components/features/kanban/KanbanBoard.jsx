import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import toast from "react-hot-toast";
import { GripVertical, AlertTriangle, Calendar, FileText, Heart } from "lucide-react";
import { JOB_STATUS, KANBAN_COLUMNS } from "../../../constants/jobStatus";
import { applicationService } from "../../../services/applicationService";
import { useApplicationsContext } from "../../../contexts/ApplicationsContext";
import { getResumeUrl } from "../../../utils/helpers";
import InterviewDateModal from "./InterviewDateModal";
import "./KanbanBoard.css";

const KanbanBoard = ({ jobs = [], onJobsUpdate, onStatusChange }) => {
  const { toggleFavoriteApplication } = useApplicationsContext();
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [localJobs, setLocalJobs] = useState(jobs);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState(null);

  useEffect(() => {
    setLocalJobs(jobs);
    if (jobs.length > 0) {
      setLoading(false);
    }
  }, [jobs]);

  // Handle initial loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
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

    // WIP Limit check
    if (newStatus === JOB_STATUS.INTERVIEWING) {
      const inProgressCount = localJobs.filter(
        (j) => j.status === JOB_STATUS.INTERVIEWING,
      ).length;
      if (inProgressCount >= 4) {
        toast.error("Đã đạt giới hạn WIP cho cột In Progress (4)");
        return;
      }
      
      // Open modal instead of proceeding
      setPendingUpdate({ applicationId, newStatus, item: draggedItem });
      setIsInterviewModalOpen(true);
      return;
    }

    await performUpdate(applicationId, newStatus, draggedItem.interview_at);
  };

  const performUpdate = async (applicationId, newStatus, interviewAt) => {
    // Optimistic Update
    const updatedJobs = localJobs.map((job) =>
      job.id === applicationId ? { ...job, status: newStatus, interview_at: interviewAt } : job,
    );
    setLocalJobs(updatedJobs);
    onJobsUpdate?.(updatedJobs);

    try {
      const data = await applicationService.update(applicationId, {
        status: newStatus,
        interview_at: interviewAt
      });

      if (!data) throw new Error("No data returned from update");

      toast.success(
        `Đã chuyển sang ${KANBAN_COLUMNS.find((c) => c.id === newStatus)?.title}`
      );

      onStatusChange?.();

      setLocalJobs((prev) =>
        prev.map((job) => (job.id === applicationId ? data : job)),
      );
    } catch (err) {
      console.error("Error updating job status:", err);
      // Rollback
      setLocalJobs(jobs);
      onJobsUpdate?.(jobs);
      toast.error(`Lỗi cập nhật: ${err.message || "Vui lòng thử lại!"}`);
    } finally {
      setIsInterviewModalOpen(false);
      setPendingUpdate(null);
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
                    className="kanban-card"
                    draggable
                    onDragStart={(e) => handleDragStart(e, job)}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="kanban-card-header">
                      <div className="kanban-card-title">
                        {job.job_title || job.position || "Chưa có vị trí"}
                      </div>
                      <button 
                        className={`favorite-btn ${job.is_favorite ? 'is-favorite' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavoriteApplication(job.id, job.is_favorite);
                        }}
                      >
                        <Heart size={16} fill={job.is_favorite ? "#ef4444" : "none"} />
                      </button>
                    </div>
                    {job.is_favorite && <div className="favorite-tag">✨ Favorite</div>}
                    <div className="kanban-card-details">
                      <span className="kanban-card-company">
                        🏢{" "}
                        {job.companies?.name ||
                          job.company_name ||
                          "Chưa có tên công ty"}
                      </span>
                      {(job.location || job.work_mode) && (
                        <span className="kanban-card-meta">
                          📍 {job.location || "---"} • {job.work_mode || "---"}
                        </span>
                      )}
                      {job.salary && (
                        <span className="kanban-card-meta">
                          💰 {job.salary}
                        </span>
                      )}
                      {job.interview_at && (
                        <span className="kanban-card-meta interview-date-badge">
                          📅 {new Date(job.interview_at).toLocaleString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      )}
                      {job.job_url && (
                        <span className="kanban-card-meta">
                          🔗{" "}
                          <a
                            href={job.job_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Xem JD
                          </a>
                        </span>
                      )}
                      {job.resumes && (
                        <span className="kanban-card-meta cv-badge">
                          <FileText size={12} />
                          {job.resumes.file_path ? (
                            <a
                              href={getResumeUrl(job.resumes.file_path)}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {job.resumes.version_name || "Xem CV"}
                            </a>
                          ) : (
                            <span>{job.resumes.version_name || "Chưa có CV"}</span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {columnJobs.length === 0 && (
                  <div className="kanban-empty">
                    <div className="kanban-empty-icon">📋</div>
                    <p>Chưa có công việc</p>
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

      <InterviewDateModal
        isOpen={isInterviewModalOpen}
        onClose={() => setIsInterviewModalOpen(false)}
        onSave={(date) => {
          if (pendingUpdate) {
            performUpdate(pendingUpdate.applicationId, pendingUpdate.newStatus, date);
          }
        }}
        application={pendingUpdate?.item}
      />
    </div>
  );
};

export default KanbanBoard;
