import * as PushAPI from '@pushprotocol/restapi';

import {
  CAIP10,
  CHANNEL_ADDRESS,
} from '../config';
import { showToast } from './utils';


export const signChannel = async (key: string, publicAddress: string) => {
  const ethers = require('ethers');
  const Pkey = `0x${key}`;
  const signer = new ethers.Wallet(Pkey);

  await PushAPI.channels.subscribe({
    signer: signer,
    channelAddress: `${CAIP10}${CHANNEL_ADDRESS}`,
    userAddress: `${CAIP10}${publicAddress}`,
    
    onSuccess: () => {
      console.log('opt in success');
    },
    onError: () => {
      console.error('opt in error');
    },
    env: 'staging',
  });
};


