import { useState, useEffect } from 'react';
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
import './NDFOutrightTicket.css';

const NDFOutrightTicket = ({ activeSubTab, mirrorTrades, disableOffMkt, addToast }) => {
  // Config fields (editable via pencils)
  const [company, setCompany] = useState('NHI');
  const [tradingBook, setTradingBook] = useState('TGT8400');
  const [counterparty, setCounterparty] = useState('NHI');

  // Form Fields
  const [subType, setSubType] = useState('NDFOutright');
  const [mirroredTrade, setMirroredTrade] = useState(false);
  const [tradeDate, setTradeDate] = useState(new Date().toISOString().split('T')[0]);
  const [tradeId] = useState('NDF-99201');
  const [version] = useState('0');
  const [status] = useState('New');
  const [trader, setTrader] = useState('KAKKAR, VANSH [kakkarvan]');
  const [orgTrader, setOrgTrader] = useState('KAKKAR, VANSH [kakkarvan]');
  const [messages, setMessages] = useState('');
  const [destination] = useState('Venom');
  const [totoroValuationFunction, setTotoroValuationFunction] = useState('TotoroValuation');

  // Right block fields
  const [tradeReferences, setTradeReferences] = useState('');
  const [mirrorThis, setMirrorThis] = useState('No');

  // NDF Parameters fields
  const [sellCur, setSellCur] = useState('USD');
  const [sellAmount, setSellAmount] = useState('10000000');
  const [spotRate, setSpotRate] = useState('155.20');
  const [points, setPoints] = useState('50.00');
  const [buyCur, setBuyCur] = useState('JPY');
  const [buyAmount, setBuyAmount] = useState('64433.00');
  const [fwdRate, setFwdRate] = useState('155.25');
  const [valueDate, setValueDate] = useState(new Date(Date.now() + 172800000).toISOString().split('T')[0]); // T+2
  
  const [fixingDate, setFixingDate] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]); // T+1
  const [lendRate, setLendRate] = useState('0.150');
  const [borrowRate, setBorrowRate] = useState('0.120');
  const [bc, setBc] = useState('Foil');
  
  const [reciprocal, setReciprocal] = useState(false);
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

  // Dynamically calculate forward rate and buy amount
  useEffect(() => {
    const spot = parseFloat(spotRate) || 0;
    const pts = parseFloat(points) || 0;
    if (spot > 0) {
      const fwd = spot + (pts / 10000);
      setFwdRate(fwd.toFixed(4));
    }
  }, [spotRate, points]);

  useEffect(() => {
    const sAmt = parseFloat(sellAmount) || 0;
    const rate = parseFloat(fwdRate) || 0;
    if (sAmt > 0 && rate > 0) {
      let result;
      if (reciprocal) {
        result = sAmt * rate;
      } else {
        result = sAmt / rate;
      }
      setBuyAmount(result.toFixed(2));
    }
  }, [sellAmount, fwdRate, reciprocal]);

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
      addToast(`NDF Outright Trade committed successfully! Position updated in book ${tradingBook}.`, 'success');
    } else if (actionName === 'Validate') {
      addToast(`NDF Ticket validation passed. Value Date: ${valueDate}, Fixing Date: ${fixingDate}.`, 'info');
    } else if (actionName === 'Save') {
      addToast(`NDF Outright Ticket saved as draft.`, 'success');
    } else if (actionName === 'Undo') {
      setSellAmount('10000000');
      setSpotRate('155.20');
      setPoints('50.00');
      setReciprocal(false);
      addToast(`Reverted parameters to defaults.`, 'info');
    } else {
      addToast(`Action "${actionName}" executed.`, 'info');
    }
  };

  useTradeOperation(handleActionClick);

  if (activeSubTab === 'preferences') {
    return (
      <div className="preferences-view glass">
        <h3>NDF Outright Preferences</h3>
        <p className="subtitle">Configure preferences for Non-Deliverable Forwards pricing and fixing</p>
        <div className="preferences-grid mt-2">
          <div className="pref-row">
            <span className="pref-lbl">Enable Auto-Fixing Date Calendar Lookup</span>
            <label className="custom-checkbox">
              <input type="checkbox" defaultChecked />
              <div className="checkbox-box"></div>
            </label>
          </div>
          <div className="pref-row">
            <span className="pref-lbl">NDF Fixing Source Registry</span>
            <select defaultValue="BFIX">
              <option value="BFIX">Bloomberg BFIX</option>
              <option value="WM">Reuters WM/R</option>
              <option value="EMTA">EMTA Template</option>
            </select>
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
            NDF Core Identification
          </h3>
          
          <div className="ndf-top-layout">
            {/* Grid for Columns 1, 2, 3 */}
            <div className="ndf-grid-left">
              {/* Row 1 */}
              <div className="input-group">
                <label>Trade Type</label>
                <input type="text" value="NDF" disabled className="locked-input" />
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
                  <option value="NDFOutright">NDFOutright</option>
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
            <div className="ndf-grid-right">
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
                      name="mirror-this-ndf" 
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
                      name="mirror-this-ndf" 
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

        {/* NDF Leg Details Block */}
        <div className="form-section glass">
          <h3 className="section-title">
            <Scale size={14} className="section-title-icon" />
            Leg Details
          </h3>
          
          <div className="ndf-legs-layout">
            {/* Grid Row 1: Sell Leg, Spot/Points, Buy Leg, FWD Rate/Value Date */}
            <div className="ndf-legs-row-1">
              {/* Column 1: Sell Leg details */}
              <div className="ndf-panel ndf-panel--sell">
                <h4 className="side-title">Sell</h4>
                <div className="ndf-side-inputs">
                  <div className="sub-input">
                    <label>Ccy</label>
                    <select value={sellCur} onChange={(e) => setSellCur(e.target.value)}>
                      <option value="USD">USD</option>
                      <option value="JPY">JPY</option>
                      <option value="EUR">EUR</option>
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
                </div>
              </div>

              {/* Column 2: Spot Rate and Points */}
              <div className="ndf-panel ndf-panel--rates">
                <h4 className="side-title">Spot Pricing</h4>
                <div className="ndf-side-inputs ndf-side-inputs--two">
                  <div className="sub-input">
                    <label>Spot Rate</label>
                    <input 
                      type="text" 
                      value={spotRate} 
                      onChange={(e) => setSpotRate(e.target.value)} 
                    />
                  </div>
                  <div className="sub-input">
                    <label>Points</label>
                    <input 
                      type="text" 
                      value={points} 
                      onChange={(e) => setPoints(e.target.value)} 
                    />
                  </div>
                </div>
              </div>

              {/* Column 3: Buy Leg details */}
              <div className="ndf-panel ndf-panel--buy">
                <h4 className="side-title">Buy</h4>
                <div className="ndf-side-inputs">
                  <div className="sub-input">
                    <label>Ccy</label>
                    <select value={buyCur} onChange={(e) => setBuyCur(e.target.value)}>
                      <option value="JPY">JPY</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
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
                </div>
              </div>

              {/* Column 4: Forward rate and Value date */}
              <div className="ndf-panel ndf-panel--fwd">
                <h4 className="side-title">Forward Delivery</h4>
                <div className="ndf-side-inputs ndf-side-inputs--two">
                  <div className="sub-input">
                    <label>FWD Rate</label>
                    <input 
                      type="text" 
                      value={fwdRate} 
                      onChange={(e) => setFwdRate(e.target.value)} 
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

            {/* Grid Row 2: Fixing Date, Lend Rate, Borrow Rate, BC select */}
            <div className="ndf-legs-row-2">
              <div className="sub-input">
                <label>Fixing Date</label>
                <input 
                  type="date" 
                  value={fixingDate} 
                  onChange={(e) => setFixingDate(e.target.value)} 
                />
              </div>

              <div className="sub-input">
                <label>Lend Rate</label>
                <input 
                  type="text" 
                  value={lendRate} 
                  onChange={(e) => setLendRate(e.target.value)} 
                />
              </div>

              <div className="sub-input">
                <label>Borrow Rate</label>
                <input 
                  type="text" 
                  value={borrowRate} 
                  onChange={(e) => setBorrowRate(e.target.value)} 
                />
              </div>

              <div className="sub-input">
                <label>BC</label>
                <select value={bc} onChange={(e) => setBc(e.target.value)}>
                  <option value="Foil">Foil</option>
                  <option value="Option 2">Option 2</option>
                </select>
              </div>
            </div>

            {/* Grid Row 3: Reciprocal Checkbox, empty columns, and Disable Checks Checkbox */}
            <div className="ndf-legs-row-3">
              <div className="checkbox-align-container">
                <label className="custom-checkbox">
                  <input 
                    type="checkbox" 
                    checked={reciprocal} 
                    onChange={(e) => setReciprocal(e.target.checked)}
                  />
                  <div className="checkbox-box"></div>
                  <span>Reciprocal</span>
                </label>
              </div>

              <div className="empty-spacer"></div>
              <div className="empty-spacer"></div>

              <div className="checkbox-align-container">
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
          
          <div className="ndf-comments-grid">
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
          <a href="#support" className="support-link" onClick={() => addToast('Connecting to NDF support...', 'info')}>
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

export default NDFOutrightTicket;
