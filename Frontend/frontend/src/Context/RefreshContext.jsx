// src/context/RefreshContext.js
import { createContext, useContext, useState } from 'react';

const RefreshContext = createContext();

export const RefreshProvider = ({ children }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const refreshData = () => {
    setRefreshTrigger(prev => !prev);
  };

  return (
    <RefreshContext.Provider value={{ refreshData, refreshTrigger }}>
      {children}
    </RefreshContext.Provider>
  );
};

export const useRefresh = () => useContext(RefreshContext);