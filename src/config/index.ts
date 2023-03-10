export const IS_TESTING = false;

export const baseUrl = IS_TESTING
  ? 'https://f22e-2806-10a6-d-b8d1-75af-e111-f13-3678.ngrok.io/api'
  : 'https://lotyio-api.vercel.app/api';

export const DEV_MODE_PARAMS = {
  email: 'test+success@magic.link',
};

export const CAIP10 = IS_TESTING ? 'eip155:137:' : 'eip155:5:';
export const CHANNEL_ADDRESS = IS_TESTING
  ? '0x2Ee77bA42220Cb41f972b9F66088D0A9f4F156f1'
  : '0xeDE1bC3D6c0cd15244101dBc60A21839D58Db27a';

export const providerUrl = 'https://rpc.ankr.com/polygon'; //'https://rpc.ankr.com/eth'; // Or your desired provider url
export const USE_TESTNET = IS_TESTING;

export const TOKEN_LIFESPAN_IN_SECONDS = 1209600;
