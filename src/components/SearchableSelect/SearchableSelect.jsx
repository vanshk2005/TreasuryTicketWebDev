import React, { useState, useRef, useEffect, Children } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import './SearchableSelect.css';

export default function SearchableSelect({ value, onChange, disabled, style, className, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const options = [];
  Children.forEach(children, child => {
    if (child && child.type === 'option') {
      options.push({ 
        value: child.props.value, 
        label: child.props.children || child.props.value 
      });
    }
  });

  const selectedOption = options.find(opt => opt.value === value) || { value: '', label: '' };
  
  const filteredOptions = options.filter(opt => {
    const term = searchTerm.toLowerCase();
    const l = (opt.label || '').toLowerCase();
    const v = (opt.value || '').toLowerCase();
    return l.includes(term) || v.includes(term);
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (opt) => {
    setIsOpen(false);
    setSearchTerm('');
    if (onChange) {
      // Simulate native event
      onChange({ target: { value: opt.value } });
    }
  };

  const handleContainerClick = (e) => {
    if (isOpen && e.target.tagName === 'INPUT') return;
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div 
      className={`searchable-select-container ${disabled ? 'disabled' : ''} ${className || ''}`} 
      ref={containerRef}
      style={style}
    >
      <div className="searchable-select-control" onClick={handleContainerClick}>
        {!isOpen && (
          <div className="searchable-select-value">{selectedOption.label}</div>
        )}
        {isOpen && (
          <input 
            ref={inputRef}
            type="text" 
            className="searchable-select-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder=""
          />
        )}
        <div className="searchable-select-indicators">
          {isOpen && <Search size={12} className="search-icon" />}
          <ChevronDown size={14} className="chevron-icon" />
        </div>
      </div>
      
      {isOpen && (
        <div className="searchable-select-menu glass">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt, idx) => (
              <div 
                key={`${opt.value}-${idx}`} 
                className={`searchable-select-option ${opt.value === value ? 'selected' : ''}`}
                onClick={() => handleSelect(opt)}
              >
                {opt.label || '\u00A0'}
              </div>
            ))
          ) : (
            <div className="searchable-select-no-options">No matches found</div>
          )}
        </div>
      )}
    </div>
  );
}
