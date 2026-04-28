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
      {visibleFieldKeys.map((key, index) => {
        const field = fields[key as keyof T];
        const previousField = index > 0 ? fields[visibleFieldKeys[index - 1] as keyof T] : undefined;
        const showSection = Boolean(field.section) && field.section !== previousField?.section;

        return (
          <View key={`form-field-${key}`} style={styles.fieldBlock}>
            {showSection ? <Text style={styles.sectionTitle}>{field.section}</Text> : null}
            <FormInput<T> fieldKey={key} />
          </View>
        );
      })}

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
  fieldBlock: {
    gap: 12,
  },
  sectionTitle: {
    color: '#24324B',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
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
