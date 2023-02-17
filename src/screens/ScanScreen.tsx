import * as React from 'react';
import {
  View,
  Image,
  SafeAreaView,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';

import {truncateAddress, truncateStringIfNeeded} from '../helpers/utils';
import {clearAll} from '../helpers/storage';
import {getScannedNftCollections} from '../helpers/api';

import {Button, Text, Card, Dialog, Portal} from 'react-native-paper';

import theme from '../styles/theme';

const ScanScreen = ({navigation, route}: any) => {
  const [scannedNftCollections, setScannedNftCollections] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const hasScannedNft = !!route?.params?.hasScannedNft;

  const fetchData = async () => {
    try {
      const result = await getScannedNftCollections();
      setScannedNftCollections(result);

      console.log(JSON.stringify(result, null, 2));
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
  const [showDialog, setshowDialog] = React.useState(false);

  const hideDialog = () => setshowDialog(false);

  const dialogSingOut = (
    <Portal>
      <Dialog
        visible={showDialog}
        onDismiss={hideDialog}
        style={{backgroundColor: theme.colors.background}}>
        <Dialog.Content
          style={{alignContent: 'space-around', alignItems: 'center'}}>
          <Text variant="titleMedium" style={{color: theme.colors.primary}}>
            You are leaving. . .
          </Text>
          <Text style={{color: theme.colors.whiteVariant}}>Are you sure?</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setshowDialog(false)}>NO</Button>
          {/* Este text debe eliminartse, por el momento me da una solución */}
          <Text>{'                                               '}</Text>
          <Button
            textColor={theme.colors.error}
            onPress={() => {
              clearAll();
              navigation.goBack();
            }}>
            YES
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );

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
    <>
      <Card
        style={{
          backgroundColor: theme.colors.background,
          borderRadius: 0,
          borderBottomColor: '#48484A',
          borderBottomWidth: 1,
        }}
        onPress={() =>
          onPressCollection(id, name, contractAddress, description)
        }>
        <Card.Content>
          <Image
            source={{uri: `${image}`}}
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
            <Text
              variant="titleLarge"
              style={{
                color: theme.colors.whiteVariant,
              }}>
              {name || truncateAddress(contractAddress)}
            </Text>
            <Text
              variant="bodyLarge"
              style={{
                color: theme.colors.whiteVariant,
              }}>
              {truncateStringIfNeeded(description, 80)}
            </Text>
          </View>
        </Card.Content>
      </Card>
    </>
  );

  return (
    <SafeAreaView style={{backgroundColor: theme.colors.background, flex: 1}}>
      {dialogSingOut}
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
        <Button onPress={() => setshowDialog(true)}>Sing Out</Button>
        <Text style={{color: theme.colors.whiteVariant}}> QR Access</Text>
        <Button
          onPress={onPressSettings}
          icon={({}) => (
            <Image
              source={require('../assets/settings.png')}
              style={{justifyContent: 'center', alignSelf: 'center'}}
            />
          )}>
          {}
        </Button>
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
          <Text
            variant="titleMedium"
            style={{color: theme.colors.whiteVariant}}>
            {isLoading ? 'Loading...' : 'Nothing scanned yet'}
          </Text>
        </View>
      )}

      <Button
        dark={false}
        mode="contained"
        onPress={onPressScan}
        style={{marginBottom: 5}}>
        Scan QR code
      </Button>
    </SafeAreaView>
  );
};

export default ScanScreen;
