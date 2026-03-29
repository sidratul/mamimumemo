import { Pressable } from 'react-native';

import { Box, Text } from '../../theme/theme';

type ModuleCardProps = {
  title: string;
  description: string;
  onPress: () => void;
};

export function ModuleCard({ title, description, onPress }: ModuleCardProps) {
  return (
    <Pressable onPress={onPress}>
      <Box backgroundColor="surface" borderWidth={1} borderColor="border" borderRadius="lg" padding="lg" gap="xs">
        <Text variant="cardValue">{title}</Text>
        <Text color="textSecondary">{description}</Text>
      </Box>
    </Pressable>
  );
}
