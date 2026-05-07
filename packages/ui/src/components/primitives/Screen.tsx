import type { ReactNode } from 'react';
import { ScrollView, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TextHeading, TextMuted } from './Typography';

export function Screen({ 
  title, 
  subtitle, 
  children,
  contentContainerStyle,
  style,
}: { 
  title: string; 
  subtitle?: string; 
  children: ReactNode;
  contentContainerStyle?: ViewStyle;
  style?: ViewStyle;
}) {
  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: '#F8FAFC' }, style]} edges={['left', 'right', 'top']}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 120, gap: 16 }, 
          contentContainerStyle
        ]}>
        <View style={{ gap: 6, marginBottom: 8 }}>
          <TextHeading>{title}</TextHeading>
          {subtitle ? <TextMuted>{subtitle}</TextMuted> : null}
        </View>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
