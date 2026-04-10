import { useFormik } from 'formik';
import { ValidationError, object } from 'yup';
import { View } from 'react-native';
import { ZodError } from 'zod';

import { FormContent } from './FormContent';
import { DynamicFormProps, FormContext } from './form.types';

function mapYupErrors(error: ValidationError) {
  return error.inner.reduce((result, item) => {
    if (item.path && !result[item.path]) {
      result[item.path] = item.message;
    }

    return result;
  }, {} as Record<string, string>);
}

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
  const fieldKeys = Object.keys(fields) as (keyof T)[];

  const validationShape = fieldKeys.reduce((shape, key) => {
    const validation = fields[key].validation;

    if (validation) {
      shape[key as string] = validation;
    }

    return shape;
  }, {} as Record<string, any>);

  const fallbackYupSchema = Object.keys(validationShape).length > 0 ? object(validationShape) : undefined;

  const formik = useFormik<T>({
    initialValues,
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnChange: false,
    validate: async (values) => {
      try {
        if (schema) {
          if ('safeParse' in schema) {
            const result = schema.safeParse(values);
            if (!result.success) {
              return mapZodErrors(result.error);
            }
            return {};
          }

          await schema.validate(values, { abortEarly: false });
          return {};
        }

        if (fallbackYupSchema) {
          await fallbackYupSchema.validate(values, { abortEarly: false });
        }

        return {};
      } catch (error) {
        if (error instanceof ZodError) {
          return mapZodErrors(error);
        }

        if (error instanceof ValidationError) {
          return mapYupErrors(error);
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
