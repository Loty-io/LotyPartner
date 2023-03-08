import * as React from 'react';
import {
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  FlatList,
  Clipboard,
  RefreshControl,
} from 'react-native';

import { clearAll } from '../helpers/storage';

import {
  addContractAddressApi,
  deleteContractAddressApi,
  deletePartner,
  getScannedNftCollections,
} from '../helpers/api';
import { showToast, truncateAddress } from '../helpers/utils';

import {
  Button,
  Text,
  Card,
  Dialog,
  Portal,
  TextInput,
} from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import DialogButton from '../components/DialogButton';
import CustomAppBar from '../components/CustomAppBar';

const SettingsScreen = ({ navigation, route }: any) => {
  const theme = useTheme();
  const [isAdding, setIsAdding] = React.useState(false);
  const [contractAddress, setContractAddress] = React.useState('');
  const [deletecontractAddress, setDeleteContractAddress] = React.useState('');
  const [showDialog, setshowDialog] = React.useState(false);
  const hideDialog = () => setshowDialog(false);
  const [scannedNftCollections, setScannedNftCollections] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchData = async () => {
    try {
      const result = await getScannedNftCollections();
      setScannedNftCollections(result);
    } catch (error) {
    }
    setIsLoading(false);
  };

  React.useEffect(() => {
    fetchData();
    const interval = setInterval(() => { fetchData(); }, 2000);
    return () => clearInterval(interval);
  }, []);

  const deleteUser = async () => {
    await deletePartner();
    clearAll();
    navigation.navigate('Login');
  };

  const onPressGoBack = () => {
    navigation.navigate('Account', { hasScannedNft: true });
  };

  const onPressCopy = (contractAddress: string) => {
    Clipboard.setString(contractAddress);
    showToast('success', 'Contract Address Copied!');
  };

  const onPressDelete = async () => {
    const { hasError } = await deleteContractAddressApi(deletecontractAddress);
    if (hasError) {
      showToast('error', 'Something is wrong');
      return;
    }
    setDeleteContractAddress('');
    showToast('success', 'Removed correctly');
  };

  const isBtnDisabled = !contractAddress || isAdding;

  const onPressAdd = async () => {

    try {
      const contractAddressArray = await scannedNftCollections.map(
        ({ contractAddress }) => contractAddress,
      );
      if (contractAddress && contractAddressArray.includes(contractAddress)) {
        showToast('error', 'Address Already Added');
        return;
      }

      setIsAdding(true);
      const { hasError, errorMessage } = await addContractAddressApi(
        contractAddress,
      );

      if (hasError) {
        throw new Error(errorMessage);
      }

      setContractAddress('');
      showToast('success', 'Added correctly');
    } catch (error) {
      showToast('error', 'Invalid address');
    } finally {
      setIsAdding(false);
    }
  };

  const dialogDeleteContract = () => {
    return (
      <Portal>
        <Dialog
          visible={showDialog}
          onDismiss={hideDialog}
          style={{ backgroundColor: theme.colors.background }}>
          <Dialog.Content
            style={{ alignContent: 'space-around', alignItems: 'center' }}>
            <Text variant="titleMedium" style={{ color: theme.colors.surface }}>
              Delete this Contract...
            </Text>
            <Text style={{ color: theme.colors.outline}}>
              Are you sure?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setshowDialog(false)}>NO</Button>
            <Button
              textColor={theme.colors.error}
              onPress={() => {
                onPressDelete();
                setshowDialog(false);
              }}>
              YES
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  };

  const imageSize = 18;
  const renderItem = ({ item: { name = '', contractAddress = '' } }) => (
    <Card contentStyle={{ flexDirection:'row'}}
      style={{
        backgroundColor: theme.colors.background,
        borderRadius: 15,
        borderColor: theme.colors.backdrop,
        borderWidth: 1,
      }}>
        <View style={{padding:10}}>
          <Text variant="titleLarge"
            style={{ color: theme.colors.surface }}>
            {name}
          </Text>
          <Button
            compact={true}
            textColor={theme.colors.outline}
            style={{ margin: 2}}
            contentStyle={{ flexDirection: 'row-reverse' }}
            icon={require('../assets/copy.png')}
            onPress={() => onPressCopy(contractAddress)}>
            {truncateAddress(contractAddress)}
          </Button>
        </View>
        <Button style={{ flex: 1, flexDirection:'row-reverse', alignItems:'center'}}
          onPress={() => {
            setshowDialog(true);
            setDeleteContractAddress(contractAddress);
          }}
          icon={({}) => (
            <Image source={require('../assets/trash.png')}
              style={{ width: imageSize, height: imageSize, }} />
          )}>
          {}
        </Button>
    </Card>
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.background}}>
      {dialogDeleteContract()}
      <CustomAppBar
        title={'Settings'}
        isBack={true}
        leftButtonText={'Back'}
        textButtonStyle={{ fontSize: 17 }}
        onPressLeftButton={onPressGoBack}
        isRightButton={false}/>

        <Text variant="titleMedium"
          style={{ color: theme.colors.surface, alignSelf: 'flex-start', margin: 15 }}>
          Enter Smart Contract Address
        </Text>
        <TextInput
          style={{marginHorizontal: 15}}
          textColor={theme.colors.surface}
          outlineColor={theme.colors.outline}
          mode="outlined"
          label="0x..."
          value={contractAddress}
          keyboardType="default"
          onChangeText={setContractAddress}
          theme={{ roundness: 5 }}
        />
        <Button
          onPress={onPressAdd}
          disabled={isBtnDisabled}
          dark={false}
          mode="contained"
          style={{
            backgroundColor: theme.colors.primary,
            justifyContent: 'center',
            margin: 15,
            opacity: isBtnDisabled ? 0.7 : 1,
            alignSelf:'center',
          }}>
          {isAdding ? 'Adding...' : 'Add'}
        </Button>
      <Text
        variant="titleMedium"
        style={{
          color: theme.colors.surface,
          alignSelf: 'flex-start',
          marginVertical: 15,
          paddingHorizontal: 16,
        }}>
        Your Smart Contract Addresses:
      </Text>

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
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <Text variant="titleMedium"
            style={{ color: theme.colors.outline, fontSize: 18, textAlign: 'center', }}>
            {isLoading ? 'Loading...' : 'Nothing added yet'}
          </Text>
        </View>
      )}
      <DialogButton
        titleText="Are you sure you want to delete your user forever?"
        bodyText="Doing so will remove all your usage data for the platform,
              including all the customers you scanned, as well as your loyalty
              memberships. This action is not reversible."
        confirmBtnText="Erase Forever"
        onConfirm={deleteUser}>
        Delete user
      </DialogButton>
    </SafeAreaView>
  );
};

export default SettingsScreen;
