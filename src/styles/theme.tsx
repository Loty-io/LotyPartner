import {
  configureFonts,
  MD3LightTheme as DefaultTheme,
} from 'react-native-paper';

const fontConfig = {
  ios: {
    regular: {
      fontFamily: 'Bahnschrift',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Bahnschrift',
      fontWeight: 'bold',
    },
    light: {
      fontFamily: 'Bahnschrift',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'Bahnschrift',
      fontWeight: 'normal',
    },
  },
  android: {
    regular: {
      fontFamily: 'Bahnschrift',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Bahnschrift',
      fontWeight: 'bold',
    },
    light: {
      fontFamily: 'Bahnschrift',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'Bahnschrift',
      fontWeight: 'normal',
    },
  },
};

const colors = {
  primary: '#69F6CC',
  gray: '#38383A',
  dark_gray: '#1C1C1E',
  white: '#F2F2F7',
  error: '#FF003E',
  variantGray: '#8E8E93',
  borderBottom: '#48484A',
};

const theme = {
  ...DefaultTheme,
  // Specify custom property
  myOwnProperty: true,
  // Specify custom property in nested object
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    surfaceVariant: colors.gray,
    background: colors.dark_gray,
    outlineVariant: colors.gray,
    outline: colors.primary,
    whiteVariant: colors.white,
    error: colors.error,
    variantGray: colors.variantGray,
    borderBottom: colors.borderBottom,
  },
  fonts: configureFonts({ config: fontConfig, isV3: true }),
};

export default theme;
