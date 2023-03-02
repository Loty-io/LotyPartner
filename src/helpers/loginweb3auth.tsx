import Web3Auth, {
  LOGIN_PROVIDER,
  OPENLOGIN_NETWORK,
} from '@web3auth/react-native-sdk';
import * as WebBrowser from '@toruslabs/react-native-web-browser';
import { providerUrl, USE_TESTNET } from '../config';

const clientId =
  'BJOnPi5GUxzB3SajKH7y2WvzHPVvTOGtR-WEbZyVqlzOnbb94_QQgZO4dy-xiwvsGNhaTqg1NX4H1jEdR1AaRSw';

const scheme = 'lotyw3acommerce';
export const resolvedRedirectUrl = `${scheme}://openlogin`;

export const web3auth = new Web3Auth(WebBrowser, {
  clientId,
  network: OPENLOGIN_NETWORK.CYAN,
  chainConfig: {
    chainNamespace: 'eip155',
    //chainId: "0x89", // hex of 137, polygon mainnet
    rpcTarget: providerUrl,
    // Avoid using public rpcTarget in production.
    // Use services like Infura, Quicknode etc
    displayName: USE_TESTNET ? 'Polygon Mumbai' : 'Polygon Mainnet',
    blockExplorer: USE_TESTNET
      ? 'https://mumbai.polygonscan.com'
      : 'https://polygonscan.com',
    ticker: 'MATIC',
    tickerName: 'Matic',
  },
  whiteLabel: {
    name: 'Loty',
    logoLight:
      'https://pbs.twimg.com/profile_images/1618334995680210945/w7FZ3Dvb_200x200.jpg',
    logoDark:
      'https://pbs.twimg.com/profile_images/1618334995680210945/w7FZ3Dvb_200x200.jpg',
    defaultLanguage: 'en',
    dark: true,
    theme: {
      primary: '#69F6CC',
    },
  },
});

export const emailWeb3auth = async (email: string) => {
  const infoEmail = await web3auth.login({
    loginProvider: LOGIN_PROVIDER.EMAIL_PASSWORDLESS,
    extraLoginOptions: {
      login_hint: email,
    },
    redirectUrl: resolvedRedirectUrl,
  });
  return infoEmail;
};
