import { useState } from 'react';
import { loginSchema } from '@mami/core';
import { DynamicForm, PasswordField, TextField, useToast, type FormFieldProps } from '@mami/ui';

import { Box } from '../../../theme/theme';
import { useSession } from '../../../providers/session-provider';
import { loginAsAdmin } from '../../../services/auth';

type LoginData = {
  email: string;
  password: string;
};

const fields: FormFieldProps<LoginData> = {
  email: {
    label: 'Email',
    required: true,
    input: TextField,
    props: {
      placeholder: 'admin@daycare.id',
      keyboardType: 'email-address',
    },
  },
  password: {
    label: 'Password',
    required: true,
    input: PasswordField,
    props: {
      placeholder: 'Minimal 6 karakter',
    },
  },
};

export function LoginForm() {
  const { signIn } = useSession();
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(data: LoginData) {
    setSubmitting(true);

    try {
      const result = await loginAsAdmin(data.email, data.password);
      await signIn(result.accessToken, result.refreshToken);
    } catch (error) {
      showToast({
        message: error instanceof Error ? error.message : 'Login gagal. Periksa email/password atau koneksi API.',
        tone: 'danger',
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box gap="md">
      <DynamicForm<LoginData>
        fields={fields}
        defaultValue={{ email: '', password: '' }}
        schema={loginSchema}
        submitLabel="Masuk"
        loading={submitting}
        onSubmit={onSubmit}
      />
    </Box>
  );
}
