import * as React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import theme from './styles/theme';

import { Provider as PaperProvider } from 'react-native-paper';
import SplashScreen from 'react-native-splash-screen';
import './i18n/i18n.config';
import StackNavigator from './components/navigation/StackNavigator';
import { JwtTokenProvider } from './context/AuthContext';
import { ApolloProvider } from '@apollo/client';
import { Web3DataProvider } from './context/Web3Context';
import { apolloClient } from './graphql/client';

export default function App() {
  React.useEffect(() => {
    setTimeout(function () {
      SplashScreen.hide();
    }, 2000);
  }, []);

  React.useEffect(() => {
    StatusBar.setBarStyle('light-content', true);
  }, []);

  return (
    <PaperProvider theme={theme}>
      <JwtTokenProvider>
        <ApolloProvider client={apolloClient}>
          <Web3DataProvider>
            <NavigationContainer>
              <StatusBar barStyle="light-content" />
              <StackNavigator />
              <Toast />
            </NavigationContainer>
          </Web3DataProvider>
        </ApolloProvider>
      </JwtTokenProvider>
    </PaperProvider>
  );
}
