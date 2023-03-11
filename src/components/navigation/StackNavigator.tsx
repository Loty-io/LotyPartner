import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import AnalyticsScreen from '../../screens/AnalyticsScreen';
import CameraScreen from '../../screens/CameraScreen';
import CheckInScreen from '../../screens/CheckInScreen';
import CollectionQR from '../../screens/CollectionQR';
import LoginScreen from '../../screens/LoginScreen';
import SettingsScreen from '../../screens/SettingsScreen';
import TabNavigator from './TabNavigator';

export default function StackNavigator() {
  const Stack = createNativeStackNavigator();

  const options = {
    headerShown: false,
  };

  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} options={options} />
      <Stack.Screen
        name="TabNavigator"
        component={TabNavigator}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen name="Camera" component={CameraScreen} options={options} />
      <Stack.Screen name="QR" component={CollectionQR} options={options} />
      <Stack.Screen
        name="CheckIn"
        component={CheckInScreen}
        options={options}
      />
      <Stack.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={options}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={options}
      />
    </Stack.Navigator>
  );
}

export enum Screens {
  CAMERA = 'CAMERA',
}
