import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';

import { Box, Text, useAppTheme } from '../../theme/theme';
import { ModulesListSection } from './ModulesListSection';

export function ModulesHomeContainer() {
  const theme = useAppTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Box gap="lg" paddingTop="md" paddingBottom="sm">
          <Box paddingHorizontal="lg" gap="xs">
            <Text variant="title" fontSize={24}>Modul Sistem</Text>
            <Text variant="subtitle">Kumpulan alat bantu untuk pengelolaan internal sistem.</Text>
          </Box>
        </Box>

        <Box paddingHorizontal="lg" gap="xl">
          <ModulesListSection />
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
