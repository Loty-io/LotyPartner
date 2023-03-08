import { GestureResponderEvent, TextStyle, View } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import BoldCustomText from './BoldCustomText';

type CustomAppBarInput = {
    title: string;
    isBack: boolean;
    leftButtonText: string;
    textButtonStyle?: TextStyle;
    onPressLeftButton: ((event: GestureResponderEvent) => void) | undefined;
}
const CustomAppBar = ({ title, isBack, leftButtonText, textButtonStyle, onPressLeftButton }: CustomAppBarInput) => {
    const theme = useTheme();
    return (
        <View
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          height: 60,
          width: '100%',
          paddingHorizontal: 16,
          borderBottomColor: theme.colors.surfaceVariant,
          borderBottomWidth: 2,
          flexDirection: 'row',
        }}>
            <Button
                icon={!isBack ? null : require('../assets/arrow-back.png')}
                style={{ backgroundColor: 'transparent', }}
                labelStyle={textButtonStyle}
                onPress={onPressLeftButton}
            >
                {leftButtonText}
            </Button>
            <BoldCustomText style={{ fontSize: 18, color: theme.colors.surface }}>
                {title}
            </BoldCustomText>
            <BoldCustomText style={{ color: 'transparent', ...textButtonStyle}}>
                {leftButtonText}
            </BoldCustomText>
        </View>
    );
};

export default CustomAppBar;