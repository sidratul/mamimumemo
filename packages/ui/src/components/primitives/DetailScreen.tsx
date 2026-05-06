import { type ReactNode } from 'react';
import { ScrollView, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { PageHeader } from './PageHeader';

type DetailScreenProps = {
  title: string;
  onBack?: () => void;
  children: ReactNode;
  scrollable?: boolean;
  backgroundColor?: string;
  contentContainerStyle?: ViewStyle;
  headerBackgroundColor?: string;
  headerBorderBottomColor?: string;
  style?: ViewStyle;
};

export function DetailScreen({
  title,
  onBack,
  children,
  scrollable = true,
  backgroundColor = '#FFFFFF',
  contentContainerStyle,
  headerBackgroundColor = '#FFFFFF',
  headerBorderBottomColor = '#E8ECF4',
  style,
}: DetailScreenProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('../' as any);
    }
  };

  const content = scrollable ? (
    <ScrollView
      contentContainerStyle={[
        {
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 120,
          gap: 16,
        },
        contentContainerStyle,
      ]}
      showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  ) : (
    <View
      style={[
        {
          flex: 1,
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 120,
          gap: 16,
        },
        contentContainerStyle,
      ]}>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor }, style]} edges={['left', 'right', 'bottom']}>
      <PageHeader
        title={title}
        onBack={handleBack}
        backgroundColor={headerBackgroundColor}
        borderBottomColor={headerBorderBottomColor}
      />
      {content}
    </SafeAreaView>
  );
}
