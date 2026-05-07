import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Pressable, ScrollView, Text, View, type ViewStyle } from 'react-native';

import { brandColors } from '../../theme/brand';

export type SegmentTabItem = {
  key: string;
  label: string;
  content: ReactNode;
};

type SegmentTabsProps = {
  items: SegmentTabItem[];
  initialKey?: string;
  activeKey?: string;
  onChange?: (key: string) => void;
  contentContainerStyle?: ViewStyle;
  variant?: 'underline' | 'segmented';
};

export function SegmentTabs({
  items,
  initialKey,
  activeKey: controlledActiveKey,
  onChange,
  contentContainerStyle,
  variant = 'underline',
}: SegmentTabsProps) {
  const defaultIndex = Math.max(0, items.findIndex((item) => item.key === initialKey));
  const [internalActiveKey, setInternalActiveKey] = useState(items[defaultIndex]?.key ?? items[0]?.key ?? '');
  const activeKey = controlledActiveKey ?? internalActiveKey;

  useEffect(() => {
    if (controlledActiveKey !== undefined) {
      return;
    }

    const nextDefaultKey = items[defaultIndex]?.key ?? items[0]?.key ?? '';
    const hasActiveItem = items.some((item) => item.key === internalActiveKey);

    if (!hasActiveItem) {
      setInternalActiveKey(nextDefaultKey);
    }
  }, [controlledActiveKey, defaultIndex, internalActiveKey, items]);

  const activeItem = useMemo(
    () => items.find((item) => item.key === activeKey) ?? items[0] ?? null,
    [activeKey, items]
  );

  return (
    <View style={{ flex: 1, minHeight: 0 }}>
      {variant === 'segmented' ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 4,
            paddingBottom: 4,
            gap: 8,
          }}
        >
          {items.map((item) => {
            const active = item.key === activeKey;

            return (
              <Pressable
                key={item.key}
                onPress={() => {
                  setInternalActiveKey(item.key);
                  onChange?.(item.key);
                }}
                style={{
                  minHeight: 38,
                  paddingHorizontal: 14,
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: active ? '#C7D2FE' : '#E2E8F0',
                  backgroundColor: active ? '#EEF2FF' : '#FFFFFF',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '700',
                    color: active ? brandColors.primary : brandColors.textPrimary,
                  }}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      ) : (
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: '#EEF2F7',
          }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 16,
              alignItems: 'flex-end',
            }}
          >
            {items.map((item) => {
              const active = item.key === activeKey;

              return (
                <Pressable
                  key={item.key}
                  onPress={() => {
                    setInternalActiveKey(item.key);
                    onChange?.(item.key);
                  }}
                  style={{
                    height: 40,
                    paddingHorizontal: 14,
                    justifyContent: 'center',
                    borderBottomWidth: 2,
                    borderBottomColor: active ? brandColors.primary : 'transparent',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '700',
                      color: active ? brandColors.primary : brandColors.textPrimary,
                    }}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          {
            paddingTop: 16,
            paddingBottom: 24,
            gap: 16,
          },
          contentContainerStyle,
        ]}
      >
        {activeItem?.content}
      </ScrollView>
    </View>
  );
}
