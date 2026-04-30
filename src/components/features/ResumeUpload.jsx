import React, { useState, useRef } from "react";
import { useResumes } from "../../hooks/useResumes";
import { Upload, FileText, Star, Trash2 } from "lucide-react";
import "./ResumeUpload.css";

const ResumeUpload = ({ userId }) => {
  const {
    resumes,
    addResume,
    setActiveResume,
    deleteResume,
    loading,
    getActiveResume,
  } = useResumes(userId);
  const fileInputRef = useRef(null);

  const [versionName, setVersionName] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!versionName.trim()) {
      alert("Vui lòng nhập tên phiên bản CV");
      return;
    }

    setUploading(true);

    try {
      // Trong thực tế, bạn sẽ upload file lên Supabase Storage
      // Ở đây giả lập bằng cách lưu đường dẫn file
      const filePath = `resumes/${userId}/${Date.now()}_${file.name}`;

      const result = await addResume({
        file_path: filePath,
        version_name: versionName,
        is_active: resumes.length === 0, // Set active nếu là CV đầu tiên
      });

      if (result.success) {
        setVersionName("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } catch (err) {
      console.error("Error uploading resume:", err);
      alert("Lỗi upload CV");
    } finally {
      setUploading(false);
    }
  };

  const handleSetActive = async (resumeId) => {
    await setActiveResume(resumeId);
  };

  const handleDelete = async (resumeId) => {
    await deleteResume(resumeId);
  };

  const activeResume = getActiveResume();

  return (
    <div className="resume-upload">
      <div className="resume-header">
        <h3>Quản lý CV</h3>
        <span className="resume-count">{resumes.length} CV</span>
      </div>

      {/* Upload Section */}
      <div className="upload-section">
        <div className="version-input">
          <input
            type="text"
            placeholder="Tên phiên bản (VD: CV 2024, Senior Dev...)"
            value={versionName}
            onChange={(e) => setVersionName(e.target.value)}
          />
        </div>

        <div className="file-input-wrapper">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileSelect}
            disabled={uploading || loading}
            id="resume-file"
          />
          <label htmlFor="resume-file" className="upload-btn">
            <Upload size={16} />
            {uploading ? "Đang upload..." : "Chọn file"}
          </label>
        </div>
      </div>

      {/* Resume List */}
      <div className="resume-list">
        {resumes.length === 0 ? (
          <div className="empty-state">
            <FileText size={40} />
            <p>Chưa có CV nào</p>
            <span>Upload CV đầu tiên của bạn</span>
          </div>
        ) : (
          resumes.map((resume) => (
            <div
              key={resume.id}
              className={`resume-item ${resume.is_active ? "active" : ""}`}
            >
              <div className="resume-icon">
                <FileText size={20} />
              </div>

              <div className="resume-info">
                <div className="resume-name">
                  {resume.version_name}
                  {resume.is_active && (
                    <span className="active-badge">
                      <Star size={12} /> Mặc định
                    </span>
                  )}
                </div>
                <div className="resume-date">
                  {new Date(resume.created_at).toLocaleDateString("vi-VN")}
                </div>
              </div>

              <div className="resume-actions">
                {!resume.is_active && (
                  <button
                    className="btn-set-active"
                    onClick={() => handleSetActive(resume.id)}
                    title="Đặt làm CV mặc định"
                  >
                    <Star size={16} />
                  </button>
                )}
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(resume.id)}
                  title="Xóa CV"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ResumeUpload;
