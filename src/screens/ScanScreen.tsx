import * as React from 'react';
import {
  View,
  Image,
  SafeAreaView,
  FlatList,
  RefreshControl,
} from 'react-native';

import { truncateAddress, truncateStringIfNeeded } from '../helpers/utils';
import { clearAll } from '../helpers/storage';
import { getScannedNftCollections } from '../helpers/api';

import {
  Button,
  Text,
  Card,
  Dialog,
  Portal,
  useTheme,
} from 'react-native-paper';
import CustomAppBar from '../components/CustomAppBar';
import CustomFAB from '../components/CustomFAB';

const ScanScreen = ({ navigation, route }: any) => {
  const theme = useTheme();
  const [scannedNftCollections, setScannedNftCollections] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const hasScannedNft = !!route?.params?.hasScannedNft;
  const [showDialog, setshowDialog] = React.useState(false);
  const hideDialog = () => setshowDialog(false);

  const [isExtended, setIsExtended] = React.useState(true);
  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
    setIsExtended(currentScrollPosition <= 0);
  };

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
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });
    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    if (!hasScannedNft) {
      return;
    }
    fetchData();
  }, [hasScannedNft]);

  const onPressScan = () => {
    navigation.navigate('Camera');
  };

  const dialogSignOut = (
    <Portal>
      <Dialog visible={showDialog}
        onDismiss={hideDialog}
        style={{ backgroundColor: theme.colors.background }}>
        <Dialog.Content
          style={{ alignContent: 'space-around', alignItems: 'center' }}>
          <Text variant="titleMedium" style={{ color: theme.colors.surface }}>
            You are leaving. . .
          </Text>
          <Text style={{ color: theme.colors.outline, marginTop:10 }}>
            Are you sure?
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setshowDialog(false)} textColor={theme.colors.surface}>
            NO
          </Button>
          <Button
            textColor={theme.colors.surface}
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
      ({ contractAddress }) => contractAddress,
    );
    navigation.navigate('Settings', { contractAddressArray });
  };

  const onPressCollection = (
    id: string,
    name: string,
    contractAddress: string,
    description: string,
  ) => {
    navigation.navigate('Analytics', {
      id,
      name,
      contractAddress,
      description,
    });
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
      <Card contentStyle={{flexDirection: 'row'}}
        style={{
          backgroundColor: theme.colors.background,
          borderBottomColor: theme.colors.background,
          borderBottomWidth: 1,
          margin: 10}}
        onPress={() => onPressCollection(id, name, contractAddress, description)}>
          <Image source={{ uri: `${image}` }}
            style={{width: 102, height: 79, borderRadius: 10}}/>
          <View style={{ justifyContent: 'flex-start', marginLeft: 10, paddingVertical: 5,}}>
            <Text variant="titleLarge" style={{ color: theme.colors.surface, }}>
              {name || truncateAddress(contractAddress)}
            </Text>
            <Text variant="bodyLarge" style={{ color: theme.colors.outline, }}>
              {truncateStringIfNeeded(description, 80)}
            </Text>
          </View>
      </Card>
    </>
  );

  return (
    <SafeAreaView style={{ backgroundColor: theme.colors.background, flex: 1 }}>
      {dialogSignOut}
      <CustomAppBar
        title={'My loyalty programs'}
        isBack={false}
        leftButtonText={'Sign Out'}
        textButtonStyle={{ fontSize: 14 }}
        onPressLeftButton={() => setshowDialog(true)}
        isRightButton={true}
        rightIcon={require('../assets/settings.png')} 
        onPressRightButton={onPressSettings}/>

      {scannedNftCollections.length ? (
        <FlatList
          data={scannedNftCollections}
          renderItem={renderItem}
          onScroll={onScroll}
          keyExtractor={(_, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={fetchData} />
          }
        />
      ) : (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <Text variant="titleLarge" style={{ color: theme.colors.outline}}>
            {isLoading ? 'Loading...' : 'Nothing scanned yet'}
          </Text>
        </View>
      )}
      <CustomFAB 
      text={'Check-in'} 
      textStyle={{color: theme.colors.surfaceVariant, fontSize: 15, }}
      onPress = {onPressScan} 
      isExtended={isExtended}
      icon={require('../assets/scan.png')}
      />
    </SafeAreaView>
  );
};

export default ScanScreen;
