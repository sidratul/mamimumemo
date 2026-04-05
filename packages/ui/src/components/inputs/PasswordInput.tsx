import { useState } from 'react';
import { TextInput as PaperTextInput } from 'react-native-paper';

import { TextInput, type SharedTextInputProps } from './TextInput';

export type SharedPasswordInputProps = Omit<SharedTextInputProps, 'secureTextEntry' | 'right'>;

export function PasswordInput(props: SharedPasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <TextInput
      {...props}
      secureTextEntry={!visible}
      right={<PaperTextInput.Icon icon={visible ? 'eye-off' : 'eye'} onPress={() => setVisible((prev) => !prev)} />}
    />
  );
}
