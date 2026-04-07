import { ScrollView } from 'react-native';

import { Box, Text } from '../../../theme/theme';
import { RegisterForm } from './RegisterForm';

export function RegisterContainer() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#FFF8F4' }} contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Box gap="md">
        <Text style={{ fontSize: 28, fontWeight: '700' }}>Daftar</Text>
        <RegisterForm />
      </Box>
    </ScrollView>
  );
}
