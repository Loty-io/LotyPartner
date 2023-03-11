import React, { createContext, useState } from 'react';
import { getObjectValue, storeObjectValue } from '../helpers/storage';

interface Web3Data {
  publicAddress?: string;
}

interface Web3DataContextValue {
  web3Data: Web3Data;
  updateWeb3Data: (key: keyof Web3Data, value: any) => void;
  setWeb3Data: (web3Data: Web3Data) => void;
}

export const Web3DataContext = createContext<Web3DataContextValue>({
  web3Data: {},
  updateWeb3Data: () => {},
  setWeb3Data: () => {},
});

export const Web3DataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [web3Data, setWeb3Data] = useState<Web3Data>({});

  const updateWeb3Data = (key: keyof Web3Data, value: any) => {
    setWeb3Data(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };

  React.useEffect(() => {
    if (web3Data && Object.keys(web3Data).length && web3Data.publicAddress) {
      storeObjectValue('publicAddress', web3Data.publicAddress);
    }
  }, [web3Data]);

  React.useEffect(() => {
    getObjectValue('publicAddress').then(publicAddress => {
      updateWeb3Data('publicAddress', publicAddress);
    });
  }, []);

  return (
    <Web3DataContext.Provider value={{ web3Data, updateWeb3Data, setWeb3Data }}>
      {children}
    </Web3DataContext.Provider>
  );
};
