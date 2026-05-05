import { TextInput, type SharedTextInputProps } from '../inputs/TextInput';

export type InputProps = SharedTextInputProps;

export function Input(props: InputProps) {
  return <TextInput {...props} />;
}
