import { type ReactNode } from 'react';

import { Box, Text } from '../../theme/theme';

type DetailSectionProps = {
  title: string;
  action?: ReactNode;
  children: ReactNode;
};

export function DetailSection({ title, action, children }: DetailSectionProps) {
  return (
    <Box gap="md" marginBottom="sm">
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        gap="md"
        paddingBottom="sm"
        borderBottomWidth={1}
        borderBottomColor="border">
        <Text style={{ fontSize: 16, fontWeight: '800', color: '#0F172A', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {title}
        </Text>
        {action}
      </Box>
      <Box paddingHorizontal="xs">
        {children}
      </Box>
    </Box>
  );
}
