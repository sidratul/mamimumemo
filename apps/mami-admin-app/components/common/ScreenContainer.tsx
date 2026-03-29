import { ReactNode } from 'react';
import { ScrollView } from 'react-native';

import { Box } from '../../theme/theme';

type ScreenContainerProps = {
  children: ReactNode;
};

export function ScreenContainer({ children }: ScreenContainerProps) {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <Box flex={1} backgroundColor="background" padding="xl" paddingTop="xxl" gap="lg">
        {children}
      </Box>
    </ScrollView>
  );
}
