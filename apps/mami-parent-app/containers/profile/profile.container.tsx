import { useRouter } from 'expo-router';
import { Button, Screen, TextMuted } from '@mami/ui';
import { View } from 'react-native';

import { useSession } from '../../providers/session-provider';

export function ProfileContainer() {
  const router = useRouter();
  const { user, signOut } = useSession();

  return (
    <Screen title="Profile" subtitle="Profile parent berada di tab, edit profile keluar dari tab shell.">
      <View style={{ gap: 12 }}>
        <TextMuted>Nama: {user?.name ?? '-'}</TextMuted>
        <TextMuted>Email: {user?.email ?? '-'}</TextMuted>
        <TextMuted>Role: {user?.role ?? '-'}</TextMuted>
      </View>
      <View style={{ gap: 12 }}>
        <Button label="Update Profile" onPress={() => router.push('/(app)/profile-update')} />
        <Button label="Logout" variant="secondary" onPress={signOut} />
      </View>
    </Screen>
  );
}
