import { useState } from 'react';
import { 
  Pencil, 
  Scale, 
  Coins,
  Check,
  Save as SaveIcon,
  Play,
  ShieldAlert,
  Undo2,
  XSquare,
  Trash2,
  LogOut
} from 'lucide-react';
import useTradeOperation from '../../utils/useTradeOperation';
import SettingsModal from '../Modal/SettingsModal';
import './FreeCashTicket.css';

const FreeCashTicket = ({ activeSubTab, mirrorTrades, disableOffMkt, addToast }) => {
  // Config fields (editable via pencils)
  const [company, setCompany] = useState('NHI');
  const [tradingBook, setTradingBook] = useState('TGT8400');
  const [counterparty, setCounterparty] = useState('NHI');

  // Form Fields
  const [subType, setSubType] = useState('FreeCash');
  const [mirroredTrade, setMirroredTrade] = useState(false);
  const [tradeDate, setTradeDate] = useState(new Date().toISOString().split('T')[0]);
  const [tradeId] = useState('NTRM-99121');
  const [version] = useState('0');
  const [status] = useState('New');
  const [trader, setTrader] = useState('KAKKAR, VANSH [kakkarvan]');
  const [orgTrader, setOrgTrader] = useState('KAKKAR, VANSH [kakkarvan]');
  const [messages, setMessages] = useState('');
  const [destination] = useState('SMO');
  const [totoroValuationFunction, setTotoroValuationFunction] = useState('TotoroValuation');

  // Right block fields
  const [tradeReferences, setTradeReferences] = useState('');

  // Free Cash Parameters fields
  const [direction, setDirection] = useState('Pay'); // 'Pay' or 'Receive'
  const [ntrmFleg, setNtrmFleg] = useState('ACACashCollIP');
  const [ccy, setCcy] = useState('USD');
  const [amount, setAmount] = useState('10000000');
  const [valueDate, setValueDate] = useState(new Date().toISOString().split('T')[0]);

  // Comments
  const [changeOwner, setChangeOwner] = useState('');
  const [changeReason, setChangeReason] = useState('');
  const [changeComment, setChangeComment] = useState('');
  const [comment, setComment] = useState('');
  const [settlementComment, setSettlementComment] = useState('');
  const [holidays, setHolidays] = useState('None');
  const [strategy, setStrategy] = useState('');
  const [accruedInterestOverwrite, setAccruedInterestOverwrite] = useState('None');

  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalField, setModalField] = useState('');
  const [modalValue, setModalValue] = useState('');

  const handleOpenModal = (title, field, value) => {
    setModalTitle(title);
    setModalField(field);
    setModalValue(value);
    setModalOpen(true);
  };

  const handleSaveModal = (newValue) => {
    if (modalField === 'entity') setCompany(newValue);
    if (modalField === 'book') setTradingBook(newValue);
    if (modalField === 'cpEntBook') setCounterparty(newValue);
    addToast(`Updated configuration field "${modalField}" to ${newValue}`, 'info');
  };

  const handleActionClick = (actionName) => {
    if (actionName === 'OK' || actionName === 'Commit') {
      addToast(`Free Cash ${direction} trade of ${ccy} ${parseFloat(amount).toLocaleString()} committed successfully!`, 'success');
    } else if (actionName === 'Validate') {
      addToast(`Free Cash validation passed. Direction: ${direction}, Funding Leg: ${ntrmFleg}.`, 'info');
    } else if (actionName === 'Save') {
      addToast(`Free Cash Ticket saved as draft.`, 'success');
    } else if (actionName === 'Undo') {
      setAmount('10000000');
      setDirection('Pay');
      setNtrmFleg('ACACashCollIP');
      addToast(`Reverted parameters to defaults.`, 'info');
    } else {
      addToast(`Action "${actionName}" executed.`, 'info');
    }
  };

  useTradeOperation(handleActionClick);

  if (activeSubTab === 'preferences') {
    return (
      <div className="preferences-view glass">
        <h3>Free Cash Preferences</h3>
        <p className="subtitle">Configure settings for free cash transfers and liquidity desks</p>
        <div className="preferences-grid mt-2">
          <div className="pref-row">
            <span className="pref-lbl">Enable Direct Clearing Broker Feed</span>
            <label className="custom-checkbox">
              <input type="checkbox" defaultChecked />
              <div className="checkbox-box"></div>
            </label>
          </div>
          <div className="pref-row">
            <span className="pref-lbl">Default Cash Pool Account</span>
            <input type="text" defaultValue="ACACashCollIP" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ticket-container">
      {/* Actions Bar matching the screenshot */}
      <div className="actions-bar glass">
        <div className="actions-left">
          <button type="button" onClick={() => handleActionClick('OK')} className="action-btn">
            <Check size={13} className="act-icon success" /> OK
          </button>
          <button type="button" onClick={() => handleActionClick('Save')} className="action-btn">
            <SaveIcon size={13} className="act-icon" /> Save
          </button>
          <button type="button" onClick={() => handleActionClick('Commit')} className="action-btn">
            <Play size={13} className="act-icon primary" /> Commit
          </button>
          <button type="button" onClick={() => handleActionClick('Validate')} className="action-btn">
            <ShieldAlert size={13} className="act-icon warning" /> Validate
          </button>
          <button type="button" onClick={() => handleActionClick('Undo')} className="action-btn">
            <Undo2 size={13} className="act-icon" /> Undo
          </button>
        </div>
        <div className="actions-right">
          <button type="button" onClick={() => handleActionClick('Cancel')} className="action-btn">
            <XSquare size={13} className="act-icon" /> Cancel
          </button>
          <button type="button" onClick={() => handleActionClick('Delete')} className="action-btn">
            <Trash2 size={13} className="act-icon bearish" /> Delete
          </button>
          <button type="button" onClick={() => handleActionClick('Exit')} className="action-btn">
            <LogOut size={13} className="act-icon" /> Exit
          </button>
        </div>
      </div>

      {/* Main Form content */}
      <form onSubmit={(e) => e.preventDefault()} className="ticket-form">
        {/* Core Identification Block */}
        <div className="form-section glass">
          <h3 className="section-title">
            <Coins size={14} className="section-title-icon" />
            Free Cash Core Identification
          </h3>
          
          <div className="fc-top-layout">
            {/* Grid for Columns 1, 2, 3 */}
            <div className="fc-grid-left">
              {/* Row 1 */}
              <div className="input-group">
                <label>Trade Type</label>
                <input type="text" value="NTRM" disabled className="locked-input" />
              </div>
              <div className="input-group input-group--editable">
                <label>Company</label>
                <div className="editable-field">
                  <span className="field-value">{company}</span>
                  <button 
                    type="button" 
                    onClick={() => handleOpenModal('Select Company', 'entity', company)}
                    className="edit-pencil-btn"
                  >
                    <Pencil size={12} />
                  </button>
                </div>
              </div>
              <div className="input-group input-group--editable">
                <label>Counterparty</label>
                <div className="editable-field">
                  <span className="field-value">{counterparty}</span>
                  <button 
                    type="button" 
                    onClick={() => handleOpenModal('Select Counterparty', 'cpEntBook', counterparty)}
                    className="edit-pencil-btn"
                  >
                    <Pencil size={12} />
                  </button>
                </div>
              </div>

              {/* Row 2 */}
              <div className="input-group">
                <label>Sub Type</label>
                <select value={subType} onChange={(e) => setSubType(e.target.value)}>
                  <option value="FreeCash">FreeCash</option>
                </select>
              </div>
              <div className="input-group input-group--editable">
                <label>Trading Book</label>
                <div className="editable-field">
                  <span className="field-value">{tradingBook}</span>
                  <button 
                    type="button" 
                    onClick={() => handleOpenModal('Select Trading Book', 'book', tradingBook)}
                    className="edit-pencil-btn"
                  >
                    <Pencil size={12} />
                  </button>
                </div>
              </div>
              <div className="input-group">
                <label>Trade Date</label>
                <input type="date" value={tradeDate} onChange={(e) => setTradeDate(e.target.value)} />
              </div>

              {/* Row 3 */}
              <div className="input-group">
                <label>Trade Id</label>
                <input type="text" value={tradeId} disabled />
              </div>
              <div className="input-group-placeholder"></div> {/* Empty spacer to match visual layout grid */}
              <div className="input-group">
                <label>Trader</label>
                <input type="text" value={trader} onChange={(e) => setTrader(e.target.value)} />
              </div>

              {/* Row 4 */}
              <div className="input-group">
                <label>Version</label>
                <input type="text" value={version} disabled />
              </div>
              <div className="input-group">
                <label>Messages</label>
                <input type="text" value={messages} onChange={(e) => setMessages(e.target.value)} placeholder="Logs..." />
              </div>
              <div className="input-group">
                <label>Original Trader</label>
                <input type="text" value={orgTrader} onChange={(e) => setOrgTrader(e.target.value)} />
              </div>

              {/* Row 5 */}
              <div className="input-group">
                <label>Status</label>
                <input type="text" value={status} disabled className="status-new" />
              </div>
              <div className="input-group-placeholder"></div>
              <div className="input-group-placeholder"></div>

              {/* Row 6 */}
              <div className="input-group">
                <label>Destination</label>
                <input type="text" value={destination} disabled />
              </div>
              <div className="input-group span-two">
                <label>TotoroValuationFunction</label>
                <select value={totoroValuationFunction} onChange={(e) => setTotoroValuationFunction(e.target.value)}>
                  <option value="TotoroValuation">TotoroValuation</option>
                  <option value="Option 2">Option 2</option>
                </select>
              </div>
            </div>

            {/* Column 4: Right References Column */}
            <div className="fc-grid-right">
              <div className="textarea-ref-group">
                <label>Trade References</label>
                <textarea 
                  value={tradeReferences} 
                  onChange={(e) => setTradeReferences(e.target.value)}
                  placeholder="Enter trade reference notes..."
                  rows={6}
                />
              </div>
              {/* Note: Free Cash has no "Mirror This" radio options in the desktop view */}
              <div className="radio-spacer-empty" style={{ flex: 1 }}></div>
            </div>
          </div>
        </div>

        {/* Parameters Block */}
        <div className="form-section glass">
          <h3 className="section-title">
            <Scale size={14} className="section-title-icon" />
            Free Cash Parameters
          </h3>
          
          <div className="fc-parameters-layout">
            <div className="fc-params-row">
              {/* Direction Stack: Pay / Receive */}
              <div className="direction-toggle-container">
                <button
                  type="button"
                  onClick={() => setDirection('Pay')}
                  className={`dir-toggle-btn dir-toggle-btn--pay ${direction === 'Pay' ? 'active' : ''}`}
                >
                  Pay
                </button>
                <button
                  type="button"
                  onClick={() => setDirection('Receive')}
                  className={`dir-toggle-btn dir-toggle-btn--receive ${direction === 'Receive' ? 'active' : ''}`}
                >
                  Receive
                </button>
              </div>

              {/* Dynamic Label based on direction: NTRM Pleg (Pay Leg) or NTRM Rleg (Receive Leg) */}
              <div className="sub-input">
                <label>{direction === 'Pay' ? 'NTRM Pleg' : 'NTRM Rleg'}</label>
                <select value={ntrmFleg} onChange={(e) => setNtrmFleg(e.target.value)}>
                  <option value="ACACashCollIP">ACACashCollIP</option>
                  <option value="ACACashCollOP">ACACashCollOP</option>
                  <option value="None">None</option>
                </select>
              </div>

              <div className="sub-input">
                <label>Ccy</label>
                <select value={ccy} onChange={(e) => setCcy(e.target.value)}>
                  <option value="USD">USD</option>
                  <option value="JPY">JPY</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>

              <div className="sub-input">
                <label>Amount</label>
                <input 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)} 
                />
              </div>

              <div className="sub-input">
                <label>Value Date</label>
                <input 
                  type="date" 
                  value={valueDate} 
                  onChange={(e) => setValueDate(e.target.value)} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Change and Settlement Comments */}
        <div className="form-section glass">
          <h3 className="section-title">Comments & Strategy</h3>
          
          <div className="fc-comments-grid">
            {/* Change comments */}
            <div className="comment-block">
              <div className="input-group">
                <label>ChangeOwner</label>
                <input 
                  type="text" 
                  placeholder="Change Owner" 
                  value={changeOwner} 
                  onChange={(e) => setChangeOwner(e.target.value)} 
                />
              </div>
              <div className="input-group">
                <label>ChangeReason</label>
                <input 
                  type="text" 
                  placeholder="Change Reason" 
                  value={changeReason} 
                  onChange={(e) => setChangeReason(e.target.value)} 
                />
              </div>
              <div className="input-group">
                <label>ChangeComment</label>
                <textarea 
                  rows={2} 
                  placeholder="Change Comment" 
                  value={changeComment} 
                  onChange={(e) => setChangeComment(e.target.value)} 
                />
              </div>
            </div>

            {/* Strategy and settlement */}
            <div className="comment-block">
              <div className="input-group">
                <label>Comment</label>
                <input 
                  type="text" 
                  placeholder="General comments..." 
                  value={comment} 
                  onChange={(e) => setComment(e.target.value)} 
                />
              </div>
              <div className="input-group">
                <label>Settlement Comment</label>
                <input 
                  type="text" 
                  placeholder="Settlement notes..." 
                  value={settlementComment} 
                  onChange={(e) => setSettlementComment(e.target.value)} 
                />
              </div>
              
              <div className="input-group-row">
                <div className="input-group half-width">
                  <label>Holidays</label>
                  <input type="text" value={holidays} onChange={(e) => setHolidays(e.target.value)} />
                </div>
                <div className="input-group half-width">
                  <label>Strategy</label>
                  <input type="text" value={strategy} onChange={(e) => setStrategy(e.target.value)} />
                </div>
              </div>

              <div className="input-group mt-2">
                <label>Accrued Interest Overwrite</label>
                <select 
                  value={accruedInterestOverwrite} 
                  onChange={(e) => setAccruedInterestOverwrite(e.target.value)}
                >
                  <option value="None">None</option>
                  <option value="True">True</option>
                  <option value="False">False</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Support Link */}
        <div className="support-link-container-fx">
          <a href="#support" className="support-link" onClick={() => addToast('Connecting to Free Cash support...', 'info')}>
            Treasury Support
          </a>
        </div>
      </form>

      {/* Modal Settings Render */}
      <SettingsModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        field={modalField}
        value={modalValue}
        onSave={handleSaveModal}
      />
    </div>
  );
};

export default FreeCashTicket;
