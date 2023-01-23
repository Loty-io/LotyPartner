import * as React from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {BarCodeReadEvent} from 'react-native-camera';

import CustomText from '../components/CustomText';
import BoldCustomText from '../components/BoldCustomText';
import {getNftGromQrCode} from '../helpers/api';
import {showToast} from '../helpers/utils';

const CameraScreen = ({navigation}: any) => {
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
        error?.response?.data?.error_message ?? 'Invalid QR Code';

      showToast('error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          height: 50,
          width: '100%',
          paddingHorizontal: 16,
          borderBottomColor: 'black',
          borderBottomWidth: 1,
          flexDirection: 'row',
        }}>
        <TouchableOpacity onPress={onPressGoBack}>
          <Image source={require('../assets/arrow-back.png')} />
        </TouchableOpacity>
        <CustomText
          style={{
            color: 'white',
            fontSize: 17,
          }}>
          QR Access
        </CustomText>
        <CustomText
          style={{
            color: '#1C1C1E',
            fontSize: 17,
          }}>
          a.
        </CustomText>
      </View>

      {isLoading ? (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
          }}>
          <BoldCustomText
            style={{
              color: 'white',
              fontSize: 18,
              textAlign: 'center',
            }}>
            Loading...
          </BoldCustomText>
        </View>
      ) : (
        <QRCodeScanner onRead={onRead} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
});

export default CameraScreen;
