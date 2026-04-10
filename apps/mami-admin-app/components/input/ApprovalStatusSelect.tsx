import { DaycareStatusInput } from '@mami/ui';

import { InputComponentProps } from '../form/form.types';
import { type SelectOption } from './Select';

type ApprovalStatusSelectProps = InputComponentProps<string> & {
  disabled?: boolean;
  options?: SelectOption[];
};

const APPROVAL_STATUS_OPTIONS = [
  { label: 'Draft', value: 'DRAFT' },
  { label: 'Submitted', value: 'SUBMITTED' },
  { label: 'In Review', value: 'IN_REVIEW' },
  { label: 'Needs Revision', value: 'NEEDS_REVISION' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Rejected', value: 'REJECTED' },
  { label: 'Suspended', value: 'SUSPENDED' },
];

export function ApprovalStatusSelect({ value, placeholder, onChange, disabled, options }: ApprovalStatusSelectProps) {
  return (
    <DaycareStatusInput
      value={value}
      placeholder={placeholder ?? 'Pilih status approval'}
      onChange={onChange}
      disabled={disabled}
      options={options ?? APPROVAL_STATUS_OPTIONS}
    />
  );
}
