import { useEffect, useState } from 'react';
import { Alert, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ActivityIndicator } from 'react-native-paper';

import { ScreenContainer } from '../../components/common/ScreenContainer';
import { PasswordField, RoleSelect, TextField } from '../../components/input';
import {
  deleteUser,
  getUserById,
  getUserRoleLabel,
  updateUser,
  updateUserPassword,
  type AdminUser,
  type UserRole,
} from '../../services/users';
import { Box, Text } from '../../theme/theme';

type UserDetailContainerProps = {
  id: string;
};

export function UserDetailContainer({ id }: UserDetailContainerProps) {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('PARENT');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    async function run() {
      try {
        setLoading(true);
        setError('');
        const data = await getUserById(id);
        setUser(data);
        setName(data.name);
        setEmail(data.email);
        setPhone(data.phone);
        setRole(data.role);
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : 'Gagal mengambil detail user.');
      } finally {
        setLoading(false);
      }
    }

    void run();
  }, [id]);

  async function handleSaveProfile() {
    try {
      setSavingProfile(true);
      setSubmitError('');
      await updateUser(id, {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role,
      });
      const refreshed = await getUserById(id);
      setUser(refreshed);
    } catch (nextError) {
      setSubmitError(nextError instanceof Error ? nextError.message : 'Gagal memperbarui user.');
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleResetPassword() {
    try {
      setSavingPassword(true);
      setPasswordError('');
      await updateUserPassword(id, { newPassword });
      setNewPassword('');
    } catch (nextError) {
      setPasswordError(nextError instanceof Error ? nextError.message : 'Gagal memperbarui password.');
    } finally {
      setSavingPassword(false);
    }
  }

  async function handleDelete() {
    try {
      setDeleting(true);
      await deleteUser(id);
      router.replace('/(app)/(tabs)/users' as never);
    } catch (nextError) {
      setSubmitError(nextError instanceof Error ? nextError.message : 'Gagal menghapus user.');
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <ScreenContainer>
        <Box backgroundColor="surface" borderColor="border" borderWidth={1} borderRadius="lg" padding="xl" gap="sm" alignItems="center">
          <ActivityIndicator color="#E23A8A" />
          <Text color="textSecondary">Memuat detail user...</Text>
        </Box>
      </ScreenContainer>
    );
  }

  if (!user || error) {
    return (
      <ScreenContainer>
        <Box backgroundColor="surface" borderColor="border" borderWidth={1} borderRadius="lg" padding="xl" gap="sm">
          <Text color="danger" style={{ fontWeight: '700' }}>Detail user tidak tersedia</Text>
          <Text color="textSecondary">{error || 'User tidak ditemukan.'}</Text>
        </Box>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Pressable onPress={() => router.back()}>
        <Box flexDirection="row" alignItems="center" gap="sm">
          <MaterialIcons name="arrow-back" size={20} color="#8A4C73" />
          <Text color="textSecondary" style={{ fontWeight: '700' }}>Kembali</Text>
        </Box>
      </Pressable>

      <Box
        backgroundColor="surface"
        borderRadius="lg"
        borderWidth={1}
        borderColor="border"
        padding="lg"
        gap="md"
        style={{ shadowColor: '#E8B8D2', shadowOpacity: 0.12, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 2 }}>
        <Box gap="xs">
          <Text variant="title">{user.name}</Text>
          <Text variant="subtitle">{getUserRoleLabel(user.role)}</Text>
        </Box>
        <Box flexDirection="row" justifyContent="space-between" gap="md">
          <Box flex={1} gap="xs">
            <Text color="textSecondary">Email</Text>
            <Text numberOfLines={1}>{user.email}</Text>
          </Box>
          <Box flex={1} gap="xs">
            <Text color="textSecondary">Phone</Text>
            <Text numberOfLines={1}>{user.phone || '-'}</Text>
          </Box>
        </Box>
      </Box>

      <Box backgroundColor="surface" borderRadius="lg" borderWidth={1} borderColor="border" padding="lg" gap="md">
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#3A1130' }}>Profil User</Text>
        <TextField value={name} placeholder="Nama lengkap" onChange={setName} />
        <TextField value={email} placeholder="Email" onChange={setEmail} keyboardType="email-address" />
        <TextField value={phone} placeholder="Nomor telepon" onChange={setPhone} keyboardType="phone-pad" />
        <RoleSelect value={role} onChange={(value) => setRole(value as UserRole)} />
        {submitError ? <Text color="danger">{submitError}</Text> : null}
        <Pressable disabled={savingProfile} onPress={() => void handleSaveProfile()}>
          <Box backgroundColor="primary" padding="lg" borderRadius="md" alignItems="center">
            {savingProfile ? <ActivityIndicator color="#FFFFFF" /> : <Text variant="buttonLabel">Simpan Perubahan</Text>}
          </Box>
        </Pressable>
      </Box>

      <Box backgroundColor="surface" borderRadius="lg" borderWidth={1} borderColor="border" padding="lg" gap="md">
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#3A1130' }}>Reset Password</Text>
        <PasswordField value={newPassword} placeholder="Password baru" onChange={setNewPassword} />
        {passwordError ? <Text color="danger">{passwordError}</Text> : null}
        <Pressable disabled={savingPassword} onPress={() => void handleResetPassword()}>
          <Box borderColor="primary" borderWidth={1} backgroundColor="surface" padding="lg" borderRadius="md" alignItems="center">
            {savingPassword ? <ActivityIndicator color="#E23A8A" /> : <Text color="primary" style={{ fontWeight: '700' }}>Update Password</Text>}
          </Box>
        </Pressable>
      </Box>

      <Box backgroundColor="surface" borderRadius="lg" borderWidth={1} borderColor="border" padding="lg" gap="sm">
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#3A1130' }}>Danger Zone</Text>
        <Text color="textSecondary">Hapus user secara permanen dari sistem.</Text>
        <Pressable
          disabled={deleting}
          onPress={() => {
            Alert.alert('Hapus User', `Yakin ingin menghapus ${user.name}?`, [
              { text: 'Batal', style: 'cancel' },
              { text: 'Hapus', style: 'destructive', onPress: () => void handleDelete() },
            ]);
          }}>
          <Box backgroundColor="danger" padding="lg" borderRadius="md" alignItems="center">
            {deleting ? <ActivityIndicator color="#FFFFFF" /> : <Text variant="buttonLabel">Hapus User</Text>}
          </Box>
        </Pressable>
      </Box>
    </ScreenContainer>
  );
}
