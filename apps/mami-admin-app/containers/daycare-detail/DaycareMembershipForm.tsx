import { useState } from 'react';
import { DrawerFormActions, SelectInput, type SelectOption } from '@mami/ui';

import { TextAreaField } from '../../components/input';
import { type DaycareMembershipPersona } from '../../services/daycare-memberships/store';
import { Box, Text } from '../../theme/theme';

type DaycareMembershipFormProps = {
  loading: boolean;
  error?: string;
  userId: string;
  persona: DaycareMembershipPersona;
  notes: string;
  userOptions: SelectOption[];
  onCancel: () => void;
  onChangeUserId: (value: string) => void;
  onChangePersona: (value: DaycareMembershipPersona) => void;
  onChangeNotes: (value: string) => void;
  onSubmit: () => void;
};

const personaOptions: SelectOption[] = [
  { label: 'Owner', value: 'OWNER' },
  { label: 'Admin Daycare', value: 'ADMIN' },
  { label: 'Karyawan Daycare', value: 'SITTER' },
];

export function DaycareMembershipForm({
  loading,
  error,
  userId,
  persona,
  notes,
  userOptions,
  onCancel,
  onChangeUserId,
  onChangePersona,
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
        <Text style={{ fontSize: 12, fontWeight: '700', color: '#24324B' }}>Persona</Text>
        <SelectInput
          value={persona}
          placeholder="Pilih persona"
          onChange={(value) => onChangePersona(value as DaycareMembershipPersona)}
          disabled={loading}
          options={personaOptions}
          title="Pilih Persona"
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
        />
      </Box>

      <DrawerFormActions onCancel={onCancel} onSubmit={handleSubmit} loading={loading} />

      {localError ? <Text color="danger">{localError}</Text> : null}
      {error ? <Text color="danger">{error}</Text> : null}
    </Box>
  );
}
