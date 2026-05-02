import React from "react";
import Modal from "../../common/Modal";
import { AlertTriangle } from "lucide-react";
import "./ConfirmModal.css";

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Xác nhận xóa", 
  message = "Bạn có chắc chắn muốn xóa mục này? Hành động này không thể hoàn tác.",
  confirmText = "Xóa ngay",
  cancelText = "Hủy bỏ",
  type = "danger" 
}) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={title}
      className={`confirm-modal ${type}`}
    >
      <div className="confirm-content">
        <div className="confirm-icon">
          <AlertTriangle size={32} />
        </div>
        <p className="confirm-message">{message}</p>
        
        <div className="confirm-actions">
          <button className="btn-cancel" onClick={onClose}>
            {cancelText}
          </button>
          <button className="btn-confirm" onClick={() => {
            onConfirm();
            onClose();
          }}>
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
