import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { BottomDrawer, DetailScreen, SegmentTabs, type SelectOption } from '@mami/ui';

import { listDaycares } from '../../services/daycare';
import { addExistingUserToDaycare, deactivateDaycareMembership } from '../../services/membership';
import {
  deleteUser,
  getUserById,
  getUserDaycareMemberships,
  updateUser,
  updateUserPassword,
} from '../../services/user';
import {
  UserRecord,
  UserDaycareMembership,
  SystemRoleSelection,
} from '../../shared/user/types';
import { DaycareMembershipAccess } from '../../services/membership';
import { Box, Text } from '../../theme/theme';
import { UserDangerSection } from './UserDangerSection';
import { UserDetailState } from './UserDetailState';
import { UserMembershipForm } from './UserMembershipForm';
import { UserMembershipsSection } from './UserMembershipsSection';
import { UserPasswordSection } from './UserPasswordSection';
import { UserProfileSection } from './UserProfileSection';
import { UserSummarySection } from './UserSummarySection';

type UserDetailContainerProps = {
  id: string;
};

export function UserDetailContainer({ id }: UserDetailContainerProps) {
  const router = useRouter();
  const [user, setUser] = useState<UserRecord | null>(null);
  const [memberships, setMemberships] = useState<UserDaycareMembership[]>([]);
  const [daycareOptions, setDaycareOptions] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [systemRole, setSystemRole] = useState<SystemRoleSelection>('NONE');
  const [newPassword, setNewPassword] = useState('');
  const [membershipDrawerVisible, setMembershipDrawerVisible] = useState(false);
  const [membershipLoading, setMembershipLoading] = useState(false);
  const [membershipError, setMembershipError] = useState('');
  const [selectedDaycareId, setSelectedDaycareId] = useState('');
  const [selectedMembershipAccess, setSelectedMembershipAccess] = useState<DaycareMembershipAccess>('ADMIN');
  const [membershipNotes, setMembershipNotes] = useState('');
  const [busyMembershipId, setBusyMembershipId] = useState('');

  const activeMembershipDaycareIds = useMemo(
    () => new Set(memberships.filter((membership) => membership.status === 'ACTIVE').map((membership) => membership.daycare._id)),
    [memberships]
  );

  useEffect(() => {
    async function run() {
      try {
        setLoading(true);
        setError('');
        const [userRes, userMembershipsRes, daycaresRes] = await Promise.all([
          getUserById(id),
          getUserDaycareMemberships(id),
          listDaycares({ limit: 100 }),
        ]);
        if (userRes.error) throw userRes.error;
        const data = userRes.data;
        if (data) {
          setUser(data);
          setName(data.name);
          setEmail(data.email);
          setPhone(data.phone ?? '');
          setSystemRole(data.systemRole ?? 'NONE');
        }
        setMemberships(userMembershipsRes.items ?? []);
        setDaycareOptions((daycaresRes.items ?? []).map((daycare: any) => ({ label: daycare.name, value: daycare._id })));
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : 'Gagal mengambil detail user.');
      } finally {
        setLoading(false);
      }
    }

    void run();
  }, [id]);

  async function handleSaveProfile() {
    try {
      setSavingProfile(true);
      setSubmitError('');
      const res = await updateUser(id, {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        systemRole: systemRole === 'NONE' ? null : systemRole,
      });
      if (res.errors) throw new Error(res.errors[0].message);

      const userRes = await getUserById(id);
      if (userRes.data) setUser(userRes.data);
    } catch (nextError) {
      setSubmitError(nextError instanceof Error ? nextError.message : 'Gagal memperbarui user.');
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleResetPassword() {
    try {
      setSavingPassword(true);
      setPasswordError('');
      const res = await updateUserPassword(id, { newPassword });
      if (res.errors) throw new Error(res.errors[0].message);
      setNewPassword('');
    } catch (nextError) {
      setPasswordError(nextError instanceof Error ? nextError.message : 'Gagal memperbarui password.');
    } finally {
      setSavingPassword(false);
    }
  }

  async function handleDelete() {
    try {
      setDeleting(true);
      const res = await deleteUser(id);
      if (res.errors) throw new Error(res.errors[0].message);
      router.replace('/(app)/(tabs)/users' as never);
    } catch (nextError) {
      setSubmitError(nextError instanceof Error ? nextError.message : 'Gagal menghapus user.');
    } finally {
      setDeleting(false);
    }
  }

  async function handleAddMembership() {
    if (!user) {
      return;
    }

    try {
      setMembershipLoading(true);
      setMembershipError('');
      const res = await addExistingUserToDaycare({
        daycareId: selectedDaycareId,
        userId: user._id,
        access: selectedMembershipAccess,
        notes: membershipNotes.trim() || undefined,
      });
      if (res.errors) throw new Error(res.errors[0].message);
      
      const refreshedMembershipsRes = await getUserDaycareMemberships(id);
      setMemberships(refreshedMembershipsRes.items ?? []);
      setMembershipDrawerVisible(false);
      setSelectedDaycareId('');
      setSelectedMembershipAccess('ADMIN');
      setMembershipNotes('');
    } catch (nextError) {
      setMembershipError(nextError instanceof Error ? nextError.message : 'Gagal menambahkan membership daycare.');
    } finally {
      setMembershipLoading(false);
    }
  }

  async function handleDeactivateMembership(membershipId: string) {
    try {
      setBusyMembershipId(membershipId);
      const res = await deactivateDaycareMembership(membershipId);
      if (res.errors) throw new Error(res.errors[0].message);
      const refreshedMembershipsRes = await getUserDaycareMemberships(id);
      setMemberships(refreshedMembershipsRes.items ?? []);
    } catch (nextError) {
      setSubmitError(nextError instanceof Error ? nextError.message : 'Gagal menonaktifkan membership.');
    } finally {
      setBusyMembershipId('');
    }
  }

  if (loading) {
    return (
      <DetailScreen title="Detail User" onBack={() => router.back()} scrollable={false}>
        <UserDetailState type="loading" />
      </DetailScreen>
    );
  }

  if (!user || error) {
    return (
      <DetailScreen title="Detail User" onBack={() => router.back()} scrollable={false}>
        <UserDetailState type="error" message={error || 'User tidak ditemukan.'} />
      </DetailScreen>
    );
  }

  return (
    <DetailScreen 
      title="Detail User" 
      onBack={() => router.back()} 
      scrollable={false}
      contentContainerStyle={{ flex: 1, paddingTop: 20, gap: 24, paddingBottom: 0 }}
    >
      <UserSummarySection user={user} />
      <SegmentTabs
        initialKey="profile"
        variant="underline"
        contentContainerStyle={{ paddingBottom: 40 }}
        items={[
          {
            key: 'profile',
            label: 'Profil',
            content: (
              <Box gap="xl">
                <UserProfileSection
                  name={name}
                  email={email}
                  phone={phone}
                  systemRole={systemRole}
                  saving={savingProfile}
                  error={submitError}
                  onChangeName={setName}
                  onChangeEmail={setEmail}
                  onChangePhone={setPhone}
                  onChangeSystemRole={setSystemRole}
                  onSubmit={() => void handleSaveProfile()}
                />
                <UserDangerSection userName={user.name} loading={deleting} onConfirmDelete={() => void handleDelete()} />
              </Box>
            ),
          },
          {
            key: 'membership',
            label: 'Membership',
            content: (
              <UserMembershipsSection
                memberships={memberships}
                busyMembershipId={busyMembershipId}
                onAddPress={() => {
                  setMembershipError('');
                  const firstAvailableDaycare = daycareOptions.find((option) => !activeMembershipDaycareIds.has(option.value));
                  setSelectedDaycareId(firstAvailableDaycare?.value ?? '');
                  setSelectedMembershipAccess('ADMIN');
                  setMembershipNotes('');
                  setMembershipDrawerVisible(true);
                }}
                onDeactivateMembership={(membershipId) => void handleDeactivateMembership(membershipId)}
              />
            ),
          },
          {
            key: 'security',
            label: 'Keamanan',
            content: (
              <UserPasswordSection
                password={newPassword}
                loading={savingPassword}
                error={passwordError}
                onChangePassword={setNewPassword}
                onSubmit={() => void handleResetPassword()}
              />
            ),
          },
        ]}
      />

      <BottomDrawer visible={membershipDrawerVisible} onDismiss={() => setMembershipDrawerVisible(false)}>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 16 }}>Tambah Membership Daycare</Text>
        <UserMembershipForm
          loading={membershipLoading}
          error={membershipError}
          daycareId={selectedDaycareId}
          access={selectedMembershipAccess}
          notes={membershipNotes}
          daycareOptions={daycareOptions.filter((option) => !activeMembershipDaycareIds.has(option.value))}
          onCancel={() => setMembershipDrawerVisible(false)}
          onChangeDaycareId={setSelectedDaycareId}
          onChangeAccess={setSelectedMembershipAccess}
          onChangeNotes={setMembershipNotes}
          onSubmit={() => void handleAddMembership()}
        />
      </BottomDrawer>
    </DetailScreen>
  );
}
