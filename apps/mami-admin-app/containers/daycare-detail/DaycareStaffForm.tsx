import { useState } from 'react';
import { SegmentedButtons } from 'react-native-paper';
import { DrawerFormActions, SelectInput, type SelectOption } from '@mami/ui';

import { PasswordField, TextAreaField, TextField } from '../../components/input';
import { type DaycareMembershipAccess } from '../../services/membership';
import { Box, Text } from '../../theme/theme';

type StaffAccess = Exclude<DaycareMembershipAccess, 'OWNER'>;

export type DaycareStaffFormValue = {
  access: StaffAccess;
  notes?: string;
} & (
  | { mode: 'existing'; userId: string }
  | {
      mode: 'new';
      userData: {
        name: string;
        email: string;
        password: string;
        phone?: string;
      };
    }
);

type DaycareStaffFormProps = {
  loading: boolean;
  error?: string;
  userOptions: SelectOption[];
  onCancel: () => void;
  onSubmit: (value: DaycareStaffFormValue) => void;
};

const accessOptions: SelectOption[] = [
  { label: 'Admin Daycare', value: 'ADMIN' },
  { label: 'Sitter', value: 'SITTER' },
];

export function DaycareStaffForm({
  loading,
  error,
  userOptions,
  onCancel,
  onSubmit,
}: DaycareStaffFormProps) {
  const [mode, setMode] = useState<'new' | 'existing'>('new');
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [access, setAccess] = useState<StaffAccess>('SITTER');
  const [notes, setNotes] = useState('');
  const [localError, setLocalError] = useState('');

  function handleSubmit() {
    if (mode === 'existing') {
      if (!userId) {
        setLocalError('Pilih user terlebih dahulu.');
        return;
      }
      onSubmit({
        mode,
        userId,
        access,
        notes: notes.trim() || undefined,
      });
      return;
    }

    if (!name.trim() || !email.trim() || !password) {
      setLocalError('Nama, email, dan password wajib diisi.');
      return;
    }
    if (password.length < 6) {
      setLocalError('Password minimal 6 karakter.');
      return;
    }

    onSubmit({
      mode,
      access,
      notes: notes.trim() || undefined,
      userData: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        phone: phone.trim() || undefined,
      },
    });
  }

  return (
    <Box gap="md">
      <SegmentedButtons
        value={mode}
        onValueChange={(value) => {
          setMode(value as 'new' | 'existing');
          setLocalError('');
        }}
        buttons={[
          { value: 'new', label: 'User Baru' },
          { value: 'existing', label: 'User Existing' },
        ]}
      />

      {mode === 'existing' ? (
        <Box gap="xs">
          <Text variant="bodySmall" fontWeight="700">User</Text>
          <SelectInput
            value={userId}
            placeholder="Pilih user"
            onChange={setUserId}
            disabled={loading}
            options={userOptions}
            title="Pilih User"
          />
        </Box>
      ) : (
        <Box gap="sm">
          <TextField value={name} placeholder="Nama lengkap" onChange={setName} disabled={loading} />
          <TextField
            value={email}
            placeholder="Email"
            onChange={setEmail}
            keyboardType="email-address"
            disabled={loading}
          />
          <TextField value={phone} placeholder="Nomor telepon (opsional)" onChange={setPhone} disabled={loading} />
          <PasswordField value={password} placeholder="Password sementara" onChange={setPassword} disabled={loading} />
        </Box>
      )}

      <Box gap="xs">
        <Text variant="bodySmall" fontWeight="700">Akses</Text>
        <SelectInput
          value={access}
          placeholder="Pilih akses"
          onChange={(value) => setAccess(value as StaffAccess)}
          disabled={loading}
          options={accessOptions}
          title="Pilih Akses"
        />
      </Box>

      <TextAreaField
        value={notes}
        placeholder="Catatan tambahan (opsional)"
        onChange={setNotes}
        disabled={loading}
        useBottomSheetInput
      />

      {localError || error ? (
        <Text color="danger" variant="bodySmall">{localError || error}</Text>
      ) : null}

      <DrawerFormActions
        submitLabel="Tambahkan Staff"
        onCancel={onCancel}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </Box>
  );
}
