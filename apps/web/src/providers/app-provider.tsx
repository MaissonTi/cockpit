'use client';
import { ProviderAlert } from '@/components/composition/alert-dialog-general';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { ThemeProvider } from './theme-provider';

type AppContextProps = {
  setOpenMenu: (value: boolean) => void;
  openMenu: boolean;
};

type UseAppProps = Omit<AppContextProps, ''> & {
  toggleMenu: (value?: boolean | undefined) => void;
};

const AppContext = createContext<AppContextProps | undefined>(undefined);

const AppProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [openMenu, setOpenMenu] = useState(true);

  return (
    <AppContext.Provider value={{ openMenu, setOpenMenu }}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <ProviderAlert />
      </ThemeProvider>
    </AppContext.Provider>
  );
};

export const useApp = (): UseAppProps => {
  const context = useContext(AppContext);
  if (!context)
    throw new Error('useProcess must be used within a ProcessProvider');

  const { openMenu, setOpenMenu } = context;

  const toggleMenu = (value?: boolean | undefined) => {
    if (value !== undefined) {
      return setOpenMenu(value);
    }

    setOpenMenu(!openMenu);
  };

  return {
    openMenu,
    setOpenMenu,
    toggleMenu,
  };
};

export default AppProvider;
