import { useRouter } from 'expo-router';
import { ScreenHeader } from '@mami/ui';
import { SafeAreaView } from 'react-native-safe-area-context';

import { moduleDefinitions } from '../../constants/modules';
import { Box } from '../../theme/theme';
import { ModuleCard } from '../../components/common/ModuleCard';
import { ScreenContainer } from '../../components/common/ScreenContainer';

export function ModulesHomeContainer() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      <ScreenContainer>
        <ScreenHeader title="Modules" subtitle="Container utama untuk kebutuhan system admin." />

        <Box gap="md" paddingHorizontal="lg">
          {moduleDefinitions.map((moduleDef) => (
            <ModuleCard
              key={moduleDef.slug}
              title={moduleDef.title}
              description={moduleDef.description}
              onPress={() => router.push(moduleDef.route as never)}
            />
          ))}
        </Box>
      </ScreenContainer>
    </SafeAreaView>
  );
}
