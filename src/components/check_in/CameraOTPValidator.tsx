import * as React from 'react';
import { View, SafeAreaView } from 'react-native';

import { showToast } from '../../helpers/utils';
import CustomAppBar from '../navigation/CustomAppBar';
import theme from '../../styles/theme';

import QRCodeScanner from 'react-native-qrcode-scanner';
import { BarCodeReadEvent } from 'react-native-camera';
import { Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { AppBarAction } from '../navigation/CustomAppBar';
import speakeasy from 'speakeasy';
import { OTP_SECRET, OTP_STEP } from '../../config';

export const CameraOTPValidator = ({ navigation, route }: any) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = React.useState(false);

  function validateOTP(clientOTP: string): boolean {
    const expectedOTP = speakeasy.totp({
      secret: OTP_SECRET,
      encoding: 'ascii',
      time: (Date.now() / 1000) | 0,
      step: OTP_STEP,
    });
    return clientOTP === expectedOTP;
  }

  const onRead = async (e: BarCodeReadEvent) => {
    try {
      setIsLoading(true);
      const data = JSON.parse(e.data);
      const isValid = validateOTP(data.token);

      if (isValid) {
        navigation.navigate('CheckIn', {
          userPublicAddress: data.embeddedInfo.publicAddress,
        });
      } else {
        showToast('error', t('common.invalid_qr'));
        navigation.navigate('TabNavigator', {
          screen: t('common.account'),
        });
      }
    } catch (error) {
      console.error('error validating qr code', error);
      showToast('error', t('common.invalid_qr'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <CustomAppBar
        action={AppBarAction.BACK}
        leftButtonText={t('common.back')}
        textButtonStyle={{ fontSize: 17 }}
        navigation={navigation}
      />

      {isLoading ? (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
          }}>
          <Text variant="titleLarge" style={{ color: theme.colors.surface }}>
            {t('common.loading')}
          </Text>
        </View>
      ) : (
        <QRCodeScanner onRead={onRead} reactivateTimeout={5000} />
      )}
    </SafeAreaView>
  );
};
