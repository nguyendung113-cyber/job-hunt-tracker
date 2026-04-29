import React from 'react';
import JobCard from './JobCard';
import './JobTable.css';

const JobTable = ({ jobs, loading, onStatusChange, onDelete }) => {
  if (loading && jobs.length === 0) {
    return (
      <div className="table-container">
        <div className="loading-state">
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (!loading && jobs.length === 0) {
    return (
      <div className="table-container">
        <div className="empty-state">
          <p>Chưa có công việc nào</p>
          <span>Hãy thêm công việc đầu tiên của bạn</span>
        </div>
      </div>
    );
  }

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
            <JobCard
              key={job.id}
              job={job}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JobTable;