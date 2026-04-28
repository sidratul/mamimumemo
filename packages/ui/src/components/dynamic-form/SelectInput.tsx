import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { List, Modal, Portal, Surface, TextInput } from 'react-native-paper';

import type { InputComponentProps } from './form.types';

export type SelectOption = {
  label: string;
  value: string;
};

type SelectInputProps = InputComponentProps<string> & {
  options?: SelectOption[];
  title?: string;
  textColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
};

export function SelectInput({
  value,
  placeholder,
  onChange,
  options = [],
  disabled,
  title,
  textColor = '#24324B',
  backgroundColor = '#FFFFFF',
  borderRadius = 10,
}: SelectInputProps) {
  const [visible, setVisible] = useState(false);

  const selectedLabel = useMemo(() => {
    const selectedOption = options.find((option) => option.value === value);
    return selectedOption?.label ?? '';
  }, [options, value]);

  return (
    <>
      <Pressable disabled={disabled} onPress={() => setVisible(true)}>
        <TextInput
          mode="outlined"
          value={selectedLabel}
          placeholder={placeholder}
          editable={false}
          pointerEvents="none"
          disabled={disabled}
          textColor={textColor}
          outlineStyle={{ borderRadius, borderColor: '#D7DDEA' }}
          style={{ backgroundColor }}
          right={
            <TextInput.Icon
              icon="chevron-down"
              forceTextInputFocus={false}
              onPress={() => setVisible(true)}
            />
          }
        />
      </Pressable>

      <Portal>
        <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={{ justifyContent: 'flex-end', flex: 1 }}>
          <Surface
            style={{
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingTop: 12,
              paddingBottom: 20,
              overflow: 'hidden',
            }}>
            <List.Item
              title={title ?? placeholder ?? 'Pilih opsi'}
              titleStyle={{ fontSize: 17, fontWeight: '700', color: '#24324B' }}
              left={() => null}
            />
            {options.map((option, index) => (
              <Pressable
                key={option.value}
                onPress={() => {
                  onChange(option.value);
                  setVisible(false);
                }}>
                <>
                  {index > 0 ? <View style={{ height: 1, backgroundColor: '#E8ECF4' }} /> : null}
                  <List.Item
                    title={option.label}
                    right={() =>
                      option.value === value ? <List.Icon icon="check" color="#4D96FF" /> : <List.Icon icon="chevron-right" color="#B8C2D6" />
                    }
                  />
                </>
              </Pressable>
            ))}
          </Surface>
        </Modal>
      </Portal>
    </>
  );
}
