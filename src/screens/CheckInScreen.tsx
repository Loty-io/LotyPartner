import * as React from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';

import CustomText from '../components/CustomText';
import BoldCustomText from '../components/BoldCustomText';
import {callCheckInApi} from '../helpers/api';
import {showToast} from '../helpers/utils';

import {Button, Text, Card} from 'react-native-paper';
import theme from '../styles/theme';

const CheckInScreen = ({navigation, route}: any) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const {name, description, image, qrCodeData} = route.params;

  const onPressCheckIn = async () => {
    try {
      setIsLoading(true);
      const {hasError, errorMessage} = await callCheckInApi(qrCodeData);

      if (hasError) {
        throw new Error(errorMessage);
      }

      navigation.navigate('Scan', {hasScannedNft: true});
      showToast('success', 'Scanned correctly');
    } catch (error) {
      const errorMessage =
        error?.response?.data?.error_message ?? 'Invalid QR Code';

      showToast('error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const onPressGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
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
            {/* {name} */}
            loty
          </CustomText>
          <CustomText
            style={{
              color: '#1C1C1E',
              fontSize: 17,
            }}>
            a.
          </CustomText>
        </View>

        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 18,
            marginTop: 20,
          }}>
          <Image
            source={{uri: image}}
            style={{
              width: '100%',
              aspectRatio: 1,
              borderRadius: 8,
            }}
          />
          <BoldCustomText
            style={{
              color: '#F2F2F7',
              fontSize: 28,
              marginTop: 15,
              alignSelf: 'flex-start',
            }}>
            {name}
          </BoldCustomText>
          <CustomText
            style={{
              color: 'white',
              fontSize: 17,
              lineHeight: 22,
              marginTop: 25,
              alignSelf: 'flex-start',
              paddingBottom: 90,
            }}>
            {description}
          </CustomText>
        </View>
      </ScrollView>
      <TouchableOpacity
        disabled={isLoading}
        onPress={onPressCheckIn}
        activeOpacity={0.5}
        style={{
          backgroundColor: '#69F6CC',
          borderRadius: 24,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          paddingVertical: 13,
          marginBottom: 5,
          bottom: 40,
          left: 5,
          right: 5,
          opacity: isLoading ? 0.5 : 1,
        }}>
        <CustomText>{isLoading ? 'Loading...' : 'Check in'}</CustomText>
      </TouchableOpacity>
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

export default CheckInScreen;
