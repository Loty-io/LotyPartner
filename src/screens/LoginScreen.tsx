import * as React from 'react';
import { ImageBackground, View, Image, ActivityIndicator } from 'react-native';
import { showErrorToast } from '../helpers/utils';
import { Surface, Text, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { EmailLogin } from '../components/login/EmailLogin';
import { JwtTokenContext } from '../context/AuthContext';

const LoginScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = React.useState(true);
  const theme = useTheme();
  const { jwtTokenData } = React.useContext(JwtTokenContext);

  React.useEffect(() => {
    if (jwtTokenData?.accessToken) {
      navigation.navigate('TabNavigator', {
        screen: t('common.account'),
      });
    }
    setIsLoading(false);
  }, [jwtTokenData?.accessToken]);

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require('../assets/login-bg.png')}
        resizeMode="cover"
        style={{ flex: 1, paddingHorizontal: 14 }}>
        {isLoading ? (
          <ActivityIndicator color="white" size="large" />
        ) : (
          <>
            <View style={{ flex: 1 }} />
            <View style={{ flex: 1, justifyContent: 'flex-start' }}>
              <Surface
                style={{
                  borderRadius: 24,
                  backgroundColor: theme.colors.surface,
                  alignSelf: 'flex-start',
                }}>
                <Text
                  variant="bodyMedium"
                  style={{
                    color: theme.colors.surfaceVariant,
                    paddingVertical: 5,
                    paddingHorizontal: 16,
                  }}>
                  {t('login.text.for_companies')}
                </Text>
              </Surface>
              <View style={{ flexDirection: 'row', marginTop: 18 }}>
                <Image source={require('../assets/login-logo.png')} />
                <Text
                  variant="displayMedium"
                  style={{ color: theme.colors.surface, marginLeft: 10 }}>
                  {t('login.loty')}
                </Text>
              </View>
              <Text
                variant="headlineMedium"
                style={{
                  color: theme.colors.surface,
                  fontWeight: 'bold',
                  marginTop: 20,
                }}>
                {t('login.text.slogan')}
              </Text>
              <Text
                variant="headlineLarge"
                style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                {t('login.text.nfts')}
              </Text>
            </View>
            <EmailLogin
              onSuccess={() => {
                navigation.navigate('TabNavigator', {
                  screen: t('common.account'),
                });
                setIsLoading(false);
              }}
              onError={(error: any) => {
                setIsLoading(false);
                showErrorToast(error);
              }}
              onPress={() => {
                setIsLoading(true);
              }}
            />
          </>
        )}
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;
