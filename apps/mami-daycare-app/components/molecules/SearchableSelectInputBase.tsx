import { useMemo, useState } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { CONTROL_HEIGHT, TextField } from '@mami/ui';

import { Box, Text, useAppTheme } from '../../theme/theme';

export type SearchableSelectOption = {
  label: string;
  value: string;
  description?: string;
};

type SearchableSelectInputBaseProps = {
  value?: string;
  options: SearchableSelectOption[];
  placeholder?: string;
  title: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  error?: string;
  onChange: (value: string) => void;
};

export function SearchableSelectInputBase({
  value,
  options,
  placeholder = 'Pilih opsi',
  title,
  searchPlaceholder = 'Cari...',
  emptyText = 'Tidak ada hasil.',
  disabled,
  error,
  onChange,
}: SearchableSelectInputBaseProps) {
  const appTheme = useAppTheme();
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState('');

  const selected = useMemo(() => options.find((option) => option.value === value), [options, value]);

  const filteredOptions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return options;

    return options.filter((option) =>
      [option.label, option.description ?? '', option.value].join(' ').toLowerCase().includes(normalized)
    );
  }, [options, query]);

  function close() {
    setVisible(false);
    setQuery('');
  }

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled, expanded: visible }}
        disabled={disabled}
        onPress={() => setVisible(true)}
        style={({ pressed }) => [styles.triggerWrap, pressed && !disabled ? styles.pressed : null]}>
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
              color: selected ? appTheme.colors.textPrimary : appTheme.colors.textSecondary,
              flex: 1,
              fontSize: 13,
              fontWeight: '800',
            }}>
            {selected?.label ?? placeholder}
          </Text>
          <MaterialCommunityIcons name="chevron-down" size={18} color={appTheme.colors.textSecondary} />
        </Box>
      </Pressable>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
        <View style={[StyleSheet.absoluteFillObject, styles.modalOverlay]}>
          <Pressable accessibilityRole="button" accessibilityLabel="Tutup" onPress={close} style={styles.backdrop} />
          <View style={[styles.panel, { backgroundColor: appTheme.colors.surface, borderColor: appTheme.colors.border }]}>
            <Box flexDirection="row" alignItems="center" justifyContent="space-between" gap="md">
              <Text style={{ fontSize: 16, fontWeight: '900' }}>{title}</Text>
              <Pressable accessibilityRole="button" accessibilityLabel="Tutup" onPress={close}>
                <MaterialCommunityIcons name="close" size={22} color={appTheme.colors.textSecondary} />
              </Pressable>
            </Box>

            <TextField
              value={query}
              disabled={disabled}
              placeholder={searchPlaceholder}
              backgroundColor={appTheme.colors.surface}
              borderRadius={8}
              useBottomSheetInput={false}
              onChange={setQuery}
            />

            <ScrollView
              nestedScrollEnabled
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator
              style={styles.scroller}
              contentContainerStyle={styles.list}>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => {
                  const active = option.value === value;

                  return (
                    <Pressable
                      key={option.value}
                      accessibilityRole="button"
                      accessibilityState={{ selected: active }}
                      disabled={disabled}
                      onPress={() => {
                        onChange(option.value);
                        close();
                      }}>
                      <Box
                        borderWidth={1}
                        borderColor={active ? 'primary' : 'border'}
                        borderRadius="sm"
                        backgroundColor={active ? 'background' : 'surface'}
                        gap="xxs"
                        padding="md">
                        <Box flexDirection="row" alignItems="center" justifyContent="space-between" gap="sm">
                          <Text
                            numberOfLines={1}
                            style={{
                              color: active ? appTheme.colors.primary : appTheme.colors.textPrimary,
                              flex: 1,
                              fontSize: 13,
                              fontWeight: '900',
                            }}>
                            {option.label}
                          </Text>
                          {active ? <MaterialCommunityIcons name="check" size={18} color={appTheme.colors.primary} /> : null}
                        </Box>
                        {option.description ? (
                          <Text
                            numberOfLines={2}
                            style={{ color: appTheme.colors.textSecondary, fontSize: 12, fontWeight: '700' }}>
                            {option.description}
                          </Text>
                        ) : null}
                      </Box>
                    </Pressable>
                  );
                })
              ) : (
                <Box backgroundColor="surface" borderColor="border" borderRadius="sm" borderWidth={1} padding="md">
                  <Text style={{ color: appTheme.colors.textSecondary, fontSize: 13, fontWeight: '700' }}>{emptyText}</Text>
                </Box>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  triggerWrap: {
    width: '100%',
  },
  pressed: {
    opacity: 0.92,
  },
  modalOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    padding: 24,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  panel: {
    borderRadius: 12,
    borderWidth: 1,
    gap: 14,
    maxHeight: '80%',
    maxWidth: 560,
    padding: 18,
    width: '100%',
  },
  scroller: {
    maxHeight: 360,
  },
  list: {
    gap: 10,
    paddingBottom: 4,
  },
});
