import { useState } from 'react';
import { DrawerFormActions, SelectInput, type SelectOption } from '@mami/ui';

import { TextAreaField } from '../../components/input';
import { type DaycareMembershipAccess } from '../../services/daycare-memberships/store';
import { Box, Text } from '../../theme/theme';

type DaycareMembershipFormProps = {
  loading: boolean;
  error?: string;
  userId: string;
  access: DaycareMembershipAccess;
  notes: string;
  userOptions: SelectOption[];
  onCancel: () => void;
  onChangeUserId: (value: string) => void;
  onChangeAkses: (value: DaycareMembershipAccess) => void;
  onChangeNotes: (value: string) => void;
  onSubmit: () => void;
};

const accessOptions: SelectOption[] = [
  { label: 'Owner', value: 'OWNER' },
  { label: 'Admin Daycare', value: 'ADMIN' },
  { label: 'Karyawan Daycare', value: 'SITTER' },
];

export function DaycareMembershipForm({
  loading,
  error,
  userId,
  access,
  notes,
  userOptions,
  onCancel,
  onChangeUserId,
  onChangeAkses,
  onChangeNotes,
  onSubmit,
}: DaycareMembershipFormProps) {
  const [localError, setLocalError] = useState('');

  function handleSubmit() {
    if (!userId) {
      setLocalError('Pilih user terlebih dahulu.');
      return;
    }

    setLocalError('');
    onSubmit();
  }

  return (
    <Box gap="md">
      <Box gap="xs">
        <Text style={{ fontSize: 12, fontWeight: '700', color: '#24324B' }}>User</Text>
        <SelectInput
          value={userId}
          placeholder="Pilih user"
          onChange={(value) => {
            setLocalError('');
            onChangeUserId(value);
          }}
          disabled={loading}
          options={userOptions}
          title="Pilih User"
        />
      </Box>

      <Box gap="xs">
        <Text style={{ fontSize: 12, fontWeight: '700', color: '#24324B' }}>Akses</Text>
        <SelectInput
          value={access}
          placeholder="Pilih access"
          onChange={(value) => onChangeAkses(value as DaycareMembershipAccess)}
          disabled={loading}
          options={accessOptions}
          title="Pilih Akses"
        />
      </Box>

      <Box gap="xs">
        <Text style={{ fontSize: 12, fontWeight: '700', color: '#24324B' }}>Catatan</Text>
        <TextAreaField
          value={notes}
          placeholder="Catatan tambahan untuk membership ini"
          onChange={onChangeNotes}
          disabled={loading}
          numberOfLines={4}
          useBottomSheetInput
        />
      </Box>

      <DrawerFormActions onCancel={onCancel} onSubmit={handleSubmit} loading={loading} />

      {localError ? <Text color="danger">{localError}</Text> : null}
      {error ? <Text color="danger">{error}</Text> : null}
    </Box>
  );
}
