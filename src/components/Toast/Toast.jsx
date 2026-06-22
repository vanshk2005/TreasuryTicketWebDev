import { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import './Toast.css';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle2 size={16} className="toast-icon success" />,
    warning: <AlertTriangle size={16} className="toast-icon warning" />,
    info: <Info size={16} className="toast-icon info" />
  };

  return (
    <div className={`toast-notification glass toast-notification--${type}`}>
      {icons[type]}
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={onClose}>
        <X size={12} />
      </button>
    </div>
  );
};

export default Toast;
