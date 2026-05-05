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
};

export function Select({ value, placeholder, options, onChange, disabled, error }: SelectProps) {
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
            backgroundColor: 'rgba(58, 17, 48, 0.2)',
          }}>
          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 16,
              gap: 8,
            }}>
            {options.map((option) => {
              const active = option.value === value;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => {
                    onChange(option.value);
                    setVisible(false);
                  }}
                  style={{
                    minHeight: 48,
                    borderRadius: 12,
                    justifyContent: 'center',
                    paddingHorizontal: 12,
                    backgroundColor: active ? '#FFF2F8' : 'transparent',
                  }}>
                  <Text style={{ color: brandColors.textPrimary, fontWeight: active ? '700' : '500' }}>{option.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </RNModal>
    </View>
  );
}
