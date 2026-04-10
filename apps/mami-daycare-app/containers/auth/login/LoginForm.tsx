import { useState } from 'react';
import { router } from 'expo-router';
import { DynamicForm, PasswordField, TextField, type FormFieldProps } from '@mami/ui';
import { loginSchema } from '@mami/core';
import { HelperText } from 'react-native-paper';

import { useSession } from '../../../providers/session-provider';
import { signInDaycareOwner } from '../../../services/registration';
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
    label: 'Email',
    input: TextField,
    props: {
      placeholder: 'owner@daycare.id',
      keyboardType: 'email-address',
      autoCapitalize: 'none',
      borderRadius: 14,
      backgroundColor: '#FFFFFF',
    },
  },
  password: {
    label: 'Password',
    input: PasswordField,
    props: {
      placeholder: 'Masukkan password',
      borderRadius: 14,
      backgroundColor: '#FFFFFF',
    },
  },
};

export function LoginForm() {
  const { saveSession } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function onSubmit(values: LoginData) {
    try {
      setIsSubmitting(true);
      setErrorMessage('');
      const result = await signInDaycareOwner(values);
      await saveSession({
        token: result.token,
        refreshToken: result.refreshToken,
        daycareId: result.daycareId,
        ownerEmail: result.ownerEmail,
        ownerName: result.ownerName,
      });
      router.replace('/(daycare)');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Gagal masuk. Silakan coba lagi.');
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
        submitLabel="Masuk"
        loading={isSubmitting}
        onSubmit={onSubmit}
      />

      {errorMessage ? <HelperText type="error">{errorMessage}</HelperText> : null}
    </Box>
  );
}
