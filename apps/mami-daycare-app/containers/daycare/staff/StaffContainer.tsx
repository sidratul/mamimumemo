import { useCallback, useEffect, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  BottomDrawer,
  Button,
  DrawerFormActions,
  PasswordField,
  Screen,
  SelectInput,
  TextAreaField,
  TextField,
} from '@mami/ui';
import { SegmentedButtons } from 'react-native-paper';

import { useSession } from '../../../providers/session-provider';
import {
  addExistingStaffByEmail,
  createStaffUser,
  deactivateStaffMembership,
  getStaffMemberships,
  type StaffAccess,
  type StaffMembership,
} from '../../../services/operations/staff';
import { Box, Text } from '../../../theme/theme';

const accessOptions = [
  { label: 'Admin Daycare', value: 'ADMIN' },
  { label: 'Sitter', value: 'SITTER' },
];

export function StaffContainer() {
  const { session } = useSession();
  const [memberships, setMemberships] = useState<StaffMembership[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [mode, setMode] = useState<'new' | 'existing'>('new');
  const [access, setAccess] = useState<StaffAccess>('SITTER');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [notes, setNotes] = useState('');

  const loadMemberships = useCallback(async () => {
    if (!session?.token || !session.daycareId) {
      return;
    }
    try {
      setLoading(true);
      setError('');
      setMemberships(await getStaffMemberships(session.token, session.daycareId));
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Gagal mengambil data staff.');
    } finally {
      setLoading(false);
    }
  }, [session?.daycareId, session?.token]);

  useEffect(() => {
    void loadMemberships();
  }, [loadMemberships]);

  function openForm() {
    setMode('new');
    setAccess('SITTER');
    setName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setNotes('');
    setFormError('');
    setDrawerVisible(true);
  }

  async function handleSubmit() {
    if (!session?.token || !session.daycareId) {
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setFormError('Email wajib diisi.');
      return;
    }
    if (mode === 'new' && (!name.trim() || password.length < 6)) {
      setFormError('Nama wajib diisi dan password minimal 6 karakter.');
      return;
    }

    try {
      setFormLoading(true);
      setFormError('');
      if (mode === 'new') {
        await createStaffUser(session.token, {
          daycareId: session.daycareId,
          access,
          name: name.trim(),
          email: normalizedEmail,
          password,
          phone: phone.trim() || undefined,
          notes: notes.trim() || undefined,
        });
      } else {
        await addExistingStaffByEmail(session.token, {
          daycareId: session.daycareId,
          access,
          email: normalizedEmail,
          notes: notes.trim() || undefined,
        });
      }
      await loadMemberships();
      setDrawerVisible(false);
    } catch (nextError) {
      setFormError(nextError instanceof Error ? nextError.message : 'Gagal menambahkan staff.');
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDeactivate(id: string) {
    if (!session?.token) {
      return;
    }
    try {
      await deactivateStaffMembership(session.token, id);
      await loadMemberships();
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Gagal menonaktifkan staff.');
    }
  }

  return (
    <Screen title="Staff & Pengasuh" subtitle="Kelola admin dan sitter daycare Anda.">
      <Box flexDirection="row" justifyContent="flex-end">
        <Button
          label="Tambah Staff"
          onPress={openForm}
          icon={<MaterialCommunityIcons name="account-plus-outline" size={18} color="#FFFFFF" />}
        />
      </Box>

      {error ? <Text color="danger">{error}</Text> : null}
      {loading ? <Text color="textSecondary">Memuat staff...</Text> : null}

      {!loading && memberships.length === 0 ? (
        <Box padding="xl" alignItems="center">
          <Text color="textSecondary">Belum ada admin atau sitter tambahan.</Text>
        </Box>
      ) : (
        <Box gap="md">
          {memberships.map((membership) => (
            <Box
              key={membership._id}
              padding="md"
              gap="sm"
              backgroundColor="surface"
              borderWidth={1}
              borderColor="border"
              borderRadius="md"
            >
              <Box flexDirection="row" justifyContent="space-between" alignItems="center">
                <Box flex={1} gap="xxs">
                  <Text fontWeight="800">{membership.user.name}</Text>
                  <Text variant="bodySmall" color="textSecondary">{membership.user.email}</Text>
                </Box>
                <Text variant="bodySmall" fontWeight="800" color="primary">
                  {membership.access === 'ADMIN' ? 'ADMIN' : 'SITTER'}
                </Text>
              </Box>
              <Button
                label="Nonaktifkan"
                variant="secondary"
                onPress={() => void handleDeactivate(membership._id)}
              />
            </Box>
          ))}
        </Box>
      )}

      <BottomDrawer visible={drawerVisible} onDismiss={() => setDrawerVisible(false)}>
        <Text style={{ fontSize: 18, fontWeight: '800', marginBottom: 16 }}>Tambah Staff</Text>
        <Box gap="md">
          <SegmentedButtons
            value={mode}
            onValueChange={(value) => {
              setMode(value as 'new' | 'existing');
              setFormError('');
            }}
            buttons={[
              { value: 'new', label: 'User Baru' },
              { value: 'existing', label: 'User Existing' },
            ]}
          />

          {mode === 'new' ? (
            <>
              <TextField value={name} onChange={setName} placeholder="Nama lengkap" />
              <TextField
                value={email}
                onChange={setEmail}
                placeholder="Email"
                keyboardType="email-address"
              />
              <TextField value={phone} onChange={setPhone} placeholder="Nomor telepon (opsional)" />
              <PasswordField value={password} onChange={setPassword} placeholder="Password sementara" />
            </>
          ) : (
            <TextField
              value={email}
              onChange={setEmail}
              placeholder="Email user existing"
              keyboardType="email-address"
            />
          )}

          <SelectInput
            value={access}
            onChange={(value) => setAccess(value as StaffAccess)}
            options={accessOptions}
            title="Pilih Akses"
            placeholder="Pilih akses"
          />
          <TextAreaField value={notes} onChange={setNotes} placeholder="Catatan (opsional)" />

          {formError ? <Text color="danger">{formError}</Text> : null}
          <DrawerFormActions
            submitLabel="Tambahkan Staff"
            onCancel={() => setDrawerVisible(false)}
            onSubmit={() => void handleSubmit()}
            loading={formLoading}
          />
        </Box>
      </BottomDrawer>
    </Screen>
  );
}
