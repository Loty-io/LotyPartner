import {
  ColorValue,
  KeyboardTypeOptions,
  TextInput,
  TextStyle,
} from 'react-native';
import * as React from 'react';

const CustomTextInput = ({
  style,
  onChangeText,
  value,
  placeholder,
  keyboardType,
  placeholderTextColor,
}: {
  style?: TextStyle;
  value?: string | undefined;
  placeholder?: string | undefined;
  keyboardType?: KeyboardTypeOptions | undefined;
  onChangeText?: ((text: string) => void) | undefined;
  placeholderTextColor?: ColorValue | undefined;
}) => (
  <TextInput
    style={{
      fontFamily: 'Bahnschrift',
      height: 50,
      borderWidth: 1,
      paddingVertical: 15,
      paddingHorizontal: 20,
      backgroundColor: '#1C1C1E',
      borderRadius: 15,
      color: 'white',
      ...style,
    }}
    onChangeText={onChangeText}
    value={value}
    placeholder={placeholder}
    keyboardType={keyboardType}
    placeholderTextColor={placeholderTextColor}
  />
);

export default CustomTextInput;
