import { ReactNode } from 'react';

import { Box, Text } from '../../theme/theme';

type SectionCardProps = {
  title: string;
  children: ReactNode;
};

export function SectionCard({ title, children }: SectionCardProps) {
  return (
    <Box backgroundColor="surface" borderRadius="lg" borderWidth={1} borderColor="border" padding="lg" gap="sm">
      <Text variant="cardValue">{title}</Text>
      {children}
    </Box>
  );
}
