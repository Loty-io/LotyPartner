import { Image, ImageSourcePropType } from 'react-native';
import { useTheme } from 'react-native-paper';

const TabImage = ({
  source,
  focused,
}: {
  source: ImageSourcePropType;
  focused: boolean;
}) => {
  const theme = useTheme();
  return (
    <Image
      style={{
        width: 20,
        height: 20,
        tintColor: focused ? theme.colors.primary : theme.colors.surface,
      }}
      source={source}
    />
  );
};

export default TabImage;
