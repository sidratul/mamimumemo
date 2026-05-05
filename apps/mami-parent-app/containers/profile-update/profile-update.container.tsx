import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Screen } from '@mami/ui';

import { useSession } from '../../providers/session-provider';
import { ProfileUpdateForm } from './profile-update.form';
import type { ProfileUpdateValues } from './profile-update.schema';

export function ProfileUpdateContainer() {
  const router = useRouter();
  const { user, updateProfile } = useSession();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(values: ProfileUpdateValues) {
    try {
      setLoading(true);
      updateProfile(values);
      router.back();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen title="Update Profile" subtitle="Detail page parent di luar tab, tetap memakai dynamic form shared.">
      <ProfileUpdateForm
        data={{
          name: user?.name ?? '',
          email: user?.email ?? '',
        }}
        loading={loading}
        onSubmit={handleSubmit}
      />
    </Screen>
  );
}
