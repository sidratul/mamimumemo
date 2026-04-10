import { useEffect, useMemo, useState } from 'react';
import { Linking, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ActivityIndicator } from 'react-native-paper';
import { BottomDrawer, type SelectOption } from '@mami/ui';
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
  addExistingUserToDaycare,
  deactivateDaycareMembership,
  getDaycareMemberships,
  type DaycareMembershipPersona,
  type DaycareMembershipRecord,
} from '../../services/daycare-memberships/store';
import { pickAndUploadDaycareDocument } from '../../services/uploads';
import { listUsers, type AdminUser } from '../../services/users';
import { Box, Text } from '../../theme/theme';
import { DaycareDocumentForm } from './DaycareDocumentForm';
import { DaycareDocumentsSection } from './DaycareDocumentsSection';
import { DaycareDetailHeader } from './DaycareDetailHeader';
import { DaycareHeroSection } from './DaycareHeroSection';
import { DaycareHistorySection } from './DaycareHistorySection';
import { DaycareMembershipForm } from './DaycareMembershipForm';
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
  const [userOptions, setUserOptions] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [statusSheetVisible, setStatusSheetVisible] = useState(false);
  const [documentsSheetVisible, setDocumentsSheetVisible] = useState(false);
  const [membershipDrawerVisible, setMembershipDrawerVisible] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [membershipLoading, setMembershipLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [documentsError, setDocumentsError] = useState('');
  const [membershipError, setMembershipError] = useState('');
  const [nextStatus, setNextStatus] = useState('');
  const [reviewNote, setReviewNote] = useState('');
  const [documentDrafts, setDocumentDrafts] = useState<DocumentDraft[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedMembershipPersona, setSelectedMembershipPersona] = useState<DaycareMembershipPersona>('ADMIN');
  const [membershipNotes, setMembershipNotes] = useState('');
  const [busyMembershipId, setBusyMembershipId] = useState('');

  useEffect(() => {
    async function run() {
      try {
        setLoading(true);
        setError('');
        const [data, daycareMemberships, users] = await Promise.all([
          getDaycareById(id),
          getDaycareMemberships(id),
          listUsers({ limit: 100 }),
        ]);
        setDaycare(data);
        setMemberships(daycareMemberships);
        setUserOptions(
          users.map((user: AdminUser) => ({
            label: `${user.name} · ${user.email}`,
            value: user.id,
          }))
        );
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
  const activeMembershipUserIds = useMemo(
    () => new Set(memberships.filter((membership) => membership.status === 'ACTIVE').map((membership) => membership.user.id)),
    [memberships]
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

  async function handleAddMembership() {
    if (!daycare || !selectedUserId) {
      return;
    }

    try {
      setMembershipLoading(true);
      setMembershipError('');
      await addExistingUserToDaycare({
        daycareId: daycare.id,
        userId: selectedUserId,
        persona: selectedMembershipPersona,
        notes: membershipNotes.trim() || undefined,
      });

      const refreshedMemberships = await getDaycareMemberships(daycare.id);
      setMemberships(refreshedMemberships);
      setMembershipDrawerVisible(false);
      setSelectedUserId('');
      setSelectedMembershipPersona('ADMIN');
      setMembershipNotes('');
    } catch (nextError) {
      setMembershipError(nextError instanceof Error ? nextError.message : 'Gagal menambahkan membership daycare.');
    } finally {
      setMembershipLoading(false);
    }
  }

  async function handleDeactivateMembership(membershipId: string) {
    if (!daycare) {
      return;
    }

    try {
      setBusyMembershipId(membershipId);
      await deactivateDaycareMembership(membershipId);
      const refreshedMemberships = await getDaycareMemberships(daycare.id);
      setMemberships(refreshedMemberships);
    } catch (nextError) {
      setMembershipError(nextError instanceof Error ? nextError.message : 'Gagal menonaktifkan membership.');
    } finally {
      setBusyMembershipId('');
    }
  }

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F7F9FC' }}>
        <DaycareDetailHeader title="Detail Daycare" onBack={() => router.back()} />
        <Box paddingHorizontal="md" paddingTop="xxl" alignItems="center" gap="sm">
          <ActivityIndicator color="#4D96FF" />
          <Text color="textSecondary">Memuat detail daycare...</Text>
        </Box>
      </View>
    );
  }

  if (!daycare || error) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F7F9FC' }}>
        <DaycareDetailHeader title="Detail Daycare" onBack={() => router.back()} />
        <Box paddingHorizontal="md" paddingTop="xxl" gap="sm">
          <Text color="danger" style={{ fontWeight: '700' }}>
            Detail daycare tidak tersedia
          </Text>
          <Text color="textSecondary">{error || 'Daycare tidak ditemukan.'}</Text>
        </Box>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F7F9FC' }}>
      <DaycareDetailHeader title="Detail Daycare" onBack={() => router.back()} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 120, gap: 16 }}
        showsVerticalScrollIndicator={false}>
        <DaycareHeroSection name={daycare.name} address={daycare.address || daycare.city} logoUrl={daycare.logoUrl} />

        <DaycareOwnerSection owner={daycare.owner} getInitials={getInitials} />
        <DaycareStatusSection
          status={daycare.approvalStatus}
          submittedLabel={submittedLabel}
          helperText={nextStatus ? getApprovalStatusHelperText(nextStatus as ApprovalStatus) : ''}
          onPressUpdate={() => setStatusSheetVisible(true)}
          canUpdate={nextStatusOptions.length > 0}
        />
        <DaycareMembershipsSection
          memberships={memberships}
          busyMembershipId={busyMembershipId}
          onAddPress={() => {
            setMembershipError('');
            const firstAvailableUser = userOptions.find((option) => !activeMembershipUserIds.has(option.value));
            setSelectedUserId(firstAvailableUser?.value ?? '');
            setSelectedMembershipPersona('ADMIN');
            setMembershipNotes('');
            setMembershipDrawerVisible(true);
          }}
          onDeactivateMembership={(membershipId) => void handleDeactivateMembership(membershipId)}
        />
        <DaycareDocumentsSection
          legalDocuments={daycare.legalDocuments}
          getDocumentName={getDocumentName}
          onOpenDocument={(url) => void Linking.openURL(url)}
          onPressUpdate={() => setDocumentsSheetVisible(true)}
        />
        <DaycareHistorySection history={latestHistory} getInitials={getInitials} />
      </ScrollView>

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

      <BottomDrawer visible={membershipDrawerVisible} onDismiss={() => setMembershipDrawerVisible(false)}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#24324B' }}>Tambah Membership Daycare</Text>
        <DaycareMembershipForm
          loading={membershipLoading}
          error={membershipError}
          userId={selectedUserId}
          persona={selectedMembershipPersona}
          notes={membershipNotes}
          userOptions={userOptions.filter((option) => !activeMembershipUserIds.has(option.value))}
          onCancel={() => setMembershipDrawerVisible(false)}
          onChangeUserId={setSelectedUserId}
          onChangePersona={setSelectedMembershipPersona}
          onChangeNotes={setMembershipNotes}
          onSubmit={() => void handleAddMembership()}
        />
      </BottomDrawer>
    </View>
  );
}
