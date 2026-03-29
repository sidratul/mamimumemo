import { Box, Text } from '../../theme/theme';
import { useFormContext } from './form.types';

type FormInputProps = {
  fieldKey: string;
};

export function FormInput<T extends Record<string, unknown>>({ fieldKey }: FormInputProps) {
  const { fields, formik } = useFormContext<T>();
  const field = fields[fieldKey as keyof T];
  const value = formik.values[fieldKey as keyof T];
  const error = formik.errors[fieldKey as keyof T] as string | undefined;

  return (
    <Box gap="xs">
      {field.label ? <Text>{field.label}</Text> : null}
      {field.input({
        ...field.props,
        value,
        onChange: (nextValue) => formik.setFieldValue(fieldKey, nextValue),
      })}
      {error ? <Text color="danger">{error}</Text> : null}
    </Box>
  );
}
