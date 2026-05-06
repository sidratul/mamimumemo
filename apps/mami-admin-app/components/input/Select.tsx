import { SelectInput as BaseSelectInput, type SelectOption } from '@mami/ui';
import { View } from 'react-native';

type SelectProps = {
  value?: string;
  placeholder?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  options: SelectOption[];
  title?: string;
};

export function Select(props: SelectProps) {
  return (
    <View style={{ flex: 1 }}>
      <BaseSelectInput
        value={props.value}
        placeholder={props.placeholder}
        onChange={props.onChange}
        disabled={props.disabled}
        options={props.options}
        title={props.title}
      />
    </View>
  );
}
