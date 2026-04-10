import { Card } from 'react-native-paper';

import { Box, Text } from '../../theme/theme';

type ModuleCardProps = {
  title: string;
  description: string;
  onPress: () => void;
};

export function ModuleCard({ title, description, onPress }: ModuleCardProps) {
  return (
    <Card mode="outlined" onPress={onPress} style={{ borderRadius: 14 }}>
      <Card.Content>
        <Box gap="xs">
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#24324B' }}>{title}</Text>
          <Text color="textSecondary">{description}</Text>
        </Box>
      </Card.Content>
    </Card>
  );
}
