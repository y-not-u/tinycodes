import { createContext, useContext } from 'react';
import { useLocalObservable } from 'mobx-react';
import Store from '../stores';

const StoreContext = createContext<Store | null>(null);

export const StoreProvider = ({ children }: { children: JSX.Element }) => {
  const store = useLocalObservable(() => new Store());
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
