import { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';

import { Box } from '../../theme/theme';

type ScreenContainerProps = {
  children: ReactNode;
  floatingAction?: ReactNode;
};

export function ScreenContainer({ children, floatingAction }: ScreenContainerProps) {
  return (
    <View style={{ flex: 1, backgroundColor: '#F7F9FC' }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}>
        <Box flex={1} backgroundColor="background" gap="lg">
          {children}
        </Box>
      </ScrollView>
      {floatingAction ? <View style={{ position: 'absolute', right: 24, bottom: 32 }}>{floatingAction}</View> : null}
    </View>
  );
}
