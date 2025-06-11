
import React, { createContext, useContext, useState } from 'react';

interface AdminDataContextType {
  refreshTrigger: number;
  triggerRefresh: () => void;
  isRefreshing: boolean;
  setRefreshing: (refreshing: boolean) => void;
}

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

export const useAdminData = () => {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return context;
};

export const AdminDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isRefreshing, setRefreshing] = useState(false);

  const triggerRefresh = () => {
    console.log('🔄 Triggering data refresh...');
    setRefreshTrigger(prev => prev + 1);
  };

  const value = {
    refreshTrigger,
    triggerRefresh,
    isRefreshing,
    setRefreshing
  };

  return (
    <AdminDataContext.Provider value={value}>
      {children}
    </AdminDataContext.Provider>
  );
};
