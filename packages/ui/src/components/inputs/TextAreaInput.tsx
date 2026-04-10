import { TextInput as PaperTextInput } from 'react-native-paper';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';

import type { SharedTextInputProps } from './TextInput';

export type SharedTextAreaInputProps = Omit<SharedTextInputProps, 'multiline' | 'numberOfLines'> & {
  numberOfLines?: number;
};

export function TextAreaInput({
  value,
  placeholder,
  onChangeText,
  disabled,
  numberOfLines = 3,
  textColor = '#3D2218',
  backgroundColor = '#FFFFFF',
  borderRadius = 10,
}: SharedTextAreaInputProps) {
  const minHeight = Math.max(numberOfLines * 24 + 32, 112);

  return (
    <PaperTextInput
      value={value ?? ''}
      mode="outlined"
      disabled={disabled}
      placeholder={placeholder}
      multiline
      numberOfLines={numberOfLines}
      onChangeText={onChangeText}
      textColor={textColor}
      outlineStyle={{ borderRadius }}
      style={{
        backgroundColor,
        minHeight,
      }}
      contentStyle={{
        textAlignVertical: 'top',
      }}
      render={(inputProps) => <BottomSheetTextInput {...inputProps} />}
    />
  );
}
