import { TextAreaInput as SharedTextAreaInput, type InputComponentProps } from '@mami/ui';

import { useSharedInputProps } from './shared';

type TextAreaFieldProps = InputComponentProps<string> & {
  disabled?: boolean;
  numberOfLines?: number;
  useBottomSheetInput?: boolean;
};

export function TextAreaField({
  value,
  placeholder,
  onChange,
  disabled,
  numberOfLines = 4,
  useBottomSheetInput,
}: TextAreaFieldProps) {
  const inputProps = useSharedInputProps();

  return (
    <SharedTextAreaInput
      value={value ?? ''}
      numberOfLines={numberOfLines}
      disabled={disabled}
      placeholder={placeholder}
      onChangeText={onChange}
      textColor={inputProps.textColor}
      backgroundColor={inputProps.backgroundColor}
      borderRadius={inputProps.borderRadius}
      useBottomSheetInput={useBottomSheetInput}
    />
  );
}
