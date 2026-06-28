import { useState } from 'react';
import { 
  Check, 
  Save as SaveIcon, 
  Play, 
  ShieldAlert, 
  Undo2, 
  XSquare, 
  Trash2, 
  LogOut,
  RefreshCw
} from 'lucide-react';
import useTradeOperation from '../../utils/useTradeOperation';
import './NDFSwapTicket.css';

const NDFSwapTicket = ({ activeSubTab, mirrorTrades, disableOffMkt, addToast }) => {
  // Core config fields
  const [subType, setSubType] = useState('NDFSwap');
  const [company, setCompany] = useState('');
  const [counterparty, setCounterparty] = useState('');
  const [tradingBook, setTradingBook] = useState('');
  const [mirroredTrade, setMirroredTrade] = useState(mirrorTrades || false);
  const [tradeDate, setTradeDate] = useState('2026-06-22');
  const [tradeId, setTradeId] = useState('');
  const [trader, setTrader] = useState('KAKKAR, VANSH [kakkarvan]');
  const [version, setVersion] = useState('0');
  const [orgTrader, setOrgTrader] = useState('KAKKAR, VANSH [kakkarvan]');
  const [status, setStatus] = useState('New');
  const [messages, setMessages] = useState('');
  const [destination, setDestination] = useState('Venom');
  const [tradeReferences, setTradeReferences] = useState('');
  const [mirrorThis, setMirrorThis] = useState('No');

  // Params
  const [sellCur, setSellCur] = useState('');
  const [sellAmountNear, setSellAmountNear] = useState('');
  const [spotRate, setSpotRate] = useState('');
  const [buyCur, setBuyCur] = useState('');
  const [buyAmountNear, setBuyAmountNear] = useState('');
  const [fixingDateNear, setFixingDateNear] = useState('');
  const [valueDateNear, setValueDateNear] = useState('');

  const [sellAmountFar, setSellAmountFar] = useState('');
  const [fwdRate, setFwdRate] = useState('');
  const [buyAmountFar, setBuyAmountFar] = useState('');
  const [fixingDateFar, setFixingDateFar] = useState('');
  const [valueDateFar, setValueDateFar] = useState('');

  const [overrideDefaultSSI, setOverrideDefaultSSI] = useState(false);
  const [lendRate, setLendRate] = useState('');
  const [points, setPoints] = useState('');
  const [borrowRate, setBorrowRate] = useState('');
  const [bc, setBc] = useState('Full');
  const [accrualLeft, setAccrualLeft] = useState('');
  const [reciprocal, setReciprocal] = useState(false);
  const [accrualRight, setAccrualRight] = useState('');
  const [disableOffMarketChecks, setDisableOffMarketChecks] = useState(disableOffMkt || false);

  // Comments
  const [changeOwner, setChangeOwner] = useState('');
  const [changeReason, setChangeReason] = useState('');
  const [changeComment, setChangeComment] = useState('');
  const [comment, setComment] = useState('');
  const [settlementComment, setSettlementComment] = useState('');
  const [holidays, setHolidays] = useState('None');
  const [strategy, setStrategy] = useState('');
  const [accruedInterestOverwrite, setAccruedInterestOverwrite] = useState('None');

  const handleActionClick = (actionName) => {
    if (addToast) addToast(`${actionName} action performed on NDFSwap Ticket`, 'info');
  };
  useTradeOperation(handleActionClick);

  return (
    <div className="ticket-container">
      {/* Actions Bar */}
      <div className="actions-bar glass">
        <div className="actions-left">
          <button type="button" onClick={() => handleActionClick('OK')} className="action-btn"><Check size={13} className="act-icon success" /> OK</button>
          <button type="button" onClick={() => handleActionClick('Save')} className="action-btn"><SaveIcon size={13} className="act-icon" /> Save</button>
          <button type="button" onClick={() => handleActionClick('Commit')} className="action-btn"><Play size={13} className="act-icon primary" /> Commit</button>
          <button type="button" onClick={() => handleActionClick('Validate')} className="action-btn"><ShieldAlert size={13} className="act-icon warning" /> Validate</button>
          <button type="button" onClick={() => handleActionClick('Undo')} className="action-btn"><Undo2 size={13} className="act-icon" /> Undo</button>
        </div>
        <div className="actions-right">

          <div className="action-checkboxes" style={{ display: 'flex', gap: '15px', marginRight: '20px', alignItems: 'center' }}>
            <label className="custom-checkbox">
              <input type="checkbox" checked={mirroredTrade} onChange={(e) => setMirroredTrade(e.target.checked)} />
              <div className="checkbox-box"></div><span style={{color: 'var(--color-text)', fontSize: '12px'}}>Mirror Trades</span>
            </label>
            <label className="custom-checkbox">
              <input type="checkbox" checked={disableOffMarketChecks} onChange={(e) => setDisableOffMarketChecks(e.target.checked)} />
              <div className="checkbox-box"></div><span style={{color: 'var(--color-text)', fontSize: '12px'}}>Disable OffMkt Checks</span>
            </label>
          </div>
          <button type="button" onClick={() => handleActionClick('Cancel')} className="action-btn"><XSquare size={13} className="act-icon" /> Cancel</button>
          <button type="button" onClick={() => handleActionClick('Delete')} className="action-btn"><Trash2 size={13} className="act-icon bearish" /> Delete</button>
          <button type="button" onClick={() => handleActionClick('Exit')} className="action-btn"><LogOut size={13} className="act-icon" /> Exit</button>
        </div>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="ticket-form">
        
        {/* Core Identification Grid */}
        <div className="form-section glass">
          <div className="core-identification-grid">
            {/* Column 1 */}
            <div className="core-column">
              <div className="input-row"><label>Trade Type</label><input type="text" value="NDF" disabled /></div>
              <div className="input-row">
                <label>Sub Type</label>
                <select value={subType} onChange={(e) => setSubType(e.target.value)}>
                  <option value="NDFSwap">NDFSwap</option>
                </select>
              </div>
              <div className="input-row"><label>Trade Id</label><input type="text" value={tradeId} disabled /></div>
              <div className="input-row"><label>Version</label><input type="text" value={version} disabled /></div>
              <div className="input-row"><label>Status</label><input type="text" value={status} disabled /></div>
              <div className="input-row"><label>Destination</label><input type="text" value={destination} disabled /></div>
            </div>

            {/* Column 2 */}
            <div className="core-column">
              <div className="input-row">
                <label>Company</label>
                <select value={company} onChange={(e) => setCompany(e.target.value)}><option value=""></option></select>
              </div>
              
              <div className="input-row">
                <label>Trading Book</label>
                <select value={tradingBook} onChange={(e) => setTradingBook(e.target.value)}><option value=""></option></select>
              </div>
              <div className="input-row"><label>Messages</label><input type="text" value={messages} onChange={(e) => setMessages(e.target.value)} /></div>
            </div>

            {/* Column 3 */}
            <div className="core-column">
              <div className="input-row">
                <label>Counterparty</label>
                <select value={counterparty} onChange={(e) => setCounterparty(e.target.value)}><option value=""></option></select>
              </div>
              <div className="input-row"><label>Trade Date</label><input type="date" value={tradeDate} onChange={(e) => setTradeDate(e.target.value)} /></div>
              <div className="input-row"><label>Trader</label><input type="text" value={trader} onChange={(e) => setTrader(e.target.value)} /></div>
              <div className="input-row"><label>Original Trader</label><input type="text" value={orgTrader} onChange={(e) => setOrgTrader(e.target.value)} /></div>
            </div>

            {/* Column 4 */}
            <div className="core-column">
              <div className="input-row" style={{ gridTemplateColumns: '1fr', gap: '0.1rem' }}>
                <label>Trade References</label>
                <textarea rows={3} value={tradeReferences} onChange={(e) => setTradeReferences(e.target.value)} />
              </div>
              <div className="input-row" style={{marginTop: '0.5rem'}}>
                <label>Mirror This</label>
                <div style={{display: 'flex', gap: '15px'}}>
                  <label className="custom-radio">
                    <input type="radio" value="Yes" checked={mirrorThis === 'Yes'} onChange={() => setMirrorThis('Yes')} />
                    <div className="radio-circle"></div><span>Yes</span>
                  </label>
                  <label className="custom-radio">
                    <input type="radio" value="No" checked={mirrorThis === 'No'} onChange={() => setMirrorThis('No')} />
                    <div className="radio-circle"></div><span>No</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Parameters Grid */}
        <div className="form-section glass">
          <div className="param-table" style={{ gridTemplateColumns: '40px 80px 100px 100px 80px 100px 140px 140px' }}>
            <div className="empty-cell"></div>
            <div className="param-table-header" style={{textAlign: 'center'}}>Sell</div>
            <div className="empty-cell"></div>
            <div className="empty-cell"></div>
            <div className="param-table-header" style={{textAlign: 'center'}}>Buy</div>
            <div className="empty-cell"></div>
            <div className="empty-cell"></div>
            <div className="empty-cell"></div>

            <div className="empty-cell"></div>
            <div className="param-table-header">Ccy</div>
            <div className="param-table-header">Amount</div>
            <div className="param-table-header">Spot Rate</div>
            <div className="param-table-header">Ccy</div>
            <div className="param-table-header">Amount</div>
            <div className="param-table-header">Fixing Date</div>
            <div className="param-table-header">Value Date</div>

            {/* Near Row */}
            <div className="param-row-label">Near</div>
            <select value={sellCur} onChange={(e) => setSellCur(e.target.value)}><option value=""></option></select>
            <input type="number" value={sellAmountNear} onChange={(e) => setSellAmountNear(e.target.value)} />
            <input type="text" value={spotRate} onChange={(e) => setSpotRate(e.target.value)} />
            <select value={buyCur} onChange={(e) => setBuyCur(e.target.value)}><option value=""></option></select>
            <input type="number" value={buyAmountNear} onChange={(e) => setBuyAmountNear(e.target.value)} />
            <div style={{display: 'flex', gap: '5px', alignItems: 'center'}}>
              <label className="custom-checkbox"><input type="checkbox" /><div className="checkbox-box"></div></label>
              <input type="date" value={fixingDateNear} onChange={(e) => setFixingDateNear(e.target.value)} />
            </div>
            <div style={{display: 'flex', gap: '5px', alignItems: 'center'}}>
              <label className="custom-checkbox"><input type="checkbox" /><div className="checkbox-box"></div></label>
              <input type="date" value={valueDateNear} onChange={(e) => setValueDateNear(e.target.value)} />
            </div>

            {/* FWD Rate Header block inserted mid-table */}
            <div className="empty-cell"></div>
            <div className="empty-cell"></div>
            <div className="empty-cell"></div>
            <div className="param-table-header">FWD Rate</div>
            <div className="empty-cell"></div>
            <div className="empty-cell"></div>
            <div className="empty-cell"></div>
            <div className="empty-cell"></div>

            {/* Far Row */}
            <div className="param-row-label">Far</div>
            <div className="empty-cell"></div>
            <input type="number" value={sellAmountFar} onChange={(e) => setSellAmountFar(e.target.value)} />
            <input type="text" value={fwdRate} onChange={(e) => setFwdRate(e.target.value)} />
            <div className="empty-cell"></div>
            <input type="number" value={buyAmountFar} onChange={(e) => setBuyAmountFar(e.target.value)} />
            <div style={{display: 'flex', gap: '5px', alignItems: 'center'}}>
              <label className="custom-checkbox"><input type="checkbox" /><div className="checkbox-box"></div></label>
              <input type="date" value={fixingDateFar} onChange={(e) => setFixingDateFar(e.target.value)} />
            </div>
            <div style={{display: 'flex', gap: '5px', alignItems: 'center'}}>
              <label className="custom-checkbox"><input type="checkbox" /><div className="checkbox-box"></div></label>
              <input type="date" value={valueDateFar} onChange={(e) => setValueDateFar(e.target.value)} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '2rem', marginTop: '1rem' }}>
            <label className="custom-checkbox">
              <input type="checkbox" checked={overrideDefaultSSI} onChange={(e) => setOverrideDefaultSSI(e.target.checked)} />
              <div className="checkbox-box"></div><span>Override Default SSI</span>
            </label>
          </div>

          {/* Points / Rates Row */}
          <div className="param-table" style={{ gridTemplateColumns: 'repeat(7, 1fr)', marginTop: '1rem' }}>
            <div className="input-row"><label>Lend Rate</label><input type="text" value={lendRate} onChange={(e)=>setLendRate(e.target.value)} /></div>
            <div className="empty-cell"></div>
            <div className="input-row"><label style={{textAlign: 'center', width: '100%', display: 'block'}}>Points</label><input type="text" value={points} onChange={(e)=>setPoints(e.target.value)} /></div>
            <div className="empty-cell"></div>
            <div className="input-row"><label>Borrow Rate</label><input type="text" value={borrowRate} onChange={(e)=>setBorrowRate(e.target.value)} /></div>
            <div className="empty-cell"></div>
            <div className="input-row"><label>BC</label><select value={bc} onChange={(e)=>setBc(e.target.value)}><option value="Full">Full</option></select></div>
            
            <div className="input-row"><label>Accrual</label><select value={accrualLeft} onChange={(e)=>setAccrualLeft(e.target.value)}><option value=""></option></select></div>
            <div className="empty-cell"></div>
            <label className="custom-checkbox" style={{justifyContent: 'center'}}>
              <input type="checkbox" checked={reciprocal} onChange={(e)=>setReciprocal(e.target.checked)} />
              <div className="checkbox-box"></div><span>Reciprocal</span>
            </label>
            <div className="empty-cell"></div>
            <div className="input-row"><label>Accrual</label><select value={accrualRight} onChange={(e)=>setAccrualRight(e.target.value)}><option value=""></option></select></div>
            <div className="empty-cell"></div>
            <label className="custom-checkbox">
              <input type="checkbox" checked={disableOffMarketChecks} onChange={(e)=>setDisableOffMarketChecks(e.target.checked)} />
              <div className="checkbox-box"></div><span>Disable OffMarket Checks</span>
            </label>
          </div>
        </div>

        {/* Change and Settlement Comments */}
        <div className="form-section glass comments-section">
          <div className="core-identification-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="core-column">
              <div className="input-row"><label>ChangeOwner</label><select value={changeOwner} onChange={(e) => setChangeOwner(e.target.value)}><option value=""></option></select></div>
              <div className="input-row"><label>ChangeComment</label><input type="text" value={changeComment} onChange={(e) => setChangeComment(e.target.value)} /></div>
              <div className="input-row"><label>Comment</label><input type="text" value={comment} onChange={(e) => setComment(e.target.value)} /></div>
              <div className="input-row"><label>Settlement Comment</label><input type="text" value={settlementComment} onChange={(e) => setSettlementComment(e.target.value)} /></div>
              <div className="input-row"><label>Holidays</label><select value={holidays} onChange={(e) => setHolidays(e.target.value)}><option value="None">None</option></select></div>
            </div>
            
            <div className="core-column">
              <div className="input-row"><label>ChangeReason</label><input type="text" value={changeReason} onChange={(e) => setChangeReason(e.target.value)} /></div>
              <div className="input-row empty-cell"><label>Spacer</label><input type="text" /></div>
              <div className="input-row empty-cell"><label>Spacer</label><input type="text" /></div>
              <div className="input-row empty-cell"><label>Spacer</label><input type="text" /></div>
              <div className="input-row"><label>Strategy</label><input type="text" value={strategy} onChange={(e) => setStrategy(e.target.value)} /></div>
              <div className="input-row extra-wide-label"><label>Accrued Interest Overwrite</label><select value={accruedInterestOverwrite} onChange={(e) => setAccruedInterestOverwrite(e.target.value)}><option value="None">None</option></select></div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NDFSwapTicket;
