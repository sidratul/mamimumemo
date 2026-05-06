import { useEffect, useMemo, useState } from 'react';
import { Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { ActivityIndicator } from 'react-native-paper';
import { BottomDrawer, DetailScreen, SegmentTabs, type SelectOption } from '@mami/ui';
import { formatDateTimeId } from '@mami/core';

import {
  getDaycareById,
  updateDaycareApprovalStatus,
  updateDaycareDocuments,
} from '../../services/daycare';
import {
  getDaycareMemberships,
} from '../../services/membership';
import {
  getApprovalStatusLabel,
  getApprovalStatusHelperText,
  getAvailableApprovalStatusOptions,
} from '../../shared/daycare/logic';
import { DaycareRecord, ApprovalStatus } from '../../shared/daycare/types';
import { pickAndUploadDaycareDocument } from '../../services/uploads';
import { Box, Text } from '../../theme/theme';
import { DaycareDocumentForm } from './DaycareDocumentForm';
import { DaycareDocumentsSection } from './DaycareDocumentsSection';
import { DaycareHeroSection } from './DaycareHeroSection';
import { DaycareHistorySection } from './DaycareHistorySection';
import { DaycareMembershipsSection } from './DaycareMembershipsSection';
import { DaycareOwnerSection } from './DaycareOwnerSection';
import { DaycareStatusSection } from './DaycareStatusSection';
import { DaycareStatusForm } from './DaycareStatusForm';
import { getDocumentName, getInitials } from './daycare-detail.utils';

type DaycareDetailContainerProps = {
  id: string;
};

type DocumentDraft = {
  type: string;
  url: string;
  verified: boolean;
};

export function DaycareDetailContainer({ id }: DaycareDetailContainerProps) {
  const router = useRouter();
  const [daycare, setDaycare] = useState<DaycareRecord | null>(null);
  const [memberships, setMemberships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [statusSheetVisible, setStatusSheetVisible] = useState(false);
  const [documentsSheetVisible, setDocumentsSheetVisible] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [documentsError, setDocumentsError] = useState('');
  const [nextStatus, setNextStatus] = useState('');
  const [reviewNote, setReviewNote] = useState('');
  const [documentDrafts, setDocumentDrafts] = useState<DocumentDraft[]>([]);

  useEffect(() => {
    async function run() {
      try {
        setLoading(true);
        setError('');
        const [daycareRes, membershipsRes] = await Promise.all([
          getDaycareById(id),
          getDaycareMemberships(id),
        ]);
        if (daycareRes.error) throw daycareRes.error;
        setDaycare(daycareRes.data || null);
        setMemberships(membershipsRes.items ?? []);
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
    () => (daycare?.approval?.status ? getAvailableApprovalStatusOptions(daycare.approval.status) : []),
    [daycare]
  );

  const statusSelectionOptions = useMemo(() => {
    if (!daycare?.approval?.status) {
      return [];
    }

    const currentStatusOption = {
      label: `${getApprovalStatusLabel(daycare.approval.status)} (saat ini)`,
      value: daycare.approval.status,
    };

    return [
      currentStatusOption,
      ...nextStatusOptions.filter((option) => option.value !== daycare.approval?.status),
    ];
  }, [daycare, nextStatusOptions]);

  useEffect(() => {
    setNextStatus(daycare?.approval?.status ?? '');
    setReviewNote(daycare?.approval?.note ?? '');
  }, [daycare?.approval]);

  useEffect(() => {
    setDocumentDrafts(
      daycare?.legalDocuments?.length
        ? daycare.legalDocuments.map((item) => ({
            type: item.type,
            url: item.url,
            verified: item.verified,
          }))
        : [{ type: '', url: '', verified: false }]
    );
  }, [daycare?.legalDocuments]);

  const submittedLabel = daycare?.submittedAt ? formatDateTimeId(daycare.submittedAt) : 'Belum diajukan';
  const latestHistory = daycare?.approval?.history?.slice(0, 3) ?? [];

  if (loading) {
    return (
      <DetailScreen title="Detail Daycare" onBack={() => router.back()} scrollable={false}>
        <Box paddingHorizontal="md" paddingTop="xxl" alignItems="center" gap="md">
          <ActivityIndicator color="#4F46E5" />
          <Text variant="bodySmall" color="textSecondary">Memuat detail daycare...</Text>
        </Box>
      </DetailScreen>
    );
  }

  if (!daycare || error) {
    return (
      <DetailScreen title="Detail Daycare" onBack={() => router.back()} scrollable={false}>
        <Box paddingHorizontal="md" paddingTop="xxl" gap="sm">
          <Text color="danger" fontWeight="800">
            Detail daycare tidak tersedia
          </Text>
          <Text variant="bodySmall" color="textSecondary">{error || 'Daycare tidak ditemukan.'}</Text>
        </Box>
      </DetailScreen>
    );
  }

  return (
    <DetailScreen
      title="Detail Daycare"
      onBack={() => router.back()}
      scrollable={false}
      contentContainerStyle={{ flex: 1, paddingTop: 20, gap: 16, paddingBottom: 0 }}>
      <DaycareHeroSection name={daycare.name} address={daycare.address || daycare.city} logoUrl={daycare.logoUrl ?? undefined} />
      <SegmentTabs
        initialKey="overview"
        contentContainerStyle={{ paddingBottom: 40 }}
        items={[
          {
            key: 'overview',
            label: 'Overview',
            content: (
              <>
                <DaycareOwnerSection owner={daycare.owner} getInitials={getInitials} />
                <DaycareStatusSection
                  status={daycare.approval?.status || 'DRAFT'}
                  submittedLabel={submittedLabel}
                  helperText={nextStatus ? getApprovalStatusHelperText(nextStatus as ApprovalStatus) : ''}
                  onPressUpdate={() => setStatusSheetVisible(true)}
                  canUpdate={nextStatusOptions.length > 0}
                />
              </>
            ),
          },
          {
            key: 'staff',
            label: 'Staff',
            content: (
              <DaycareMembershipsSection
                owner={{
                  _id: daycare.owner._id,
                  name: daycare.owner.name,
                  email: daycare.owner.email,
                  phone: daycare.owner.phone ?? undefined,
                }}
                memberships={memberships}
              />
            ),
          },
          {
            key: 'documents',
            label: 'Dokumen',
            content: (
              <DaycareDocumentsSection
                legalDocuments={daycare.legalDocuments || []}
                getDocumentName={getDocumentName}
                onOpenDocument={(url) => void Linking.openURL(url)}
                onPressUpdate={() => setDocumentsSheetVisible(true)}
              />
            ),
          },
          {
            key: 'history',
            label: 'Riwayat',
            content: <DaycareHistorySection history={latestHistory} getInitials={getInitials} />,
          },
        ]}
      />

      <BottomDrawer visible={statusSheetVisible} onDismiss={() => setStatusSheetVisible(false)}>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 16 }}>Update Status</Text>
        <DaycareStatusForm
          currentStatus={daycare.approval?.status || 'DRAFT'}
          value={nextStatus}
          note={reviewNote}
          options={statusSelectionOptions}
          loading={submitLoading}
          error={submitError}
          onCancel={() => setStatusSheetVisible(false)}
          onChangeStatus={setNextStatus}
          onChangeNote={setReviewNote}
          onSubmit={() => {
            void (async () => {
              try {
                setSubmitLoading(true);
                setSubmitError('');
                const res = await updateDaycareApprovalStatus(id, nextStatus as ApprovalStatus, reviewNote);
                if (res.error) throw res.error;
                setDaycare(res.data || null);
                setStatusSheetVisible(false);
              } catch (nextError) {
                setSubmitError(nextError instanceof Error ? nextError.message : 'Gagal memperbarui status daycare.');
              } finally {
                setSubmitLoading(false);
              }
            })();
          }}
        />
      </BottomDrawer>

      <BottomDrawer visible={documentsSheetVisible} onDismiss={() => setDocumentsSheetVisible(false)}>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 16 }}>Update Dokumen</Text>
        <DaycareDocumentForm
          documents={documentDrafts}
          loading={documentsLoading}
          error={documentsError}
          getDocumentName={getDocumentName}
          onCancel={() => setDocumentsSheetVisible(false)}
          onChangeType={(index, value) =>
            setDocumentDrafts((current) =>
              current.map((item, itemIndex) => (itemIndex === index ? { ...item, type: value } : item))
            )
          }
          onUpload={(index) => {
            void (async () => {
              try {
                setDocumentsLoading(true);
                setDocumentsError('');
                const uploaded = await pickAndUploadDaycareDocument();
                if (uploaded?.path) {
                  setDocumentDrafts((current) =>
                    current.map((item, itemIndex) =>
                      itemIndex === index ? { ...item, url: uploaded.path } : item
                    )
                  );
                }
              } catch (nextError) {
                setDocumentsError(nextError instanceof Error ? nextError.message : 'Gagal upload dokumen.');
              } finally {
                setDocumentsLoading(false);
              }
            })();
          }}
          onSubmit={() => {
            void (async () => {
              try {
                setDocumentsLoading(true);
                setDocumentsError('');
                const sanitizedDocuments = documentDrafts
                  .map((document) => ({
                    type: document.type.trim(),
                    url: document.url.trim(),
                    verified: Boolean(document.verified),
                  }))
                  .filter((document) => document.type && document.url);

                const res = await updateDaycareDocuments(id, sanitizedDocuments);
                if (res.error) throw res.error;
                setDaycare(res.data || null);
                setDocumentsSheetVisible(false);
              } catch (nextError) {
                setDocumentsError(nextError instanceof Error ? nextError.message : 'Gagal memperbarui dokumen daycare.');
              } finally {
                setDocumentsLoading(false);
              }
            })();
          }}
        />
      </BottomDrawer>
    </DetailScreen>
  );
}
