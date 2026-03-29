import { Pressable } from 'react-native';

import { Box, Text } from '../../theme/theme';
import { FormInput } from './FormInput';
import { useFormContext } from './form.types';

export function FormContent<T extends Record<string, unknown>>() {
  const { fields, submitLabel, loading, formik } = useFormContext<T>();
  const values = formik.values;

  const visibleFieldKeys = Object.keys(fields).filter((key) => {
    const field = fields[key as keyof T];

    if (field.show && !field.show(values)) {
      return false;
    }

    return true;
  });

  return (
    <Box gap="md">
      {visibleFieldKeys.map((key) => (
        <FormInput<T> key={`form-field-${key}`} fieldKey={key} />
      ))}

      <Pressable disabled={loading} onPress={() => void formik.submitForm()}>
        <Box
          backgroundColor={loading ? 'textSecondary' : 'primary'}
          borderRadius="md"
          alignItems="center"
          padding="lg">
          <Text variant="buttonLabel">{loading ? 'Memproses...' : submitLabel ?? 'Simpan'}</Text>
        </Box>
      </Pressable>
    </Box>
  );
}
