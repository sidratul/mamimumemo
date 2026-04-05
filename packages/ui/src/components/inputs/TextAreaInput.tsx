import { TextInput, type SharedTextInputProps } from './TextInput';

export type SharedTextAreaInputProps = Omit<SharedTextInputProps, 'multiline' | 'numberOfLines'> & {
  numberOfLines?: number;
};

export function TextAreaInput({ numberOfLines = 3, ...props }: SharedTextAreaInputProps) {
  return <TextInput {...props} multiline numberOfLines={numberOfLines} />;
}
