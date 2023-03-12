import * as React from 'react';
import { SafeAreaView } from 'react-native';

import CustomAppBar, {
  AppBarAction,
} from '../components/navigation/CustomAppBar';
import CustomFAB from '../components/custom/CustomFAB';

import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { CollectionGallery } from '../components/collections/CollectionGallery';

const MainScreen = ({ navigation, route }: any) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [isExtended, setIsExtended] = React.useState(true);

  const onPressScan = () => {
    navigation.navigate('CameraOTPValidator');
  };

  return (
    <SafeAreaView style={{ backgroundColor: theme.colors.background, flex: 1 }}>
      <CustomAppBar
        title={t('account.title') || ''}
        action={AppBarAction.SIGN_OUT}
        leftButtonText={t('navbar.logout.sign_out')}
        textButtonStyle={{ fontSize: 14 }}
        navigation={navigation}
      />

      <CollectionGallery
        navigation={navigation}
        onScroll={({ nativeEvent }) => {
          const currentScrollPosition =
            Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
          setIsExtended(currentScrollPosition <= 0);
        }}
      />

      <CustomFAB
        text={t('common.check_in')}
        textStyle={{ color: theme.colors.surfaceVariant, fontSize: 15 }}
        onPress={onPressScan}
        isExtended={isExtended}
        icon={require('../assets/scan.png')}
      />
    </SafeAreaView>
  );
};

export default MainScreen;
