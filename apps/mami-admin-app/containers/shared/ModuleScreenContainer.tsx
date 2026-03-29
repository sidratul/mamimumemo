import { ScrollView } from 'react-native';

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
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <Box flex={1} backgroundColor="background" padding="xl" gap="lg" paddingTop="xxl">
        <Box gap="xs">
          <Text variant="title">{title}</Text>
          <Text variant="subtitle">{description}</Text>
        </Box>

        <Box backgroundColor="surface" borderWidth={1} borderColor="border" borderRadius="lg" padding="lg" gap="sm">
          <Text variant="cardValue">Screen Scope</Text>
          {keyScreens.map((screen) => (
            <Text key={screen}>• {screen}</Text>
          ))}
        </Box>

        <Box backgroundColor="surface" borderWidth={1} borderColor="border" borderRadius="lg" padding="lg" gap="sm">
          <Text variant="cardValue">Actions</Text>
          {keyActions.map((action) => (
            <Text key={action}>• {action}</Text>
          ))}
        </Box>
      </Box>
    </ScrollView>
  );
}
