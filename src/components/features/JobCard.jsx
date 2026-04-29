import React from 'react';
import { getStatusClass, formatDate } from '../../utils/helpers';

/**
 * JobCard - Hiển thị thông tin một job
 */
const JobCard = ({ job, onStatusChange, onDelete }) => {
  const { id, company_name, position, japanese_level, status, notes, created_at } = job;

  return (
    <tr key={id}>
      <td data-label="Công ty">
        <span className="company-name">{company_name}</span>
      </td>
      <td data-label="Vị trí">
        <span>{position}</span>
      </td>
      <td data-label="Trình độ">
        <span className="jlpt-badge">{japanese_level}</span>
      </td>
      <td data-label="Trạng thái">
        <span className={`status-pill ${getStatusClass(status)}`}>
          {status}
        </span>
      </td>
      <td data-label="Thao tác">
        <div className="action-buttons">
          <select
            value={status}
            onChange={(e) => onStatusChange(id, e.target.value)}
            className="status-select"
            aria-label="Thay đổi trạng thái"
          >
            <option value="Applied">Đã nộp đơn</option>
            <option value="Interviewing">Phỏng vấn</option>
            <option value="Offered">Nhận Offer</option>
            <option value="Rejected">Từ chối</option>
          </select>
          <button 
            className="btn-delete" 
            onClick={() => onDelete(id)}
            aria-label="Xóa công việc"
          >
            🗑️
          </button>
        </div>
      </td>
      <td data-label="Ghi chú">
        <span className="notes-text">{notes || '-'}</span>
      </td>
    </tr>
  );
};

export default JobCard;