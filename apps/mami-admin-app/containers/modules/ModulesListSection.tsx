import { useRouter } from 'expo-router';

import { ModuleCard } from '../../components/common/ModuleCard';
import { moduleDefinitions } from '../../constants/modules';
import { Box } from '../../theme/theme';

export function ModulesListSection() {
  const router = useRouter();

  return (
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
  );
}
