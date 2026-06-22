import { useState, useEffect } from 'react';
import { 
  Pencil, 
  Send, 
  RefreshCw, 
  Scale, 
  Check, 
  Save as SaveIcon, 
  Play, 
  ShieldAlert, 
  Undo2, 
  XSquare, 
  Trash2, 
  LogOut,
  Coins 
} from 'lucide-react';
import useTradeOperation from '../../utils/useTradeOperation';
import SettingsModal from '../Modal/SettingsModal';
import './FXOutrightTicket.css';

const FXOutrightTicket = ({ activeSubTab, mirrorTrades, disableOffMkt, addToast }) => {
  // Config fields (editable via pencils)
  const [company, setCompany] = useState('NHI');
  const [tradingBook, setTradingBook] = useState('TGT8400');
  const [counterparty, setCounterparty] = useState('NHI');

  // Form Fields
  const [subType, setSubType] = useState('Spot');
  const [mirroredTrade, setMirroredTrade] = useState(false);
  const [tradeDate, setTradeDate] = useState(new Date().toISOString().split('T')[0]);
  const [tradeId] = useState('FX-99281');
  const [version] = useState('0');
  const [status] = useState('New');
  const [trader, setTrader] = useState('KAKKAR, VANSH');
  const [orgTrader, setOrgTrader] = useState('KAKKAR, VANSH');
  const [messages, setMessages] = useState('');
  const [destination] = useState('Totoro');

  // Right block fields
  const [tradeReferences, setTradeReferences] = useState('');
  const [mirrorThis, setMirrorThis] = useState('No');

  // Sell Side Details (Near Leg only)
  const [sellCur, setSellCur] = useState('JPY');
  const [sellAmount, setSellAmount] = useState('10000000');
  const [sellFxRate, setSellFxRate] = useState('155.20');

  // Buy Side Details (Near Leg only)
  const [buyCur, setBuyCur] = useState('USD');
  const [buyAmount, setBuyAmount] = useState('64433.00');
  const [buyFxRate, setBuyFxRate] = useState('155.20');
  const [reciprocal, setReciprocal] = useState(false);

  // Value Date & Accrual
  const [valueDate, setValueDate] = useState(new Date(Date.now() + 172800000).toISOString().split('T')[0]); // T+2
  const [bc, setBc] = useState('Foil');
  const [disableOffMarketChecks, setDisableOffMarketChecks] = useState(false);

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

  // Dynamically calculate buy amount based on Fx Rate and Sell amount
  useEffect(() => {
    const sAmt = parseFloat(sellAmount) || 0;
    const rate = parseFloat(sellFxRate) || 0;
    if (sAmt > 0 && rate > 0) {
      let result;
      if (reciprocal) {
        result = sAmt * rate;
      } else {
        result = sAmt / rate;
      }
      setBuyAmount(result.toFixed(2));
    }
  }, [sellAmount, sellFxRate, reciprocal]);

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
      addToast(`FX Ticket committed successfully! Position updated in book ${tradingBook}.`, 'success');
    } else if (actionName === 'Validate') {
      addToast(`Ticket validation passed. Off-Market checks: ${disableOffMarketChecks ? 'OFF' : 'ON'}.`, 'info');
    } else if (actionName === 'Save') {
      addToast(`FX Outright Ticket saved as draft.`, 'success');
    } else if (actionName === 'Undo') {
      setSellAmount('10000000');
      setSellFxRate('155.20');
      setReciprocal(false);
      addToast(`Reverted inputs to default parameters.`, 'info');
    } else {
      addToast(`Action "${actionName}" executed.`, 'info');
    }
  };

  useTradeOperation(handleActionClick);

  if (activeSubTab === 'preferences') {
    return (
      <div className="preferences-view glass">
        <h3>FX Outright Preferences</h3>
        <p className="subtitle">Configure preferences for FX Spot and Outrights</p>
        <div className="preferences-grid mt-2">
          <div className="pref-row">
            <span className="pref-lbl">Enable Auto-Pricing Feed</span>
            <label className="custom-checkbox">
              <input type="checkbox" defaultChecked />
              <div className="checkbox-box"></div>
            </label>
          </div>
          <div className="pref-row">
            <span className="pref-lbl">Max Spot Limit Threshold (USD equivalent)</span>
            <input type="text" defaultValue="5,000,000" />
          </div>
          <div className="pref-row">
            <span className="pref-lbl">Auto-Mirror Collateral Trades</span>
            <label className="custom-checkbox">
              <input type="checkbox" defaultChecked />
              <div className="checkbox-box"></div>
            </label>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ticket-container">
      {/* FX Outright Actions bar matching the screenshot */}
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
            FX Core Identification
          </h3>
          
          <div className="fx-top-layout">
            {/* Left Grid */}
            <div className="fx-grid-left">
              {/* Row 1 */}
              <div className="input-group">
                <label>Trade Type</label>
                <input type="text" value="FX" disabled className="locked-input" />
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
                  <option value="Spot">Spot</option>
                  <option value="Outright">Outright</option>
                  <option value="Forward">Forward</option>
                </select>
              </div>
              <div className="input-group">
                <label>Mirrored Trade</label>
                <label className="custom-checkbox justify-start">
                  <input 
                    type="checkbox" 
                    checked={mirroredTrade} 
                    onChange={(e) => {
                      setMirroredTrade(e.target.checked);
                      addToast(`Mirrored Trade Option ${e.target.checked ? 'Enabled' : 'Disabled'}`, 'info');
                    }}
                  />
                  <div className="checkbox-box"></div>
                </label>
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
                <label>Trader</label>
                <input type="text" value={trader} onChange={(e) => setTrader(e.target.value)} />
              </div>

              {/* Row 4 */}
              <div className="input-group">
                <label>Version</label>
                <input type="text" value={version} disabled />
              </div>
              <div className="input-group">
                <label>Original Trader</label>
                <input type="text" value={orgTrader} onChange={(e) => setOrgTrader(e.target.value)} />
              </div>
              <div className="input-group">
                <label>Status</label>
                <input type="text" value={status} disabled className="status-new" />
              </div>

              {/* Row 5 */}
              <div className="input-group">
                <label>Messages</label>
                <input type="text" value={messages} onChange={(e) => setMessages(e.target.value)} placeholder="Enter logs..." />
              </div>
              <div className="input-group">
                <label>Destination</label>
                <input type="text" value={destination} disabled />
              </div>
            </div>

            {/* Right References Column */}
            <div className="fx-grid-right">
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
                      name="mirror-this" 
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
                      name="mirror-this" 
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

        {/* FX Details Leg Panel (Near Leg only) */}
        <div className="form-section glass">
          <h3 className="section-title">
            <Scale size={14} className="section-title-icon" />
            Leg Details
          </h3>

          <div className="fx-legs-container">
            {/* Sell Leg */}
            <div className="fx-side-panel fx-side-panel--sell">
              <h4 className="side-title">Sell Near</h4>
              <div className="fx-side-inputs">
                <div className="sub-input">
                  <label>Cur</label>
                  <select value={sellCur} onChange={(e) => setSellCur(e.target.value)}>
                    <option value="JPY">JPY</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
                <div className="sub-input">
                  <label>Amount</label>
                  <input 
                    type="number" 
                    value={sellAmount} 
                    onChange={(e) => setSellAmount(e.target.value)} 
                  />
                </div>
                <div className="sub-input">
                  <label>Fx Rate</label>
                  <input 
                    type="text" 
                    value={sellFxRate} 
                    onChange={(e) => setSellFxRate(e.target.value)} 
                  />
                </div>
              </div>
            </div>

            {/* Buy Leg */}
            <div className="fx-side-panel fx-side-panel--buy">
              <h4 className="side-title">Buy Near</h4>
              <div className="fx-side-inputs">
                <div className="sub-input">
                  <label>Ccy</label>
                  <select value={buyCur} onChange={(e) => setBuyCur(e.target.value)}>
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
                    value={buyAmount} 
                    disabled 
                    className="locked-input"
                  />
                </div>
                <div className="sub-input">
                  <label>Fx Rate</label>
                  <input 
                    type="text" 
                    value={buyFxRate} 
                    onChange={(e) => setBuyFxRate(e.target.value)} 
                  />
                </div>
              </div>
            </div>

            {/* Right side parameters (Value date, reciprocal, flags) */}
            <div className="fx-side-params">
              <div className="params-row">
                <div className="sub-input">
                  <label>Value Date</label>
                  <input type="date" value={valueDate} onChange={(e) => setValueDate(e.target.value)} />
                </div>
                <div className="sub-input">
                  <label>BC</label>
                  <select value={bc} onChange={(e) => setBc(e.target.value)}>
                    <option value="Foil">Foil</option>
                    <option value="Option 2">Option 2</option>
                  </select>
                </div>
              </div>

              <div className="checkboxes-vertical-fx">
                <label className="custom-checkbox">
                  <input 
                    type="checkbox" 
                    checked={reciprocal} 
                    onChange={(e) => setReciprocal(e.target.checked)}
                  />
                  <div className="checkbox-box"></div>
                  <span>Reciprocal</span>
                </label>

                <label className="custom-checkbox">
                  <input 
                    type="checkbox" 
                    checked={disableOffMarketChecks} 
                    onChange={(e) => setDisableOffMarketChecks(e.target.checked)}
                  />
                  <div className="checkbox-box"></div>
                  <span>Disable OffMarket Checks</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Change and Settlement Comments */}
        <div className="form-section glass">
          <h3 className="section-title">Comments & Strategy</h3>
          
          <div className="fx-comments-grid">
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
                  <option value="Manual">Manual</option>
                  <option value="Override">Override</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Support Link */}
        <div className="support-link-container-fx">
          <a href="#support" className="support-link" onClick={() => addToast('Connecting to FX support...', 'info')}>
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

export default FXOutrightTicket;
