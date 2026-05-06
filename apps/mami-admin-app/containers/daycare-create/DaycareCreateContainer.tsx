import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppPageHeader } from '../../components/common/AppPageHeader';
import { registerDaycare } from '../../services/daycare';
import { pickAndUploadDaycareLogo } from '../../services/uploads';
import { Box } from '../../theme/theme';
import { DaycareCreateFormData, DaycareCreateFormSection } from './DaycareCreateFormSection';

export function DaycareCreateContainer() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(values: DaycareCreateFormData) {
    try {
      setLoading(true);
      setError('');
      const res = await registerDaycare({
        owner: {
          name: values.ownerName.trim(),
          email: values.ownerEmail.trim(),
          password: values.ownerPassword,
          phone: values.ownerPhone.trim(),
        },
        daycare: {
          name: values.daycareName.trim(),
          logoUrl: values.logoUrl.trim(),
          description: values.description.trim(),
          address: values.address.trim(),
          city: values.city.trim(),
        },
      });
      if (res.errors) throw new Error(res.errors[0].message);
      router.replace('/(app)/(tabs)/daycares');
    } catch (nextError) {
      console.error('[UI:DaycareCreate] submit failed', nextError);
      setError(nextError instanceof Error ? nextError.message : 'Gagal mendaftarkan daycare.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAFC' }} edges={['left', 'right', 'bottom']}>
      <AppPageHeader
        title="Buat Daycare"
        onBack={() => router.back()}
        backgroundColor="#FFFFFF"
        borderBottomColor="#EEF2F7"
      />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 }}>
        <Box paddingBottom="lg" style={{ paddingBottom: Math.max(insets.bottom, 16) + 16 }}>
          <DaycareCreateFormSection
            uploadingLogo={uploadingLogo}
            error={error}
            loading={loading}
            onPickLogo={async () => {
              try {
                setUploadingLogo(true);
                const uploaded = await pickAndUploadDaycareLogo();
                return uploaded?.url ?? null;
              } finally {
                setUploadingLogo(false);
              }
            }}
            onSubmit={(values) => void handleSubmit(values)}
          />
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
