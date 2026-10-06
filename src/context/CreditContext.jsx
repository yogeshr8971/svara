import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as creditService from '../services/creditService';
import { useAuth } from './AuthContext';

const CreditContext = createContext();

export function CreditProvider({ children }) {
  const { user } = useAuth();
  const [credits, setCredits] = useState(0);

  const refreshCredits = useCallback(async () => {
    if (!user) { setCredits(0); return; }
    try {
      const data = await creditService.getBalance();
      setCredits(data.balance || 0);
    } catch {}
  }, [user]);

  useEffect(() => { refreshCredits(); }, [refreshCredits]);

  return (
    <CreditContext.Provider value={{ credits, refreshCredits }}>
      {children}
    </CreditContext.Provider>
  );
}

export const useCredits = () => useContext(CreditContext);
