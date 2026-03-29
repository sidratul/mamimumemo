import { useRouter } from 'expo-router';

import { moduleDefinitions } from '../../constants/modules';
import { Box, Text } from '../../theme/theme';
import { ModuleCard } from '../../components/common/ModuleCard';
import { ScreenContainer } from '../../components/common/ScreenContainer';

export function ModulesHomeContainer() {
  const router = useRouter();

  return (
    <ScreenContainer>
      <Box gap="xs">
        <Text variant="title">Modules</Text>
        <Text variant="subtitle">Container utama untuk kebutuhan system admin.</Text>
      </Box>

      <Box gap="md">
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
  );
}
