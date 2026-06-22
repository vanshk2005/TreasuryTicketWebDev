import { useEffect, useRef } from 'react';

export default function useTradeOperation(handleActionClick) {
  const handlerRef = useRef(handleActionClick);
  handlerRef.current = handleActionClick;

  useEffect(() => {
    const handleTradeOperation = (e) => {
      if (handlerRef.current) {
        handlerRef.current(e.detail.operation);
      }
    };
    window.addEventListener('trade-operation', handleTradeOperation);
    return () => {
      window.removeEventListener('trade-operation', handleTradeOperation);
    };
  }, []);
}
