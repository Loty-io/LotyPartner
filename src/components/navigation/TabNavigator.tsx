import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'react-native-paper';
import MainScreen from '../../screens/MainScreen';
import TabImage from './TabImage';
import SettingsScreen from '../../screens/SettingsScreen';

export default function TabNavigator() {
  const { t } = useTranslation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const Tab = createBottomTabNavigator();

  const isIphoneWithNotch = insets.bottom > 0;
  const options = {
    headerShown: false,
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          var source = undefined;
          switch (route.name) {
            case t('common.account'):
              source = require('../../assets/account.png');
              break;
            case t('settings.title'):
              source = require('../../assets/settings.png');
              break;
          }
          return <TabImage focused={focused} source={source} />;
        },
        tabBarStyle: {
          height: 50 + (isIphoneWithNotch ? insets.bottom : 10),
          paddingBottom: -insets.bottom,
        },
        tabBarLabelStyle: {
          marginBottom: isIphoneWithNotch ? 30 : 5,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.surface,
        tabBarActiveBackgroundColor: theme.colors.background,
        tabBarInactiveBackgroundColor: theme.colors.background,
      })}>
      <Tab.Screen
        name={t('common.account')}
        component={MainScreen}
        options={options}
      />
      <Tab.Screen
        name={t('settings.title')}
        component={SettingsScreen}
        options={options}
      />
    </Tab.Navigator>
  );
}
