import * as React from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  RefreshControl,
} from 'react-native';

import CustomText from '../components/CustomText';
import BoldCustomText from '../components/BoldCustomText';
import {truncateAddress, truncateStringIfNeeded} from '../helpers/utils';
import {clearAll} from '../helpers/storage';
import {getScannedNftCollections} from '../helpers/api';

const ScanScreen = ({navigation, route}: any) => {
  const [scannedNftCollections, setScannedNftCollections] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const hasScannedNft = !!route?.params?.hasScannedNft;

  const fetchData = async () => {
    try {
      const result = await getScannedNftCollections();
      setScannedNftCollections(result);
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  React.useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    if (!hasScannedNft) {
      return;
    }
    fetchData();
  }, [hasScannedNft]);

  const onPressScan = () => {
    navigation.navigate('Camera');
  };
  // const qrCollection = () => {
  //   navigation.navigate('QR');
  // };

  const onPressSignOut = () => {
    clearAll();
    navigation.goBack();
  };

  const onPressSettings = () => {
    const contractAddressArray = scannedNftCollections.map(
      ({contractAddress}) => contractAddress,
    );
    navigation.navigate('Settings', {contractAddressArray});
  };

  const onPressCollection = (
    id: string,
    name: string,
    contractAddress: string,
    description: string,
  ) => {
    navigation.navigate('Analytics', {id, name, contractAddress, description});
  };

  const renderItem = ({
    item: {
      name = '',
      description = '',
      image = '',
      id = '',
      contractAddress = '',
    },
  }) => (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={() => onPressCollection(id, name, contractAddress, description)}
      style={{
        borderBottomColor: '#48484A',
        borderBottomWidth: 1,
        flexDirection: 'row',
        padding: 16,
      }}>
      <Image
        source={{uri: image}}
        style={{
          width: 102,
          height: 74,
          borderRadius: 5,
        }}
      />
      <View
        style={{
          justifyContent: 'space-between',
          marginLeft: 8,
          width: '74%',
          paddingVertical: 2,
        }}>
        <CustomText style={{color: '#F2F2F7', fontSize: 20}}>
          {name || truncateAddress(contractAddress)}
        </CustomText>
        <CustomText style={{color: '#F2F2F7', fontSize: 16}}>
          {truncateStringIfNeeded(description, 80)}
        </CustomText>
      </View>
    </TouchableOpacity>
  );

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
        <TouchableOpacity onPress={onPressSignOut}>
          <CustomText
            style={{
              color: '#69F6CC',
              fontSize: 17,
            }}>
            Sign Out
          </CustomText>
        </TouchableOpacity>
        <CustomText
          style={{
            color: 'white',
            fontSize: 17,
          }}>
          QR Access
        </CustomText>
        <TouchableOpacity onPress={onPressSettings} style={{marginLeft: 42}}>
          <Image source={require('../assets/settings.png')} />
        </TouchableOpacity>
      </View>

      {scannedNftCollections.length ? (
        <FlatList
          data={scannedNftCollections}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={fetchData} />
          }
        />
      ) : (
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
            {isLoading ? 'Loading...' : 'Nothing scanned yet'}
          </BoldCustomText>
        </View>
      )}

      <TouchableOpacity
        onPress={onPressScan}
        activeOpacity={0.7}
        style={{
          backgroundColor: '#69F6CC',
          borderRadius: 24,
          paddingVertical: 13,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          marginBottom: 5,
          bottom: 0,
          left: 5,
          right: 5,
        }}>
        <CustomText>Scan QR code</CustomText>
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

export default ScanScreen;
