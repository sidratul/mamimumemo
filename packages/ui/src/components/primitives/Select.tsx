import { useMemo, useState } from 'react';
import { Modal as RNModal, Pressable, Text, View } from 'react-native';

import { brandColors } from '../../theme/brand';

export type PrimitiveSelectOption = {
  label: string;
  value: string;
};

export type SelectProps = {
  value?: string;
  placeholder?: string;
  options: PrimitiveSelectOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
  title?: string;
};

export function Select({ value, placeholder, options, onChange, disabled, error, title }: SelectProps) {
  const [visible, setVisible] = useState(false);
  const selected = useMemo(() => options.find((option) => option.value === value), [options, value]);

  return (
    <View>
      <Pressable
        disabled={disabled}
        onPress={() => setVisible(true)}
        style={{
          minHeight: 56,
          borderWidth: 1,
          borderColor: error ? brandColors.danger : brandColors.border,
          borderRadius: 12,
          paddingHorizontal: 14,
          justifyContent: 'center',
          backgroundColor: '#FFFFFF',
          opacity: disabled ? 0.6 : 1,
        }}>
        <Text style={{ color: selected ? brandColors.textPrimary : brandColors.textSecondary }}>
          {selected?.label ?? placeholder ?? 'Pilih'}
        </Text>
      </Pressable>

      <RNModal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <Pressable
          onPress={() => setVisible(false)}
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
          }}
        ><View
            style={{
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 24,
              paddingBottom: 40,
              gap: 8,
            }}
          >{title ? (
              <Text style={{ fontSize: 13, fontWeight: '800', color: brandColors.textSecondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {title}
              </Text>
            ) : null}{options.map((option) => {
              const active = option.value === value;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => {
                    onChange(option.value);
                    setVisible(false);
                  }}
                  style={{
                    minHeight: 52,
                    borderRadius: 12,
                    justifyContent: 'center',
                    paddingHorizontal: 16,
                    backgroundColor: active ? '#EEF2FF' : 'transparent',
                  }}>
                  <Text style={{ color: active ? '#4F46E5' : '#0F172A', fontWeight: active ? '800' : '600', fontSize: 15 }}>{option.label}</Text>
                </Pressable>
              );
            })}</View></Pressable>
      </RNModal>
    </View>
  );
}
