import React, { useState } from "react";
import Modal from "../../common/Modal";
import { Calendar, Clock } from "lucide-react";
import "./InterviewDateModal.css";

const InterviewDateModal = ({ isOpen, onClose, onSave, application }) => {
  const [date, setDate] = useState("");
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date) return;
    onSave(new Date(date).toISOString());
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Đặt lịch phỏng vấn"
      className="interview-modal"
    >
      <form onSubmit={handleSubmit} className="interview-date-form">
        <div className="app-preview">
          <p className="app-company">{application?.companies?.name}</p>
          <p className="app-position">{application?.job_title || application?.position}</p>
        </div>
        
        <div className="form-group">
          <label>Ngày & Giờ phỏng vấn</label>
          <div className="input-with-icon">
            <Calendar size={18} className="input-icon" />
            <input 
              type="datetime-local" 
              value={date} 
              onChange={(e) => setDate(e.target.value)}
              required 
              autoFocus
            />
          </div>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>Hủy</button>
          <button type="submit" className="btn-primary" disabled={!date}>Xác nhận</button>
        </div>
      </form>
    </Modal>
  );
};

export default InterviewDateModal;
