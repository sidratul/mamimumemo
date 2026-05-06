import { type SelectOption } from '@mami/ui';
import { Select } from './Select';

type ApprovalStatusSelectProps = {
  value?: string;
  placeholder?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  options: SelectOption[];
  title?: string;
};

export function ApprovalStatusSelect({ value, placeholder, onChange, disabled, options, title }: ApprovalStatusSelectProps) {
  return (
    <Select
      value={value}
      placeholder={placeholder ?? 'Pilih status'}
      onChange={onChange}
      disabled={disabled}
      options={options}
      title={title ?? 'Update Status Approval'}
    />
  );
}
