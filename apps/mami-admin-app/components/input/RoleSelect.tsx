import { type InputComponentProps } from '@mami/ui';
import { Select } from './Select';

type RoleSelectProps = InputComponentProps<string> & {
  disabled?: boolean;
  options?: {
    label: string;
    value: string;
  }[];
};

export const ROLE_OPTIONS = [
  { label: 'Superuser (Sistem)', value: 'SUPER_ADMIN' },
  { label: 'Pemilik (Owner)', value: 'DAYCARE_OWNER' },
  { label: 'Admin Daycare', value: 'DAYCARE_ADMIN' },
  { label: 'Pengasuh (Sitter)', value: 'DAYCARE_SITTER' },
  { label: 'Orang Tua (Parent)', value: 'PARENT' },
];

export const ADMIN_MANAGED_ROLE_OPTIONS = [
  { label: 'Superuser (Sistem)', value: 'SUPER_ADMIN' },
  { label: 'Admin Daycare', value: 'DAYCARE_ADMIN' },
];

export function RoleSelect({ value, placeholder, onChange, disabled, options, ...props }: RoleSelectProps) {
  return (
    <Select
      value={value}
      placeholder={placeholder ?? 'Pilih akses sistem'}
      onChange={onChange}
      disabled={disabled}
      options={options ?? ROLE_OPTIONS}
      title={(props as any).title ?? "Pilih Akses Sistem"}
    />
  );
}
