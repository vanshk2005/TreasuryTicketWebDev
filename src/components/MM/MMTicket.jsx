import { useState, useEffect } from 'react';
import { 
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
import useTicketStateMachine from '../../utils/useTicketStateMachine';
import SearchableSelect from '../SearchableSelect/SearchableSelect';
import './MMTicket.css';

const MMTicket = ({ activeSubTab, mirrorTrades, disableOffMkt, addToast, addTrade, updateTradeStatus, draftDataToLoad, setDraftDataToLoad }) => {
  // Core config fields
  const [subType, setSubType] = useState('InternalDeposit');
  const [company, setCompany] = useState('');
  const [counterparty, setCounterparty] = useState('');
  const [tradingBook, setTradingBook] = useState('');
  const [mirroredTrade, setMirroredTrade] = useState(mirrorTrades || false);
  const [disableOffMarketChecks, setDisableOffMarketChecks] = useState(disableOffMkt || false);
  const [tradeDate, setTradeDate] = useState('2026-06-22');
  const [tradeId, setTradeId] = useState('');
  const [trader, setTrader] = useState('KAKKAR, VANSH [kakkarvan]');
  const [version, setVersion] = useState('0');
  const [orgTrader, setOrgTrader] = useState('KAKKAR, VANSH [kakkarvan]');
  const [status, setStatus] = useState('New');
  const [destination, setDestination] = useState('');
  const [tradeReferences, setTradeReferences] = useState('');
  const [mirrorThis, setMirrorThis] = useState('No');

  // Params
  const [totoro, setTotoro] = useState('');
  const [currency, setCurrency] = useState('');
  const [notional, setNotional] = useState('');
  const [index, setIndex] = useState('');
  const [spread, setSpread] = useState('');
  const [startDate, setStartDate] = useState('');
  const [accrual, setAccrual] = useState('');
  const [bc, setBc] = useState('Mod Foil');
  const [maturityDate, setMaturityDate] = useState('');
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

  
  const { tradeState, hasDataChanged, messages: downMessages, isChangeEnabled, handleDataChange, handleCommit } = useTicketStateMachine(addToast, changeReason, changeComment);
  
  
  useEffect(() => {
    if (draftDataToLoad && draftDataToLoad.type === 'MM') {
      if (typeof setTradeId !== 'undefined') setTradeId(draftDataToLoad.id);
      if (typeof setCounterparty !== 'undefined') setCounterparty(draftDataToLoad.cpart);
      if (typeof setCparty !== 'undefined') setCparty(draftDataToLoad.cpart);
      if (typeof setSellAmount !== 'undefined') setSellAmount(draftDataToLoad.notional);
      if (typeof setAmount !== 'undefined') setAmount(draftDataToLoad.notional);
      if (typeof setNotional !== 'undefined') setNotional(draftDataToLoad.notional);
      if (typeof setDepositAmount !== 'undefined') setDepositAmount(draftDataToLoad.notional);
      if (typeof setSellCur !== 'undefined') setSellCur(draftDataToLoad.ccy);
      if (typeof setCcy !== 'undefined') setCcy(draftDataToLoad.ccy);
      if (typeof setTradingBook !== 'undefined') setTradingBook(draftDataToLoad.book);
      if (typeof setValueDate !== 'undefined') setValueDate(draftDataToLoad.valueDate);
      if (typeof setTrader !== 'undefined') setTrader(draftDataToLoad.trader);
      
      // Clear it out
      if (setDraftDataToLoad) setDraftDataToLoad(null);
      if (addToast) addToast('Draft loaded successfully', 'info');
    }
  }, [draftDataToLoad]);

  const handleActionClick = (actionName) => {
    if (actionName === 'Commit') {
      const tradeData = {
        id: typeof tradeId !== 'undefined' && tradeId ? tradeId : (typeof subType !== 'undefined' ? subType.substring(0,2).toUpperCase() : 'TR') + '-' + Math.floor(Math.random()*100000),
        type: 'MM',
        subType: typeof subType !== 'undefined' ? subType : 'Unknown',
        cpart: typeof counterparty !== 'undefined' ? counterparty : (typeof cparty !== 'undefined' ? cparty : 'Unknown'),
        ccy: typeof sellCur !== 'undefined' ? sellCur : (typeof ccy !== 'undefined' ? ccy : 'USD'),
        notional: Number(typeof sellAmount !== 'undefined' && sellAmount ? sellAmount : (typeof amount !== 'undefined' && amount ? amount : (typeof notional !== 'undefined' && notional ? notional : (typeof depositAmount !== 'undefined' && depositAmount ? depositAmount : 0)))),
        valueDate: typeof valueDate !== 'undefined' && valueDate ? valueDate : '2026-06-25',
        book: typeof tradingBook !== 'undefined' ? tradingBook : 'DESK_BOOK',
        trader: typeof trader !== 'undefined' ? trader : 'KAKKAR, VANSH'
      };
      handleCommit(null, tradeData, addTrade, updateTradeStatus);
    } else if (actionName === 'Save') {
      const tradeData = {
        id: typeof tradeId !== 'undefined' && tradeId ? tradeId : (typeof subType !== 'undefined' ? subType.substring(0,2).toUpperCase() : 'TR') + '-' + Math.floor(Math.random()*100000),
        type: 'MM',
        subType: typeof subType !== 'undefined' ? subType : 'Unknown',
        cpart: typeof counterparty !== 'undefined' ? counterparty : (typeof cparty !== 'undefined' ? cparty : 'Unknown'),
        ccy: typeof sellCur !== 'undefined' ? sellCur : (typeof ccy !== 'undefined' ? ccy : 'USD'),
        notional: Number(typeof sellAmount !== 'undefined' && sellAmount ? sellAmount : (typeof amount !== 'undefined' && amount ? amount : (typeof notional !== 'undefined' && notional ? notional : (typeof depositAmount !== 'undefined' && depositAmount ? depositAmount : 0)))),
        valueDate: typeof valueDate !== 'undefined' && valueDate ? valueDate : '2026-06-25',
        book: typeof tradingBook !== 'undefined' ? tradingBook : 'DESK_BOOK',
        trader: typeof trader !== 'undefined' ? trader : 'KAKKAR, VANSH'
      };
      if (addTrade) {
        addTrade({ ...tradeData, status: 'Draft' });
        if (addToast) addToast('Trade saved as draft. Ready to commit.', 'success');
      }
    } else {
      if (addToast) addToast(`${actionName} action performed on MMTicket`, 'info');
    }
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
              <div className="input-row"><label>Trade Type</label><input type="text" value="MM" disabled /></div>
              <div className="input-row">
                <label>Sub Type</label>
                <SearchableSelect value={subType} onChange={(e) => setSubType(e.target.value)}>
                  <option value="InternalDeposit">InternalDeposit</option>
                  <option value="Deposit">Deposit</option>
                  <option value="Loan">Loan</option>
                </SearchableSelect>
              </div>
              <div className="input-row"><label>Trade Id</label><input type="text" value={tradeId} onChange={(e) => setTradeId(e.target.value)} /></div>
              <div className="input-row"><label>Version</label><input type="text" value={version} disabled /></div>
              <div className="input-row"><label>Status</label><input type="text" value={status} disabled /></div>
              <div className="input-row"><label>Destination</label><input type="text" value={destination} disabled /></div>
            </div>

            {/* Column 2 */}
            <div className="core-column">
              <div className="input-row">
                <label>Company</label>
                <SearchableSelect value={company} onChange={(e) => setCompany(e.target.value)}><option value=""></option></SearchableSelect>
              </div>
              
              <div className="input-row">
                <label>Trading Book</label>
                <SearchableSelect value={tradingBook} onChange={(e) => setTradingBook(e.target.value)}><option value=""></option></SearchableSelect>
              </div>
              <div className="input-row"><label>Messages</label><input type="text" value={downMessages} disabled style={{opacity: 0.8}} /></div>
            </div>

            {/* Column 3 */}
            <div className="core-column">
              <div className="input-row">
                <label>Counterparty</label>
                <SearchableSelect value={counterparty} onChange={(e) => setCounterparty(e.target.value)}><option value=""></option></SearchableSelect>
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

        {/* Parameters Grid for MM */}
        <div className="form-section glass">
          <div className="input-row auto-label" style={{ width: '400px', margin: '0 auto 1rem auto' }}>
            <label style={{textAlign: 'right', marginRight: '0.5rem'}}>TotoroValuationFunction</label>
            <SearchableSelect value={totoro} onChange={(e) => setTotoro(e.target.value)}><option value=""></option></SearchableSelect>
          </div>

          <div className="param-table" style={{ gridTemplateColumns: '80px 140px 80px 160px 60px 160px 70px 120px 220px', overflowX: 'auto', paddingBottom: '10px' }}>
            <label className="param-row-label" style={{textAlign: 'right', paddingRight: '10px'}}>Currency</label>
            <SearchableSelect value={currency} onChange={(e) => setCurrency(e.target.value)}><option value=""></option></SearchableSelect>
            
            <label className="param-row-label" style={{textAlign: 'right', paddingRight: '10px'}}>Notional</label>
            <input type="number" value={notional} onChange={handleDataChange(setNotional)} />
            
            <label className="param-row-label" style={{textAlign: 'right', paddingRight: '10px'}}>Index</label>
            <input type="text" value={index} onChange={(e) => setIndex(e.target.value)} />
            
            <label className="param-row-label" style={{textAlign: 'right', paddingRight: '10px'}}>Spread</label>
            <input type="text" value={spread} onChange={(e) => setSpread(e.target.value)} />
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
              <div style={{display: 'flex', gap: '5px', alignItems: 'center'}}>
                <span className="param-row-label">Start</span>
                <label className="custom-checkbox"><input type="checkbox" /><div className="checkbox-box"></div></label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{width: '100%'}}/>
              </div>
              <div style={{display: 'flex', gap: '5px', alignItems: 'center'}}>
                <span className="param-row-label">Maturity</span>
                <label className="custom-checkbox"><input type="checkbox" /><div className="checkbox-box"></div></label>
                <input type="date" value={maturityDate} onChange={(e) => setMaturityDate(e.target.value)} style={{width: '100%'}}/>
              </div>
            </div>
          </div>

          <div className="param-table" style={{ display: 'flex', alignItems: 'center', gap: '20px', paddingBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '230px' }}>
              <label className="param-row-label" style={{textAlign: 'right', width: '70px'}}>Accrual</label>
              <div style={{ flex: 1 }}>
                <SearchableSelect value={accrual} onChange={(e) => setAccrual(e.target.value)}><option value=""></option></SearchableSelect>
              </div>
            </div>
            
            <div style={{ flex: 1 }}></div>

            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
              <label className="param-row-label">BC</label>
              <div style={{ width: '140px' }}>
                <SearchableSelect value={bc} onChange={(e) => setBc(e.target.value)}><option value="Mod Foil">Mod Foil</option></SearchableSelect>
              </div>
            </div>
            
            <label className="custom-checkbox">
              <input type="checkbox" checked={overrideDefaultSSI} onChange={(e) => setOverrideDefaultSSI(e.target.checked)} />
              <div className="checkbox-box"></div><span>Override Default SSI</span>
            </label>
          </div>
        </div>

        {/* Change and Settlement Comments */}
        <div className="form-section glass comments-section">
          <div className="core-identification-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="core-column">
              <div className="input-row"><label>ChangeOwner</label><SearchableSelect value={changeOwner} onChange={(e) => setChangeOwner(e.target.value)} disabled={!isChangeEnabled} style={{ opacity: isChangeEnabled ? 1 : 0.5 }}><option value=""></option></SearchableSelect></div>
              <div className="input-row"><label>ChangeComment</label><input type="text" value={changeComment} onChange={(e) => setChangeComment(e.target.value)} disabled={!isChangeEnabled} style={{ opacity: isChangeEnabled ? 1 : 0.5 }} /></div>
              <div className="input-row"><label>Comment</label><input type="text" value={comment} onChange={(e) => setComment(e.target.value)} /></div>
              <div className="input-row"><label>Settlement Comment</label><input type="text" value={settlementComment} onChange={(e) => setSettlementComment(e.target.value)} /></div>
              <div className="input-row"><label>Holidays</label><SearchableSelect value={holidays} onChange={(e) => setHolidays(e.target.value)}><option value="None">None</option></SearchableSelect></div>
            </div>
            
            <div className="core-column">
              <div className="input-row"><label>ChangeReason</label><input type="text" value={changeReason} onChange={(e) => setChangeReason(e.target.value)} disabled={!isChangeEnabled} style={{ opacity: isChangeEnabled ? 1 : 0.5 }} /></div>
              <div className="input-row empty-cell"><label>Spacer</label><input type="text" /></div>
              <div className="input-row empty-cell"><label>Spacer</label><input type="text" /></div>
              <div className="input-row empty-cell"><label>Spacer</label><input type="text" /></div>
              <div className="input-row"><label>Strategy</label><input type="text" value={strategy} onChange={(e) => setStrategy(e.target.value)} /></div>
              <div className="input-row extra-wide-label"><label>Accrued Interest Overwrite</label><SearchableSelect value={accruedInterestOverwrite} onChange={(e) => setAccruedInterestOverwrite(e.target.value)}><option value="True">True</option></SearchableSelect></div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MMTicket;
