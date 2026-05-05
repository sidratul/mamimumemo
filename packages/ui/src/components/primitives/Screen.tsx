import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { brandColors } from '../../theme/brand';
import { TextHeading, TextMuted } from './Typography';

export function Screen({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32, gap: 16 }}>
        <View style={{ gap: 6 }}>
          <TextHeading>{title}</TextHeading>
          {subtitle ? <TextMuted>{subtitle}</TextMuted> : null}
        </View>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
