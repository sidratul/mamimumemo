import type { ReactNode } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, View, type ImageSourcePropType } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { brandColors } from '../../theme/brand';
import { TextBody, TextHeading, TextMuted, TextStrong } from './Typography';

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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['left', 'right', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 12 : 0}>
        <ScrollView
          bounces={false}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, backgroundColor: '#FFFFFF' }}>
          <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <View
              style={{
                minHeight: 250,
                paddingHorizontal: 24,
                paddingTop: 24,
                paddingBottom: 44,
                backgroundColor: brandColors.primary,
                overflow: 'hidden',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  position: 'absolute',
                  top: -24,
                  left: -28,
                  width: 110,
                  height: 110,
                  borderRadius: 55,
                  backgroundColor: 'rgba(255,255,255,0.12)',
                }}
              />
              <View
                style={{
                  position: 'absolute',
                  top: 14,
                  left: 12,
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: 'rgba(255,255,255,0.14)',
                }}
              />
              <View style={{ gap: 8, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 }}>
                {heroLogoSource ? (
                  <Image
                    source={heroLogoSource}
                    style={{ width: 320, height: 152, resizeMode: 'contain' }}
                  />
                ) : (
                  <TextHeading style={{ color: '#FFFFFF', fontSize: 44, textAlign: 'center' }}>{heroTitle}</TextHeading>
                )}
                {heroSubtitle ? (
                  <TextBody style={{ color: 'rgba(255,255,255,0.84)', textAlign: 'center' }}>{heroSubtitle}</TextBody>
                ) : null}
              </View>
            </View>

            <View
              style={{
                flex: 1,
                marginTop: -18,
                backgroundColor: '#FFFFFF',
                borderTopLeftRadius: 28,
                borderTopRightRadius: 28,
                paddingHorizontal: 20,
                paddingTop: 22,
                paddingBottom: 28,
                gap: 18,
                shadowColor: '#0F7F86',
                shadowOpacity: 0.08,
                shadowRadius: 18,
                shadowOffset: { width: 0, height: 10 },
                elevation: 6,
              }}>
              <View style={{ gap: 6 }}>
                <TextStrong style={{ fontSize: 30, color: '#0F7F86' }}>{cardTitle}</TextStrong>
                {cardSubtitle ? <TextMuted>{cardSubtitle}</TextMuted> : null}
              </View>
              {children}
              {footer ? <View style={{ paddingTop: 4 }}>{footer}</View> : null}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
