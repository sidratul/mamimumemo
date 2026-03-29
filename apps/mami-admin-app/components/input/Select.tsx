import { useMemo, useState } from 'react';
import { Pressable } from 'react-native';
import { Menu, TextInput } from 'react-native-paper';

import { InputComponentProps } from '../form/form.types';

export type SelectOption = {
  label: string;
  value: string;
};

type SelectProps = InputComponentProps<string> & {
  options?: SelectOption[];
  disabled?: boolean;
};

export function Select({ value, placeholder, onChange, options = [], disabled }: SelectProps) {
  const [visible, setVisible] = useState(false);

  const selectedLabel = useMemo(() => {
    const selectedOption = options.find((option) => option.value === value);
    return selectedOption?.label ?? '';
  }, [options, value]);

  return (
    <Menu
      visible={visible}
      onDismiss={() => setVisible(false)}
      anchor={
        <Pressable disabled={disabled} onPress={() => setVisible(true)}>
          <TextInput
            mode="outlined"
            value={selectedLabel}
            placeholder={placeholder}
            editable={false}
            pointerEvents="none"
            disabled={disabled}
            right={<TextInput.Icon icon="chevron-down" />}
          />
        </Pressable>
      }>
      {options.map((option) => (
        <Menu.Item
          key={option.value}
          title={option.label}
          onPress={() => {
            onChange(option.value);
            setVisible(false);
          }}
        />
      ))}
    </Menu>
  );
}
