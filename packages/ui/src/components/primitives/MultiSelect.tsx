import { useMemo, useState } from 'react';
import { Modal as RNModal, Pressable, ScrollView, Text, View } from 'react-native';
import { Checkbox } from 'react-native-paper';

import { brandColors } from '../../theme/brand';
import { Button } from './Button';

export type PrimitiveMultiSelectOption = {
  label: string;
  value: string;
  helperText?: string;
};

export type MultiSelectProps = {
  values: string[];
  placeholder?: string;
  options: PrimitiveMultiSelectOption[];
  onChange: (values: string[]) => void;
  disabled?: boolean;
  error?: string;
  title?: string;
  mode?: 'modal' | 'inline';
};

export function MultiSelect({
  values,
  placeholder,
  options,
  onChange,
  disabled,
  error,
  title,
  mode = 'modal',
}: MultiSelectProps) {
  const [visible, setVisible] = useState(false);
  const selectedLabels = useMemo(
    () => options.filter((option) => values.includes(option.value)).map((option) => option.label),
    [options, values]
  );

  return (
    <View>
      {mode === 'modal' ? (
        <>
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
            }}
          >
            <Text style={{ color: selectedLabels.length ? brandColors.textPrimary : brandColors.textSecondary }}>
              {selectedLabels.length
                ? `${selectedLabels.length} anak dipilih`
                : placeholder ?? 'Pilih'}
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
            >
              <Pressable
                onPress={(event) => event.stopPropagation()}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderTopLeftRadius: 24,
                  borderTopRightRadius: 24,
                  padding: 20,
                  paddingBottom: 28,
                  gap: 12,
                  maxHeight: '80%',
                }}
              >
                {title ? (
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '800',
                      color: brandColors.textSecondary,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                    }}
                  >
                    {title}
                  </Text>
                ) : null}

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                  {options.map((option) => {
                    const active = values.includes(option.value);

                    return (
                      <Pressable
                        key={option.value}
                        onPress={() =>
                          onChange(
                            active ? values.filter((item) => item !== option.value) : [...values, option.value]
                          )
                        }
                        style={{
                          minHeight: 56,
                          borderRadius: 14,
                          paddingHorizontal: 12,
                          paddingVertical: 10,
                          backgroundColor: active ? '#EEF2FF' : '#FFFFFF',
                          borderWidth: 1,
                          borderColor: active ? '#C7D2FE' : '#E2E8F0',
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 10,
                        }}
                      >
                        <Checkbox status={active ? 'checked' : 'unchecked'} color={brandColors.primary} />
                        <View style={{ flex: 1, gap: 2 }}>
                          <Text
                            style={{
                              fontSize: 15,
                              fontWeight: active ? '800' : '600',
                              color: active ? brandColors.primary : brandColors.textPrimary,
                            }}
                          >
                            {option.label}
                          </Text>
                          {option.helperText ? (
                            <Text style={{ fontSize: 12, color: brandColors.textSecondary }}>
                              {option.helperText}
                            </Text>
                          ) : null}
                        </View>
                      </Pressable>
                    );
                  })}
                </ScrollView>

                <Button label="Selesai" onPress={() => setVisible(false)} />
              </Pressable>
            </Pressable>
          </RNModal>
        </>
      ) : (
        <View style={{ gap: 8 }}>
          {options.map((option) => {
            const active = values.includes(option.value);

            return (
              <Pressable
                key={option.value}
                onPress={() =>
                  onChange(active ? values.filter((item) => item !== option.value) : [...values, option.value])
                }
                style={{
                  minHeight: 56,
                  borderRadius: 14,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  backgroundColor: active ? '#EEF2FF' : '#FFFFFF',
                  borderWidth: 1,
                  borderColor: active ? '#C7D2FE' : error ? brandColors.danger : '#E2E8F0',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <Checkbox status={active ? 'checked' : 'unchecked'} color={brandColors.primary} />
                <View style={{ flex: 1, gap: 2 }}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: active ? '800' : '600',
                      color: active ? brandColors.primary : brandColors.textPrimary,
                    }}
                  >
                    {option.label}
                  </Text>
                  {option.helperText ? (
                    <Text style={{ fontSize: 12, color: brandColors.textSecondary }}>
                      {option.helperText}
                    </Text>
                  ) : null}
                </View>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}
