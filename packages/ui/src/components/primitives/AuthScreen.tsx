import type { ReactNode } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, View, type ImageSourcePropType } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type AuthScreenProps = {
  heroTitle: string;
  heroSubtitle?: string;
  heroLogoSource?: ImageSourcePropType;
  cardTitle: string;
  cardSubtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthScreen({
  heroTitle,
  heroSubtitle,
  heroLogoSource,
  cardTitle,
  cardSubtitle,
  children,
  footer,
}: AuthScreenProps) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAFC' }} edges={['left', 'right', 'bottom', 'top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 12 : 0}>
        <ScrollView
          bounces={false}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ flex: 1, paddingHorizontal: 24, justifyContent: 'center', paddingVertical: 40 }}>
            <View style={{ alignItems: 'center', marginBottom: 48, gap: 12 }}>
              {heroLogoSource ? (
                <Image
                  source={heroLogoSource}
                  style={{ width: 180, height: 60, marginBottom: 8 }}
                  resizeMode="contain"
                />
              ) : (
                <View style={{ width: 64, height: 64, borderRadius: 16, backgroundColor: '#4F46E5', alignItems: 'center', justifyContent: 'center' }}>
                   <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#FFFFFF' }} />
                </View>
              )}
              <View style={{ alignItems: 'center', gap: 4 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#4F46E5' }} />
                  <Text style={{ fontSize: 28, fontWeight: '900', color: '#0F172A', letterSpacing: -1 }}>{heroTitle}</Text>
                </View>
                {heroSubtitle ? (
                  <Text style={{ fontSize: 15, color: '#64748B', textAlign: 'center', lineHeight: 22, maxWidth: 280 }}>
                    {heroSubtitle}
                  </Text>
                ) : null}
              </View>
            </View>

            <View
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 24,
                paddingHorizontal: 24,
                paddingVertical: 32,
                gap: 24,
                shadowColor: '#0F172A',
                shadowOpacity: 0.06,
                shadowRadius: 20,
                shadowOffset: { width: 0, height: 10 },
                elevation: 4,
                borderWidth: 1,
                borderColor: '#F1F5F9',
              }}>
              <View style={{ gap: 4 }}>
                <Text style={{ fontSize: 24, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5 }}>{cardTitle}</Text>
                {cardSubtitle ? (
                  <Text style={{ fontSize: 14, color: '#64748B' }}>{cardSubtitle}</Text>
                ) : null}
              </View>
              
              <View style={{ gap: 20 }}>
                {children}
              </View>

              {footer ? (
                <View style={{ paddingTop: 8, borderTopWidth: 1, borderTopColor: '#F1F5F9' }}>
                  {footer}
                </View>
              ) : null}
            </View>
            
            <View style={{ marginTop: 32, alignItems: 'center' }}>
               <Text style={{ fontSize: 13, color: '#94A3B8' }}>&copy; 2026 Mamimumemo Team</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Minimal placeholder for missing Typography imports if needed, 
// but let's assume standard Text for now for maximum compatibility since we removed them.
function Text({ style, children, ...props }: any) {
    const { Text: RNText } = require('react-native');
    return <RNText style={style} {...props}>{children}</RNText>;
}
