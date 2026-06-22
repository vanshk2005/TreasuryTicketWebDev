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
import './NDFSwapTicket.css';

const NDFSwapTicket = ({ activeSubTab, mirrorTrades, disableOffMkt, addToast }) => {
  // Config fields (editable via pencils)
  const [company, setCompany] = useState('NHI');
  const [tradingBook, setTradingBook] = useState('TGT8400');
  const [counterparty, setCounterparty] = useState('NHI');

  // Form Fields
  const [subType, setSubType] = useState('NDFSwap');
  const [mirroredTrade, setMirroredTrade] = useState(false);
  const [tradeDate, setTradeDate] = useState(new Date().toISOString().split('T')[0]);
  const [tradeId] = useState('NDFS-99302');
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

  // NDF Swap Parameters fields (Near and Far legs)
  const [sellCur, setSellCur] = useState('USD');
  const [sellNearAmount, setSellNearAmount] = useState('10000000');
  const [sellFarAmount, setSellFarAmount] = useState('10000000');
  const [spotRate, setSpotRate] = useState('155.20');
  const [fwdRate, setFwdRate] = useState('155.25');

  const [buyCur, setBuyCur] = useState('JPY');
  const [buyNearAmount, setBuyNearAmount] = useState('64433.00');
  const [buyFarAmount, setBuyFarAmount] = useState('64412.00');

  const [nearFixingDate, setNearFixingDate] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]); // T+1
  const [farFixingDate, setFarFixingDate] = useState(new Date(Date.now() + 2505600000).toISOString().split('T')[0]); // T+29
  const [nearValueDate, setNearValueDate] = useState(new Date(Date.now() + 172800000).toISOString().split('T')[0]); // T+2
  const [farValueDate, setFarValueDate] = useState(new Date(Date.now() + 2592000000).toISOString().split('T')[0]); // T+30

  const [overrideDefaultSSI, setOverrideDefaultSSI] = useState(false);

  // Bottom parameters
  const [landRate, setLandRate] = useState('0.150');
  const [points, setPoints] = useState('50.00');
  const [borrowRate, setBorrowRate] = useState('0.120');
  const [bc, setBc] = useState('Foil');
  const [accrualSell, setAccrualSell] = useState('ACT/360');
  const [accrualBuy, setAccrualBuy] = useState('ACT/365');
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

  // Dynamically calculate forward rate and buy amounts
  useEffect(() => {
    const spot = parseFloat(spotRate) || 0;
    const pts = parseFloat(points) || 0;
    if (spot > 0) {
      const fwd = spot + (pts / 10000);
      setFwdRate(fwd.toFixed(4));
    }
  }, [spotRate, points]);

  useEffect(() => {
    const sNear = parseFloat(sellNearAmount) || 0;
    const sFar = parseFloat(sellFarAmount) || 0;
    const spot = parseFloat(spotRate) || 0;
    const fwd = parseFloat(fwdRate) || 0;

    if (sNear > 0 && spot > 0) {
      const nearResult = reciprocal ? (sNear * spot) : (sNear / spot);
      setBuyNearAmount(nearResult.toFixed(2));
    }
    if (sFar > 0 && fwd > 0) {
      const farResult = reciprocal ? (sFar * fwd) : (sFar / fwd);
      setBuyFarAmount(farResult.toFixed(2));
    }
  }, [sellNearAmount, sellFarAmount, spotRate, fwdRate, reciprocal]);

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
      addToast(`NDF Swap Trade committed successfully! Position updated in book ${tradingBook}.`, 'success');
    } else if (actionName === 'Validate') {
      addToast(`NDF Swap validation passed. Near Value Date: ${nearValueDate}, Far Value Date: ${farValueDate}.`, 'info');
    } else if (actionName === 'Save') {
      addToast(`NDF Swap Ticket saved as draft.`, 'success');
    } else if (actionName === 'Undo') {
      setSellNearAmount('10000000');
      setSellFarAmount('10000000');
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
        <h3>NDF Swap Preferences</h3>
        <p className="subtitle">Configure settings for NDF Swap tenors and fixing schedules</p>
        <div className="preferences-grid mt-2">
          <div className="pref-row">
            <span className="pref-lbl">Enable Automatic Swap Roll Calendar</span>
            <label className="custom-checkbox">
              <input type="checkbox" defaultChecked />
              <div className="checkbox-box"></div>
            </label>
          </div>
          <div className="pref-row">
            <span className="pref-lbl">Default Swap Tenor Range</span>
            <select defaultValue="1M">
              <option value="1W">1 Week (1W)</option>
              <option value="1M">1 Month (1M)</option>
              <option value="3M">3 Months (3M)</option>
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
            NDF Swap Core Identification
          </h3>
          
          <div className="ndf-swap-top-layout">
            {/* Grid for Columns 1, 2, 3 */}
            <div className="ndf-swap-grid-left">
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
                  <option value="NDFSwap">NDFSwap</option>
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
            <div className="ndf-swap-grid-right">
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
                      name="mirror-this-ndfs" 
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
                      name="mirror-this-ndfs" 
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

        {/* NDF Swap Leg Details Block */}
        <div className="form-section glass">
          <h3 className="section-title">
            <Scale size={14} className="section-title-icon" />
            Leg Details
          </h3>
          
          <div className="ndfs-legs-layout">
            {/* Grid Table headers */}
            <div className="ndfs-grid-header">
              <div>Leg</div>
              <div>Sell Cur</div>
              <div>Sell Amount</div>
              <div>Rate</div>
              <div>Buy Cur</div>
              <div>Buy Amount</div>
              <div>Fixing Date</div>
              <div>Value Date</div>
            </div>

            {/* Near Leg row */}
            <div className="ndfs-grid-row">
              <div className="leg-label">Near</div>
              <div className="sub-input">
                <select value={sellCur} onChange={(e) => setSellCur(e.target.value)}>
                  <option value="USD">USD</option>
                  <option value="JPY">JPY</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
              <div className="sub-input">
                <input 
                  type="number" 
                  value={sellNearAmount} 
                  onChange={(e) => setSellNearAmount(e.target.value)} 
                />
              </div>
              <div className="sub-input">
                <input 
                  type="text" 
                  value={spotRate} 
                  onChange={(e) => setSpotRate(e.target.value)} 
                  placeholder="Spot Rate"
                />
              </div>
              <div className="sub-input">
                <select value={buyCur} onChange={(e) => setBuyCur(e.target.value)}>
                  <option value="JPY">JPY</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
              <div className="sub-input">
                <input 
                  type="number" 
                  value={buyNearAmount} 
                  disabled
                  className="locked-input"
                />
              </div>
              <div className="sub-input">
                <input 
                  type="date" 
                  value={nearFixingDate} 
                  onChange={(e) => setNearFixingDate(e.target.value)} 
                />
              </div>
              <div className="sub-input">
                <input 
                  type="date" 
                  value={nearValueDate} 
                  onChange={(e) => setNearValueDate(e.target.value)} 
                />
              </div>
            </div>

            {/* Far Leg row */}
            <div className="ndfs-grid-row">
              <div className="leg-label">Far</div>
              <div className="inherited-ccy">{sellCur}</div>
              <div className="sub-input">
                <input 
                  type="number" 
                  value={sellFarAmount} 
                  onChange={(e) => setSellFarAmount(e.target.value)} 
                />
              </div>
              <div className="sub-input">
                <input 
                  type="text" 
                  value={fwdRate} 
                  onChange={(e) => setFwdRate(e.target.value)} 
                  placeholder="FWD Rate"
                />
              </div>
              <div className="inherited-ccy">{buyCur}</div>
              <div className="sub-input">
                <input 
                  type="number" 
                  value={buyFarAmount} 
                  disabled
                  className="locked-input"
                />
              </div>
              <div className="sub-input">
                <input 
                  type="date" 
                  value={farFixingDate} 
                  onChange={(e) => setFarFixingDate(e.target.value)} 
                />
              </div>
              <div className="sub-input">
                <input 
                  type="date" 
                  value={farValueDate} 
                  onChange={(e) => setFarValueDate(e.target.value)} 
                />
              </div>
            </div>

            {/* Override Default SSI checkbox row */}
            <div className="ndfs-ssi-row">
              <div className="empty-spacer"></div>
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

            {/* Bottom Parameters Grid (4 Columns) */}
            <div className="ndfs-bottom-params">
              {/* Column 1: Land Rate, Accrual */}
              <div className="ndfs-bottom-col">
                <div className="sub-input">
                  <label>Land Rate</label>
                  <input type="text" value={landRate} onChange={(e) => setLandRate(e.target.value)} />
                </div>
                <div className="sub-input">
                  <label>Accrual</label>
                  <select value={accrualSell} onChange={(e) => setAccrualSell(e.target.value)}>
                    <option value="ACT/360">ACT/360</option>
                    <option value="ACT/365">ACT/365</option>
                  </select>
                </div>
              </div>

              {/* Column 2: Points, Reciprocal */}
              <div className="ndfs-bottom-col">
                <div className="sub-input">
                  <label>Points</label>
                  <input type="text" value={points} onChange={(e) => setPoints(e.target.value)} />
                </div>
                <div className="checkbox-align-container mt-auto">
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
              </div>

              {/* Column 3: Borrow Rate, Accrual */}
              <div className="ndfs-bottom-col">
                <div className="sub-input">
                  <label>Borrow Rate</label>
                  <input type="text" value={borrowRate} onChange={(e) => setBorrowRate(e.target.value)} />
                </div>
                <div className="sub-input">
                  <label>Accrual</label>
                  <select value={accrualBuy} onChange={(e) => setAccrualBuy(e.target.value)}>
                    <option value="ACT/365">ACT/365</option>
                    <option value="ACT/360">ACT/360</option>
                  </select>
                </div>
              </div>

              {/* Column 4: BC, Disable OffMarket Checks */}
              <div className="ndfs-bottom-col">
                <div className="sub-input">
                  <label>BC</label>
                  <select value={bc} onChange={(e) => setBc(e.target.value)}>
                    <option value="Foil">Foil</option>
                    <option value="Option 2">Option 2</option>
                  </select>
                </div>
                <div className="checkbox-align-container mt-auto">
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
        </div>

        {/* Change and Settlement Comments */}
        <div className="form-section glass">
          <h3 className="section-title">Comments & Strategy</h3>
          
          <div className="ndfs-comments-grid">
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
          <a href="#support" className="support-link" onClick={() => addToast('Connecting to NDF Swap support...', 'info')}>
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

export default NDFSwapTicket;
