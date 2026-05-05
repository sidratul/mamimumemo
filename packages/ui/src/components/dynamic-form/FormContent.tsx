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
    gap: 16,
  },
  fieldBlock: {
    gap: 12,
  },
  sectionTitle: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  button: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginTop: 8,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.5,
    backgroundColor: '#94A3B8',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});
