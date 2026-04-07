import { useState } from 'react';
import { Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ActivityIndicator } from 'react-native-paper';

import { ScreenContainer } from '../../components/common/ScreenContainer';
import { PasswordField, RoleSelect, TextField } from '../../components/input';
import { createUser, type UserRole } from '../../services/users';
import { Box, Text } from '../../theme/theme';

export function UserCreateContainer() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('DAYCARE_OWNER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    try {
      setLoading(true);
      setError('');
      const result = await createUser({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
        role,
      });
      router.replace({ pathname: '/(app)/users/[id]', params: { id: result.id } } as never);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Gagal membuat user.');
    } finally {
      setLoading(false);
    }
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
        gap="sm"
        style={{ shadowColor: '#E8B8D2', shadowOpacity: 0.12, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 2 }}>
        <Text variant="title">Tambah User</Text>
        <Text variant="subtitle">Buat akun baru untuk sistem admin dan operasional daycare.</Text>
      </Box>

      <Box backgroundColor="surface" borderRadius="lg" borderWidth={1} borderColor="border" padding="lg" gap="md">
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#3A1130' }}>Informasi Akun</Text>
        <TextField value={name} placeholder="Nama lengkap" onChange={setName} />
        <TextField value={email} placeholder="Email" onChange={setEmail} keyboardType="email-address" />
        <TextField value={phone} placeholder="Nomor telepon" onChange={setPhone} keyboardType="phone-pad" />
        <RoleSelect value={role} onChange={(value) => setRole(value as UserRole)} />
        <PasswordField value={password} placeholder="Password" onChange={setPassword} />

        {error ? <Text color="danger">{error}</Text> : null}

        <Pressable disabled={loading} onPress={() => void handleSubmit()}>
          <Box backgroundColor="primary" padding="lg" borderRadius="md" alignItems="center">
            {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text variant="buttonLabel">Simpan User</Text>}
          </Box>
        </Pressable>
      </Box>
    </ScreenContainer>
  );
}
