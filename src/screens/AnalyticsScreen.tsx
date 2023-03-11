import * as React from 'react';
import { View, SafeAreaView, FlatList, RefreshControl } from 'react-native';

import { countCheckIn, truncateAddress } from '../helpers/utils';
import { getScannedNfts } from '../helpers/api';

import CustomAppBar, {
  AppBarAction,
} from '../components/navigation/CustomAppBar';
import CustomFAB from '../components/custom/CustomFAB';

import { Card, Text, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

const AnalyticsScreen = ({ navigation, route }: any) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [scannedNfts, setScannedNfts] = React.useState([]);
  const [checkinData, setCheckinData] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);
  const {
    name: collectionName,
    id,
    contractAddress,
    description,
  } = route.params;

  const [isExtended, setIsExtended] = React.useState(true);
  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
    setIsExtended(currentScrollPosition <= 0);
  };

  const fetchData = async () => {
    try {
      const { nfts, hasError, errorMessage } = await getScannedNfts(
        id,
        contractAddress,
      );
      if (hasError) {
        throw new Error(errorMessage);
      }
      setScannedNfts(nfts);
      const chekingData = await countCheckIn(nfts);
      setCheckinData(chekingData);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const qrCollection = () => {
    navigation.navigate('QR', {
      id,
      collectionName,
      contractAddress,
      description,
    });
  };
  const onPressGoBack = () => {
    navigation.goBack();
  };

  const renderItem = ({ item: { name = '', owner = '', checink = '' } }) => (
    <Card
      contentStyle={{ flexDirection: 'row' }}
      style={{
        backgroundColor: theme.colors.backdrop,
        borderWidth: 1,
        margin: 2,
      }}>
      <View style={{ margin: 10 }}>
        <Text variant="titleLarge" style={{ color: theme.colors.surface }}>
          {name}
        </Text>
        <Text variant="bodyLarge" style={{ color: theme.colors.outline }}>
          {truncateAddress(owner)}
        </Text>
      </View>
      <Card.Content
        style={{
          position: 'absolute',
          right: 10,
          alignSelf: 'center',
          borderBottomColor: theme.colors.primary,
          borderBottomWidth: 1,
        }}>
        <Text variant="bodyLarge" style={{ color: theme.colors.primary }}>
          {checink}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <CustomAppBar
        title={collectionName}
        action={AppBarAction.BACK}
        leftButtonText={t('common.back')}
        textButtonStyle={{ fontSize: 17 }}
        navigation={navigation}
      />

      {checkinData.length ? (
        <FlatList
          data={checkinData}
          onScroll={onScroll}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={fetchData} />
          }
        />
      ) : (
        <View
          style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <Text variant="titleLarge" style={{ color: theme.colors.surface }}>
            {isLoading ? 'Loading...' : 'Nothing scanned yet'}
          </Text>
        </View>
      )}
      <CustomFAB
        text={'Invite new customer'}
        textStyle={{ color: theme.colors.surfaceVariant, fontSize: 17 }}
        onPress={() => qrCollection()}
        isExtended={isExtended}
        icon={require('../assets/qr_code_scanner.png')}
      />
    </SafeAreaView>
  );
};

export default AnalyticsScreen;
