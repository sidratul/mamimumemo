import { useEffect, useMemo, useState } from 'react';
import { Redirect, router } from 'expo-router';
import { Button } from 'react-native-paper';
import { ScreenHeader, ScreenSection } from '@mami/ui';
import { formatDateTimeId } from '@mami/core';

import { useSession } from '../../../providers/session-provider';
import { getMyDaycareRegistration, type DaycareRegistrationStatus } from '../../../services/registration';
import { Box, Text } from '../../../theme/theme';

const badgeColors: Record<DaycareRegistrationStatus['approvalStatus'], { bg: string; text: string }> = {
  DRAFT: { bg: '#F6E8EF', text: '#8A4C73' },
  SUBMITTED: { bg: '#EEE9FF', text: '#6D28D9' },
  IN_REVIEW: { bg: '#E8F1FF', text: '#2563EB' },
  NEEDS_REVISION: { bg: '#FFF3E0', text: '#D97706' },
  APPROVED: { bg: '#E8F7EF', text: '#1F9D63' },
  REJECTED: { bg: '#FDECEF', text: '#C6285A' },
  SUSPENDED: { bg: '#F2F4F7', text: '#6B7280' },
};

const statusLabels: Record<DaycareRegistrationStatus['approvalStatus'], string> = {
  DRAFT: 'Draft',
  SUBMITTED: 'Menunggu Review',
  IN_REVIEW: 'Sedang Dicek',
  NEEDS_REVISION: 'Perlu Revisi',
  APPROVED: 'Aktif',
  REJECTED: 'Ditolak',
  SUSPENDED: 'Ditangguhkan',
};

export function RegistrationStatusContainer() {
  const { isLoading, session, signOut } = useSession();
  const [status, setStatus] = useState<DaycareRegistrationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function run() {
      if (!session) {
        return;
      }

      try {
        setLoading(true);
        setError('');
        const result = await getMyDaycareRegistration(session.token);
        setStatus(result);
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : 'Gagal memuat status registrasi daycare.');
      } finally {
        setLoading(false);
      }
    }

    void run();
  }, [session]);

  const submittedLabel = useMemo(() => {
    if (!status?.submittedAt) {
      return 'Belum ada tanggal submit';
    }

    return formatDateTimeId(status.submittedAt);
  }, [status?.submittedAt]);

  if (isLoading) {
    return null;
  }

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  const palette = badgeColors[status?.approvalStatus ?? 'SUBMITTED'];

  return (
    <Box flex={1} backgroundColor="background" padding="lg" paddingTop="xl" gap="md">
      <ScreenHeader title="Status" subtitle="Pantau proses review daycare kamu." />

      {loading ? (
        <ScreenSection gap={8}>
          <Text style={{ fontWeight: '700' }}>Memuat...</Text>
        </ScreenSection>
      ) : null}

      {!loading && error ? (
        <ScreenSection gap={8}>
          <Text color="danger" style={{ fontWeight: '700' }}>Status belum bisa dimuat</Text>
          <Text color="textSecondary">{error}</Text>
        </ScreenSection>
      ) : null}

      {!loading && !error && status ? (
        <>
          <ScreenSection>
            <Box gap="xs">
              <Text variant="title">{status.name}</Text>
              <Text variant="subtitle">{status.city}</Text>
            </Box>

            <Box
              style={{ backgroundColor: palette.bg }}
              borderRadius="lg"
              padding="md"
              alignSelf="flex-start">
              <Text style={{ color: palette.text, fontWeight: '700' }}>{statusLabels[status.approvalStatus]}</Text>
            </Box>

            <Box gap="xs">
              <Text color="textSecondary">Dikirim</Text>
              <Text>{submittedLabel}</Text>
            </Box>

            <Box gap="xs">
              <Text color="textSecondary">Catatan</Text>
              <Text>{status.approvalNote || 'Belum ada catatan.'}</Text>
            </Box>
          </ScreenSection>

          {status.approvalStatus === 'APPROVED' ? (
            <Box paddingHorizontal="xl">
              <Button mode="contained" onPress={() => void router.push('/(daycare)/operations')}>
                Buka Operasional
              </Button>
            </Box>
          ) : null}
        </>
      ) : null}

      {!loading && !error && !status ? (
        <ScreenSection gap={8}>
          <Text style={{ fontSize: 20, fontWeight: '700' }}>Belum ada daycare</Text>
          <Text color="textSecondary">Data daycare belum ditemukan.</Text>
        </ScreenSection>
      ) : null}

      <Box paddingHorizontal="xl">
        <Button mode="outlined" onPress={() => void signOut()}>
          Keluar
        </Button>
      </Box>
    </Box>
  );
}
