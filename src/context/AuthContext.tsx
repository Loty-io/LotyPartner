import React, { createContext, useState } from 'react';
import { storeObjectValue, getObjectValue } from '../helpers/storage';

interface JwtTokenData {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
}

interface JwtTokenContextValue {
  jwtTokenData: JwtTokenData;
  setJwtTokenData: (jwtTokenData: JwtTokenData) => void;
}

export const JwtTokenContext = createContext<JwtTokenContextValue>({
  jwtTokenData: {},
  setJwtTokenData: () => {},
});

export const JwtTokenProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [jwtTokenData, setJwtTokenData] = useState<JwtTokenData>({});

  React.useEffect(() => {
    if (jwtTokenData && Object.keys(jwtTokenData).length) {
      storeObjectValue('jwt', jwtTokenData);
    }
  }, [jwtTokenData]);

  React.useEffect(() => {
    getObjectValue('jwt').then(token => {
      setJwtTokenData(token);
    });
  }, []);

  return (
    <JwtTokenContext.Provider value={{ jwtTokenData, setJwtTokenData }}>
      {children}
    </JwtTokenContext.Provider>
  );
};
