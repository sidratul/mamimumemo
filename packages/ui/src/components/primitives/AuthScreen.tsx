import type { ReactNode } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, View, type ImageSourcePropType, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAFC' }} edges={['left', 'right', 'top']}>
      {/* Decorative Blobs */}
      <View style={{ 
        position: 'absolute', 
        top: -50, 
        right: -30, 
        width: 250, 
        height: 250, 
        borderRadius: 125, 
        backgroundColor: '#EEF2FF',
        opacity: 0.8
      }} />
      <View style={{ 
        position: 'absolute', 
        top: SCREEN_HEIGHT * 0.2, 
        left: -60, 
        width: 180, 
        height: 180, 
        borderRadius: 90, 
        backgroundColor: '#F5F3FF',
        opacity: 0.6
      }} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          bounces={true}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}>
          
          {/* Top Branding Area */}
          <View style={{ paddingVertical: 40, alignItems: 'center', gap: 16 }}>
            <View style={{ 
              width: 120, 
              height: 120, 
              borderRadius: 36, 
              backgroundColor: '#FFFFFF',
              alignItems: 'center', 
              justifyContent: 'center',
              shadowColor: '#4F46E5',
              shadowOpacity: 0.1,
              shadowRadius: 20,
              shadowOffset: { width: 0, height: 8 },
              elevation: 8,
              borderWidth: 1.5,
              borderColor: '#EEF2FF'
            }}>
              {heroLogoSource ? (
                <Image
                  source={heroLogoSource}
                  style={{ width: 80, height: 80 }}
                  resizeMode="contain"
                />
              ) : (
                <View style={{ width: 50, height: 50, borderRadius: 16, backgroundColor: '#4F46E5' }} />
              )}
            </View>

            <View style={{ alignItems: 'center', gap: 4, paddingHorizontal: 24 }}>
              {heroTitle.toLowerCase() === 'mamimumemo' ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: 40, fontWeight: '900', color: '#FF6B6B', letterSpacing: -2 }}>ma</Text>
                  <Text style={{ fontSize: 40, fontWeight: '900', color: '#4D96FF', letterSpacing: -2 }}>mi</Text>
                  <Text style={{ fontSize: 40, fontWeight: '900', color: '#FFD93D', letterSpacing: -2 }}>mu</Text>
                  <Text style={{ fontSize: 40, fontWeight: '900', color: '#6BCB77', letterSpacing: -2 }}>me</Text>
                  <Text style={{ fontSize: 40, fontWeight: '900', color: '#4F46E5', letterSpacing: -2 }}>mo</Text>
                </View>
              ) : (
                <Text style={{ fontSize: 38, fontWeight: '900', color: '#4F46E5', letterSpacing: -1.5, textAlign: 'center' }}>{heroTitle}</Text>
              )}
              {heroSubtitle ? (
                <Text style={{ fontSize: 15, color: '#64748B', textAlign: 'center', lineHeight: 22, maxWidth: 280, fontWeight: '500' }}>
                  {heroSubtitle}
                </Text>
              ) : null}
            </View>
          </View>

          {/* Edge-to-Edge Bottom Card */}
          <View
            style={{
              flex: 1,
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: 40,
              borderTopRightRadius: 40,
              paddingHorizontal: 28,
              paddingTop: 40,
              paddingBottom: 60,
              gap: 28,
              shadowColor: '#000',
              shadowOpacity: 0.05,
              shadowRadius: 15,
              shadowOffset: { width: 0, height: -10 },
              elevation: 10,
              marginTop: 'auto', // Push to bottom
            }}>
            <View style={{ gap: 4 }}>
              <Text style={{ fontSize: 28, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5 }}>{cardTitle}</Text>
              {cardSubtitle ? (
                <Text style={{ fontSize: 16, color: '#64748B', fontWeight: '500' }}>{cardSubtitle}</Text>
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

            <View style={{ alignItems: 'center', marginTop: 12 }}>
               <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                 <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#CBD5E1' }} />
                 <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '800', letterSpacing: 1.5 }}>MAMIMUMEMO &bull; 2026</Text>
                 <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#CBD5E1' }} />
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
