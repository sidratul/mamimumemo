import { useState } from 'react';
import { Pressable } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { DynamicForm, NumberField, PasswordField, TextAreaField, TextField, type FormFieldProps } from '@mami/ui';
import { daycareRegistrationDaycareStepSchema, daycareRegistrationOwnerStepSchema } from '@mami/core';
import { HelperText } from 'react-native-paper';

import { useSession } from '../../../providers/session-provider';
import { submitDaycareRegistration } from '../../../services/registration';
import { Box, Text } from '../../../theme/theme';

type RegisterData = {
  daycareName: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  password: string;
  city: string;
  address: string;
  description: string;
};

type RegisterStep = 'daycare' | 'owner';

const initialValues: RegisterData = {
  daycareName: '',
  ownerName: '',
  ownerEmail: '',
  ownerPhone: '',
  password: '',
  city: '',
  address: '',
  description: '',
};

function StepItem({
  label,
  icon,
  active,
  done,
}: {
  label: string;
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  active: boolean;
  done: boolean;
}) {
  const iconColor = active || done ? '#FFFFFF' : '#8E5C4A';
  const backgroundColor = active || done ? '#C75B39' : '#FFF1E8';
  const textColor = active || done ? '#3D2218' : '#8E5C4A';

  return (
    <Box flex={1} gap="xs" alignItems="center">
      <Box flexDirection="row" alignItems="center" gap="sm">
        <Box
          width={34}
          height={34}
          borderRadius="lg"
          style={{ backgroundColor }}
          alignItems="center"
          justifyContent="center">
          <MaterialIcons name={done && !active ? 'check' : icon} size={18} color={iconColor} />
        </Box>
        <Text style={{ fontSize: 12, fontWeight: '700', color: textColor }}>{label}</Text>
      </Box>
    </Box>
  );
}

type DaycareStepData = Pick<RegisterData, 'daycareName' | 'city' | 'address' | 'description'>;
type OwnerStepData = Pick<RegisterData, 'ownerName' | 'ownerEmail' | 'ownerPhone' | 'password'>;

const daycareFields: FormFieldProps<DaycareStepData> = {
  daycareName: {
    label: 'Nama Daycare',
    input: TextField,
    props: {
      placeholder: 'Contoh: Mami Daycare Kemang',
      borderRadius: 14,
      backgroundColor: '#FFFFFF',
    },
  },
  city: {
    label: 'Kota',
    input: TextField,
    props: {
      placeholder: 'Contoh: Jakarta Selatan',
      borderRadius: 14,
      backgroundColor: '#FFFFFF',
    },
  },
  address: {
    label: 'Alamat Daycare',
    input: TextAreaField,
    props: {
      placeholder: 'Alamat lengkap daycare',
      borderRadius: 14,
      backgroundColor: '#FFFFFF',
      numberOfLines: 3,
    },
  },
  description: {
    label: 'Deskripsi Singkat',
    input: TextAreaField,
    props: {
      placeholder: 'Deskripsi operasional daycare, jam layanan, kapasitas, dll.',
      borderRadius: 14,
      backgroundColor: '#FFFFFF',
      numberOfLines: 3,
    },
  },
};

const ownerFields: FormFieldProps<OwnerStepData> = {
  ownerName: {
    label: 'Nama Owner',
    input: TextField,
    props: {
      placeholder: 'Contoh: Nadia Putri',
      borderRadius: 14,
      backgroundColor: '#FFFFFF',
    },
  },
  ownerEmail: {
    label: 'Email Owner',
    input: TextField,
    props: {
      placeholder: 'owner@daycare.id',
      keyboardType: 'email-address',
      autoCapitalize: 'none',
      borderRadius: 14,
      backgroundColor: '#FFFFFF',
    },
  },
  ownerPhone: {
    label: 'Nomor Telepon Owner',
    input: NumberField,
    props: {
      placeholder: '08xxxxxxxxxx',
      borderRadius: 14,
      backgroundColor: '#FFFFFF',
    },
  },
  password: {
    label: 'Password Akun',
    input: PasswordField,
    props: {
      placeholder: 'Minimal 6 karakter',
      borderRadius: 14,
      backgroundColor: '#FFFFFF',
    },
  },
};

