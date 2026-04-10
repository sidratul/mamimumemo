import { type ReactNode } from 'react';
import { Surface } from 'react-native-paper';

import { Box, Text } from '../../theme/theme';

type DaycareDetailSectionProps = {
  title: string;
  action?: ReactNode;
  children: ReactNode;
};

export function DaycareDetailSection({ title, action, children }: DaycareDetailSectionProps) {
  return (
    <Surface
      style={{
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E8ECF4',
        backgroundColor: '#FFFFFF',
        padding: 14,
        gap: 12,
      }}>
      <Box flexDirection="row" alignItems="center" justifyContent="space-between" gap="md">
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#24324B' }}>{title}</Text>
        {action}
      </Box>
      {children}
    </Surface>
  );
}
