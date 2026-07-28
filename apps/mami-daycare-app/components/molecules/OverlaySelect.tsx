import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { CONTROL_HEIGHT } from '@mami/ui';

import { Text } from '../../theme/theme';

export type OverlaySelectOption = {
  label: string;
  value: string;
  description?: string;
};

type OverlaySelectProps = {
  value?: string;
  options: OverlaySelectOption[];
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  compact?: boolean;
  onChange: (value: string) => void;
};

export function OverlaySelect({
  value,
  options,
  placeholder = 'Pilih opsi',
  disabled,
  error,
  compact,
  onChange,
}: OverlaySelectProps) {
  const [visible, setVisible] = useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <View style={[styles.wrap, compact ? styles.wrapCompact : null]}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: visible, disabled }}
        disabled={disabled}
        onPress={() => setVisible((current) => !current)}
        style={[
          compact ? styles.triggerCompact : styles.trigger,
          error ? styles.triggerError : null,
          disabled ? styles.disabled : null,
        ]}
      >
        <Text
          numberOfLines={1}
          style={[
            compact ? styles.triggerTextCompact : styles.triggerText,
            selected ? null : styles.placeholder,
          ]}
        >
          {selected?.label ?? placeholder}
        </Text>
        <MaterialCommunityIcons name={visible ? 'chevron-up' : 'chevron-down'} size={18} color="#64748B" />
      </Pressable>

      {visible ? (
        <View style={[styles.dropdown, compact ? styles.dropdownCompact : null]}>
          <ScrollView
            nestedScrollEnabled
            showsVerticalScrollIndicator
            style={styles.scroller}
            contentContainerStyle={styles.optionList}
          >
            {options.map((option) => {
              const active = option.value === value;

              return (
                <Pressable
                  key={option.value}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  onPress={() => {
                    onChange(option.value);
                    setVisible(false);
                  }}
                  style={[styles.option, active ? styles.optionActive : null]}
                >
                  <View style={styles.optionTextWrap}>
                    <Text numberOfLines={1} style={[styles.optionText, active ? styles.optionTextActive : null]}>
                      {option.label}
                    </Text>
                    {option.description ? (
                      <Text numberOfLines={1} style={styles.optionDescription}>
                        {option.description}
                      </Text>
                    ) : null}
                  </View>
                  {active ? <MaterialCommunityIcons name="check" size={17} color="#4F46E5" /> : null}
                </Pressable>
              );
            })}
            {options.length === 0 ? (
              <View style={styles.emptyOption}>
                <Text style={styles.optionDescription}>Tidak ada opsi.</Text>
              </View>
            ) : null}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    elevation: 30,
    position: 'relative',
    zIndex: 300,
  },
  wrapCompact: {
    flexShrink: 0,
    width: 190,
    zIndex: 300,
  },
  trigger: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    minHeight: CONTROL_HEIGHT,
    paddingHorizontal: 12,
  },
  triggerCompact: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    height: CONTROL_HEIGHT,
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    width: 210,
  },
  triggerError: {
    borderColor: '#B91C1C',
  },
  disabled: {
    opacity: 0.6,
  },
  triggerText: {
    color: '#0F172A',
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
  },
  triggerTextCompact: {
    color: '#0F172A',
    flex: 1,
    fontSize: 12,
    fontWeight: '900',
    lineHeight: 16,
  },
  placeholder: {
    color: '#94A3B8',
  },
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 8,
    borderWidth: 1,
    elevation: 8,
    left: 0,
    marginTop: 6,
    padding: 4,
    position: 'absolute',
    right: 0,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    top: CONTROL_HEIGHT,
    zIndex: 500,
  },
  dropdownCompact: {
    top: CONTROL_HEIGHT + 2,
  },
  scroller: {
    maxHeight: 220,
  },
  optionList: {
    gap: 2,
  },
  option: {
    alignItems: 'center',
    borderRadius: 7,
    flexDirection: 'row',
    gap: 8,
    minHeight: 36,
    paddingHorizontal: 10,
  },
  optionActive: {
    backgroundColor: '#EEF2FF',
  },
  optionTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  optionText: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  optionTextActive: {
    color: '#4F46E5',
    fontWeight: '900',
  },
  optionDescription: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 15,
  },
  emptyOption: {
    minHeight: 36,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
});
