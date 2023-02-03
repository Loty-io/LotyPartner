import {Contract} from 'ethers';
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

interface jsonNftDada {
  name: String;
  contractAddress: String;
  owner: String;
}

interface returnJsonData {
  name: String;
  contractAddress: String;
  owner: String;
  checink: Number;
}

export const countCheckIn = async (data: jsonNftDada[]) => {
  let data_checkins: Record<string, String | number>[] = [];
  let bander = false;
  data_checkins.push({
    name: data[0].name,
    contractAddress: data[0].contractAddress,
    owner: data[0].owner,
    checink: 0,
  });
  data.forEach(info => {
    data_checkins.forEach((dataowner, index) => {
      if (
        dataowner.owner === info.owner &&
        dataowner.contractAddress === info.contractAddress &&
        dataowner.name === info.name
      ) {
        bander = true;
        let check = data_checkins[index].checink as number;
        data_checkins[index].checink = check + 1;
      }
    });

    if (!bander) {
      data_checkins.push({
        name: info.name,
        contractAddress: info.contractAddress,
        owner: info.owner,
        checink: 1,
      });

      // data_return.push(data_checkins);
    }
    bander = false;
  });

  // console.log(JSON.stringify(data_checkins, null, 2));
  // console.log(data_checkins);
  // const dataJson = data_checkins as unknown;
  // const json = JSON.stringify(data_checkins);
  return data_checkins;
};
