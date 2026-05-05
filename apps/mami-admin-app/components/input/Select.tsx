import {
  SelectInput as SharedSelectInput,
  type InputComponentProps,
  type SelectOption as SharedSelectOption,
} from '@mami/ui';

import { useSharedInputProps } from './shared';

export type SelectOption = SharedSelectOption;

type SelectProps = InputComponentProps<string> & {
  options?: SelectOption[];
  disabled?: boolean;
};

export function Select({ value, placeholder, onChange, options = [], disabled }: SelectProps) {
  const inputProps = useSharedInputProps();

  return (
    <SharedSelectInput
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      disabled={disabled}
      options={options}
      textColor={inputProps.textColor}
      backgroundColor={inputProps.backgroundColor}
      borderRadius={inputProps.borderRadius}
    />
  );
}
