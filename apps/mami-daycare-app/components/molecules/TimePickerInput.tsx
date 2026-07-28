import { useMemo, useState } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { TimePickerModal } from 'react-native-paper-dates';
import { Pressable, StyleSheet } from 'react-native';
import { CONTROL_HEIGHT } from '@mami/ui';

import { Box, Text, useAppTheme } from '../../theme/theme';
import { formatTimeString, parseTimeString } from './time-utils';

type TimePickerInputProps = {
  value: string;
  placeholder?: string;
  title?: string;
  disabled?: boolean;
  error?: string;
  onChange: (value: string) => void;
};

export function TimePickerInput({
  value,
  placeholder = 'Pilih jam',
  title = 'Pilih jam',
  disabled,
  error,
  onChange,
}: TimePickerInputProps) {
  const appTheme = useAppTheme();
  const [visible, setVisible] = useState(false);

  const parsedValue = useMemo(() => parseTimeString(value), [value]);
  const displayValue = useMemo(() => {
    if (!parsedValue) return '';
    return formatTimeString(parsedValue);
  }, [parsedValue]);

  const hours = parsedValue?.getHours();
  const minutes = parsedValue?.getMinutes();

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled, expanded: visible }}
        disabled={disabled}
        onPress={() => setVisible(true)}
        style={({ pressed }) => [styles.trigger, pressed && !disabled ? styles.pressed : null]}>
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
            {displayValue || placeholder}
          </Text>
          <MaterialCommunityIcons name="clock-outline" size={18} color={appTheme.colors.textSecondary} />
        </Box>
      </Pressable>

      <TimePickerModal
        visible={visible}
        onDismiss={() => setVisible(false)}
        onConfirm={({ hours: nextHours, minutes: nextMinutes }) => {
          setVisible(false);
          onChange(`${String(nextHours).padStart(2, '0')}:${String(nextMinutes).padStart(2, '0')}`);
        }}
        hours={hours}
        minutes={minutes}
        label={title}
        cancelLabel="Batal"
        confirmLabel="Simpan"
        locale="id"
        use24HourClock
        animationType="fade"
      />
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    width: '100%',
  },
  pressed: {
    opacity: 0.92,
  },
});
