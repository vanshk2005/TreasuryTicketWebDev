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
import './MMTicket.css';

const MMTicket = ({ activeTab, activeSubTab, mirrorTrades, disableOffMkt, addToast }) => {
  // Config fields (editable via pencils)
  const [company, setCompany] = useState('NHI');
  const [tradingBook, setTradingBook] = useState('TGT8400');
  const [counterparty, setCounterparty] = useState('NHI');

  // Form Fields
  const [subType, setSubType] = useState('InternalDeposit');
  const [mirroredTrade, setMirroredTrade] = useState(false);
  const [tradeDate, setTradeDate] = useState(new Date().toISOString().split('T')[0]);
  const [tradeId] = useState('MM-99482');
  const [version] = useState('0');
  const [status] = useState('New');
  const [trader, setTrader] = useState('KAKKAR, VANSH [kakkarvan]');
  const [orgTrader, setOrgTrader] = useState('KAKKAR, VANSH [kakkarvan]');
  const [messages, setMessages] = useState('');
  const [destination] = useState('Totoro');
  const [totoroValuationFunction, setTotoroValuationFunction] = useState('TotoroValuation');

  // Right block fields
  const [tradeReferences, setTradeReferences] = useState('');
  const [mirrorThis, setMirrorThis] = useState('No');

  // Deal Parameters fields
  const [currency, setCurrency] = useState('USD');
  const [notional, setNotional] = useState('10000000');
  const [index, setIndex] = useState('Libor');
  const [spread, setSpread] = useState('0.0000');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [accrual, setAccrual] = useState('ACT/360');
  const [bc, setBc] = useState('Mod Foil');
  const [maturityDate, setMaturityDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // T+30
  );
  const [overrideDefaultSSI, setOverrideDefaultSSI] = useState(false);

  // Comments
  const [changeOwner, setChangeOwner] = useState('');
  const [changeReason, setChangeReason] = useState('');
  const [changeComment, setChangeComment] = useState('');
  const [comment, setComment] = useState('');
  const [settlementComment, setSettlementComment] = useState('');
  const [holidays, setHolidays] = useState('None');
  const [strategy, setStrategy] = useState('');
  const [accruedInterestOverwrite, setAccruedInterestOverwrite] = useState('True');

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
      addToast(`MM Trade committed successfully! Position updated in book ${tradingBook}.`, 'success');
    } else if (actionName === 'Validate') {
      addToast(`Ticket validation passed. Off-Market checks: ON.`, 'info');
    } else if (actionName === 'Save') {
      addToast(`MM Ticket saved as draft.`, 'success');
    } else if (actionName === 'Undo') {
      setNotional('10000000');
      setSpread('0.0000');
      setOverrideDefaultSSI(false);
      setMirrorThis('No');
      addToast(`Reverted inputs to default parameters.`, 'info');
    } else {
      addToast(`Action "${actionName}" executed.`, 'info');
    }
  };

  useTradeOperation(handleActionClick);

  const getDisplayTradeType = () => {
    return activeTab.toUpperCase().replace('-', ' ');
  };

  if (activeSubTab === 'preferences') {
    return (
      <div className="preferences-view glass">
        <h3>{getDisplayTradeType()} Preferences</h3>
        <p className="subtitle">Configure preferences for Trade Type: <strong>{getDisplayTradeType()}</strong></p>
        <div className="preferences-grid mt-2">
          <div className="pref-row">
            <span className="pref-lbl">Auto-Approve Internal Deals</span>
            <label className="custom-checkbox">
              <input type="checkbox" defaultChecked />
              <div className="checkbox-box"></div>
            </label>
          </div>
          <div className="pref-row">
            <span className="pref-lbl">Default Accrual Method</span>
            <select defaultValue="ACT/360">
              <option value="ACT/360">ACT/360</option>
              <option value="ACT/365">ACT/365</option>
              <option value="30/360">30/360</option>
            </select>
          </div>
          <div className="pref-row">
            <span className="pref-lbl">Auto-Export to Ledger Blotter</span>
            <label className="custom-checkbox">
              <input type="checkbox" />
              <div className="checkbox-box"></div>
            </label>
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
            MM Core Identification
          </h3>
          
          <div className="mm-top-layout">
            {/* Grid for Columns 1, 2, 3 */}
            <div className="mm-grid-left">
              {/* Row 1 */}
              <div className="input-group">
                <label>Trade Type</label>
                <input type="text" value={getDisplayTradeType()} disabled className="locked-input" />
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
                  <option value="InternalDeposit">InternalDeposit</option>
                  <option value="TermDeposit">TermDeposit</option>
                  <option value="CallDeposit">CallDeposit</option>
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
              <div className="input-group-placeholder"></div> {/* Spacer */}
              <div className="input-group-placeholder"></div> {/* Spacer */}

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
            <div className="mm-grid-right">
              <div className="textarea-ref-group">
                <label>Trade References</label>
                <textarea 
                  value={tradeReferences} 
                  onChange={(e) => setTradeReferences(e.target.value)}
                  placeholder="Enter trade reference notes..."
                  rows={6}
                />
              </div>

              <div className="radio-group-container">
                <label>Mirror This</label>
                <div className="radios-horizontal">
                  <label className="custom-radio">
                    <input 
                      type="radio" 
                      name="mirror-this-mm" 
                      value="Yes" 
                      checked={mirrorThis === 'Yes'}
                      onChange={() => setMirrorThis('Yes')}
                    />
                    <div className="radio-circle"></div>
                    <span>Yes</span>
                  </label>
                  <label className="custom-radio">
                    <input 
                      type="radio" 
                      name="mirror-this-mm" 
                      value="No" 
                      checked={mirrorThis === 'No'}
                      onChange={() => setMirrorThis('No')}
                    />
                    <div className="radio-circle"></div>
                    <span>No</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Parameters Block */}
        <div className="form-section glass">
          <h3 className="section-title">
            <Scale size={14} className="section-title-icon" />
            Deal Parameters
          </h3>
          
          <div className="mm-parameters-layout">
            {/* Row 1: Currency, Notional, Index, Spread, Start */}
            <div className="mm-params-row-1">
              <div className="sub-input">
                <label>Currency</label>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  <option value="USD">USD</option>
                  <option value="JPY">JPY</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
              <div className="sub-input">
                <label>Notional</label>
                <input 
                  type="number" 
                  value={notional} 
                  onChange={(e) => setNotional(e.target.value)} 
                />
              </div>
              <div className="sub-input">
                <label>Index</label>
                <select value={index} onChange={(e) => setIndex(e.target.value)}>
                  <option value="Libor">Libor</option>
                  <option value="SOFR">SOFR</option>
                  <option value="Euribor">Euribor</option>
                  <option value="Tona">Tona</option>
                </select>
              </div>
              <div className="sub-input">
                <label>Spread</label>
                <input 
                  type="text" 
                  value={spread} 
                  onChange={(e) => setSpread(e.target.value)} 
                />
              </div>
              <div className="sub-input">
                <label>Start</label>
                <input 
                  type="date" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)} 
                />
              </div>
            </div>

            {/* Row 2: Accrual, BC, Maturity, Override SSI */}
            <div className="mm-params-row-2">
              <div className="sub-input">
                <label>Accrual</label>
                <select value={accrual} onChange={(e) => setAccrual(e.target.value)}>
                  <option value="ACT/360">ACT/360</option>
                  <option value="ACT/365">ACT/365</option>
                  <option value="30/360">30/360</option>
                </select>
              </div>
              <div className="sub-input">
                <label>BC</label>
                <select value={bc} onChange={(e) => setBc(e.target.value)}>
                  <option value="Mod Foil">Mod Foil</option>
                  <option value="Foil">Foil</option>
                  <option value="None">None</option>
                </select>
              </div>
              <div className="sub-input">
                <label>Maturity</label>
                <input 
                  type="date" 
                  value={maturityDate} 
                  onChange={(e) => setMaturityDate(e.target.value)} 
                />
              </div>
              <div className="checkbox-align-container">
                <label className="custom-checkbox">
                  <input 
                    type="checkbox" 
                    checked={overrideDefaultSSI} 
                    onChange={(e) => setOverrideDefaultSSI(e.target.checked)}
                  />
                  <div className="checkbox-box"></div>
                  <span>Override Default SSI</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Change and Settlement Comments */}
        <div className="form-section glass">
          <h3 className="section-title">Comments & Strategy</h3>
          
          <div className="mm-comments-grid">
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
          <a href="#support" className="support-link" onClick={() => addToast('Connecting to MM support...', 'info')}>
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

export default MMTicket;
