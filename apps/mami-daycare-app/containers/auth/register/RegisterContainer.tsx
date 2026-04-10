import { ScrollView } from 'react-native';
import { ScreenHeader, ScreenSection } from '@mami/ui';

import { Box } from '../../../theme/theme';
import { RegisterForm } from './RegisterForm';

export function RegisterContainer() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#FFF8F4' }} contentContainerStyle={{ paddingBottom: 48, gap: 12 }}>
      <Box gap="md">
        <ScreenHeader title="Daftar" subtitle="Buat akun owner dan daycare dalam satu alur." />
        <ScreenSection>
        <RegisterForm />
        </ScreenSection>
      </Box>
    </ScrollView>
  );
}
