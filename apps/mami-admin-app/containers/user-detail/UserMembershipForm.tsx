import { DrawerFormActions, SelectInput, type SelectOption } from '@mami/ui';
import { useState } from 'react';

import { TextAreaField } from '../../components/input';
import { type DaycareMembershipAccess } from '../../services/membership';
import { Box, Text } from '../../theme/theme';

type UserMembershipFormProps = {
  loading: boolean;
  error?: string;
  daycareId: string;
  access: DaycareMembershipAccess;
  notes: string;
  daycareOptions: SelectOption[];
  onCancel: () => void;
  onChangeDaycareId: (value: string) => void;
  onChangeAccess: (value: DaycareMembershipAccess) => void;
  onChangeNotes: (value: string) => void;
  onSubmit: () => void;
};

const accessOptions: Array<{ label: string; value: DaycareMembershipAccess }> = [
  { label: 'Admin Daycare', value: 'ADMIN' },
  { label: 'Karyawan (Sitter)', value: 'SITTER' },
  { label: 'Pemilik (Owner)', value: 'OWNER' },
];

export function UserMembershipForm({
  loading,
  error,
  daycareId,
  access,
  notes,
  daycareOptions,
  onCancel,
  onChangeDaycareId,
  onChangeAccess,
  onChangeNotes,
  onSubmit,
}: UserMembershipFormProps) {
  return (
    <Box gap="lg">
      <Box gap="xs">
        <Text style={{ fontSize: 12, fontWeight: '700', color: '#24324B' }}>Pilih Daycare</Text>
        <SelectInput
          value={daycareId}
          placeholder="Cari daycare..."
          onChange={onChangeDaycareId}
          disabled={loading}
          options={daycareOptions}
          title="Pilih Daycare"
        />
      </Box>

      <Box gap="xs">
        <Text style={{ fontSize: 12, fontWeight: '700', color: '#24324B' }}>Pilih Akses</Text>
        <SelectInput
          value={access}
          placeholder="Pilih akses"
          onChange={(value) => onChangeAccess(value as DaycareMembershipAccess)}
          disabled={loading}
          options={accessOptions}
          title="Pilih Akses"
        />
      </Box>

      <Box gap="xs">
        <Text style={{ fontSize: 12, fontWeight: '700', color: '#24324B' }}>Catatan</Text>
        <TextAreaField
          value={notes}
          placeholder="Catatan tambahan (opsional)"
          onChange={onChangeNotes}
          disabled={loading}
        />
      </Box>

      {error ? (
        <Text color="danger" variant="bodySmall">
          {error}
        </Text>
      ) : null}

      <Box flexDirection="row" gap="sm"><DrawerFormActions submitLabel="Tambahkan Membership" onCancel={onCancel} onSubmit={onSubmit} loading={loading} /></Box>
    </Box>
  );
}
