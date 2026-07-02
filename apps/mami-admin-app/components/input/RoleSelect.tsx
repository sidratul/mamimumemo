import { type InputComponentProps } from '@mami/ui';
import { Select } from './Select';

type RoleSelectProps = InputComponentProps<string> & {
  disabled?: boolean;
  options?: {
    label: string;
    value: string;
  }[];
};

export const ADMIN_MANAGED_ROLE_OPTIONS = [
  { label: 'Tanpa akses sistem', value: 'NONE' },
  { label: 'Superuser (Sistem)', value: 'SUPER_ADMIN' },
];

export function RoleSelect({ value, placeholder, onChange, disabled, options, ...props }: RoleSelectProps) {
  return (
    <Select
      value={value}
      placeholder={placeholder ?? 'Pilih akses sistem'}
      onChange={onChange}
      disabled={disabled}
      options={options ?? ADMIN_MANAGED_ROLE_OPTIONS}
      title={(props as any).title ?? "Pilih Akses Sistem"}
    />
  );
}
