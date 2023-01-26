import Toast from 'react-native-toast-message';
import {getStringValue} from './storage';

export const validateEmail = (email: string) => {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
};

const truncateString = (str: string, len: number) => str.slice?.(0, len);

export const infobyLogin = async () => {
  const publicAddress = (await getStringValue('publicAddress')) as string;
  const idToken = (await getStringValue('idtoken')) as string;
  return {idToken, publicAddress};
};

export const truncateStringIfNeeded = (text: string, limit: number) => {
  if (text && text.length > limit) {
    return `${truncateString(text, limit)}...`;
  }

  return text;
};

export const truncateAddress = (address: string) => {
  if (!address) {
    return 'No Account';
  }

  const match = address.match(
    /^(0x[a-zA-Z0-9]{5})[a-zA-Z0-9]+([a-zA-Z0-9]{3})$/,
  );
  if (!match) {
    return address;
  }
  return `${match[1]}…${match[2]}`;
};

export const showToast = (type: string, errorMessage: string) => {
  Toast.show({
    type,
    text1: errorMessage,
  });
};
