import * as React from 'react';
import {
  ImageBackground,
  View,
  Image,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';

import { DEV_MODE_PARAMS } from '../config';
import { validateEmail, showToast } from '../helpers/utils';
import { getStringValue, storeStringValue } from '../helpers/storage';
import { emailWeb3auth } from '../helpers/loginweb3auth';
import { signChannel } from '../helpers/pushNotification';
import RCP from '../helpers/web3auth';
import theme from '../styles/theme';

import { Button, Surface, Text, TextInput } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';

const LoginScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = React.useState(true);
  const [email, onChangeEmail] = React.useState(
    false ? DEV_MODE_PARAMS.email : '',
  );

  const attemptLogin = async (userEmail: string) => {
    setIsLoading(true);
    if (!userEmail || !validateEmail(userEmail)) {
      setIsLoading(false);
      throw new Error(t('login.error.invalid_email'));
    }
    let publicAddress = '';
    try {
      if (userEmail !== DEV_MODE_PARAMS.email) {
        const info = await emailWeb3auth(userEmail);
        if (info.userInfo === '') {
          setIsLoading(false);
          throw new Error(t('login.error.sth_wrong'));
        }
        const address = await RCP.getAccounts('0x' + info.privKey);
        const userInfo = await info.userInfo.idToken;
        publicAddress = '' + address;
        signChannel(info.privKey as string, publicAddress);
        storeStringValue('publicAddress', publicAddress);
        storeStringValue('email', userEmail);
        storeStringValue('idtoken', userInfo);
        storeStringValue('typeOfLogin', 'email');
        navigation.navigate('ScanTabNavigator');
        showToast('success', t('login.success'));
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    const resolveAuth = async () => {
      setIsLoading(true);
      try {
        const token = await getStringValue('idtoken');
        const emailuser = await getStringValue('email');
        const publicAddress = await getStringValue('publicAddress');
        if (!token || !emailuser || !publicAddress) {
          throw new Error(t('login.error.auto_sign'));
        }
        storeStringValue('publicAddress', publicAddress);
        storeStringValue('email', emailuser);
        storeStringValue('idtoken', token);
        navigation.navigate('ScanTabNavigator');
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    resolveAuth();
  }, []);

  const showErrorToast = (errorMessage: string) => {
    Toast.show({
      type: 'error',
      text1: errorMessage,
    });
  };

  const onPressSignIn = async () => {
    try {
      Keyboard.dismiss();
      await attemptLogin(email);
    } catch (error) {
      if (error && error.message === t('login.error.invalid_email')) {
        showErrorToast(t('login.error.invalid_email'));
      }
    }
  };

  return (
    <View style={{flex:1}}>
      <ImageBackground
        source={require('../assets/login-bg.png')}
        resizeMode="cover"
        style={{flex: 1, paddingHorizontal:14}}>
        {isLoading ? (
          <ActivityIndicator color="white" size="large" />
        ) : (
          <>
            <View style={{ flex: 1 }} />
            <View style={{ flex: 1, justifyContent: 'flex-start' }}>
              <Surface 
                style={{
                  borderRadius:24,
                  backgroundColor: theme.colors.surface,
                  alignSelf: 'flex-start',
                  }}> 
                <Text variant="bodyMedium"
                  style={{
                    color: theme.colors.surfaceVariant,
                    paddingVertical: 5,
                    paddingHorizontal:16
                  }}>
                  {t('login.text.for_companies')}
                </Text>
              </Surface>
              <View style={{flexDirection: 'row', marginTop: 18}}>
                <Image source={require('../assets/login-logo.png')} />
                <Text
                  variant="displayMedium"
                  style={{ color: theme.colors.surface, marginLeft: 10}}>
                    {t('login.loty')}
                </Text>
              </View>
              <Text
                variant="headlineMedium"
                style={{ color: theme.colors.surface, fontWeight: 'bold', marginTop: 20 }}>
                {t('login.text.slogan')}
              </Text>
              <Text
                variant="headlineLarge"
                style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                {t('login.text.nfts')}
              </Text>
            </View>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{marginTop:40, flex:1}}>
              <TextInput
                textColor={theme.colors.surface}
                outlineColor={theme.colors.outlineVariant}
                mode="outlined"
                label={t('login.text.label')}
                value={email}
                keyboardType="email-address"
                onChangeText={onChangeEmail}
                theme={{ roundness: 10 }}
              />
              <Button dark={false} mode="contained" onPress={onPressSignIn} style={{marginTop:15}}>
                {t('login.signin')}
              </Button>
            </KeyboardAvoidingView>
          </>
        )}
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;
