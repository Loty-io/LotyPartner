import {Magic} from '@magic-sdk/react-native';
import {TOKEN_LIFESPAN_IN_SECONDS} from '../config';

export const getMagic = () =>
  new Magic('pk_live_F044BAD7C90D1070', {testMode: false});

const magic = getMagic();

export const getIdToken = async () => {
  const idToken = await magic.user.getIdToken({
    lifespan: TOKEN_LIFESPAN_IN_SECONDS,
  });

  return idToken;
};
