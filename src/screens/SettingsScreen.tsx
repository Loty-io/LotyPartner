import * as React from 'react';
import {
  View,
  Image,
  SafeAreaView,
  FlatList,
  Clipboard,
  RefreshControl,
} from 'react-native';

import { clearAll } from '../helpers/storage';
import { useTheme } from 'react-native-paper';
import DialogButton from '../components/custom/DialogButton';
import CustomAppBar, {
  AppBarAction,
} from '../components/navigation/CustomAppBar';
import CustomDialog from '../components/custom/CustomDialog';
import {
  addContractAddressApi,
  deleteContractAddressApi,
  deletePartner,
  getScannedNftCollections,
} from '../helpers/api';
import { showToast, truncateAddress } from '../helpers/utils';

import { Button, Text, Card, TextInput } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

const SettingsScreen = ({ navigation, route }: any) => {
  const { t } = useTranslation();
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
    } catch (error) {}
    setIsLoading(false);
  };

  React.useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 2000);
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
    showToast('success', t('settings.text.copy'));
  };

  const onPressDelete = async () => {
    const { hasError } = await deleteContractAddressApi(deletecontractAddress);
    if (hasError) {
      showToast('error', t('common.generic_error'));
      return;
    }
    setDeleteContractAddress('');
    showToast('success', t('settings.text.removed'));
  };

  const isBtnDisabled = !contractAddress || isAdding;

  const onPressAdd = async () => {
    try {
      const contractAddressArray = await scannedNftCollections.map(
        ({ contractAddress }) => contractAddress,
      );
      if (contractAddress && contractAddressArray.includes(contractAddress)) {
        showToast('error', t('settings.text.already_added'));
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
      showToast('success', t('settings.text.added'));
    } catch (error) {
      showToast('error', t('settings.text.error'));
    } finally {
      setIsAdding(false);
    }
  };

  const dialogDeleteContract = () => {
    return (
      <CustomDialog
        isVisible={showDialog}
        onPressLeft={() => setshowDialog(false)}
        onPressRight={() => {
          onPressDelete();
          setshowDialog(false);
        }}
        title={t('settings.delete.title')}
        content={t('settings.delete.dialog')}
        textRight={t('common.yes')}
        textLeft={t('common.no')}
      />
    );
  };

  const imageSize = 18;
  const renderItem = ({ item: { name = '', contractAddress = '' } }) => (
    <Card
      contentStyle={{ flexDirection: 'row' }}
      style={{
        backgroundColor: theme.colors.background,
        borderRadius: 15,
        borderColor: theme.colors.backdrop,
        borderWidth: 1,
      }}>
      <View style={{ padding: 10 }}>
        <Text variant="titleLarge" style={{ color: theme.colors.surface }}>
          {name}
        </Text>
        <Button
          compact={true}
          textColor={theme.colors.outline}
          style={{ margin: 2 }}
          contentStyle={{ flexDirection: 'row-reverse' }}
          icon={require('../assets/copy.png')}
          onPress={() => onPressCopy(contractAddress)}>
          {truncateAddress(contractAddress)}
        </Button>
      </View>
      <Button
        style={{ flex: 1, flexDirection: 'row-reverse', alignItems: 'center' }}
        onPress={() => {
          setshowDialog(true);
          setDeleteContractAddress(contractAddress);
        }}
        icon={({}) => (
          <Image
            source={require('../assets/trash.png')}
            style={{ width: imageSize, height: imageSize }}
          />
        )}>
        {}
      </Button>
    </Card>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {dialogDeleteContract()}
      <CustomAppBar
        title={t('settings.title') || ''}
        action={AppBarAction.BACK}
        leftButtonText={t('common.back')}
        textButtonStyle={{ fontSize: 17 }}
        navigation={navigation}
      />

      <Text
        variant="titleMedium"
        style={{
          color: theme.colors.surface,
          alignSelf: 'flex-start',
          margin: 15,
        }}>
        {t('settings.text.enter_add')}
      </Text>
      <TextInput
        style={{ marginHorizontal: 15 }}
        textColor={theme.colors.surface}
        outlineColor={theme.colors.outline}
        mode="outlined"
        label={t('settings.text.label')}
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
          alignSelf: 'center',
        }}>
        {isAdding ? t('settings.text.adding') : t('settings.text.add')}
      </Button>
      <Text
        variant="titleMedium"
        style={{
          color: theme.colors.surface,
          alignSelf: 'flex-start',
          marginVertical: 15,
          paddingHorizontal: 16,
        }}>
        {t('settings.text.your_contract')}
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
          style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <Text
            variant="titleMedium"
            style={{
              color: theme.colors.outline,
              fontSize: 18,
              textAlign: 'center',
            }}>
            {isLoading ? t('common.loading') : t('settings.text.nil_added')}
          </Text>
        </View>
      )}
      <DialogButton
        titleText={t('settings.deleteuser.title')}
        bodyText={t('settings.deleteuser.dialog')}
        confirmBtnText={t('settings.deleteuser.confirm')}
        onConfirm={deleteUser}>
        {t('settings.deleteuser.delete')}
      </DialogButton>
    </SafeAreaView>
  );
};

export default SettingsScreen;
