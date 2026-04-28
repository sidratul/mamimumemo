import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native';

import { AppPageHeader } from '../../components/common/AppPageHeader';
import { registerDaycare } from '../../services/daycare-admin';
import { pickAndUploadDaycareLogo } from '../../services/uploads';
import { Box } from '../../theme/theme';
import { DaycareCreateInfoSection } from './DaycareCreateInfoSection';
import { DaycareCreateOwnerSection } from './DaycareCreateOwnerSection';

export function DaycareCreateContainer() {
  const router = useRouter();
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [daycareName, setDaycareName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    try {
      setLoading(true);
      setError('');
      await registerDaycare({
        owner: {
          name: ownerName.trim(),
          email: ownerEmail.trim(),
          password: ownerPassword,
          phone: ownerPhone.trim(),
        },
        daycare: {
          name: daycareName.trim(),
          logoUrl: logoUrl.trim(),
          description: description.trim(),
          address: address.trim(),
          city: city.trim(),
        },
      });
      router.replace('/(app)/(tabs)/daycares');
    } catch (nextError) {
      console.error('[UI:DaycareCreate] submit failed', nextError);
      setError(nextError instanceof Error ? nextError.message : 'Gagal mendaftarkan daycare.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box flex={1} style={{ backgroundColor: '#F7F9FC' }}>
      <AppPageHeader title="Buat Daycare" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32, gap: 16 }}>
        <DaycareCreateOwnerSection
          ownerName={ownerName}
          ownerEmail={ownerEmail}
          ownerPhone={ownerPhone}
          ownerPassword={ownerPassword}
          onChangeOwnerName={setOwnerName}
          onChangeOwnerEmail={setOwnerEmail}
          onChangeOwnerPhone={setOwnerPhone}
          onChangeOwnerPassword={setOwnerPassword}
        />

        <DaycareCreateInfoSection
          daycareName={daycareName}
          logoUrl={logoUrl}
          uploadingLogo={uploadingLogo}
          city={city}
          address={address}
          description={description}
          error={error}
          loading={loading}
          onChangeDaycareName={setDaycareName}
          onPickLogo={() => {
            void (async () => {
              try {
                setUploadingLogo(true);
                const uploaded = await pickAndUploadDaycareLogo();
                if (uploaded?.url) {
                  setLogoUrl(uploaded.url);
                }
              } finally {
                setUploadingLogo(false);
              }
            })();
          }}
          onChangeCity={setCity}
          onChangeAddress={setAddress}
          onChangeDescription={setDescription}
          onSubmit={() => void handleSubmit()}
        />
      </ScrollView>
    </Box>
  );
}
