import * as React from 'react';
import {
  ImageBackground,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import Toast from 'react-native-toast-message';
//test Pull request
import CustomText from '../components/CustomText';
import BoldCustomText from '../components/BoldCustomText';
import CustomTextInput from '../components/CustomTextInput';
import {validateEmail, showToast} from '../helpers/utils';
import {getStringValue, storeStringValue} from '../helpers/storage';
import {DEV_MODE_PARAMS} from '../config';
import {emailWeb3auth} from '../helpers/loginweb3auth';

import RCP from '../helpers/web3auth';

const INVALID_EMAIL = 'Invalid email';

const LoginScreen = ({navigation}: any) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [email, onChangeEmail] = React.useState(
    false ? DEV_MODE_PARAMS.email : '',
  );

  const attemptLogin = async (userEmail: string) => {
    setIsLoading(true);
    if (!userEmail || !validateEmail(userEmail)) {
      setIsLoading(false);
      throw new Error(INVALID_EMAIL);
    }
    let publicAddress = '';
    try {
      if (userEmail !== DEV_MODE_PARAMS.email) {
        const info = await emailWeb3auth(userEmail);
        if (info.userInfo === '') {
          setIsLoading(false);
          throw new Error('Something is wrong');
        }
        const address = await RCP.getAccounts('0x' + info.privKey);
        const userInfo = await info.userInfo.idToken;
        publicAddress = '' + address;
        console.log(publicAddress);
        storeStringValue('publicAddress', publicAddress);
        storeStringValue('email', userEmail);
        storeStringValue('idtoken', userInfo);
        console.log(userInfo);
        storeStringValue('typeOfLogin', 'email');
        navigation.navigate('ScanTabNavigator');
        showToast('success', 'login correcto');
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }

    // storeStringValue('email', userEmail);
    // navigation.navigate('ScanTabNavigator');
    // setIsLoading(false);
  };

  React.useEffect(() => {
    const resolveAuth = async () => {
      setIsLoading(true);
      try {
        // const emailInStorage = await getStringValue('email');
        // await attemptLogin(emailInStorage);
        const token = await getStringValue('idtoken');
        const emailuser = await getStringValue('email');
        const publicAddress = await getStringValue('publicAddress');
        if (!token || !emailuser || !publicAddress) {
          throw new Error('Auto sing in error');
        }
        storeStringValue('publicAddress', publicAddress);
        storeStringValue('email', emailuser);
        storeStringValue('idtoken', token);

        navigation.navigate('ScanTabNavigator');
        setIsLoading(false);
      } catch (error) {
        console.log(error);
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
      console.log(error);
      if (error && error.message === INVALID_EMAIL) {
        showErrorToast(INVALID_EMAIL);
      }
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/login-bg.png')}
        resizeMode="cover"
        style={styles.image}>
        {isLoading ? (
          <ActivityIndicator color="white" size="large" />
        ) : (
          <>
            <View style={{flex: 1}} />
            <View style={{flex: 1, justifyContent: 'flex-end'}}>
              <View
                style={{
                  backgroundColor: '#F2F2F7',
                  borderRadius: 24,
                  paddingVertical: 5,
                  paddingHorizontal: 16,
                  alignSelf: 'flex-start',
                }}>
                <CustomText>For companies</CustomText>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 18,
                  alignItems: 'center',
                }}>
                <Image source={require('../assets/login-logo.png')} />
                <CustomText
                  style={{
                    color: 'white',
                    fontSize: 40,
                    marginLeft: 15,
                    marginTop: 2,
                  }}>
                  LOTY
                </CustomText>
              </View>
              <BoldCustomText
                style={{
                  color: 'white',
                  fontSize: 34,
                  lineHeight: 41,
                  marginTop: 28,
                }}>
                The future of loyalty programs through
              </BoldCustomText>
              <BoldCustomText
                style={{
                  color: '#69F6CC',
                  fontSize: 34,
                  lineHeight: 41,
                }}>
                NFTs
              </BoldCustomText>
            </View>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.container}>
              <CustomTextInput
                style={styles.input}
                onChangeText={onChangeEmail}
                value={email}
                placeholder="example@email.com"
                keyboardType="email-address"
                placeholderTextColor={'#EBEBF5'}
              />
              <TouchableOpacity
                onPress={onPressSignIn}
                style={{
                  backgroundColor: '#69F6CC',
                  borderRadius: 24,
                  paddingVertical: 13,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: Dimensions.get('window').height / 10,
                }}>
                <CustomText>Sign in / Sign up</CustomText>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </>
        )}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  input: {
    marginTop: 40,
    marginBottom: 20,
  },
});

export default LoginScreen;
