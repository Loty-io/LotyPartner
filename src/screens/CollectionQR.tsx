import React from 'react';
import {
  View,
  SafeAreaView,
  Dimensions,
  ScrollView,
} from 'react-native';

import CustomAppBar from '../components/CustomAppBar';
import theme from '../styles/theme';

import QRCode from 'react-native-qrcode-svg';
import { Card, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

const paddingHorizontal = 10;

const CollectionQR = ({ navigation, route }: any) => {
  const { t } = useTranslation();
  const { collectionName, id, contractAddress, description } = route.params;

  const onPressGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.background}}>
      <CustomAppBar
        title={''}
        isBack={true}
        leftButtonText={t('common.back')}
        textButtonStyle={{ fontSize: 17 }}
        onPressLeftButton={onPressGoBack}
        isRightButton={false}/>
      <ScrollView>
        <Card contentStyle={{alignItems: 'center', paddingHorizontal: paddingHorizontal, paddingVertical: 15}} 
          style={{backgroundColor: theme.colors.background}}>
          <Text variant='headlineMedium'
            style={{color: theme.colors.surface, marginVertical: 25}}>
            {collectionName}
          </Text>
          <View
            style={{
              width: '100%',
              height: Dimensions.get('window').width - paddingHorizontal * 2,
              backgroundColor: 'white',
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <QRCode
              value={contractAddress}
              size={Dimensions.get('window').width - paddingHorizontal * 4}
              logoBorderRadius={8}
              logoMargin={20}
              backgroundColor="white"
            />
          </View>
          <Text variant='titleMedium'
            style={{color: theme.colors.surface, marginVertical: 25}}>
            {description}
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CollectionQR;
