import { ReactNode } from 'react';
import { Card } from 'react-native-paper';

import { Box, Text } from '../../theme/theme';

type SectionCardProps = {
  title: string;
  children: ReactNode;
};

export function SectionCard({ title, children }: SectionCardProps) {
  return (
    <Card mode="outlined">
      <Card.Content>
        <Box gap="sm">
          <Text variant="cardValue">{title}</Text>
          {children}
        </Box>
      </Card.Content>
    </Card>
  );
}
