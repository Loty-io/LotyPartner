import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import CheckInScreen from '../../screens/CheckInScreen';
import LoginScreen from '../../screens/LoginScreen';
import SettingsScreen from '../../screens/SettingsScreen';
import { CameraOTPValidator } from '../check_in/CameraOTPValidator';
import CheckInDetail from '../collections/CheckInDetail';
import { CollectionDetail } from '../collections/CollectionDetail';
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
      <Stack.Screen
        name="CameraOTPValidator"
        component={CameraOTPValidator}
        options={options}
      />
      <Stack.Screen
        name="CheckIn"
        component={CheckInScreen}
        options={options}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={options}
      />
      <Stack.Screen
        name="CollectionDetail"
        component={CollectionDetail}
        options={options}
      />
      <Stack.Screen
        name="CheckInDetail"
        component={CheckInDetail}
        options={options}
      />
    </Stack.Navigator>
  );
}
