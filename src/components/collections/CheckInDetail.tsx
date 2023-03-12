import * as React from 'react';
import { View, SafeAreaView, FlatList, RefreshControl } from 'react-native';

import { countCheckInsByOwner, truncateAddress } from '../../helpers/utils';
import { getScannedNfts } from '../../helpers/api';

import CustomAppBar, { AppBarAction } from '../navigation/CustomAppBar';

import { Card, List, Text, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

export const CheckInDetail = ({ navigation, route }: any) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [checkinData, setCheckinData] = React.useState(
    {} as { [id: string]: number },
  );
  const [isLoading, setIsLoading] = React.useState(true);
  const { name: collectionName, id, contractAddress } = route.params;

  const fetchData = async () => {
    try {
      const { nfts, hasError, errorMessage } = await getScannedNfts(
        id,
        contractAddress,
      );
      if (hasError) {
        throw new Error(errorMessage);
      }
      const checkinData = await countCheckInsByOwner(nfts);
      setCheckinData(checkinData);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

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
          data={Object.keys(checkinData)}
          renderItem={({ item }) => {
            return (
              <List.Item
                title={item}
                description={checkinData[item]}
                left={props => <List.Icon {...props} icon="folder" />}
              />
            );
          }}
          keyExtractor={item => item}
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
    </SafeAreaView>
  );
};

export default CheckInDetail;
