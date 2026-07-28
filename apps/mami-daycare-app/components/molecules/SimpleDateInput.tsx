import { useMemo, useRef } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { CONTROL_HEIGHT } from '@mami/ui';

import { Text } from '../../theme/theme';

type SimpleDateInputProps = {
  value: string;
  disabled?: boolean;
  error?: string;
  onChange: (value: string) => void;
};

function onlyDigits(value: string, maxLength: number) {
  return value.replace(/\D/g, '').slice(0, maxLength);
}

function sanitizeMonth(value: string) {
  const digits = onlyDigits(value, 2);
  if (digits.length < 2) return digits;

  const month = Number(digits);
  if (month > 12) return '12';

  return digits;
}

export function SimpleDateInput({ value, disabled, error, onChange }: SimpleDateInputProps) {
  const monthInputRef = useRef<TextInput>(null);
  const yearInputRef = useRef<TextInput>(null);
  const parts = useMemo(() => {
    const [day = '', month = '', year = ''] = value.split('-');
    return { day, month, year };
  }, [value]);

  function updatePart(key: 'year' | 'month' | 'day', nextValue: string) {
    const normalizedValue = key === 'month'
      ? sanitizeMonth(nextValue)
      : onlyDigits(nextValue, key === 'year' ? 4 : 2);
    const next = {
      ...parts,
      [key]: normalizedValue,
    };

    onChange([next.day, next.month, next.year].filter(Boolean).join('-'));

    if (key === 'day' && normalizedValue.length === 2) {
      monthInputRef.current?.focus();
    }

    if (key === 'month' && normalizedValue.length === 2) {
      yearInputRef.current?.focus();
    }
  }

  return (
    <View style={styles.wrap}>
      <View style={[styles.inputRow, error ? styles.inputRowError : null, disabled ? styles.disabled : null]}>
        <TextInput
          value={parts.day}
          editable={!disabled}
          keyboardType="number-pad"
          maxLength={2}
          placeholder="DD"
          placeholderTextColor="#94A3B8"
          onChangeText={(next) => updatePart('day', next)}
          style={styles.input}
        />
        <Text style={styles.separator}>-</Text>
        <TextInput
          ref={monthInputRef}
          value={parts.month}
          editable={!disabled}
          keyboardType="number-pad"
          maxLength={2}
          placeholder="MM"
          placeholderTextColor="#94A3B8"
          onChangeText={(next) => updatePart('month', next)}
          style={styles.input}
        />
        <Text style={styles.separator}>-</Text>
        <TextInput
          ref={yearInputRef}
          value={parts.year}
          editable={!disabled}
          keyboardType="number-pad"
          maxLength={4}
          placeholder="YYYY"
          placeholderTextColor="#94A3B8"
          onChangeText={(next) => updatePart('year', next)}
          style={[styles.input, styles.yearInput]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
  },
  inputRow: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: CONTROL_HEIGHT,
    paddingHorizontal: 12,
  },
  inputRowError: {
    borderColor: '#B91C1C',
  },
  disabled: {
    opacity: 0.6,
  },
  input: {
    color: '#0F172A',
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
    height: CONTROL_HEIGHT,
    lineHeight: 18,
    minWidth: 0,
    padding: 0,
    textAlign: 'center',
  },
  yearInput: {
    flex: 1.5,
  },
  separator: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '900',
    lineHeight: 18,
    paddingHorizontal: 4,
  },
});
