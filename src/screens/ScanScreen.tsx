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
import CustomAppBar from '../components/CustomAppBar';
import CustomFAB from '../components/CustomFAB';
import CustomDialog from '../components/CustomDialog';

import {
  Text,
  Card,
  useTheme,
} from 'react-native-paper';
import { useTranslation } from 'react-i18next';


const ScanScreen = ({ navigation, route }: any) => {
  const { t } = useTranslation();
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
    <CustomDialog 
      showDialog={showDialog}
      hideDialog={hideDialog}
      onPressLeft={() => setshowDialog(false)}
      onPressRight={() => {
        clearAll();
        navigation.goBack();
      } } 
      title={t('scanscreen.logout.sign_out')} 
      content={t('scanscreen.logout.dialog')} 
      textRight={t('common.yes')} 
      textLeft={t('common.no')}/>
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
        title={t('scanscreen.title')}
        isBack={false}
        leftButtonText={t('scanscreen.logout.sign_out')}
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
            {isLoading ? t('common.loading') : t('scanscreen.text.nil_scanned')}
          </Text>
        </View>
      )}
      <CustomFAB 
      text={t('common.check_in')} 
      textStyle={{color: theme.colors.surfaceVariant, fontSize: 15, }}
      onPress = {onPressScan} 
      isExtended={isExtended}
      icon={require('../assets/scan.png')}
      />
    </SafeAreaView>
  );
};

export default ScanScreen;
