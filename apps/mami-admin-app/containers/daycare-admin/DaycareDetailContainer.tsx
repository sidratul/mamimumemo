import { useEffect, useMemo, useState } from 'react';
import { Linking, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import * as yup from 'yup';
import { ActivityIndicator } from 'react-native-paper';

import { ApprovalStatusBadge } from '../../components/daycare-admin';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { DynamicForm } from '../../components/form/Form';
import { FormFieldProps } from '../../components/form/form.types';
import { ApprovalStatusSelect, TextAreaField } from '../../components/input';
import {
  getAvailableApprovalStatusOptions,
  getDaycareById,
  updateDaycareApprovalStatus,
  type AdminDaycare,
  type ApprovalStatus,
} from '../../services/daycare-admin';
import { Box, Text } from '../../theme/theme';

type ApprovalForm = {
  status: string;
  note: string;
};

const fields: FormFieldProps<ApprovalForm> = {
  status: {
    label: 'Status Approval',
    input: ApprovalStatusSelect,
    validation: yup.string().required('Status wajib dipilih'),
  },
  note: {
    label: 'Catatan Review',
    input: TextAreaField,
    validation: yup.string().required('Catatan wajib diisi'),
    props: { placeholder: 'Catatan approval, revisi, reject, atau suspend' },
  },
};

type DaycareDetailContainerProps = {
  id: string;
};

export function DaycareDetailContainer({ id }: DaycareDetailContainerProps) {
  const router = useRouter();
  const [daycare, setDaycare] = useState<AdminDaycare | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    async function run() {
      try {
        setLoading(true);
        setError('');
        const data = await getDaycareById(id);
        setDaycare(data);
      } catch (nextError) {
        setDaycare(null);
        setError(nextError instanceof Error ? nextError.message : 'Gagal mengambil detail daycare.');
      } finally {
        setLoading(false);
      }
    }

    void run();
  }, [id]);

  const nextStatusOptions = useMemo(
    () => (daycare ? getAvailableApprovalStatusOptions(daycare.approvalStatus) : []),
    [daycare]
  );

  const defaultFormValue = useMemo(
    () => ({
      status: nextStatusOptions[0]?.value ?? '',
      note: daycare?.approvalNote ?? '',
    }),
    [daycare?.approvalNote, nextStatusOptions]
  );

  const submittedLabel = daycare?.submittedAt
    ? new Date(daycare.submittedAt).toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Belum disubmit';

  const approvedLabel = daycare?.approvedAt
    ? new Date(daycare.approvedAt).toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Belum approved';

  if (loading) {
    return (
      <ScreenContainer>
        <Box backgroundColor="surface" borderColor="border" borderWidth={1} borderRadius="lg" padding="xl" gap="sm" alignItems="center">
          <ActivityIndicator color="#E23A8A" />
          <Text color="textSecondary">Memuat detail daycare...</Text>
        </Box>
      </ScreenContainer>
    );
  }

  if (!daycare || error) {
    return (
      <ScreenContainer>
        <Box backgroundColor="surface" borderColor="border" borderWidth={1} borderRadius="lg" padding="xl" gap="sm">
          <Text color="danger" style={{ fontWeight: '700' }}>Detail daycare tidak tersedia</Text>
          <Text color="textSecondary">{error || 'Daycare tidak ditemukan.'}</Text>
        </Box>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Box gap="xs">
        <Text variant="title">{daycare.name}</Text>
        <Text variant="subtitle">{daycare.city}</Text>
      </Box>

      <Box backgroundColor="surface" borderColor="border" borderWidth={1} borderRadius="lg" padding="lg" gap="md">
        <Box flexDirection="row" justifyContent="space-between" alignItems="center">
          <Text variant="cardValue">Status Saat Ini</Text>
          <ApprovalStatusBadge status={daycare.approvalStatus} />
        </Box>
        <Text color="textSecondary">Owner: {daycare.ownerName} ({daycare.ownerEmail})</Text>
        <Box flexDirection="row" justifyContent="space-between">
          <Box flex={1} gap="xs">
            <Text color="textSecondary">Submitted</Text>
            <Text>{submittedLabel}</Text>
          </Box>
          <Box flex={1} gap="xs">
            <Text color="textSecondary">Approved</Text>
            <Text>{approvedLabel}</Text>
          </Box>
        </Box>
      </Box>

      <Box backgroundColor="surface" borderColor="border" borderWidth={1} borderRadius="lg" padding="lg" gap="sm">
        <Text variant="cardValue">Profil Daycare</Text>
        <Text>{daycare.address || 'Alamat belum tersedia.'}</Text>
        <Text color="textSecondary">{daycare.description || 'Belum ada deskripsi daycare.'}</Text>
      </Box>

      <Box backgroundColor="surface" borderColor="border" borderWidth={1} borderRadius="lg" padding="lg" gap="sm">
        <Text variant="cardValue">Legal Documents</Text>
        {daycare.legalDocuments.length === 0 ? <Text color="textSecondary">Belum ada dokumen legal.</Text> : null}
        {daycare.legalDocuments.map((document, index) => (
          <Pressable key={`${document.type}-${index}`} onPress={() => void Linking.openURL(document.url)}>
            <Box borderColor="border" borderWidth={1} borderRadius="md" padding="md" gap="xs">
              <Box flexDirection="row" justifyContent="space-between" alignItems="center">
                <Text style={{ fontWeight: '700' }}>{document.type}</Text>
                <Text color={document.verified ? 'success' : 'textSecondary'}>
                  {document.verified ? 'Verified' : 'Pending'}
                </Text>
              </Box>
              <Text color="primary">{document.url}</Text>
            </Box>
          </Pressable>
        ))}
      </Box>

      {nextStatusOptions.length > 0 ? (
        <Box backgroundColor="surface" borderColor="border" borderWidth={1} borderRadius="lg" padding="lg" gap="md">
          <Text variant="cardValue">Review Action</Text>
          {submitError ? <Text color="danger">{submitError}</Text> : null}
          <DynamicForm<ApprovalForm>
            fields={{
              ...fields,
              status: {
                ...fields.status,
                props: {
                  placeholder: 'Pilih status tujuan',
                  options: nextStatusOptions,
                },
              },
            }}
            defaultValue={defaultFormValue}
            submitLabel="Update Status"
            loading={submitLoading}
            onSubmit={async (data) => {
              try {
                setSubmitLoading(true);
                setSubmitError('');
                const updated = await updateDaycareApprovalStatus(id, data.status as ApprovalStatus, data.note);
                setDaycare({ ...updated });
              } catch (nextError) {
                setSubmitError(nextError instanceof Error ? nextError.message : 'Gagal memperbarui status daycare.');
              } finally {
                setSubmitLoading(false);
              }
            }}
          />
        </Box>
      ) : (
        <Box backgroundColor="surface" borderColor="border" borderWidth={1} borderRadius="lg" padding="lg" gap="xs">
          <Text variant="cardValue">Review Action</Text>
          <Text color="textSecondary">Tidak ada transisi status lanjutan yang tersedia dari status saat ini.</Text>
        </Box>
      )}

      <Pressable onPress={() => router.push({ pathname: '/(app)/daycares/[id]/history', params: { id } })}>
        <Box borderColor="primary" borderWidth={1} borderRadius="md" padding="lg" alignItems="center" backgroundColor="surface">
          <Text color="primary" style={{ fontWeight: '700' }}>Lihat Approval History</Text>
        </Box>
      </Pressable>
    </ScreenContainer>
  );
}
