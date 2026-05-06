import { SelectInput as BaseSelectInput, type SelectOption } from '@mami/ui';
import type { InputComponentProps } from './form.types';

type DaycareStatusInputProps = InputComponentProps<string> & {
  options?: SelectOption[];
};

export function DaycareStatusInput({
  value,
  placeholder,
  onChange,
  options = [],
  disabled,
}: DaycareStatusInputProps) {
  return (
    <BaseSelectInput
      value={value}
      placeholder={placeholder ?? 'Pilih status'}
      onChange={onChange}
      disabled={disabled}
      options={options}
      title="Status Daycare"
    />
  );
}
