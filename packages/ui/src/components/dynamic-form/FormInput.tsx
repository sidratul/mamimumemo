import { FormField } from './form.types';
import { useFormContext } from './form.types';
import { FieldShell } from '../primitives/FieldShell';

type FormInputProps = {
  fieldKey: string;
};

export function FormInput<T extends Record<string, any>>({ fieldKey }: FormInputProps) {
  const { fields, formik, readOnly } = useFormContext<T>();
  const field = fields[fieldKey as keyof T] as FormField<T, any, any>;
  const value = formik.values[fieldKey as keyof T];
  const error = formik.errors[fieldKey as keyof T] as string | undefined;

  return (
    <FieldShell 
      label={field.label} 
      required={field.required} 
      helperText={field.helperText}
      error={formik.touched[fieldKey as keyof T] ? error : undefined}
    >
      {field.input({
        ...field.props,
        value,
        defaultValue: value,
        readOnly,
        disabled: readOnly,
        onChange: (nextValue: any) => formik.setFieldValue(fieldKey as string, nextValue),
      })}
    </FieldShell>
  );
}
