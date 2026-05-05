import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { BottomDrawer, DetailScreen, SegmentTabs, type SelectOption } from '@mami/ui';

import { listDaycares } from '../../services/daycare-admin';
import { addExistingUserToDaycare, deactivateDaycareMembership, type DaycareMembershipPersona } from '../../services/daycare-memberships/store';
import {
  deleteUser,
  getUserById,
  getUserDaycareMemberships,
  updateUser,
  updateUserPassword,
  type AdminUser,
  type UserDaycareMembership,
  type UserRole,
} from '../../services/users';
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
  const [user, setUser] = useState<AdminUser | null>(null);
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
  const [role, setRole] = useState<UserRole>('PARENT');
  const [newPassword, setNewPassword] = useState('');
  const [membershipDrawerVisible, setMembershipDrawerVisible] = useState(false);
  const [membershipLoading, setMembershipLoading] = useState(false);
  const [membershipError, setMembershipError] = useState('');
  const [selectedDaycareId, setSelectedDaycareId] = useState('');
  const [selectedMembershipPersona, setSelectedMembershipPersona] = useState<DaycareMembershipPersona>('ADMIN');
  const [membershipNotes, setMembershipNotes] = useState('');
  const [busyMembershipId, setBusyMembershipId] = useState('');
  const canManageRole = role === 'SUPER_ADMIN' || role === 'DAYCARE_ADMIN';

  const activeMembershipDaycareIds = useMemo(
    () => new Set(memberships.filter((membership) => membership.status === 'ACTIVE').map((membership) => membership.daycare.id)),
    [memberships]
  );

  useEffect(() => {
    async function run() {
      try {
        setLoading(true);
        setError('');
        const [data, userMemberships, daycares] = await Promise.all([
          getUserById(id),
          getUserDaycareMemberships(id),
          listDaycares({ limit: 100 }),
        ]);
        setUser(data);
        setMemberships(userMemberships);
        setDaycareOptions(daycares.map((daycare) => ({ label: daycare.name, value: daycare.id })));
        setName(data.name);
        setEmail(data.email);
        setPhone(data.phone);
        setRole(data.role);
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
      await updateUser(id, {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        ...(canManageRole ? { role } : {}),
      });
      const [refreshed, refreshedMemberships] = await Promise.all([
        getUserById(id),
        getUserDaycareMemberships(id),
      ]);
      setUser(refreshed);
      setMemberships(refreshedMemberships);
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
      await updateUserPassword(id, { newPassword });
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
      await deleteUser(id);
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
      await addExistingUserToDaycare({
        daycareId: selectedDaycareId,
        userId: user.id,
        persona: selectedMembershipPersona,
        notes: membershipNotes.trim() || undefined,
      });

      const refreshedMemberships = await getUserDaycareMemberships(id);
      setMemberships(refreshedMemberships);
      setMembershipDrawerVisible(false);
      setSelectedDaycareId('');
      setSelectedMembershipPersona('ADMIN');
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
      await deactivateDaycareMembership(membershipId);
      const refreshedMemberships = await getUserDaycareMemberships(id);
      setMemberships(refreshedMemberships);
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
      style={{ backgroundColor: '#F8FAFC' }}
    >
      <UserSummarySection user={user} />
      
      <SegmentTabs
        initialKey="profile"
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
                  role={role}
                  canManageRole={canManageRole}
                  saving={savingProfile}
                  error={submitError}
                  onChangeName={setName}
                  onChangeEmail={setEmail}
                  onChangePhone={setPhone}
                  onChangeRole={setRole}
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
                  setSelectedMembershipPersona('ADMIN');
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
          persona={selectedMembershipPersona}
          notes={membershipNotes}
          daycareOptions={daycareOptions.filter((option) => !activeMembershipDaycareIds.has(option.value))}
          onCancel={() => setMembershipDrawerVisible(false)}
          onChangeDaycareId={setSelectedDaycareId}
          onChangePersona={setSelectedMembershipPersona}
          onChangeNotes={setMembershipNotes}
          onSubmit={() => void handleAddMembership()}
        />
      </BottomDrawer>
    </DetailScreen>
  );
}
