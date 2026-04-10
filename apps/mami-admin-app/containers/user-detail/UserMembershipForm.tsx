import { useState } from 'react';
import { DrawerFormActions, SelectInput, type SelectOption } from '@mami/ui';

import { TextAreaField } from '../../components/input';
import { Box, Text } from '../../theme/theme';
import { type DaycareMembershipPersona } from '../../services/daycare-memberships/store';

type UserMembershipFormProps = {
  loading: boolean;
  error?: string;
  daycareId: string;
  persona: DaycareMembershipPersona;
  notes: string;
  daycareOptions: SelectOption[];
  onCancel: () => void;
  onChangeDaycareId: (value: string) => void;
  onChangePersona: (value: DaycareMembershipPersona) => void;
  onChangeNotes: (value: string) => void;
  onSubmit: () => void;
};

const personaOptions: SelectOption[] = [
  { label: 'Owner', value: 'OWNER' },
  { label: 'Admin Daycare', value: 'ADMIN' },
  { label: 'Karyawan Daycare', value: 'SITTER' },
];

export function UserMembershipForm({
  loading,
  error,
  daycareId,
  persona,
  notes,
  daycareOptions,
  onCancel,
  onChangeDaycareId,
  onChangePersona,
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

      <Box flexDirection="row" gap="sm">
        <DrawerFormActions onCancel={onCancel} onSubmit={handleSubmit} loading={loading} />
      </Box>

      {localError ? <Text color="danger">{localError}</Text> : null}
      {error ? <Text color="danger">{error}</Text> : null}
    </Box>
  );
}
