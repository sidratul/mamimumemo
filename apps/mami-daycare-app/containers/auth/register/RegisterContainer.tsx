import { ScrollView } from 'react-native';

import { Box, Text } from '../../../theme/theme';
import { RegisterForm } from './RegisterForm';

export function RegisterContainer() {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#FFF8F4' }}
      contentContainerStyle={{ paddingBottom: 32 }}>
      <Box gap="sm">
        <Box paddingHorizontal="sm" paddingTop="md" gap="xs">
          <Text style={{ fontSize: 28, fontWeight: '700', color: '#24324B' }}>Daftar</Text>
          <Text color="textSecondary">Buat akun owner dan daycare dalam satu alur.</Text>
        </Box>
        <RegisterForm />
      </Box>
    </ScrollView>
  );
}
