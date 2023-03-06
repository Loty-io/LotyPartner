import * as React from 'react';
import {
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  FlatList,
  Dimensions,
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

const SettingsScreen = ({ navigation, route }: any) => {
  const theme = useTheme();
  const [isAdding, setIsAdding] = React.useState(false);
  const [contractAddress, setContractAddress] = React.useState('');
  const [deletecontractAddress, setDeleteContractAddress] = React.useState('');

  //*************************************************************** */
  const [scannedNftCollections, setScannedNftCollections] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

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

  //*************************************************************** */

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
    console.log(contractAddress);

    try {
      console.log('InitAdd');
      const contractAddressArray = await scannedNftCollections.map(
        ({ contractAddress }) => contractAddress,
      );
      if (contractAddress && contractAddressArray.includes(contractAddress)) {
        showToast('error', 'Address Already Added');
        console.log('repetido');
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
  const [showDialog, setshowDialog] = React.useState(false);

  const hideDialog = () => setshowDialog(false);

  const dialogDeleteContract = () => {
    return (
      <Portal>
        <Dialog
          visible={showDialog}
          onDismiss={hideDialog}
          style={{ backgroundColor: theme.colors.background }}>
          <Dialog.Content
            style={{ alignContent: 'space-around', alignItems: 'center' }}>
            <Text variant="titleMedium" style={{ color: theme.colors.primary }}>
              Delete this Contract...
            </Text>
            <Text style={{ color: theme.colors.whiteVariant }}>
              Are you sure?
            </Text>
            <Text
              variant="titleSmall"
              style={{
                color: theme.colors.variantGray,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {deletecontractAddress}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setshowDialog(false)}>NO</Button>
            {/* Este text debe eliminartse, por el momento me da una solución */}
            <Text>{'                                                   '}</Text>
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
    <Card
      style={{
        backgroundColor: theme.colors.background,
        borderRadius: 0,
        borderBottomColor: '#48484A',
        borderBottomWidth: 1,
      }}>
      <Card.Content>
        <View
          style={{
            width: Dimensions.get('window').width,
            padding: 16,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View>
            <Text
              variant="titleLarge"
              style={{
                color: theme.colors.whiteVariant,
                alignSelf: 'flex-start',
                paddingBottom: 10,
              }}>
              {name}
            </Text>
            <View
              style={{
                width: '70%',
                flexDirection: 'row',
              }}>
              <Text
                variant="titleMedium"
                style={{
                  color: theme.colors.variantGray,
                  alignSelf: 'flex-start',
                  paddingRight: 10,
                }}>
                {truncateAddress(contractAddress)}
              </Text>
              <Button
                style={{ flex: 1 }}
                onPress={() => onPressCopy(contractAddress)}
                icon={({}) => (
                  <Image
                    source={require('../assets/copy.png')}
                    style={{
                      width: 20,
                      height: 20,
                      justifyContent: 'center',
                      alignSelf: 'center',
                    }}
                  />
                )}>
                {}
              </Button>
            </View>
          </View>
          <Button
            style={{
              flex: 1,
              marginLeft: 5,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              setshowDialog(true);
              setDeleteContractAddress(contractAddress);
            }}
            icon={({}) => (
              <Image
                source={require('../assets/trash.png')}
                style={{
                  width: imageSize,
                  height: imageSize,
                  justifyContent: 'center',
                  alignSelf: 'center',
                }}
              />
            )}>
            {}
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      {dialogDeleteContract()}
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
          onPress={() => onPressGoBack()}
          icon={({}) => (
            <Image
              source={require('../assets/arrow-back.png')}
              style={{ justifyContent: 'center', alignSelf: 'center' }}
            />
          )}>
          {}
        </Button>
        <Text style={{ color: theme.colors.whiteVariant }}>Settings</Text>
        <Button>{''}</Button>
      </View>
      <View
        style={{
          borderRadius: 24,
          paddingVertical: 13,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 5,
          paddingHorizontal: 10,
          width: '100%',
        }}>
        <Text
          variant="titleMedium"
          style={{
            color: theme.colors.whiteVariant,
            alignSelf: 'flex-start',
            marginVertical: 15,
          }}>
          Enter Smart Contract Address
        </Text>
        <TextInput
          style={styles.input}
          textColor={theme.colors.surface}
          outlineColor={theme.colors.outlineVariant}
          mode="outlined"
          label="0x..."
          value={contractAddress}
          placeholder="0x..."
          keyboardType="default"
          onChangeText={setContractAddress}
          placeholderTextColor={theme.colors.whiteVariant}
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
            alignItems: 'center',
            marginBottom: 10,
            width: '100%',
            opacity: isBtnDisabled ? 0.5 : 1,
          }}>
          {isAdding ? 'Adding...' : 'Add'}
        </Button>
      </View>

      <Text
        variant="titleMedium"
        style={{
          color: theme.colors.whiteVariant,
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
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
          }}>
          <Text
            variant="titleMedium"
            style={{
              color: theme.colors.whiteVariant,
              fontSize: 18,
              textAlign: 'center',
            }}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  input: {
    marginBottom: 20,
    borderColor: '#69F6CC',
    width: '100%',
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

export default SettingsScreen;
