import { type ReactNode } from 'react';
import { View } from 'react-native';

import { Box, Text } from '../../theme/theme';

type DaycareDetailSectionProps = {
  title: string;
  action?: ReactNode;
  children: ReactNode;
};

export function DaycareDetailSection({ title, action, children }: DaycareDetailSectionProps) {
  return (
    <View style={{ gap: 14 }}>
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        gap="md"
        style={{ paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#F1D6E4' }}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#24324B' }}>{title}</Text>
        {action}
      </Box>
      {children}
    </View>
  );
}
