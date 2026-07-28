import { useMemo, useState } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { DatePickerModal, id as datePickerIdTranslation, registerTranslation } from 'react-native-paper-dates';
import { Pressable, StyleSheet, View } from 'react-native';
import { CONTROL_HEIGHT } from '@mami/ui';

import { Box, Text, useAppTheme } from '../../theme/theme';

registerTranslation('id', datePickerIdTranslation);

type DatePickerInputProps = {
  value: string;
  disabled?: boolean;
  error?: string;
  onChange: (value: string) => void;
};

function parseSimpleDate(value: string) {
  const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(value);
  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);

  if (!day || !month || !year) return null;

  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

function formatSimpleDate(date: Date) {
  return [
    String(date.getDate()).padStart(2, '0'),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getFullYear()).padStart(4, '0'),
  ].join('-');
}

function formatLabel(value: string) {
  const parsed = value ? parseSimpleDate(value) : null;
  if (!parsed) return '';

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsed);
}

export function DatePickerInput({ value, disabled, error, onChange }: DatePickerInputProps) {
  const appTheme = useAppTheme();
  const [visible, setVisible] = useState(false);

  const parsedValue = useMemo(() => parseSimpleDate(value), [value]);
  const displayValue = useMemo(() => formatLabel(value), [value]);

  return (
    <>
      <Pressable
        accessibilityRole="button"
        disabled={disabled}
        onPress={() => setVisible(true)}
        style={({ pressed }) => [
          styles.pressable,
          disabled ? styles.disabled : null,
          pressed && !disabled ? styles.pressed : null,
        ]}>
        <Box
          alignItems="center"
          backgroundColor="surface"
          borderColor={error ? 'danger' : 'border'}
          borderRadius="sm"
          borderWidth={1}
          flexDirection="row"
          gap="sm"
          minHeight={CONTROL_HEIGHT}
          paddingHorizontal="md">
          <Text
            numberOfLines={1}
            style={{
              color: displayValue ? appTheme.colors.textPrimary : appTheme.colors.textSecondary,
              flex: 1,
              fontSize: 13,
              fontWeight: '800',
            }}>
            {displayValue || 'Pilih tanggal'}
          </Text>
          <MaterialCommunityIcons
            name="calendar-month-outline"
            size={18}
            color={appTheme.colors.textSecondary}
          />
        </Box>
      </Pressable>

      <DatePickerModal
        animationType="fade"
        date={parsedValue ?? undefined}
        disableStatusBarPadding
        locale="id"
        mode="single"
        onConfirm={({ date }) => {
          setVisible(false);
          if (!date) {
            onChange('');
            return;
          }

          onChange(formatSimpleDate(date));
        }}
        onDismiss={() => setVisible(false)}
        presentationStyle="overFullScreen"
        saveLabel="Simpan"
        visible={visible}
      />
    </>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: '100%',
  },
  disabled: {
    opacity: 0.65,
  },
  pressed: {
    opacity: 0.9,
  },
});
