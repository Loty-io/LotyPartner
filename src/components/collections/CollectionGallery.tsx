import React from 'react';
import { useTranslation } from 'react-i18next';
import { NativeScrollEvent } from 'react-native';
import { FlatList, NativeSyntheticEvent, RefreshControl } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { JwtTokenContext } from '../../context/AuthContext';
import { Web3DataContext } from '../../context/Web3Context';
import { getScannedNftCollections } from '../../helpers/api';
import { CollectionItem } from './CollectionItem';

export const CollectionGallery = ({
  navigation,
  onScroll,
}: {
  navigation: any;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = React.useState(true);
  const { web3Data } = React.useContext(Web3DataContext);
  const { jwtTokenData } = React.useContext(JwtTokenContext);
  const [scannedNftCollections, setScannedNftCollections] = React.useState<
    any[]
  >([]);

  React.useEffect(() => {
    if (web3Data?.publicAddress && jwtTokenData?.accessToken) {
      fetchData();
    }
  }, [web3Data?.publicAddress, jwtTokenData?.accessToken]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchData = async () => {
    try {
      //TODO: use backend
      const result = await getScannedNftCollections(
        web3Data.publicAddress!,
        jwtTokenData.accessToken!,
      );
      setScannedNftCollections(result);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  return scannedNftCollections.length ? (
    <FlatList
      data={scannedNftCollections}
      renderItem={({ item }) => (
        <CollectionItem
          collection={{
            name: item.name,
            contractAddress: item.contractAddress,
            image: item.image,
            network: item.network,
          }}
          navigation={navigation}
        />
      )}
      onScroll={onScroll}
      keyExtractor={(_, index) => index.toString()}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={fetchData} />
      }
    />
  ) : (
    <>
      <Text
        variant="titleLarge"
        style={{
          color: theme.colors.surface,
          alignSelf: 'center',
          flex: 3,
        }}>
        {isLoading ? t('common.loading') : t('account.text.nil_scanned')}
      </Text>
    </>
  );
};
