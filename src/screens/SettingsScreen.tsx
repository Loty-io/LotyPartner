import * as React from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';

import CustomText from '../components/CustomText';
import BoldCustomText from '../components/BoldCustomText';
import CustomTextInput from '../components/CustomTextInput';
import { addContractAddressApi, deleteContractAddressApi } from '../helpers/api';
import { showToast } from '../helpers/utils';

const SettingsScreen = ({ navigation, route }: any) => {
  const [contractAddressArray, setContractAddressArray] = React.useState<
    string[]
  >(route?.params?.contractAddressArray ?? []);
  const [isAdding, setIsAdding] = React.useState(false);
  const [contractAddress, setContractAddress] = React.useState('');

  const onPressGoBack = () => {
    navigation.navigate('Scan', { hasScannedNft: true });
  };

  const onPressDelete = async (contractAddr: string) => {
    try {
      const { hasError, errorMessage } = await deleteContractAddressApi(
        contractAddr,
      );

      if (hasError) {
        throw new Error(errorMessage);
      }

      setContractAddressArray(prevValue =>
        prevValue.filter(item => item !== contractAddr),
      );
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

      setContractAddressArray([...contractAddressArray, contractAddress]);
      setContractAddress('');
      showToast('success', 'Added correctly');
    } catch (error) {
      showToast('error', 'Invalid address');
    } finally {
      setIsAdding(false);
    }
  };

  const imageSize = 18;

  const renderItem = ({ item }: { item: string }) => (
    <View
      style={{
        borderBottomColor: '#48484A',
        borderBottomWidth: 1,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <CustomText
        style={{
          color: '#F2F2F7',
          fontSize: 18,
          marginVertical: 11,
          flex: 9,
        }}>
        {item}
      </CustomText>
      <TouchableOpacity
        onPress={() => onPressDelete(item)}
        style={{
          flex: 1,
          marginLeft: 10,
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

      {contractAddressArray.length ? (
        <FlatList
          data={contractAddressArray}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          showsVerticalScrollIndicator={false}
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
            {'Nothing added yet'}
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
