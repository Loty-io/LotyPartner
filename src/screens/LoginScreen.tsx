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

import CustomText from '../components/CustomText';
import BoldCustomText from '../components/BoldCustomText';
import CustomTextInput from '../components/CustomTextInput';
import {getMagic} from '../helpers/magic';
import {validateEmail} from '../helpers/utils';
import {getStringValue, storeStringValue} from '../helpers/storage';
import {DEV_MODE_PARAMS} from '../config';

const magic = getMagic();

const INVALID_EMAIL = 'Invalid email';

const LoginScreen = ({navigation}: any) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [email, onChangeEmail] = React.useState(
    __DEV__ ? DEV_MODE_PARAMS.email : '',
  );

  const attemptLogin = async (userEmail: string) => {
    if (!userEmail || !validateEmail(userEmail)) {
      throw new Error(INVALID_EMAIL);
    }

    if (userEmail !== DEV_MODE_PARAMS.email || __DEV__) {
      const decentralizedIDToken = await magic.auth.loginWithMagicLink({
        email: userEmail,
      });

      if (!decentralizedIDToken) {
        throw new Error('Invalid decentralizedIDToken');
      }
    }

    storeStringValue('email', userEmail);
    navigation.navigate('ScanTabNavigator');
    setIsLoading(false);
  };

  React.useEffect(() => {
    const resolveAuth = async () => {
      try {
        const emailInStorage = await getStringValue('email');
        await attemptLogin(emailInStorage);
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
