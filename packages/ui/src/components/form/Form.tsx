import { useFormik } from 'formik';
import { object } from 'yup';
import { View } from 'react-native';

import { FormContent } from './FormContent';
import { DynamicFormProps, FormContext } from './form.types';

export function DynamicForm<T extends Record<string, unknown>>({
  fields,
  defaultValue,
  data,
  onSubmit,
  submitLabel,
  loading,
  readOnly,
  containerStyle,
  inputsContainerStyle,
}: DynamicFormProps<T>) {
  const initialValues = (data ?? defaultValue ?? {}) as T;
  const fieldKeys = Object.keys(fields) as (keyof T)[];

  const validationShape = fieldKeys.reduce((shape, key) => {
    const validation = fields[key].validation;

    if (validation) {
      shape[key as string] = validation;
    }

    return shape;
  }, {} as Record<string, any>);

  const formik = useFormik<T>({
    initialValues,
    enableReinitialize: true,
    validationSchema: object(validationShape),
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values, helper) => {
      if (!onSubmit) {
        return;
      }

      await onSubmit(values, helper);
    },
  });

  return (
    <FormContext.Provider
      value={{
        fields,
        defaultValue,
        data,
        onSubmit,
        submitLabel,
        loading,
        readOnly,
        containerStyle,
        inputsContainerStyle,
        formik,
      }}>
      <View style={containerStyle}>
        <FormContent />
      </View>
    </FormContext.Provider>
  );
}
