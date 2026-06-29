import { useState, useRef, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  Search, 
  Filter, 
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  GripHorizontal,
  FileEdit
} from 'lucide-react';
import './MyTrades.css';

const MyTrades = ({ addToast, trades, editDraftTrade }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showDraftsOnly, setShowDraftsOnly] = useState(false);

  const initialColumns = [
    { id: 'id', label: 'Trade ID', visible: true },
    { id: 'type', label: 'Type', visible: true },
    { id: 'subType', label: 'Sub Type', visible: true },
    { id: 'status', label: 'Status', visible: true },
    { id: 'cpart', label: 'Cpty', visible: true },
    { id: 'ccy', label: 'Ccy', visible: true },
    { id: 'notional', label: 'Notional', visible: true, align: 'right' },
    { id: 'valueDate', label: 'Value Date', visible: true },
    { id: 'book', label: 'Book', visible: true },
    { id: 'actions', label: 'Actions', visible: true, unhidable: true }
  ];

  const [columns, setColumns] = useState(initialColumns);

  const filteredTrades = (trades || []).filter(t => {
    const matchesView = showDraftsOnly ? t.status === 'Draft' : t.status !== 'Draft';
    if (!matchesView) return false;
    
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (t.id && t.id.toLowerCase().includes(term)) ||
      (t.type && t.type.toLowerCase().includes(term)) ||
      (t.cpart && t.cpart.toLowerCase().includes(term)) ||
      (t.book && t.book.toLowerCase().includes(term))
    );
  });

  const toggleColumn = (colId) => {
    setColumns(cols => cols.map(c => c.id === colId && !c.unhidable ? { ...c, visible: !c.visible } : c));
  };

  // Drag and drop handlers
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('colIdx', index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData('colIdx'), 10);
    if (sourceIndex === targetIndex || isNaN(sourceIndex)) return;

    const newCols = [...columns];
    const visibleNewCols = newCols.filter(c => c.visible);
    const sourceCol = visibleNewCols[sourceIndex];
    const targetCol = visibleNewCols[targetIndex];

    const actualSourceIndex = newCols.findIndex(c => c.id === sourceCol.id);
    const actualTargetIndex = newCols.findIndex(c => c.id === targetCol.id);

    const [movedCol] = newCols.splice(actualSourceIndex, 1);
    newCols.splice(actualTargetIndex, 0, movedCol);
    setColumns(newCols);
  };

  // Click outside to close filter
  const filterRef = useRef();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderCellContent = (col, trade) => {
    switch(col.id) {
      case 'id': return <span className="trade-id-cell">{trade.id}</span>;
      case 'type': return <span className="badge badge--type">{trade.type}</span>;
      case 'subType': return trade.subType;
      case 'status': return <span className={"badge badge--status " + trade.status.toLowerCase()}>{trade.status}</span>;
      case 'cpart': return trade.cpart;
      case 'ccy': return trade.ccy;
      case 'notional': return trade.notional.toLocaleString();
      case 'valueDate': return trade.valueDate;
      case 'book': return <code>{trade.book}</code>;
      case 'actions': return (
        <div style={{ display: 'flex', gap: '5px' }}>
          <button type="button" className="view-details-btn" title="View Audit Trail" onClick={(e) => {
            e.stopPropagation();
            setSelectedTrade(trade);
            if (addToast) addToast('Loaded trade details for ' + trade.id, 'info');
          }}>
            <ExternalLink size={12} />
          </button>
          {trade.status === 'Draft' && editDraftTrade && (
            <button type="button" className="view-details-btn" title="Edit Draft" style={{ color: 'var(--color-primary-light)' }} onClick={(e) => {
              e.stopPropagation();
              editDraftTrade(trade.id);
            }}>
              Edit
            </button>
          )}
        </div>
      );
      default: return null;
    }
  };

  const visibleColumns = columns.filter(c => c.visible);

  return (
    <div className="my-trades-container">
      {/* Summary Cards */}
      <div className="trades-summary-grid">
        <div className="summary-card glass">
          <div className="summary-card-header">
            <span className="summary-title">Total Desk Volume</span>
            <FileSpreadsheet size={16} className="summary-icon text-primary" />
          </div>
          <div className="summary-value">USD 98,000,000</div>
          <div className="summary-subtext">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
        </div>
        <div className="summary-card glass">
          <div className="summary-card-header">
            <span className="summary-title">Active Deals</span>
            <CheckCircle2 size={16} className="summary-icon text-success" />
          </div>
          <div className="summary-value">{(trades || []).length} Trades</div>
          <div className="summary-subtext">Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
        </div>
        <div className="summary-card glass">
          <div className="summary-card-header">
            <span className="summary-title">Pending Settlement</span>
            <Clock size={16} className="summary-icon text-warning" />
          </div>
          <div className="summary-value">2 Queue</div>
          <div className="summary-subtext">Ut enim ad minim veniam, quis nostrud exercitation ullamco.</div>
        </div>
      </div>

      {/* Main Blotter Block */}
      <div className="blotter-section glass">
        <div className="blotter-header">
          <div className="blotter-title-block">
            <BookOpen size={16} className="title-icon" />
            <h3>My Trades Blotter</h3>
          </div>
          <div className="blotter-actions">
            <div className="search-input-wrapper">
              <Search size={14} className="search-icon" />
              <input 
                type="text" 
                placeholder="Filter trades..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button 
              className={`filter-btn ${showDraftsOnly ? "active" : ""}`}
              style={{ marginRight: '10px' }}
              onClick={() => setShowDraftsOnly(!showDraftsOnly)}
            >
              <FileEdit size={14} />
              <span>{showDraftsOnly ? "View Live Trades" : "View Drafts"}</span>
            </button>
            
            <div className="filter-dropdown-container" ref={filterRef} style={{ position: 'relative' }}>
              <button 
                className={"filter-btn " + (isFilterOpen ? "active" : "")}
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter size={14} />
                <span>Columns</span>
              </button>
              
              {isFilterOpen && (
                <div className="filter-popup glass" style={{
                  position: 'absolute', 
                  right: 0, 
                  top: '120%', 
                  zIndex: 100, 
                  padding: '1rem',
                  borderRadius: 'var(--radius-sm)',
                  minWidth: '200px',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  <h5 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-text-muted)' }}>Visible Columns</h5>
                  {columns.map(col => (
                    <label key={col.id} className="custom-checkbox" style={{ opacity: col.unhidable ? 0.5 : 1 }}>
                      <input 
                        type="checkbox" 
                        checked={col.visible} 
                        disabled={col.unhidable}
                        onChange={() => toggleColumn(col.id)} 
                      />
                      <div className="checkbox-box"></div>
                      <span style={{ fontSize: '13px' }}>{col.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Blotter Grid Table */}
        <div className="blotter-table-wrapper">
          <table className="blotter-table">
            <thead>
              <tr>
                {visibleColumns.map((col, index) => (
                  <th 
                    key={col.id}
                    className={col.align === 'right' ? 'text-right' : ''}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    style={{ cursor: 'grab' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: col.align === 'right' ? 'flex-end' : 'flex-start', gap: '5px' }}>
                      <GripHorizontal size={12} style={{ opacity: 0.3 }} />
                      {col.label}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredTrades.map((trade) => (
                <tr 
                  key={trade.id} 
                  className={"blotter-row " + (selectedTrade?.id === trade.id ? 'blotter-row--selected' : '')}
                  onClick={() => setSelectedTrade(trade)}
                >
                  {visibleColumns.map(col => (
                    <td key={col.id} className={col.align === 'right' ? 'text-right notional-cell' : ''}>
                      {renderCellContent(col, trade)}
                    </td>
                  ))}
                </tr>
              ))}
              {filteredTrades.length === 0 && (
                <tr>
                  <td colSpan={visibleColumns.length} className="no-trades-cell">
                    <AlertCircle size={20} className="mb-1 text-muted" />
                    <p>No trades found matching search term.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Trade Detailed Drawer (Lorem Ipsum) */}
      {selectedTrade && (
        <div className="trade-details-panel glass animate-slide-in">
          <div className="details-header">
            <h4>Trade Audit Trail: {selectedTrade.id}</h4>
            <button className="details-close-btn" onClick={() => setSelectedTrade(null)}>×</button>
          </div>
          <div className="details-content">
            <div className="details-grid-summary">
              <div className="summary-item">
                <span className="label">Exchange Broker:</span>
                <span className="value">LOREM BROKING LTD</span>
              </div>
              <div className="summary-item">
                <span className="label">Clearing Status:</span>
                <span className="value text-success">VERIFIED SECURE</span>
              </div>
              <div className="summary-item">
                <span className="label">Settlement Agent:</span>
                <span className="value">IPSUM BANK N.A.</span>
              </div>
              <div className="summary-item">
                <span className="label">Margin Requirement:</span>
                <span className="value">USD 450,000 (Reciprocal)</span>
              </div>
            </div>
            
            <div className="details-lorem-block">
              <h5>Deal Metadata & Compliance Trail</h5>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras interdum pretium nunc, in gravida risus vulputate a. 
                Suspendisse potenti. Duis sodales, felis ut bibendum condimentum, nunc dolor tincidunt elit, eget dictum lacus 
                eros eget nisi. Curabitur vel dictum turpis, sed luctus turpis.
              </p>
              <p className="mt-2">
                Duis feugiat eros eget justo tristique, sit amet sollicitudin elit efficitur. Mauris eleifend dictum erat id pretium. 
                Nullam ut sapien in nunc dictum congue a at ante. Class aptent taciti sociosqu ad litora torquent per conubia nostra.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTrades;
