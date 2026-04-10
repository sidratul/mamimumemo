import { FormikHelpers, FormikProps } from 'formik';
import { createContext, ReactNode, useContext } from 'react';
import { ViewStyle } from 'react-native';
import { AnySchema } from 'yup';
import { ZodType } from 'zod';

export type InputComponentProps<V> = {
  value?: V;
  defaultValue?: V;
  placeholder?: string;
  onChange: (value: V) => void;
  readOnly?: boolean;
  disabled?: boolean;
};

export type InputComponent<V> = (props: InputComponentProps<V> & Record<string, unknown>) => ReactNode;

export interface FormField<TForm, TValue, TProps = unknown> {
  label?: string;
  input: InputComponent<TValue>;
  validation?: AnySchema;
  props?: (Partial<InputComponentProps<TValue>> & TProps & Record<string, unknown>) | undefined;
  show?: (data: TForm) => boolean;
}

export type FormFieldProps<T> = {
  [K in keyof T]: FormField<T, T[K]>;
};

export interface DynamicFormProps<T extends Record<string, unknown>> {
  fields: FormFieldProps<T>;
  defaultValue?: T;
  data?: T;
  schema?: AnySchema | ZodType<T>;
  onSubmit?: (data: T, helper: FormikHelpers<T>) => void | Promise<void>;
  submitLabel?: string;
  loading?: boolean;
  readOnly?: boolean;
  showSubmitButton?: boolean;
  containerStyle?: ViewStyle;
  inputsContainerStyle?: ViewStyle;
}

type FormContextProps<T extends Record<string, unknown>> = DynamicFormProps<T> & {
  formik: FormikProps<T>;
};

export const FormContext = createContext<FormContextProps<any> | undefined>(undefined);

export function useFormContext<T extends Record<string, unknown>>() {
  const context = useContext(FormContext);

  if (!context) {
    throw new Error('useFormContext must be used within DynamicForm');
  }

  return context as FormContextProps<T>;
}
