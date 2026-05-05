import { TextAreaInput, type SharedTextAreaInputProps } from '../inputs/TextAreaInput';

export type TextareaProps = SharedTextAreaInputProps;

export function Textarea(props: TextareaProps) {
  return <TextAreaInput {...props} />;
}
