import * as React from 'react';
import {Image, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import LoginScreen from './src/screens/LoginScreen';
import ScanScreen from './src/screens/ScanScreen';
import CameraScreen from './src/screens/CameraScreen';
import CheckInScreen from './src/screens/CheckInScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import CollectionQR from './src/screens/CollectionQR';
import SplashScreen from 'react-native-splash-screen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const options = {
  headerShown: false,
};

export default function App() {
  React.useEffect(() => {
    setTimeout(function () {
      SplashScreen.hide();
    }, 2000);
  }, []);

  React.useEffect(() => {
    StatusBar.setBarStyle('light-content', true);
  }, []);

  const ScanTabNavigator = () => {
    const insets = useSafeAreaInsets();
    const isIphoneWithNotch = insets.bottom > 0;

    return (
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused}) => {
            if ((focused || !focused) && route.name === 'Account') {
              const size = 20;

              return (
                <Image
                  style={{width: size, height: size, tintColor: 'white'}}
                  source={require('./src/assets/account.png')}
                />
              );
            }
          },
          tabBarStyle: {
            height: 50 + (isIphoneWithNotch ? insets.bottom : 10),
            paddingBottom: -insets.bottom,
          },
          tabBarLabelStyle: {
            marginBottom: isIphoneWithNotch ? 30 : 5,
          },
          tabBarActiveTintColor: '#F2F2F7',
          tabBarInactiveTintColor: 'gray',
          tabBarActiveBackgroundColor: '#1C1C1E',
        })}>
        <Tab.Screen name="Account" component={ScanScreen} options={options} />
      </Tab.Navigator>
    );
  };

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" />
      {/* <magic.Relayer /> */}

      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={options} />
        <Stack.Screen
          name="ScanTabNavigator"
          component={ScanTabNavigator}
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="Camera"
          component={CameraScreen}
          options={options}
        />
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
      <Toast />
    </NavigationContainer>
  );
}
