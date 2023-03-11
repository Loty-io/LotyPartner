import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, GestureResponderEvent, TextStyle, View } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { JwtTokenContext } from '../../context/AuthContext';
import { Web3DataContext } from '../../context/Web3Context';
import { clearAll } from '../../helpers/storage';
import BoldCustomText from '../custom/BoldCustomText';
import CustomDialog from '../custom/CustomDialog';

export enum AppBarAction {
  SIGN_OUT = 'SIGN_OUT',
  BACK = 'BACK',
  CUSTOM = 'CUSTOM',
}

type CustomAppBarInput = {
  navigation: any;
  action: AppBarAction;
  leftButtonText: string;
  textButtonStyle?: TextStyle;
  title?: string;
  customAction?: ((event: GestureResponderEvent) => void) | undefined;
};

const CustomAppBar = ({
  navigation,
  action,
  title,
  leftButtonText,
  textButtonStyle,
  customAction,
}: CustomAppBarInput) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { setWeb3Data } = useContext(Web3DataContext);
  const { setJwtTokenData } = useContext(JwtTokenContext);
  const [showSignOutDialog, setShowSignOutDialog] = React.useState(false);

  const onPressLeftButton = async (ev: any) => {
    switch (action) {
      case AppBarAction.SIGN_OUT:
        await signOut();
        break;
      case AppBarAction.BACK:
        goBack();
        break;
      case AppBarAction.CUSTOM:
        if (customAction) {
          customAction(ev);
        }
        break;
    }
  };

  const isBack = () => {
    return AppBarAction.BACK == action;
  };

  const signOut = async () => {
    Alert.alert(t('navbar.logout.sign_out'), t('navbar.logout.dialog')!, [
      {
        text: t('common.yes') || 'Yes',
        onPress: () => {
          clearAll();
          setWeb3Data({});
          setJwtTokenData({});
          navigation.goBack();
        },
      },
      {
        text: t('common.no') || 'No',
        onPress: () => {},
      },
    ]);
  };

  const goBack = () => {
    navigation.goBack();
  };
  return (
    <View
      style={{
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 60,
        width: '100%',
        padding: 10,
        borderBottomColor: theme.colors.surfaceVariant,
        borderBottomWidth: 2,
        flexDirection: 'row',
      }}>
      <CustomDialog
        isVisible={showSignOutDialog}
        onPressLeft={() => setShowSignOutDialog(false)}
        onPressRight={() => {
          clearAll();
          navigation.goBack();
        }}
        title={t('scan.logout.sign_out')}
        content={t('scan.logout.dialog')}
        textRight={t('common.yes')}
        textLeft={t('common.no')}
      />
      <Button
        icon={isBack() ? require('../../assets/arrow-back.png') : null}
        style={{ backgroundColor: 'transparent' }}
        labelStyle={textButtonStyle}
        onPress={onPressLeftButton}>
        {leftButtonText}
      </Button>
      <View
        style={{
          position: 'absolute',
          left: 100,
          right: 100,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <BoldCustomText style={{ fontSize: 18, color: theme.colors.surface }}>
          {title || ''}
        </BoldCustomText>
      </View>

      <BoldCustomText style={{ color: 'transparent', ...textButtonStyle }}>
        {leftButtonText}
      </BoldCustomText>
    </View>
  );
};

export default CustomAppBar;
