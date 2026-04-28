import { approvalStatuses, getApprovalStatusLabel, type ApprovalStatus } from '@mami/core';

import type { InputComponentProps } from './form.types';
import { SelectInput, type SelectOption } from './SelectInput';

type DaycareStatusInputProps = InputComponentProps<string> & {
  options?: SelectOption[];
  disabled?: boolean;
  title?: string;
  textColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
};

const DAYCARE_STATUS_OPTIONS: SelectOption[] = Object.values(approvalStatuses).map((status) => ({
  label: getApprovalStatusLabel(status as ApprovalStatus),
  value: status,
}));

export function DaycareStatusInput({
  value,
  placeholder,
  onChange,
  disabled,
  options,
  title,
  textColor,
  backgroundColor,
  borderRadius,
}: DaycareStatusInputProps) {
  return (
    <SelectInput
      value={value}
      placeholder={placeholder ?? 'Pilih status daycare'}
      onChange={onChange}
      disabled={disabled}
      options={options ?? DAYCARE_STATUS_OPTIONS}
      title={title ?? 'Pilih Status Daycare'}
      textColor={textColor}
      backgroundColor={backgroundColor}
      borderRadius={borderRadius}
    />
  );
}
