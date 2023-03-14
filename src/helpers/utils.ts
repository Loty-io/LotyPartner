import { Contract } from 'ethers';
import Toast from 'react-native-toast-message';
import { getStringValue } from './storage';

export const validateEmail = (email: string) => {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
};

export const infobyLogin = async () => {
  const publicAddress = (await getStringValue('publicAddress')) as string;
  const idToken = (await getStringValue('idtoken')) as string;
  return { idToken, publicAddress };
};

export const truncateStringIfNeeded = (text: string, limit: number) => {
  if (text && text.length > limit) {
    return `${text.slice(0, limit)}...`;
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

export const showErrorToast = (errorMessage: string) => {
  Toast.show({
    type: 'error',
    text1: errorMessage,
  });
};

export const countCheckInsByOwner = async (
  data: {
    name: string;
    contractAddress: string;
    owner: string;
  }[],
) => {
  let checkIns: { [id: string]: number } = {};
  data.forEach(info => {
    checkIns[info.owner] = checkIns[info.owner] + 1 || 1;
  });
  return checkIns;
};
