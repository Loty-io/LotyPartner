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
import {countCheckIn, truncateAddress} from '../helpers/utils';
import {getScannedNfts} from '../helpers/api';

const AnalyticsScreen = ({navigation, route}: any) => {
  const [scannedNfts, setScannedNfts] = React.useState([]);

  const [checkinData, setCheckinData] = React.useState('');

  const [isLoading, setIsLoading] = React.useState(true);
  const {name: collectionName, id, contractAddress, description} = route.params;

  const fetchData = async () => {
    try {
      const {nfts, hasError, errorMessage} = await getScannedNfts(
        id,
        contractAddress,
      );

      if (hasError) {
        throw new Error(errorMessage);
      }
      // console.log(nfts);
      setScannedNfts(nfts);
      const chekingData = await countCheckIn(nfts);
      console.log(JSON.stringify(chekingData, null, 2));
      setCheckinData(chekingData);
      console.log(checkinData);
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  React.useEffect(() => {
    fetchData();
    console.log(checkinData);
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
  // console.log(JSON.stringify(scannedNfts, null, 2));

  const renderItem = ({item: {name = '', owner = '', checink = ''}}) => (
    <View
      style={{
        flexDirection: 'row',
      }}>
      <View
        style={{
          borderBottomColor: '#48484A',
          borderBottomWidth: 1,
          padding: 16,
          flex: 2,
        }}>
        <BoldCustomText
          style={{color: '#F2F2F7', fontSize: 18, marginBottom: 11}}>
          {name}
        </BoldCustomText>
        <CustomText style={{color: '#8E8E93', fontSize: 18}}>
          {truncateAddress(owner)}
        </CustomText>
      </View>

      <View
        style={{
          borderBottomColor: '#48484A',
          borderBottomWidth: 1,
          alignItems: 'flex-end',
          justifyContent: 'center',
          paddingRight: 70,
          flex: 2,
        }}>
        <CustomText style={{color: 'white', fontSize: 20}}>
          {checink}
        </CustomText>
      </View>
    </View>
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
        <TouchableOpacity onPress={onPressGoBack}>
          <Image source={require('../assets/arrow-back.png')} />
        </TouchableOpacity>
        <CustomText
          style={{
            color: 'white',
            fontSize: 17,
          }}>
          {collectionName}
        </CustomText>
        <CustomText
          style={{
            color: '#1C1C1E',
            fontSize: 17,
          }}>
          12
        </CustomText>
      </View>

      {checkinData.length ? (
        <FlatList
          data={checkinData || ' '}
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
        onPress={qrCollection}
        activeOpacity={0.7}
        style={{
          backgroundColor: '#69F6CC',
          borderRadius: 24,
          paddingVertical: 13,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          marginBottom: 20,
          bottom: 0,
          left: 5,
          right: 5,
        }}>
        <CustomText>Invite new customer</CustomText>
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

export default AnalyticsScreen;
