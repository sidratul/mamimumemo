import * as yup from 'yup';
import { useState } from 'react';
import { HelperText } from 'react-native-paper';

import { Box } from '../../../theme/theme';
import { DynamicForm } from '../../../components/form/Form';
import { FormFieldProps } from '../../../components/form/form.types';
import { PasswordField, TextField } from '../../../components/input';
import { useSession } from '../../../providers/session-provider';
import { loginAsAdmin } from '../../../services/auth';

type LoginData = {
  email: string;
  password: string;
};

const fields: FormFieldProps<LoginData> = {
  email: {
    label: 'Email',
    input: TextField,
    validation: yup.string().required('Email wajib diisi').email('Format email tidak valid'),
    props: {
      placeholder: 'admin@daycare.id',
      keyboardType: 'email-address',
    },
  },
  password: {
    label: 'Password',
    input: PasswordField,
    validation: yup.string().required('Password wajib diisi').min(6, 'Password minimal 6 karakter'),
    props: {
      placeholder: 'Minimal 6 karakter',
    },
  },
};

export function LoginForm() {
  const { signIn } = useSession();
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(data: LoginData) {
    setSubmitError('');
    setSubmitting(true);

    try {
      const result = await loginAsAdmin(data.email, data.password);
      await signIn(result.accessToken, result.refreshToken);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Login gagal. Periksa email/password atau koneksi API.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box gap="md">
      <DynamicForm<LoginData>
        fields={fields}
        defaultValue={{ email: '', password: '' }}
        submitLabel="Masuk"
        loading={submitting}
        onSubmit={onSubmit}
      />

      {submitError ? <HelperText type="error">{submitError}</HelperText> : null}
    </Box>
  );
}
