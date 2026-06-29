import { useState } from 'react';

export default function useTicketStateMachine(addToast, changeReason, changeComment) {
  const [tradeState, setTradeState] = useState('NEW'); // NEW, PENDING, ACK, NACK
  const [hasDataChanged, setHasDataChanged] = useState(false);
  const [messages, setMessages] = useState('');

  // The change fields are enabled if we got a NAck
  const isChangeEnabled = tradeState === 'NACK';

  const handleDataChange = (setter) => (val) => {
    // If we're already in NACK, any data change flags the trade as changed
    // We also flag it generically so we know it's not untouched
    setHasDataChanged(true);
    // Support both event objects and direct values
    if (val && val.target !== undefined) {
      setter(val.target.value);
    } else {
      setter(val);
    }
  };

  const handleCommit = (actionCallback, tradeData, addTradeFn, updateTradeFn) => {
    // Validation before committing
    if (isChangeEnabled) {
      if (!changeReason || changeReason.trim() === '') {
        if (addToast) addToast('Change Reason is mandatory for amended trades.', 'error');
        return false;
      }
      if (!changeComment || changeComment.trim() === '') {
        if (addToast) addToast('Change Comment is mandatory for amended trades.', 'error');
        return false;
      }
    }

    // Proceed with Commit
    setTradeState('PENDING');
    setMessages('Pending Downstream...');
    if (addToast) addToast('Trade committed. Waiting for downstream Ack/NAck...', 'info');
    
    if (tradeData && addTradeFn) {
      addTradeFn({ ...tradeData, status: 'Pending' });
    }

    // Simulate Downstream Processing
    setTimeout(() => {
      const isAck = Math.random() > 0.5;
      if (isAck) {
        setTradeState('ACK');
        setMessages('Ack received');
        setHasDataChanged(false); // Reset change flag on successful ack
        if (addToast) addToast('Trade Acknowledged by Downstream', 'success');
        if (tradeData && updateTradeFn) {
          updateTradeFn(tradeData.id, 'Committed');
        }
      } else {
        setTradeState('NACK');
        setMessages('NAck: Parameter validation failed');
        setHasDataChanged(false); // Reset to require new data changes to trigger amend logic
        if (addToast) addToast('Trade NAcked by Downstream. Please amend data.', 'error');
        if (tradeData && updateTradeFn) {
          updateTradeFn(tradeData.id, 'NAck\'d');
        }
      }
    }, 2000);

    // Call the original trade operation callback if provided
    if (actionCallback) {
      actionCallback('Commit');
    }
    
    return true;
  };

  return {
    tradeState,
    hasDataChanged,
    messages,
    setMessages, // allow overriding if needed
    isChangeEnabled,
    handleDataChange,
    handleCommit
  };
}
