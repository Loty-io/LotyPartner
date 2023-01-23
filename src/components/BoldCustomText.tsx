import {Text, TextStyle} from 'react-native';

const CustomText = ({
  style,
  children,
}: {
  style?: TextStyle;
  children: string;
}) => (
  <Text
    style={{
      fontFamily: 'Bahnschrift',
      fontWeight: '700',
      ...style,
    }}>
    {children}
  </Text>
);

export default CustomText;
