import { GestureResponderEvent, TextStyle, View } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import BoldCustomText from './BoldCustomText';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';

type CustomAppBarInput = {
    title: string;
    isBack: boolean;
    isRightButton: boolean;
    leftButtonText: string;
    textButtonStyle?: TextStyle;
    rightButtonText?: string;
    rightIcon?: IconSource;
    onPressLeftButton: ((event: GestureResponderEvent) => void) | undefined;
    onPressRightButton?: ((event: GestureResponderEvent) => void) | undefined;
}
const CustomAppBar = (
    {   title, 
        isBack, 
        leftButtonText, 
        textButtonStyle, 
        onPressLeftButton, 
        rightIcon, 
        rightButtonText,
        isRightButton, 
        onPressRightButton } : CustomAppBarInput) => {
    const theme = useTheme();

    return (
        <View
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          height: 60,
          borderBottomColor: theme.colors.surfaceVariant,
          borderBottomWidth: 2,
          marginHorizontal: 5,
          flexDirection: 'row',
        }}>
            <Button
                icon={!isBack ? null : require('../assets/arrow-back.png')}
                style={{ backgroundColor: 'transparent'}}
                labelStyle={textButtonStyle}
                onPress={onPressLeftButton}>
                {leftButtonText}
            </Button>
            <BoldCustomText style={{ fontSize: 18, color: theme.colors.surface }}>
                {title}
            </BoldCustomText>
            {isRightButton ? 
            <Button icon={rightIcon}
                style={{ backgroundColor: 'transparent', flexDirection: 'row-reverse'}}
                onPress={onPressRightButton}>
                    {rightButtonText}
            </Button>
            :<BoldCustomText style={{ color: 'transparent', ...textButtonStyle}}>
                {leftButtonText}
            </BoldCustomText>
            }
        </View>
    );
};

export default CustomAppBar;