export function RegisterForm() {
  const { saveSession } = useSession();
  const [values, setValues] = useState<RegisterData>(initialValues);
  const [step, setStep] = useState<RegisterStep>('daycare');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [daycareId, setDaycareId] = useState('');

  function handleNextStep(nextValues: DaycareStepData) {
    setValues((current) => ({
      ...current,
      ...nextValues,
    }));
    setErrorMessage('');
    setStep('owner');
  }

  function handlePreviousStep() {
    setErrorMessage('');
    setStep('daycare');
  }

  async function onSubmit(ownerValues: OwnerStepData) {
    setErrorMessage('');
    setSuccessMessage('');

    try {
      setIsSubmitting(true);
      const payload = {
        ...values,
        ...ownerValues,
      };
      setValues(payload);
      const result = await submitDaycareRegistration(payload);
      await saveSession({
        token: result.token,
        refreshToken: result.refreshToken,
        daycareId: result.id,
        ownerEmail: result.ownerEmail,
        ownerName: result.ownerName,
      });
      setDaycareId(result.id);
      setSuccessMessage(`${result.message} Status akhir: ${result.status}.`);
      setValues(initialValues);
      router.replace('/(daycare)/registration-status');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Gagal mengirim registrasi. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Box gap="md">
      <Box backgroundColor="surface" borderRadius="lg" borderWidth={1} borderColor="border" padding="md" gap="sm">
        <Box flexDirection="row" alignItems="center">
          <StepItem label="Daycare" icon="apartment" active={step === 'daycare'} done={step === 'owner'} />
          <Box flex={1} height={1} style={{ backgroundColor: '#F0D5C9' }} marginHorizontal="sm" />
          <StepItem label="Owner" icon="person-outline" active={step === 'owner'} done={false} />
        </Box>
      </Box>

      {step === 'daycare' ? (
        <Box backgroundColor="surface" borderRadius="lg" borderWidth={1} borderColor="border" padding="md" gap="md">
          <DynamicForm<DaycareStepData>
            fields={daycareFields}
            defaultValue={{
              daycareName: values.daycareName,
              city: values.city,
              address: values.address,
              description: values.description,
            }}
            schema={daycareRegistrationDaycareStepSchema}
            submitLabel="Lanjut"
            onSubmit={handleNextStep}
          />
          <Box flexDirection="row" justifyContent="center" alignItems="center" gap="xs">
            <Text color="textSecondary">Sudah punya akun?</Text>
            <Pressable onPress={() => router.push('/(auth)/login')}>
              <Text color="primary" style={{ fontWeight: '700' }}>Masuk</Text>
            </Pressable>
          </Box>
        </Box>
      ) : null}

      {step === 'owner' ? (
        <Box backgroundColor="surface" borderRadius="lg" borderWidth={1} borderColor="border" padding="md" gap="md">
          <DynamicForm<OwnerStepData>
            fields={ownerFields}
            defaultValue={{
              ownerName: values.ownerName,
              ownerEmail: values.ownerEmail,
              ownerPhone: values.ownerPhone,
              password: values.password,
            }}
            schema={daycareRegistrationOwnerStepSchema}
            submitLabel={isSubmitting ? 'Mengirim...' : 'Kirim'}
            loading={isSubmitting}
            onSubmit={onSubmit}
          />
          <Box flexDirection="row" gap="sm">
            <Pressable onPress={handlePreviousStep} style={{ flex: 1 }}>
              <Box backgroundColor="background" borderRadius="lg" borderWidth={1} borderColor="border" padding="md" alignItems="center">
                <Text style={{ fontWeight: '700' }}>Kembali</Text>
              </Box>
            </Pressable>
          </Box>
        </Box>
      ) : null}

      {errorMessage ? <HelperText type="error">{errorMessage}</HelperText> : null}

      {successMessage ? (
        <Box backgroundColor="surface" borderRadius="lg" borderWidth={1} borderColor="border" padding="lg" gap="xs">
          <Text color="success" style={{ fontWeight: '700' }}>Registrasi Berhasil</Text>
          <Text>{successMessage}</Text>
          <Text color="textSecondary">ID Daycare: {daycareId}</Text>
        </Box>
      ) : null}

    </Box>
  );
}
