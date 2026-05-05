import { useState } from 'react';
import { DrawerFormActions, SelectInput, type SelectOption } from '@mami/ui';

import { TextAreaField } from '../../components/input';
import { Box, Text } from '../../theme/theme';
import { type DaycareMembershipAccess } from '../../services/daycare-memberships/store';

type UserMembershipFormProps = {
  loading: boolean;
  error?: string;
  daycareId: string;
  access: DaycareMembershipAccess;
  notes: string;
  daycareOptions: SelectOption[];
  onCancel: () => void;
  onChangeDaycareId: (value: string) => void;
  onChangeAkses: (value: DaycareMembershipAccess) => void;
  onChangeNotes: (value: string) => void;
  onSubmit: () => void;
};

const accessOptions: SelectOption[] = [
  { label: 'Owner', value: 'OWNER' },
  { label: 'Admin Daycare', value: 'ADMIN' },
  { label: 'Karyawan Daycare', value: 'SITTER' },
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
  onChangeAkses,
  onChangeNotes,
  onSubmit,
}: UserMembershipFormProps) {
  const [localError, setLocalError] = useState('');

  function handleSubmit() {
    if (!daycareId) {
      setLocalError('Pilih daycare terlebih dahulu.');
      return;
    }

    setLocalError('');
    onSubmit();
  }

  return (
    <Box gap="md">
      <Box gap="xs">
        <Text style={{ fontSize: 12, fontWeight: '700', color: '#24324B' }}>Daycare</Text>
        <SelectInput
          value={daycareId}
          placeholder="Pilih daycare"
          onChange={(value) => {
            setLocalError('');
            onChangeDaycareId(value);
          }}
          disabled={loading}
          options={daycareOptions}
          title="Pilih Daycare"
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

      <Box flexDirection="row" gap="sm">
        <DrawerFormActions onCancel={onCancel} onSubmit={handleSubmit} loading={loading} />
      </Box>

      {localError ? <Text color="danger">{localError}</Text> : null}
      {error ? <Text color="danger">{error}</Text> : null}
    </Box>
  );
}
