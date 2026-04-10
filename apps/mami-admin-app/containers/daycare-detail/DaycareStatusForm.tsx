import { useState } from 'react';
import { DaycareStatusInput, DrawerFormActions } from '@mami/ui';
import { daycareStatusUpdateSchema } from '@mami/core';

import { TextAreaField } from '../../components/input';
import { Box, Text } from '../../theme/theme';

type DaycareStatusFormProps = {
  currentStatus: string;
  value: string;
  note: string;
  options: Array<{ label: string; value: string }>;
  loading: boolean;
  error?: string;
  onCancel: () => void;
  onChangeStatus: (value: string) => void;
  onChangeNote: (value: string) => void;
  onSubmit: () => void;
};

type StatusFormData = {
  status: string;
  note: string;
};

export function DaycareStatusForm({
  currentStatus,
  value,
  note,
  options,
  loading,
  error,
  onCancel,
  onChangeStatus,
  onChangeNote,
  onSubmit,
}: DaycareStatusFormProps) {
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof StatusFormData, string>>>({});

  function handleSubmit() {
    if (value === currentStatus) {
      setFieldErrors({ status: 'Pilih status yang berbeda dari status saat ini.' });
      return;
    }

    const result = daycareStatusUpdateSchema.safeParse({ status: value, note });
    if (!result.success) {
      const nextErrors = result.error.issues.reduce(
        (accumulator, issue) => {
          const path = String(issue.path[0] ?? '');
          if (path === 'status' || path === 'note') {
            accumulator[path] = issue.message;
          }
          return accumulator;
        },
        {} as Partial<Record<keyof StatusFormData, string>>
      );
      setFieldErrors(nextErrors);
      return;
    }

    setFieldErrors({});
    onSubmit();
  }

  return (
    <Box gap="md">
      <Box gap="xs">
        <Text style={{ fontSize: 12, fontWeight: '700', color: '#24324B' }}>Status tujuan</Text>
        <DaycareStatusInput
          value={value}
          placeholder="Pilih status"
          onChange={(nextValue) => {
            setFieldErrors((current) => ({ ...current, status: undefined }));
            onChangeStatus(nextValue);
          }}
          disabled={loading}
          options={options}
        />
        {fieldErrors.status ? <Text color="danger">{fieldErrors.status}</Text> : null}
      </Box>

      <Box gap="xs">
        <Text style={{ fontSize: 12, fontWeight: '700', color: '#24324B' }}>Catatan</Text>
        <TextAreaField
          value={note}
          placeholder="Tulis catatan update status"
          onChange={(nextValue) => {
            setFieldErrors((current) => ({ ...current, note: undefined }));
            onChangeNote(nextValue);
          }}
          disabled={loading}
          numberOfLines={4}
        />
        {fieldErrors.note ? <Text color="danger">{fieldErrors.note}</Text> : null}
      </Box>

      <Box flexDirection="row" gap="sm">
        <DrawerFormActions onCancel={onCancel} onSubmit={handleSubmit} loading={loading} submitDisabled={options.length === 0} />
      </Box>

      {error ? <Text color="danger">{error}</Text> : null}
    </Box>
  );
}
