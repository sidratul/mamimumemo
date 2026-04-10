import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ScreenHeader, ScreenSection } from '@mami/ui';

import { ScreenContainer } from '../../components/common/ScreenContainer';
import { registerDaycare } from '../../services/daycare-admin';
import { pickAndUploadDaycareLogo } from '../../services/uploads';
import { Text } from '../../theme/theme';
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
      setError(nextError instanceof Error ? nextError.message : 'Gagal mendaftarkan daycare.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer>
      <ScreenHeader title="Register Daycare" subtitle="Daftarkan owner dan daycare baru dalam satu proses." onBack={() => router.back()} />

      <ScreenSection gap={8}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#24324B' }}>Ringkasan</Text>
        <Text variant="subtitle">Daycare baru akan langsung masuk antrean review setelah berhasil didaftarkan.</Text>
      </ScreenSection>

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
    </ScreenContainer>
  );
}
