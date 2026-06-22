import { X } from 'lucide-react';
import './SettingsModal.css';

const SettingsModal = ({ isOpen, onClose, title, field, value, onSave }) => {
  if (!isOpen) return null;

  // Mock list of values based on what was clicked
  const options = {
    entity: ['NHI', 'NOMURA NY', 'NOMURA LN', 'NOMURA TOK', 'GENERIC_ENT'],
    book: ['TGT8400', 'TGT8500', 'TGT9000', 'MM_DEPT_01', 'TREASURY_02'],
    cpEntBook: ['NHI', 'HSBC_UK', 'JPM_US', 'MS_US', 'BARCLAYS_LN']
  };

  const currentOptions = options[field] || [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container glass" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        <div className="modal-body">
          <p className="modal-description">Select a new value for the field: <strong>{field}</strong></p>
          <div className="options-grid">
            {currentOptions.map((opt) => (
              <button 
                key={opt}
                onClick={() => {
                  onSave(opt);
                  onClose();
                }}
                className={`option-btn ${value === opt ? 'option-btn--active' : ''}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
