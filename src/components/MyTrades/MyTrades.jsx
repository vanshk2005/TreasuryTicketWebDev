import { useState } from 'react';
import { 
  FileSpreadsheet, 
  Search, 
  Filter, 
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink
} from 'lucide-react';
import './MyTrades.css';

const MyTrades = ({ addToast }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrade, setSelectedTrade] = useState(null);

  // Mock Trades Data
  const mockTrades = [
    { id: 'MM-99482', type: 'MM', subType: 'InternalDeposit', status: 'Committed', cpart: 'NHI', ccy: 'USD', notional: 10000000, valueDate: '2026-06-24', book: 'TGT8400', trader: 'KAKKAR, VANSH' },
    { id: 'FX-88401', type: 'FX OUTRIGHT', subType: 'NearLeg', status: 'Committed', cpart: 'BARC', ccy: 'EUR', notional: 15000000, valueDate: '2026-06-25', book: 'FX_MAIN', trader: 'KAKKAR, VANSH' },
    { id: 'SW-77301', type: 'FX SWAP', subType: 'SwapLegs', status: 'Pending', cpart: 'HSBC', ccy: 'JPY', notional: 25000000, valueDate: '2026-06-30', book: 'FX_SWAP_BK', trader: 'KAKKAR, VANSH' },
    { id: 'NT-66102', type: 'NTRM', subType: 'NostroTransfer', status: 'Committed', cpart: 'SMO', ccy: 'USD', notional: 5000000, valueDate: '2026-06-24', book: 'NOS_ACC', trader: 'KAKKAR, VANSH' },
    { id: 'FC-55209', type: 'NTRM', subType: 'FreeCash', status: 'Pending', cpart: 'SMO', ccy: 'GBP', notional: 8000000, valueDate: '2026-06-26', book: 'NOS_CASH', trader: 'KAKKAR, VANSH' },
    { id: 'ND-44391', type: 'NDF', subType: 'NDFOutright', status: 'Committed', cpart: 'CITI', ccy: 'USD', notional: 12000000, valueDate: '2026-07-02', book: 'NDF_DESK', trader: 'KAKKAR, VANSH' },
    { id: 'NS-33108', type: 'NDF SWAP', subType: 'NDFSwap', status: 'Cancelled', cpart: 'JPM', ccy: 'USD', notional: 20000000, valueDate: '2026-07-10', book: 'NDF_SWAP_BK', trader: 'KAKKAR, VANSH' },
  ];

  const filteredTrades = mockTrades.filter(t => 
    t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.cpart.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.book.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <div className="summary-value">12 Trades</div>
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
            <button className="filter-btn" onClick={() => addToast('Filters cleared', 'info')}>
              <Filter size={14} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Blotter Grid Table */}
        <div className="blotter-table-wrapper">
          <table className="blotter-table">
            <thead>
              <tr>
                <th>Trade ID</th>
                <th>Type</th>
                <th>Sub Type</th>
                <th>Status</th>
                <th>Cpty</th>
                <th>Ccy</th>
                <th className="text-right">Notional</th>
                <th>Value Date</th>
                <th>Book</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrades.map((trade) => (
                <tr 
                  key={trade.id} 
                  className={`blotter-row ${selectedTrade?.id === trade.id ? 'blotter-row--selected' : ''}`}
                  onClick={() => setSelectedTrade(trade)}
                >
                  <td className="trade-id-cell">{trade.id}</td>
                  <td><span className="badge badge--type">{trade.type}</span></td>
                  <td>{trade.subType}</td>
                  <td>
                    <span className={`badge badge--status ${trade.status.toLowerCase()}`}>
                      {trade.status}
                    </span>
                  </td>
                  <td>{trade.cpart}</td>
                  <td>{trade.ccy}</td>
                  <td className="text-right notional-cell">
                    {trade.notional.toLocaleString()}
                  </td>
                  <td>{trade.valueDate}</td>
                  <td><code>{trade.book}</code></td>
                  <td>
                    <button 
                      type="button" 
                      className="view-details-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTrade(trade);
                        addToast(`Loaded trade details for ${trade.id}`, 'info');
                      }}
                    >
                      <ExternalLink size={12} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredTrades.length === 0 && (
                <tr>
                  <td colSpan="10" className="no-trades-cell">
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
