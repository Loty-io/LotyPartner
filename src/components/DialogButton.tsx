import * as React from 'react';
import { View } from 'react-native';
import { Button, Dialog, Portal, Text, useTheme } from 'react-native-paper';

const DialogButton = ({
  titleText,
  bodyText,
  cancelBtnText,
  confirmBtnText,
  onConfirm,
  onCancel,
  children,
}: {
  titleText: string;
  bodyText: string;
  cancelBtnText?: string;
  confirmBtnText?: string;
  onConfirm: any;
  onCancel?: any;
  children: React.ReactNode;
}) => {
  const [visible, setVisible] = React.useState(false);
  const theme = useTheme();

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  return (
    <View>
      <Button
        onPress={showDialog}
        mode="outlined"
        textColor={theme.colors.error}
        compact={true}
        style={{ borderColor: theme.colors.error }}>
        {children}
      </Button>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>{titleText}</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">{bodyText}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button textColor={theme.colors.variantGray} onPress={hideDialog}>
              {cancelBtnText || 'Cancel'}
            </Button>
            <Button textColor={theme.colors.error} onPress={onConfirm}>
              {confirmBtnText || 'Ok'}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default DialogButton;
