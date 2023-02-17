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

import BoldCustomText from '../components/BoldCustomText';
import { countCheckIn, truncateAddress } from '../helpers/utils';
import { getScannedNfts } from '../helpers/api';

import { Button, Text, Card, Dialog, Portal } from 'react-native-paper';
import theme from '../styles/theme';

const AnalyticsScreen = ({ navigation, route }: any) => {
  const [scannedNfts, setScannedNfts] = React.useState([]);

  const [checkinData, setCheckinData] = React.useState('');

  const [isLoading, setIsLoading] = React.useState(true);
  const {
    name: collectionName,
    id,
    contractAddress,
    description,
  } = route.params;
  const [floatinButtonExtend, setFloatinButtonExtend] = React.useState(false);
  const fabStyle = { [animateFrom]: 16 };

  const fetchData = async () => {
    try {
      const { nfts, hasError, errorMessage } = await getScannedNfts(
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

  const renderItem = ({ item: { name = '', owner = '', checink = '' } }) => (
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
        <Text variant="titleLarge" style={{ color: theme.colors.whiteVariant }}>
          {name}
        </Text>
        <Text variant="bodyLarge" style={{ color: theme.colors.variantGray }}>
          {truncateAddress(owner)}
        </Text>
      </View>

      <View
        style={{
          borderBottomColor: theme.colors.primary,
          borderBottomWidth: 1,
          alignItems: 'flex-end',
          justifyContent: 'center',
          paddingRight: 70,
          flex: 1,
        }}>
        <Text variant="bodyLarge" style={{ color: theme.colors.primary }}>
          {checink}
        </Text>
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
          borderBottomColor: 'black',
          borderBottomWidth: 1,
          flexDirection: 'row',
        }}>
        <Button
          onPress={() => navigation.goBack()}
          icon={({}) => (
            <Image
              source={require('../assets/arrow-back.png')}
              style={{ justifyContent: 'center', alignSelf: 'center' }}
            />
          )}>
          {}
        </Button>
        <Text style={{ color: theme.colors.whiteVariant }}>
          {' '}
          {collectionName}
        </Text>
        <Button>{''}</Button>
      </View>

      {checkinData.length ? (
        <FlatList
          data={checkinData}
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

      <AnimatedFAB
        color={theme.colors.background}
        icon={({}) => (
          <Image
            source={require('../assets/qr_code_scanner.png')}
            style={{
              justifyContent: 'center',
              alignSelf: 'center',
              // backgroundColor: theme.colors.background,
              borderRadius: 2,
            }}
          />
        )}
        label={'Generate QR'}
        extended={floatinButtonExtend}
        onPress={() => {
          !floatinButtonExtend
            ? setFloatinButtonExtend(true)
            : (setFloatinButtonExtend(false), qrCollection());
        }}
        visible={true}
        animateFrom={'right'}
        // iconMode={'static'}
        style={{ ...styles.fabStyle, backgroundColor: theme.colors.primary }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  fabStyle: {
    bottom: 50,
    right: 16,
    position: 'absolute',
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
