import * as React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';

import CustomAppBar, {
  AppBarAction,
} from '../components/navigation/CustomAppBar';
import CustomImage from '../components/custom/CustomImage';
import { callCheckInApi } from '../helpers/api';
import { showToast } from '../helpers/utils';

import { Button, Card, Text, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

const CheckInScreen = ({ navigation, route }: any) => {
  const { t } = useTranslation();
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
      showToast('success', t('checkin.success'));
    } catch (error) {
      const errorMessage =
        error?.response?.data?.error_message ?? t('common.invalid_qr');
      showToast('error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <CustomAppBar
          action={AppBarAction.BACK}
          leftButtonText={t('common.back')}
          textButtonStyle={{ fontSize: 17 }}
          navigation={navigation}
        />

        <Card
          style={{
            backgroundColor: theme.colors.background,
            padding: 18,
          }}>
          <CustomImage
            image={image}
            style={{ aspectRatio: 1, paddingHorizontal: 15, borderRadius: 10 }}
          />
          <Text
            variant="headlineMedium"
            style={{ color: theme.colors.surface, marginTop: 15 }}>
            {name}
          </Text>
          <Text
            variant="titleMedium"
            style={{
              color: theme.colors.surface,
              marginTop: 25,
              paddingBottom: 90,
            }}>
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
          borderRadius: 24,
          position: 'absolute',
          bottom: 45,
          left: 5,
          right: 5,
          opacity: isLoading ? 0.5 : 1,
        }}>
        {isLoading ? t('common.loading') : t('common.check_in')}
      </Button>
    </SafeAreaView>
  );
};

export default CheckInScreen;
