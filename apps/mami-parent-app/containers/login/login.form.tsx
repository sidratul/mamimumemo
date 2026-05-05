import { DynamicForm, PasswordField, TextField, type FormFieldProps } from '@mami/ui';

import { loginInitialValues, loginSchema, type LoginFormValues } from './login.schema';

export function LoginForm({
  loading,
  onSubmit,
}: {
  loading?: boolean;
  onSubmit: (values: LoginFormValues) => Promise<void>;
}) {
  const fields: FormFieldProps<LoginFormValues> = {
    email: {
      label: 'Email',
      required: true,
      input: TextField,
      props: {
        placeholder: 'parent@mamimumemo.id',
        keyboardType: 'email-address',
      },
    },
    password: {
      label: 'Password',
      required: true,
      input: PasswordField,
      props: {
        placeholder: 'Masukkan password',
      },
    },
  };

  return (
    <DynamicForm<LoginFormValues>
      fields={fields}
      defaultValue={loginInitialValues}
      schema={loginSchema}
      submitLabel="Masuk"
      loading={loading}
      onSubmit={async (values) => {
        await onSubmit(values);
      }}
    />
  );
}
