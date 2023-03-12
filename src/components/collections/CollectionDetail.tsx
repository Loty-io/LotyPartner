import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Button, Card, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import LotyQRCode from '../custom/LotyQRCode';
import CustomAppBar, { AppBarAction } from '../navigation/CustomAppBar';
import CheckInDetail from './CheckInDetail';

export interface Collection {
  name?: string;
  contractType?: string;
  contractAddress: string;
  network?: string;
  allowedVerifiers?: string;
  floorPrice?: number;
  mintedNfts?: number;
  image?: string;
}
interface Props extends NativeStackScreenProps<any, any> {}

export const CollectionDetail = ({ navigation, route }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { collection } = route.params as { collection: Collection };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <CustomAppBar
        title={collection.name}
        leftButtonText={t('common.back')}
        textButtonStyle={{ fontSize: 16 }}
        navigation={navigation}
        action={AppBarAction.BACK}
      />
      <LotyQRCode contractAddress={collection.contractAddress} />

      <Text variant="headlineLarge" style={{ color: theme.colors.surface }}>
        TODO: BUILD DETAIL PAGE
        {JSON.stringify(collection)}
      </Text>
    </SafeAreaView>
  );
};

/*<Button
        onPress={() =>
          navigation.navigate(CheckInDetail.name, {
            collectionName: collection.contractAddress,
            contractAddress: collection.contractAddress,
          })
        }>
        View Check in detail
      </Button>*/
