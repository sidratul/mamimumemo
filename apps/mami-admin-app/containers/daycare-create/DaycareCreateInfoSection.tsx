import { Button } from 'react-native-paper';
import { ScreenSection } from '@mami/ui';
import { Image } from 'expo-image';

import { TextAreaField, TextField } from '../../components/input';
import { Text } from '../../theme/theme';

type DaycareCreateInfoSectionProps = {
  daycareName: string;
  logoUrl: string;
  uploadingLogo: boolean;
  city: string;
  address: string;
  description: string;
  error?: string;
  loading: boolean;
  onChangeDaycareName: (value: string) => void;
  onPickLogo: () => void;
  onChangeCity: (value: string) => void;
  onChangeAddress: (value: string) => void;
  onChangeDescription: (value: string) => void;
  onSubmit: () => void;
};

export function DaycareCreateInfoSection({
  daycareName,
  logoUrl,
  uploadingLogo,
  city,
  address,
  description,
  error,
  loading,
  onChangeDaycareName,
  onPickLogo,
  onChangeCity,
  onChangeAddress,
  onChangeDescription,
  onSubmit,
}: DaycareCreateInfoSectionProps) {
  return (
    <ScreenSection>
      <Text style={{ fontSize: 18, fontWeight: '700', color: '#24324B' }}>Data Daycare</Text>
      <TextField value={daycareName} placeholder="Nama daycare" onChange={onChangeDaycareName} />
      {logoUrl ? (
        <Image source={{ uri: logoUrl }} style={{ width: 72, height: 72, borderRadius: 12 }} contentFit="cover" />
      ) : null}
      <Button mode="outlined" loading={uploadingLogo} disabled={uploadingLogo} onPress={onPickLogo}>
        {logoUrl ? 'Ganti Logo' : 'Upload Logo'}
      </Button>
      <TextField value={city} placeholder="Kota" onChange={onChangeCity} />
      <TextField value={address} placeholder="Alamat lengkap" onChange={onChangeAddress} />
      <TextAreaField value={description} placeholder="Deskripsi daycare" onChange={onChangeDescription} />

      {error ? <Text color="danger">{error}</Text> : null}

      <Button mode="contained" onPress={onSubmit} loading={loading} disabled={loading}>
        Daftarkan Daycare
      </Button>
    </ScreenSection>
  );
}
