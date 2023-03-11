import React from 'react';
import { ViewStyle, Animated } from 'react-native';
import { GestureResponderEvent, TextStyle } from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';
import theme from '../../styles/theme';

type CustomFabInput = {
  text: string;
  textStyle?: TextStyle;
  buttonStyle?: ViewStyle;
  onPress: ((event: GestureResponderEvent) => void) | undefined;
  isExtended: boolean;
  icon: IconSource;
};

const CustomFAB = ({
  text,
  textStyle,
  onPress,
  isExtended,
  icon,
}: CustomFabInput) => {
  const fade = new Animated.Value(0);
  React.useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  });
  return isExtended ? (
    <Animated.View style={{ opacity: fade }}>
      <Button
        mode="elevated"
        onPress={onPress}
        labelStyle={textStyle}
        style={{
          right: 16,
          bottom: 16,
          position: 'absolute',
          backgroundColor: theme.colors.primary,
        }}
        icon={icon}
        contentStyle={{ flexDirection: 'row-reverse' }}>
        {text}
      </Button>
    </Animated.View>
  ) : (
    <Animated.View style={{ opacity: fade }}>
      <IconButton
        icon={icon}
        onPress={onPress}
        size={22}
        style={{
          right: 16,
          bottom: 16,
          position: 'absolute',
          backgroundColor: theme.colors.primary,
        }}
      />
    </Animated.View>
  );
};

export default CustomFAB;
