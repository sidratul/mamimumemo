import { useFormik } from 'formik';
import { View } from 'react-native';
import { ZodError } from 'zod';

import { FormContent } from './FormContent';
import { DynamicFormProps, FormContext } from './form.types';

function mapZodErrors(error: ZodError) {
  return error.issues.reduce((result, issue) => {
    const path = String(issue.path[0] ?? '');
    if (path && !result[path]) {
      result[path] = issue.message;
    }

    return result;
  }, {} as Record<string, string>);
}

export function DynamicForm<T extends Record<string, unknown>>({
  fields,
  defaultValue,
  data,
  schema,
  onSubmit,
  submitLabel,
  loading,
  readOnly,
  containerStyle,
  inputsContainerStyle,
}: DynamicFormProps<T>) {
  const initialValues = (data ?? defaultValue ?? {}) as T;

  const formik = useFormik<T>({
    initialValues,
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnChange: false,
    validate: async (values) => {
      try {
        if (!schema) {
          return {};
        }

        const result = schema.safeParse(values);
        if (!result.success) {
          return mapZodErrors(result.error);
        }

        return {};
      } catch (error) {
        if (error instanceof ZodError) {
          return mapZodErrors(error);
        }

        return {};
      }
    },
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
        schema,
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
