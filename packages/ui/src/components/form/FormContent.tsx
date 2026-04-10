import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FormInput } from './FormInput';
import { useFormContext } from './form.types';

export function FormContent<T extends Record<string, unknown>>() {
  const { fields, submitLabel, loading, formik, readOnly, showSubmitButton = true, inputsContainerStyle } = useFormContext<T>();
  const values = formik.values;

  const visibleFieldKeys = Object.keys(fields).filter((key) => {
    const field = fields[key as keyof T];
    if (field.show && !field.show(values)) {
      return false;
    }
    return true;
  });

  return (
    <View style={[styles.container, inputsContainerStyle]}>
      {visibleFieldKeys.map((key) => (
        <FormInput<T> key={`form-field-${key}`} fieldKey={key} />
      ))}

      {!readOnly && showSubmitButton ? (
        <Pressable disabled={loading} onPress={() => void formik.submitForm()}>
          <View style={[styles.button, loading ? styles.buttonDisabled : null]}>
            <Text style={styles.buttonText}>{loading ? 'Memproses...' : submitLabel ?? 'Simpan'}</Text>
          </View>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  button: {
    backgroundColor: '#C75B39',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});
