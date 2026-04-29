import React from 'react';
import { getStatusClass } from '../../utils/helpers';

/**
 * StatusBadge - Hiển thị badge trạng thái
 */
const StatusBadge = ({ status, showLabel = true }) => {
  if (!status) return null;

  const statusLabels = {
    Applied: 'Đã nộp đơn',
    Interviewing: 'Phỏng vấn',
    Offered: 'Nhận Offer',
    Rejected: 'Từ chối',
  };

  return (
    <span className={`status-pill ${getStatusClass(status)}`}>
      {showLabel ? statusLabels[status] || status : status}
    </span>
  );
};

export default StatusBadge;