import { InputComponentProps } from '../form/form.types';
import { Select } from './Select';

type RoleSelectProps = InputComponentProps<string> & {
  disabled?: boolean;
  options?: Array<{
    label: string;
    value: string;
  }>;
};

export const ROLE_OPTIONS = [
  { label: 'Super Admin', value: 'SUPER_ADMIN' },
  { label: 'Daycare Owner', value: 'DAYCARE_OWNER' },
  { label: 'Daycare Admin', value: 'DAYCARE_ADMIN' },
  { label: 'Daycare Sitter', value: 'DAYCARE_SITTER' },
  { label: 'Parent', value: 'PARENT' },
];

export const ADMIN_MANAGED_ROLE_OPTIONS = [
  { label: 'Super Admin', value: 'SUPER_ADMIN' },
  { label: 'Daycare Admin', value: 'DAYCARE_ADMIN' },
];

export function RoleSelect({ value, placeholder, onChange, disabled, options }: RoleSelectProps) {
  return (
    <Select
      value={value}
      placeholder={placeholder ?? 'Pilih role'}
      onChange={onChange}
      disabled={disabled}
      options={options ?? ROLE_OPTIONS}
    />
  );
}
