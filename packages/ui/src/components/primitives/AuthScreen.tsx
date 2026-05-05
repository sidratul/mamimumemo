import type { ReactNode } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, View, type ImageSourcePropType, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

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
      {/* Decorative Blobs for "Lucu" vibe */}
      <View style={{ 
        position: 'absolute', 
        top: -100, 
        right: -50, 
        width: 300, 
        height: 300, 
        borderRadius: 150, 
        backgroundColor: '#EEF2FF',
        opacity: 0.8
      }} />
      <View style={{ 
        position: 'absolute', 
        bottom: -50, 
        left: -80, 
        width: 250, 
        height: 250, 
        borderRadius: 125, 
        backgroundColor: '#F5F3FF',
        opacity: 0.6
      }} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 12 : 0}>
        <ScrollView
          bounces={true}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ flex: 1, paddingHorizontal: 24, justifyContent: 'center', paddingVertical: 40 }}>
            
            {/* Unique Hero Area */}
            <View style={{ alignItems: 'center', marginBottom: 40, gap: 16 }}>
              <View style={{ 
                width: 140, 
                height: 140, 
                borderRadius: 40, 
                backgroundColor: '#FFFFFF',
                alignItems: 'center', 
                justifyContent: 'center',
                shadowColor: '#4F46E5',
                shadowOpacity: 0.1,
                shadowRadius: 30,
                shadowOffset: { width: 0, height: 10 },
                elevation: 10,
                borderWidth: 2,
                borderColor: '#EEF2FF'
              }}>
                {heroLogoSource ? (
                  <Image
                    source={heroLogoSource}
                    style={{ width: 100, height: 100 }}
                    resizeMode="contain"
                  />
                ) : (
                  <View style={{ width: 60, height: 60, borderRadius: 20, backgroundColor: '#4F46E5' }} />
                )}
              </View>

              <View style={{ alignItems: 'center', gap: 6 }}>
                {heroTitle.toLowerCase() === 'mamimumemo' ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 44, fontWeight: '900', color: '#FF6B6B', letterSpacing: -2 }}>ma</Text>
                    <Text style={{ fontSize: 44, fontWeight: '900', color: '#4D96FF', letterSpacing: -2 }}>mi</Text>
                    <Text style={{ fontSize: 44, fontWeight: '900', color: '#FFD93D', letterSpacing: -2 }}>mu</Text>
                    <Text style={{ fontSize: 44, fontWeight: '900', color: '#6BCB77', letterSpacing: -2 }}>me</Text>
                    <Text style={{ fontSize: 44, fontWeight: '900', color: '#4F46E5', letterSpacing: -2 }}>mo</Text>
                  </View>
                ) : (
                  <Text style={{ 
                    fontSize: 42, 
                    fontWeight: '900', 
                    color: '#4F46E5', 
                    letterSpacing: -2,
                    textAlign: 'center'
                  }}>
                    {heroTitle}
                  </Text>
                )}
                {heroSubtitle ? (
                  <Text style={{ fontSize: 16, color: '#64748B', textAlign: 'center', lineHeight: 24, maxWidth: 300, fontWeight: '500' }}>
                    {heroSubtitle}
                  </Text>
                ) : null}
              </View>
            </View>

            {/* Login Card */}
            <View
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: 32,
                paddingHorizontal: 28,
                paddingVertical: 36,
                gap: 24,
                shadowColor: '#0F172A',
                shadowOpacity: 0.08,
                shadowRadius: 30,
                shadowOffset: { width: 0, height: 15 },
                elevation: 5,
                borderWidth: 1,
                borderColor: '#FFFFFF',
              }}>
              <View style={{ gap: 4 }}>
                <Text style={{ fontSize: 26, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5 }}>{cardTitle}</Text>
                {cardSubtitle ? (
                  <Text style={{ fontSize: 15, color: '#64748B', fontWeight: '500' }}>{cardSubtitle}</Text>
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
            
            <View style={{ marginTop: 40, alignItems: 'center' }}>
               <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                 <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#94A3B8' }} />
                 <Text style={{ fontSize: 13, color: '#94A3B8', fontWeight: '700', letterSpacing: 1 }}>MAMIMUMEMO &bull; 2026</Text>
                 <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#94A3B8' }} />
               </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Text({ style, children, ...props }: any) {
    const { Text: RNText } = require('react-native');
    return <RNText style={style} {...props}>{children}</RNText>;
}
