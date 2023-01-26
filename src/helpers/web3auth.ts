import '@ethersproject/shims';
import {ethers} from 'ethers';
import {Buffer} from 'buffer';
global.Buffer = global.Buffer || Buffer;

// const providerUrl = 'https://rpc.ankr.com/eth'; // Or your desired provider url

export const getAccounts = async (key: any) => {
  try {
    const wallet = new ethers.Wallet(key);
    const address = await wallet.address;
    return address;
  } catch (error) {
    return error;
  }
};

export default {
  getAccounts,
};
