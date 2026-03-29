import { useState } from 'react';
import { TextInput } from 'react-native-paper';

import { useAppTheme } from '../../theme/theme';
import { InputComponentProps } from '../form/form.types';

type PasswordFieldProps = InputComponentProps<string> & {
  disabled?: boolean;
};

export function PasswordField({ value, placeholder, onChange, disabled }: PasswordFieldProps) {
  const theme = useAppTheme();
  const [visible, setVisible] = useState(false);

  return (
    <TextInput
      value={value ?? ''}
      mode="outlined"
      disabled={disabled}
      outlineStyle={{ borderRadius: 10 }}
      placeholder={placeholder}
      secureTextEntry={!visible}
      right={<TextInput.Icon icon={visible ? 'eye-off' : 'eye'} onPress={() => setVisible((prev) => !prev)} />}
      onChangeText={onChange}
      textColor={theme.colors.textPrimary}
      style={{ backgroundColor: theme.colors.surface }}
    />
  );
}
