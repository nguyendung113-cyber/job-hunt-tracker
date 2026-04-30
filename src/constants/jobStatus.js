export const JOB_STATUS = {
  APPLIED: "Applied",
  INTERVIEWING: "Interviewing",
  OFFERED: "Offered",
  REJECTED: "Rejected",
};

export const STATUS_LABELS = {
  [JOB_STATUS.APPLIED]: "Đã nộp đơn",
  [JOB_STATUS.INTERVIEWING]: "Phỏng vấn",
  [JOB_STATUS.OFFERED]: "Nhận Offer",
  [JOB_STATUS.REJECTED]: "Từ chối",
};

export const STATUS_COLORS = {
  [JOB_STATUS.APPLIED]: "#3b82f6",
  [JOB_STATUS.INTERVIEWING]: "#f59e0b",
  [JOB_STATUS.OFFERED]: "#10b981",
  [JOB_STATUS.REJECTED]: "#ef4444",
};

export const KANBAN_COLUMNS = [
  {
    id: JOB_STATUS.APPLIED,
    title: "REQUESTED",
    icon: "📥",
    color: STATUS_COLORS[JOB_STATUS.APPLIED],
    wipLimit: null,
  },
  {
    id: JOB_STATUS.INTERVIEWING,
    title: "IN PROGRESS",
    icon: "⏳",
    color: STATUS_COLORS[JOB_STATUS.INTERVIEWING],
    wipLimit: 4,
  },
  {
    id: JOB_STATUS.OFFERED,
    title: "DONE",
    icon: "✅",
    color: STATUS_COLORS[JOB_STATUS.OFFERED],
    wipLimit: null,
  },
  {
    id: JOB_STATUS.REJECTED,
    title: "REJECTED",
    icon: "❌",
    color: STATUS_COLORS[JOB_STATUS.REJECTED],
    wipLimit: null,
  },
];
