import { Pusher, PusherEvent } from '@pusher/pusher-websocket-react-native';
import * as PushAPI from '@pushprotocol/restapi';

import {
  CAIP10,
  CHANNEL_ADDRESS,
  PUSHER_CHANNEL_NAME,
  PUSHER_CLUSTER_DATA,
  PUSHER_KEY,
} from '../config';
import { showToast } from './utils';

const pusher = Pusher.getInstance();

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

export const pusherInitConnection = async () => {
  await pusher.init({
    apiKey: PUSHER_KEY,
    cluster: PUSHER_CLUSTER_DATA,
  });
  await pusher.connect();
  pusherChannelSuscribe();
};

const pusherChannelSuscribe = async () => {
  await pusher.subscribe({
    channelName: PUSHER_CHANNEL_NAME,
    onEvent(event: PusherEvent) {
      showToast('success', `${event.data}`);
    },
  });
};
