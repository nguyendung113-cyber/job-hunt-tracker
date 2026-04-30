/**
 * Constants và helper functions cho Job Hunt Tracker
 */

// Job status options
export const JOB_STATUS = {
  APPLIED: "Applied",
  INTERVIEWING: "Interviewing",
  OFFERED: "Offered",
  REJECTED: "Rejected",
};

export const JOB_STATUS_OPTIONS = [
  { value: JOB_STATUS.APPLIED, label: "Đã nộp đơn" },
  { value: JOB_STATUS.INTERVIEWING, label: "Phỏng vấn" },
  { value: JOB_STATUS.OFFERED, label: "Nhận Offer" },
  { value: JOB_STATUS.REJECTED, label: "Từ chối" },
];

// Japanese level options (optional - for Japanese language learners)
export const JLPT_LEVELS = {
  N1: "N1",
  N2: "N2",
  N3: "N3",
  N4: "N4",
  NONE: "Không yêu cầu",
};

export const JLPT_OPTIONS = [
  { value: JLPT_LEVELS.N1, label: "N1" },
  { value: JLPT_LEVELS.N2, label: "N2" },
  { value: JLPT_LEVELS.N3, label: "N3" },
  { value: JLPT_LEVELS.N4, label: "N4" },
  { value: JLPT_LEVELS.NONE, label: "Không yêu cầu" },
];

// Job type options
export const JOB_TYPE = {
  FULLTIME: "Full-time",
  PARTTIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
  FREELANCE: "Freelance",
};

export const JOB_TYPE_OPTIONS = [
  { value: JOB_TYPE.FULLTIME, label: "Toàn thời gian" },
  { value: JOB_TYPE.PARTTIME, label: "Bán thời gian" },
  { value: JOB_TYPE.CONTRACT, label: "Hợp đồng" },
  { value: JOB_TYPE.INTERNSHIP, label: "Thực tập" },
  { value: JOB_TYPE.FREELANCE, label: "Freelance" },
];

// Work mode options
export const WORK_MODE = {
  ONSITE: "On-site",
  REMOTE: "Remote",
  HYBRID: "Hybrid",
};

export const WORK_MODE_OPTIONS = [
  { value: WORK_MODE.ONSITE, label: "Offline" },
  { value: WORK_MODE.REMOTE, label: "Remote" },
  { value: WORK_MODE.HYBRID, label: "Hybrid" },
];

// Default job form data
export const DEFAULT_JOB_DATA = {
  company_name: "",
  position: "",
  status: JOB_STATUS.APPLIED,
  job_url: "",
  salary: "",
  location: "",
  job_type: JOB_TYPE.FULLTIME,
  work_mode: WORK_MODE.ONSITE,
  notes: "",
};

// Status badge CSS class mapping
export const getStatusClass = (status) => {
  const statusMap = {
    [JOB_STATUS.APPLIED]: "status-applied",
    [JOB_STATUS.INTERVIEWING]: "status-interviewing",
    [JOB_STATUS.OFFERED]: "status-offered",
    [JOB_STATUS.REJECTED]: "status-rejected",
  };
  return statusMap[status] || "status-default";
};

// Format date
export const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Truncate text
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export default {
  JOB_STATUS,
  JOB_STATUS_OPTIONS,
  JLPT_LEVELS,
  JLPT_OPTIONS,
  DEFAULT_JOB_DATA,
  getStatusClass,
  formatDate,
  truncateText,
};
