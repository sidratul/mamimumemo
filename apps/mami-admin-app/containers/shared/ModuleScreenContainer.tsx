import { ScrollView } from 'react-native';
import { ScreenHeader } from '@mami/ui';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Box, Text } from '../../theme/theme';

type ModuleScreenContainerProps = {
  title: string;
  description: string;
  keyScreens: string[];
  keyActions: string[];
};

export function ModuleScreenContainer({
  title,
  description,
  keyScreens,
  keyActions,
}: ModuleScreenContainerProps) {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 48 }} showsVerticalScrollIndicator={false}>
        <Box flex={1} backgroundColor="background" gap="lg" paddingTop="md">
          <ScreenHeader title={title} subtitle={description} />

          <Box backgroundColor="surface" borderWidth={1} borderColor="border" borderRadius="md" padding="lg" gap="sm" marginHorizontal="lg">
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#24324B' }}>Screen Scope</Text>
            {keyScreens.map((screen) => (
              <Text key={screen}>• {screen}</Text>
            ))}
          </Box>

          <Box backgroundColor="surface" borderWidth={1} borderColor="border" borderRadius="md" padding="lg" gap="sm" marginHorizontal="lg">
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#24324B' }}>Actions</Text>
            {keyActions.map((action) => (
              <Text key={action}>• {action}</Text>
            ))}
          </Box>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
