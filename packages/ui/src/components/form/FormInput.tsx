import { StyleSheet, Text, View } from 'react-native';

import { useFormContext } from './form.types';

type FormInputProps = {
  fieldKey: string;
};

export function FormInput<T extends Record<string, unknown>>({ fieldKey }: FormInputProps) {
  const { fields, formik, readOnly } = useFormContext<T>();
  const field = fields[fieldKey as keyof T];
  const value = formik.values[fieldKey as keyof T];
  const error = formik.errors[fieldKey as keyof T] as string | undefined;

  return (
    <View style={styles.container}>
      {field.label ? <Text style={styles.label}>{field.label}</Text> : null}
      {field.input({
        ...field.props,
        value,
        defaultValue: value,
        readOnly,
        disabled: readOnly,
        onChange: (nextValue) => formik.setFieldValue(fieldKey, nextValue),
      })}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    color: '#3D2218',
    fontWeight: '600',
    fontSize: 14,
  },
  error: {
    color: '#C6285A',
    fontSize: 12,
  },
});
