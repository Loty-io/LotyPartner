import React from 'react';
import { GestureResponderEvent } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import theme from '../../styles/theme';

type CustomDialogInput = {
  isVisible: boolean;
  onDismiss?: (() => void) | undefined;
  onPressRight: ((event: GestureResponderEvent) => void) | undefined;
  onPressLeft: ((event: GestureResponderEvent) => void) | undefined;
  title: string;
  content: string;
  textRight: string;
  textLeft: string;
};

const CustomDialog = ({
  isVisible,
  onDismiss,
  onPressRight,
  onPressLeft,
  title,
  content,
  textRight,
  textLeft,
}: CustomDialogInput) => {
  return (
    <Portal>
      <Dialog
        visible={isVisible}
        onDismiss={onDismiss}
        style={{ backgroundColor: theme.colors.background }}>
        <Dialog.Content
          style={{ alignContent: 'space-around', alignItems: 'center' }}>
          <Text variant="titleMedium" style={{ color: theme.colors.surface }}>
            {title}
          </Text>
          <Text style={{ color: theme.colors.outline, marginTop: 10 }}>
            {content}
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onPressLeft} textColor={theme.colors.primary}>
            {textLeft}
          </Button>
          <Button textColor={theme.colors.error} onPress={onPressRight}>
            {textRight}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default CustomDialog;
