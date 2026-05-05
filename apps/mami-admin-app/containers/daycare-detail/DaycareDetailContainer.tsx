import { useEffect, useMemo, useState } from 'react';
import { Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { ActivityIndicator } from 'react-native-paper';
import { BottomDrawer, DetailScreen, SegmentTabs } from '@mami/ui';
import { formatDateTimeId } from '@mami/core';

import {
  getAvailableApprovalStatusOptions,
  getApprovalStatusLabel,
  getApprovalStatusHelperText,
  getDaycareById,
  updateDaycareApprovalStatus,
  updateDaycareDocuments,
  type AdminDaycare,
  type ApprovalStatus,
} from '../../services/daycare-admin';
import {
  getDaycareMemberships,
  type DaycareMembershipRecord,
} from '../../services/daycare-memberships/store';
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
  const [daycare, setDaycare] = useState<AdminDaycare | null>(null);
  const [memberships, setMemberships] = useState<DaycareMembershipRecord[]>([]);
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
        const [data, daycareMemberships] = await Promise.all([
          getDaycareById(id),
          getDaycareMemberships(id),
        ]);
        setDaycare(data);
        setMemberships(daycareMemberships);
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

  const statusSelectionOptions = useMemo(() => {
    if (!daycare) {
      return [];
    }

    const currentStatusOption = {
      label: `${getApprovalStatusLabel(daycare.approvalStatus)} (saat ini)`,
      value: daycare.approvalStatus,
    };

    return [
      currentStatusOption,
      ...nextStatusOptions.filter((option) => option.value !== daycare.approvalStatus),
    ];
  }, [daycare, nextStatusOptions]);

  useEffect(() => {
    setNextStatus(daycare?.approvalStatus ?? '');
    setReviewNote(daycare?.approvalNote ?? '');
  }, [daycare?.approvalNote, daycare?.approvalStatus]);

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
  const latestHistory = daycare?.history?.slice(0, 3) ?? [];

  if (loading) {
    return (
      <DetailScreen title="Detail Daycare" onBack={() => router.back()} scrollable={false}>
        <Box paddingHorizontal="md" paddingTop="xxl" alignItems="center" gap="sm">
          <ActivityIndicator color="#4D96FF" />
          <Text color="textSecondary">Memuat detail daycare...</Text>
        </Box>
      </DetailScreen>
    );
  }

  if (!daycare || error) {
    return (
      <DetailScreen title="Detail Daycare" onBack={() => router.back()} scrollable={false}>
        <Box paddingHorizontal="md" paddingTop="xxl" gap="sm">
          <Text color="danger" style={{ fontWeight: '700' }}>
            Detail daycare tidak tersedia
          </Text>
          <Text color="textSecondary">{error || 'Daycare tidak ditemukan.'}</Text>
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
      <DaycareHeroSection name={daycare.name} address={daycare.address || daycare.city} logoUrl={daycare.logoUrl} />
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
                  status={daycare.approvalStatus}
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
                  id: daycare.owner.id,
                  name: daycare.owner.name,
                  email: daycare.owner.email,
                  phone: daycare.owner.phone,
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
                legalDocuments={daycare.legalDocuments}
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
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#24324B' }}>Update Status</Text>
          <DaycareStatusForm
            currentStatus={daycare.approvalStatus}
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
                  const updated = await updateDaycareApprovalStatus(id, nextStatus as ApprovalStatus, reviewNote);
                  setDaycare(updated);
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
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#24324B' }}>Update Dokumen</Text>
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

                  const updated = await updateDaycareDocuments(id, sanitizedDocuments);
                  setDaycare(updated);
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
