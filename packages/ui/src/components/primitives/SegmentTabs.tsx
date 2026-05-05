import type { ReactNode } from 'react';
import { ScrollView, View, type ViewStyle } from 'react-native';
import { TabScreen, Tabs, TabsProvider } from 'react-native-paper-tabs';

import { brandColors } from '../../theme/brand';

export type SegmentTabItem = {
  key: string;
  label: string;
  content: ReactNode;
};

type SegmentTabsProps = {
  items: SegmentTabItem[];
  initialKey?: string;
  onChange?: (key: string) => void;
  contentContainerStyle?: ViewStyle;
};

export function SegmentTabs({
  items,
  initialKey,
  onChange,
  contentContainerStyle,
}: SegmentTabsProps) {
  const defaultIndex = Math.max(
    0,
    items.findIndex((item) => item.key === initialKey)
  );

  return (
    <View style={{ flex: 1, minHeight: 0 }}>
      <TabsProvider
        defaultIndex={defaultIndex}
        onChangeIndex={(index) => {
          const nextItem = items[index];
          if (nextItem) {
            onChange?.(nextItem.key);
          }
        }}>
        <Tabs
          mode="scrollable"
          disableSwipe
          uppercase={false}
          showLeadingSpace={false}
          showTextLabel
          style={{
            backgroundColor: '#FFFFFF',
            elevation: 0,
            shadowOpacity: 0,
          }}
          tabHeaderStyle={{
            minHeight: 48,
            borderBottomWidth: 1,
            borderBottomColor: '#F4E3EC',
          }}
          tabLabelStyle={{
            fontSize: 14,
            fontWeight: '700',
            color: brandColors.textPrimary,
          }}>
          {items.map((item) => (
            <TabScreen key={item.key} label={item.label}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                  {
                    paddingTop: 18,
                    paddingBottom: 24,
                    gap: 18,
                  },
                  contentContainerStyle,
                ]}>
                {item.content}
              </ScrollView>
            </TabScreen>
          ))}
        </Tabs>
      </TabsProvider>
    </View>
  );
}
