import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Chip, Searchbar, Text, useTheme } from 'react-native-paper';

type FilterOption<T extends string> = {
  label: string;
  value: T;
  color?: string;
};

type ListFilterBarProps<T extends string> = {
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  options: FilterOption<T>[];
  selectedValue: T;
  onSelect: (value: T) => void;
  trailingContent?: ReactNode;
};

export function ListFilterBar<T extends string>({
  searchPlaceholder,
  searchValue,
  onSearchChange,
  options,
  selectedValue,
  onSelect,
  trailingContent,
}: ListFilterBarProps<T>) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder={searchPlaceholder}
        value={searchValue}
        onChangeText={onSearchChange}
        style={[styles.searchbar, { borderRadius: 12 }]}
        inputStyle={styles.searchInput}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.row}>
          {options.map((option) => (
            <Chip
              key={option.value}
              selected={selectedValue === option.value}
              onPress={() => onSelect(option.value)}
              compact
              showSelectedOverlay={false}
              showSelectedCheck={false}
              style={[
                styles.chip,
                selectedValue === option.value
                  ? { backgroundColor: theme.colors.primary }
                  : { backgroundColor: '#F2F4F8' },
              ]}
              textStyle={
                selectedValue === option.value
                  ? { color: theme.colors.onPrimary, fontWeight: '700' }
                  : { color: theme.colors.onSurface }
              }>
              <View style={styles.chipLabelRow}>
                {option.color ? (
                  <View
                    style={[
                      styles.dot,
                      {
                        backgroundColor: selectedValue === option.value
                          ? 'rgba(255,255,255,0.92)'
                          : option.color,
                      },
                    ]}
                  />
                ) : null}
                <Text
                  style={[
                    styles.chipText,
                    selectedValue === option.value
                      ? { color: theme.colors.onPrimary }
                      : { color: theme.colors.onSurface },
                  ]}>
                  {option.label}
                </Text>
              </View>
            </Chip>
          ))}
        </View>
      </ScrollView>
      {trailingContent}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    gap: 8,
  },
  searchbar: {
    minHeight: 52,
  },
  searchInput: {
    fontSize: 14,
    lineHeight: 18,
    paddingVertical: 0,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    borderRadius: 10,
  },
  chipLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chipText: {
    fontSize: 14,
    lineHeight: 18,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
});
