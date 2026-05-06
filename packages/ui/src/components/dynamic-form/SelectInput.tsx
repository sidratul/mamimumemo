import { useMemo } from 'react';
import { Select } from '../primitives/Select';
import type { InputComponentProps } from './form.types';

export type SelectOption = {
  label: string;
  value: string;
};

type SelectInputProps = InputComponentProps<string> & {
  options?: SelectOption[];
  title?: string;
};

export function SelectInput({
  value,
  placeholder,
  onChange,
  options = [],
  disabled,
  title,
}: SelectInputProps) {
  return (
    <Select
      value={value}
      placeholder={placeholder ?? 'Pilih opsi'}
      options={options}
      onChange={onChange}
      disabled={disabled}
      title={title}
    />
  );
}
