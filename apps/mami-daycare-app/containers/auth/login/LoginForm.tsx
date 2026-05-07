import { useState } from 'react';
import { DynamicForm, PasswordField, TextField, useToast, type FormFieldProps } from '@mami/ui';
import { loginSchema } from '@mami/core';

import { useSession } from '../../../providers/session-provider';
import { signInDaycareOwner } from '../../../services/registration/registration';
import { Box } from '../../../theme/theme';

type LoginData = {
  email: string;
  password: string;
};

const initialValues: LoginData = {
  email: '',
  password: '',
};

const fields: FormFieldProps<LoginData> = {
  email: {
    label: 'Email Pengelola',
    required: true,
    input: TextField,
    props: {
      placeholder: 'owner@email.com',
      keyboardType: 'email-address',
      autoCapitalize: 'none',
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

export function LoginForm() {
  const { saveSession } = useSession();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(values: LoginData) {
    try {
      setIsSubmitting(true);

      console.log('[DaycareLogin] submit', {
        email: values.email.trim().toLowerCase(),
      });

      const loginResult = await signInDaycareOwner(values);

      await saveSession({
        token: loginResult.token,
        refreshToken: loginResult.refreshToken,
        daycareId: loginResult.daycareId ?? '',
        ownerEmail: loginResult.ownerEmail,
        ownerName: loginResult.ownerName,
      });

      showToast({
        message: 'Selamat datang kembali!',
        tone: 'success',
      });
    } catch (error) {
      console.warn('[DaycareLogin] failed', error instanceof Error ? error.message : error);
      showToast({
        message: error instanceof Error ? error.message : 'Gagal masuk. Silakan coba lagi.',
        tone: 'danger',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Box gap="md">
      <DynamicForm<LoginData>
        fields={fields}
        defaultValue={initialValues}
        schema={loginSchema}
        submitLabel="Masuk ke Dashboard"
        loading={isSubmitting}
        onSubmit={onSubmit}
      />
    </Box>
  );
}
