import * as React from 'react';
import {
  View,
  SafeAreaView,
} from 'react-native';

import {getNftGromQrCode} from '../helpers/api';
import {showToast} from '../helpers/utils';
import CustomAppBar from '../components/CustomAppBar';
import theme from '../styles/theme';

import QRCodeScanner from 'react-native-qrcode-scanner';
import {BarCodeReadEvent} from 'react-native-camera';
import { Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

const CameraScreen = ({navigation}: any) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = React.useState(false);

  const onPressGoBack = () => {
    navigation.goBack();
  };

  const onRead = async (e: BarCodeReadEvent) => {
    try {
      setIsLoading(true);
      const data = e.data;
      const {nft, hasError, errorMessage} = await getNftGromQrCode(data);
      if (hasError) {
        throw new Error(errorMessage);
      }
      navigation.navigate('CheckIn', {...nft, qrCodeData: data});
    } catch (error) {
      const errorMessage =
        error?.response?.data?.error_message ?? t('common.invalid_qr');
      showToast('error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.background}}>
      <CustomAppBar
        title={''}
        isBack={true}
        leftButtonText={t('common.back')}
        textButtonStyle={{ fontSize: 17 }}
        onPressLeftButton={onPressGoBack}
        isRightButton={false}/>

      {isLoading ? (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
          }}>
            <Text variant='titleLarge' style={{color:theme.colors.surface}}>
            {t('common.loading')}
            </Text>
        </View>
      ) : (
        <QRCodeScanner onRead={onRead} />
      )}
    </SafeAreaView>
  );
};

export default CameraScreen;
