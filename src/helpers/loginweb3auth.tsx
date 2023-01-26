import Web3Auth, {
  LOGIN_PROVIDER,
  OPENLOGIN_NETWORK,
} from '@web3auth/react-native-sdk';
import * as WebBrowser from '@toruslabs/react-native-web-browser';

const clientId =
  'BJOnPi5GUxzB3SajKH7y2WvzHPVvTOGtR-WEbZyVqlzOnbb94_QQgZO4dy-xiwvsGNhaTqg1NX4H1jEdR1AaRSw';

const scheme = 'lotyw3acommerce'; 
export const resolvedRedirectUrl = `${scheme}://openlogin`;

export const web3auth = new Web3Auth(WebBrowser, {
  clientId,
  network: OPENLOGIN_NETWORK.CYAN,
  whiteLabel: {
    name: 'Loty',
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
