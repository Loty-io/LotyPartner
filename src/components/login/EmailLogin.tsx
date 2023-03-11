import { useMutation } from '@apollo/client';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, TextInput, useTheme } from 'react-native-paper';
import { JwtTokenContext } from '../../context/AuthContext';
import { Web3DataContext } from '../../context/Web3Context';
import { GqlError } from '../../graphql/errors';
import { LOGIN } from '../../graphql/login';
import { emailWeb3auth } from '../../helpers/loginweb3auth';
import { signChannel } from '../../helpers/pushNotification';
import { showErrorToast, validateEmail } from '../../helpers/utils';
import RCP from '../../helpers/web3auth';

export const EmailLogin = ({
  onSuccess,
  onError,
  onPress,
}: {
  onSuccess: Function;
  onError: Function;
  onPress: Function;
}) => {
  const theme = useTheme();
  const [email, onChangeEmail] = React.useState('');
  const { t } = useTranslation();
  const { updateWeb3Data, setWeb3Data } = useContext(Web3DataContext);
  const { setJwtTokenData } = useContext(JwtTokenContext);
  const [gqlLogin] = useMutation(LOGIN);

  const handleGqlErrors = (typename: string) => {
    if (typename == GqlError.BAD_LOGIN_TYPE) {
      handleErrorActions(t('login.error.wrong_provider'));
    } else if (typename == GqlError.INVALID_INPUT) {
      handleErrorActions(t('login.error.wrong_email'));
    } else if (typename == GqlError.INTERNAL) {
      handleErrorActions(t('login.error.backend'));
    }
  };

  const handleErrorActions = (errorMessage: string) => {
    setJwtTokenData({});
    setWeb3Data({});
    onError(errorMessage);
  };

  const attemptLogin = async () => {
    Keyboard.dismiss();
    onPress();
    if (!email || !validateEmail(email)) {
      handleErrorActions(t('login.error.wrong_email'));
    }
    try {
      const info = await emailWeb3auth(email);
      const publicAddress = await RCP.getAccounts('0x' + info.privKey);
      const userInfo = await info.userInfo;

      gqlLogin({
        variables: {
          walletAddress: publicAddress,
          idToken: userInfo.idToken,
          email,
          loginPlatform: 'WEB3AUTH',
          typeOfLogin: userInfo.typeOfLogin,
        },
      })
        .then(res => {
          if (res.data.loginOrSignUp.__typename == 'LoginOrSignUpSuccess') {
            signChannel(info.privKey as string, publicAddress);
            setJwtTokenData({ accessToken: userInfo.idToken });
            updateWeb3Data('publicAddress', publicAddress);
            onSuccess();
          } else {
            handleGqlErrors(res.data.loginOrSignUp.__typename);
          }
          return;
        })
        .catch(e => handleErrorActions('login.error.backend'));
    } catch (error) {
      console.error(error);
      handleErrorActions(t('login.error.login'));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ marginTop: 40, flex: 1 }}>
      <TextInput
        textColor={theme.colors.surface}
        outlineColor={theme.colors.outlineVariant}
        mode="outlined"
        label={t('login.text.label') || 'email@mail.com'}
        value={email}
        keyboardType="email-address"
        onChangeText={onChangeEmail}
        theme={{ roundness: 10 }}
      />
      <Button
        dark={false}
        mode="contained"
        onPress={attemptLogin}
        style={{ marginTop: 15 }}>
        {t('login.signin')}
      </Button>
    </KeyboardAvoidingView>
  );
};
