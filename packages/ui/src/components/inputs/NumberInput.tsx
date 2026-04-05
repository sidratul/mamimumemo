import { TextInput, type SharedTextInputProps } from './TextInput';

export type SharedNumberInputProps = Omit<SharedTextInputProps, 'keyboardType'>;

export function NumberInput(props: SharedNumberInputProps) {
  return <TextInput {...props} keyboardType="numeric" />;
}
