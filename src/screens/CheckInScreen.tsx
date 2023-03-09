import * as React from 'react';
import {
  SafeAreaView,
  ScrollView,
} from 'react-native';

import CustomAppBar from '../components/CustomAppBar';
import CustomImage from '../components/CustomImage';
import { callCheckInApi } from '../helpers/api';
import { showToast } from '../helpers/utils';

import { Button, Card, Text, useTheme } from 'react-native-paper';

const CheckInScreen = ({ navigation, route }: any) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { name, description, image, qrCodeData } = route.params;
  const theme = useTheme();

  const onPressCheckIn = async () => {
    try {
      setIsLoading(true);
      const { hasError, errorMessage } = await callCheckInApi(qrCodeData);
      if (hasError) {
        throw new Error(errorMessage);
      }
      navigation.navigate('Account', { hasScannedNft: true });
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
    <SafeAreaView style={{flex:1, backgroundColor:theme.colors.background}}>
      <ScrollView showsVerticalScrollIndicator={false}>
      <CustomAppBar
        title={'Loty'}
        isBack={true}
        leftButtonText={'Back'}
        textButtonStyle={{ fontSize: 17 }}
        onPressLeftButton={onPressGoBack}
        isRightButton={false}/>

        <Card style={{
          backgroundColor: theme.colors.background, 
          padding: 18,
          }}>
          <CustomImage image={image} 
          style={{ aspectRatio: 1, paddingHorizontal: 15, borderRadius: 10, }}/>
          <Text variant='headlineMedium' style={{color:theme.colors.surface, marginTop:15}}>
            {name}
          </Text>
          <Text variant='titleMedium' style={{color:theme.colors.surface, marginTop:25, paddingBottom: 90}}>
          {description}
          </Text>
        </Card>
      </ScrollView>
      <Button 
        disabled={isLoading} 
        onPress={onPressCheckIn}
        textColor={theme.colors.surfaceVariant}
        style={{
          backgroundColor: theme.colors.primary,
          borderRadius:24,
          position: 'absolute',
          bottom: 45,
          left: 5,
          right: 5,
          opacity: isLoading ? 0.5 : 1,
        }}>
        {isLoading ? 'Loading...' : 'Check in'}
      </Button>
    </SafeAreaView>
  );
};

export default CheckInScreen;
