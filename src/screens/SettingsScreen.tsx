import * as React from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Dimensions,
  Clipboard,
  RefreshControl,
} from 'react-native';

import CustomText from '../components/CustomText';
import BoldCustomText from '../components/BoldCustomText';
import CustomTextInput from '../components/CustomTextInput';
import { addContractAddressApi, deleteContractAddressApi, getScannedNftCollections } from '../helpers/api';
import { showToast, truncateAddress } from '../helpers/utils';

const SettingsScreen = ({ navigation, route }: any) => {


  const [isAdding, setIsAdding] = React.useState(false);
  const [contractAddress, setContractAddress] = React.useState('');

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

  const onPressGoBack = () => {
    navigation.navigate('Scan', { hasScannedNft: true });
  };

  const onPressCopy = (contractAddress: string) => {
    Clipboard.setString(contractAddress);
    showToast('success', 'Contract Address Copied!');
  };

  const onPressDelete = async (contractAddr: string) => {
    try {
      const { hasError, errorMessage } = await deleteContractAddressApi(
        contractAddr,
      );

      if (hasError) {
        throw new Error(errorMessage);
      }

      showToast('success', 'Removed correctly');
    } catch (error) {
      console.log(error);
      showToast('error', 'Invalid address');
    }
  };

  const isBtnDisabled = !contractAddress || isAdding;

  const onPressAdd = async () => {

    console.log(contractAddress);

    try {
      console.log('InitAdd');
      const contractAddressArray = await scannedNftCollections.map(
        ({ contractAddress, }) => contractAddress
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

      //setContractAddressArray([...contractAddressArray, contractAddress]);
      setContractAddress('');
      showToast('success', 'Added correctly');
    } catch (error) {
      showToast('error', 'Invalid address');
    } finally {
      setIsAdding(false);
    }
  };

  const imageSize = 18;
  const renderItem = ({
    item: {
      name = '',
      contractAddress = '',
    }
  }) => (
    <View
      style={{
        width: Dimensions.get('window').width,
        borderBottomColor: '#48484A',
        borderBottomWidth: 1,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
      }}>

      <View style={{
        width: '80%',
        flexDirection: 'column',
      }}>
        <BoldCustomText
          style={{
            color: '#F2F2F7',
            fontSize: 18,
            marginVertical: 11,
            flex: 9,
          }}>
          {name}
        </BoldCustomText>
        <View style={{
          width: '70%',
          flexDirection: 'row',
        }}>
          <CustomText
            style={{
              color: '#8E8E93',
              fontSize: 15,
              marginRight: 10,
              marginTop: 3,
            }}>
            {truncateAddress(contractAddress)}
          </CustomText>
          <TouchableOpacity onPress={() => onPressCopy(contractAddress)} style={{ marginTop: 3, width: imageSize }}>
            <Image source={require('../assets/copy.png')} />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => onPressDelete(contractAddress)}
        style={{
          flex: 1,
          marginLeft: 5,
          alignItems: 'center',
          justifyContent: 'center',
          width: imageSize,
          height: imageSize,
        }}>
        <Image
          source={require('../assets/trash.png')}
          style={{
            width: imageSize,
            height: imageSize,
          }}
        />
      </TouchableOpacity>
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
          Settings
        </CustomText>
        <CustomText
          style={{
            color: '#1C1C1E',
            fontSize: 17,
          }}>
          12
        </CustomText>
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
        <BoldCustomText
          style={{
            color: 'white',
            fontSize: 17,
            width: '100%',
            marginVertical: 15,
          }}>
          Enter Smart Contract Address
        </BoldCustomText>
        <CustomTextInput
          style={styles.input}
          onChangeText={setContractAddress}
          value={contractAddress}
          placeholder="0x..."
          keyboardType="default"
          placeholderTextColor={'#EBEBF5'}
        />
        <TouchableOpacity
          onPress={onPressAdd}
          disabled={isBtnDisabled}
          activeOpacity={0.7}
          style={{
            backgroundColor: '#69F6CC',
            borderRadius: 24,
            paddingVertical: 13,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 10,
            width: '100%',
            opacity: isBtnDisabled ? 0.5 : 1,
          }}>
          <CustomText>{isAdding ? 'Adding...' : 'Add'}</CustomText>
        </TouchableOpacity>
      </View>

      <BoldCustomText
        style={{
          color: 'white',
          fontSize: 17,
          width: '100%',
          marginTop: 20,
          paddingHorizontal: 16,
        }}>
        Your Smart Contract Addresses:
      </BoldCustomText>

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
            {isLoading ? 'Loading...' : 'Nothing added yet'}
          </BoldCustomText>
        </View>
      )}
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






