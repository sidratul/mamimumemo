import { Pressable, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { InputComponentProps, SelectOption } from '@mami/ui';
import { CONTROL_BORDER_RADIUS, CONTROL_HEIGHT } from '@mami/ui';

import { Text } from '../../../theme/theme';

type MasterActivityCategoryInputProps = InputComponentProps<string> & {
  options?: SelectOption[];
};

export function MasterActivityCategoryInput({
  value,
  onChange,
  options = [],
  disabled,
}: MasterActivityCategoryInputProps) {
  return (
    <View style={styles.options}>
      {options.map((option) => {
        const active = option.value === value;

        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            accessibilityState={{ selected: active, disabled }}
            disabled={disabled}
            onPress={() => onChange(option.value)}
            style={[styles.option, active ? styles.optionActive : null, disabled ? styles.optionDisabled : null]}
          >
            <Text numberOfLines={1} style={[styles.optionText, active ? styles.optionTextActive : null]}>
              {option.label}
            </Text>
            {active ? <MaterialCommunityIcons name="check" size={16} color="#4F46E5" /> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
    borderRadius: CONTROL_BORDER_RADIUS,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    minHeight: CONTROL_HEIGHT,
    paddingHorizontal: 12,
    width: 132,
  },
  optionActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#4F46E5',
  },
  optionDisabled: {
    opacity: 0.6,
  },
  optionText: {
    flex: 1,
    color: '#334155',
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
  },
  optionTextActive: {
    color: '#4F46E5',
    fontWeight: '900',
  },
});
