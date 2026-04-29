import React from 'react';
import { X } from 'lucide-react';
import './Modal.css';

/**
 * Modal - Component modal chung
 */
const Modal = ({ isOpen, onClose, title, children, className = '' }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className={`modal-container ${className}`}>
        <button className="close-btn" onClick={onClose} aria-label="Đóng modal">
          <X size={20} />
        </button>
        {title && <h2>{title}</h2>}
        {children}
      </div>
    </div>
  );
};

export default Modal;