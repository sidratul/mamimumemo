import { useEffect, useState } from 'react';
import { Pressable, ScrollView } from 'react-native';
import { Redirect, router } from 'expo-router';
import { DynamicForm, NumberField, PasswordField, TextAreaField, TextField, type FormFieldProps } from '@mami/ui';
import { daycareChildEditSchema, daycareEnrollmentSchema, daycareParentNotesSchema } from '@mami/core';
import { HelperText } from 'react-native-paper';

import { useSession } from '../../../providers/session-provider';
import {
  deactivateDaycareChild,
  deactivateDaycareParent,
  getDaycareRoster,
  getMyDaycareRegistration,
  onboardFamily,
  updateDaycareChild,
  updateDaycareParentNotes,
  type DaycareChild,
  type DaycareParent,
} from '../../../services/registration';
import { Box, Text } from '../../../theme/theme';

type RegistrationGate = 'loading' | 'approved' | 'pending';

type EnrollmentForm = {
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  parentPassword: string;
  parentNotes: string;
  childName: string;
  childBirthDate: string;
  childGender: 'MALE' | 'FEMALE';
  childNotes: string;
};

const initialForm: EnrollmentForm = {
  parentName: '',
  parentEmail: '',
  parentPhone: '',
  parentPassword: '',
  parentNotes: '',
  childName: '',
  childBirthDate: '',
  childGender: 'MALE',
  childNotes: '',
};

function formatBirthDate(value: string) {
  if (!value) {
    return '-';
  }

  return new Date(value).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function calculateAgeLabel(value: string) {
  if (!value) {
    return 'Tanggal lahir belum diisi';
  }

  const birthDate = new Date(value);
  if (Number.isNaN(birthDate.getTime())) {
    return 'Format tanggal belum valid';
  }

  const now = new Date();
  let months = (now.getFullYear() - birthDate.getFullYear()) * 12;
  months += now.getMonth() - birthDate.getMonth();
  if (now.getDate() < birthDate.getDate()) {
    months -= 1;
  }

  if (months < 12) {
    return `${Math.max(months, 0)} bulan`;
  }

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  return remainingMonths > 0 ? `${years} th ${remainingMonths} bln` : `${years} tahun`;
}

type ParentEditForm = {
  notes: string;
};

type ChildEditForm = {
  name: string;
  birthDate: string;
  notes: string;
};

const enrollmentFields: FormFieldProps<EnrollmentForm> = {
  parentName: {
    label: 'Nama Parent',
    input: TextField,
    props: { placeholder: 'Contoh: Ayu Maharani', borderRadius: 14, backgroundColor: '#FFFFFF' },
  },
  parentEmail: {
    label: 'Email Parent',
    input: TextField,
    props: { placeholder: 'parent@example.com', keyboardType: 'email-address', autoCapitalize: 'none', borderRadius: 14, backgroundColor: '#FFFFFF' },
  },
  parentPhone: {
    label: 'Nomor Telepon',
    input: NumberField,
    props: { placeholder: '08xxxxxxxxxx', borderRadius: 14, backgroundColor: '#FFFFFF' },
  },
  parentPassword: {
    label: 'Password Sementara',
    input: PasswordField,
    props: { placeholder: 'Minimal 6 karakter', borderRadius: 14, backgroundColor: '#FFFFFF' },
  },
  parentNotes: {
    label: 'Catatan Parent',
    input: TextAreaField,
    props: { placeholder: 'Akses pickup, catatan keluarga, dll.', borderRadius: 14, backgroundColor: '#FFFFFF', numberOfLines: 3 },
  },
  childName: {
    label: 'Nama Child',
    input: TextField,
    props: { placeholder: 'Contoh: Alma Putri', borderRadius: 14, backgroundColor: '#FFFFFF' },
  },
  childBirthDate: {
    label: 'Tanggal Lahir',
    input: TextField,
    props: { placeholder: 'YYYY-MM-DD', borderRadius: 14, backgroundColor: '#FFFFFF' },
  },
  childGender: {
    label: '',
    input: () => null,
    show: () => false,
  },
  childNotes: {
    label: 'Catatan Child',
    input: TextAreaField,
    props: { placeholder: 'Alergi ringan, kebiasaan tidur, panggilan, dll.', borderRadius: 14, backgroundColor: '#FFFFFF', numberOfLines: 3 },
  },
};

const parentEditFields: FormFieldProps<ParentEditForm> = {
  notes: {
    label: 'Catatan',
    input: TextAreaField,
    props: { placeholder: 'Tambahkan catatan singkat', borderRadius: 14, backgroundColor: '#FFFFFF', numberOfLines: 3 },
  },
};

const childEditFields: FormFieldProps<ChildEditForm> = {
  name: {
    label: 'Nama Child',
    input: TextField,
    props: { placeholder: 'Nama child', borderRadius: 14, backgroundColor: '#FFFFFF' },
  },
  birthDate: {
    label: 'Tanggal Lahir',
    input: TextField,
    props: { placeholder: 'YYYY-MM-DD', borderRadius: 14, backgroundColor: '#FFFFFF' },
  },
  notes: {
    label: 'Catatan',
    input: TextAreaField,
    props: { placeholder: 'Catatan child', borderRadius: 14, backgroundColor: '#FFFFFF', numberOfLines: 3 },
  },
};

function ParentCard({ parent, childCount }: { parent: DaycareParent; childCount: number }) {
  return (
    <Box backgroundColor="surface" borderRadius="lg" borderWidth={1} borderColor="border" padding="md" gap="xs">
      <Box flexDirection="row" justifyContent="space-between" alignItems="center">
        <Text style={{ fontSize: 17, fontWeight: '700' }}>{parent.user.name}</Text>
        <Text color="textSecondary">{childCount} anak</Text>
      </Box>
      <Text color="textSecondary">{parent.user.email}</Text>
      <Text color="textSecondary">{parent.user.phone}</Text>
      {parent.customData.notes ? <Text color="textSecondary">{parent.customData.notes}</Text> : null}
    </Box>
  );
}

function ChildCard({ child, parentName }: { child: DaycareChild; parentName: string }) {
  return (
    <Box backgroundColor="surface" borderRadius="lg" borderWidth={1} borderColor="border" padding="md" gap="xs">
      <Box flexDirection="row" justifyContent="space-between" alignItems="center">
        <Text style={{ fontSize: 17, fontWeight: '700' }}>{child.profile.name}</Text>
        <Box backgroundColor="background" borderRadius="md" paddingHorizontal="md" paddingVertical="xs">
          <Text style={{ fontWeight: '700', fontSize: 12 }}>{child.profile.gender}</Text>
        </Box>
      </Box>
      <Text color="textSecondary">{parentName}</Text>
      <Text color="textSecondary">{formatBirthDate(child.profile.birthDate)} | {calculateAgeLabel(child.profile.birthDate)}</Text>
      {child.customData.notes ? <Text color="textSecondary">{child.customData.notes}</Text> : null}
    </Box>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <Box flex={1} backgroundColor="surface" borderRadius="lg" borderWidth={1} borderColor="border" padding="md" gap="xs">
      <Text color="textSecondary">{label}</Text>
      <Text style={{ fontSize: 28, fontWeight: '700' }}>{value}</Text>
    </Box>
  );
}

export function DaycareOperationsContainer() {
  const { isLoading, session, signOut } = useSession();
  const [gate, setGate] = useState<RegistrationGate>('loading');
  const [parents, setParents] = useState<DaycareParent[]>([]);
  const [children, setChildren] = useState<DaycareChild[]>([]);
  const [values, setValues] = useState<EnrollmentForm>(initialForm);
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);
  const [editingParentId, setEditingParentId] = useState('');
  const [editingParentNotes, setEditingParentNotes] = useState('');
  const [editingChildId, setEditingChildId] = useState('');
  const [editingChildName, setEditingChildName] = useState('');
  const [editingChildBirthDate, setEditingChildBirthDate] = useState('');
  const [editingChildGender, setEditingChildGender] = useState<'MALE' | 'FEMALE'>('MALE');
  const [editingChildNotes, setEditingChildNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionBusyId, setActionBusyId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  async function loadRoster(activeSession = session) {
    if (!activeSession) {
      return;
    }

    const registration = await getMyDaycareRegistration(activeSession.token);
    if (!registration) {
      setGate('pending');
      setParents([]);
      setChildren([]);
      return;
    }

    if (registration.approvalStatus !== 'APPROVED') {
      setGate('pending');
      setParents([]);
      setChildren([]);
      return;
    }

    setGate('approved');
    const roster = await getDaycareRoster(activeSession.token, activeSession.daycareId || registration.id);
    setParents(roster.parents);
    setChildren(roster.children);
  }

  useEffect(() => {
    async function run() {
      if (!session) {
        return;
      }

      try {
        setLoading(true);
        setErrorMessage('');
        await loadRoster(session);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Gagal memuat operasional daycare.');
      } finally {
        setLoading(false);
      }
    }

    void run();
  }, [session]);

  if (isLoading) {
    return null;
  }

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  const activeSession = session;

  if (!loading && gate === 'pending') {
    return <Redirect href="/(daycare)/registration-status" />;
  }

  const childCountByParentId = new Map<string, number>();
  for (const child of children) {
    childCountByParentId.set(child.parentId, (childCountByParentId.get(child.parentId) ?? 0) + 1);
  }

  const parentNameById = new Map<string, string>();
  for (const parent of parents) {
    parentNameById.set(parent.id, parent.user.name);
  }

  async function handleSubmit(nextValues: EnrollmentForm) {
    try {
      setIsSubmitting(true);
      setErrorMessage('');
      setSuccessMessage('');
      setValues(nextValues);
      await onboardFamily(activeSession.token, {
        daycareId: activeSession.daycareId,
        parentName: nextValues.parentName,
        parentEmail: nextValues.parentEmail,
        parentPhone: nextValues.parentPhone,
        parentPassword: nextValues.parentPassword,
        parentNotes: nextValues.parentNotes,
        childName: nextValues.childName,
        childBirthDate: nextValues.childBirthDate,
        childGender: nextValues.childGender,
        childNotes: nextValues.childNotes,
      });
      await loadRoster(activeSession);
      setValues(initialForm);
      setShowEnrollmentForm(false);
      setSuccessMessage('Parent dan child berhasil ditambahkan ke roster daycare.');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Gagal menambahkan parent dan child.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleParentSave(form: ParentEditForm) {
    if (!editingParentId) {
      return;
    }

    try {
      setActionBusyId(`parent-${editingParentId}`);
      setErrorMessage('');
      await updateDaycareParentNotes(activeSession.token, editingParentId, form.notes);
      await loadRoster(activeSession);
      setEditingParentId('');
      setEditingParentNotes('');
      setSuccessMessage('Catatan parent berhasil diperbarui.');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Gagal memperbarui parent.');
    } finally {
      setActionBusyId('');
    }
  }

  async function handleParentDeactivate(parentId: string) {
    try {
      setActionBusyId(`parent-${parentId}`);
      setErrorMessage('');
      await deactivateDaycareParent(activeSession.token, parentId);
      await loadRoster(activeSession);
      if (editingParentId === parentId) {
        setEditingParentId('');
        setEditingParentNotes('');
      }
      setSuccessMessage('Parent dinonaktifkan.');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Gagal menonaktifkan parent.');
    } finally {
      setActionBusyId('');
    }
  }

  async function handleChildSave(form: ChildEditForm) {
    if (!editingChildId) {
      return;
    }

    try {
      setActionBusyId(`child-${editingChildId}`);
      setErrorMessage('');
      await updateDaycareChild(activeSession.token, editingChildId, {
        name: form.name,
        birthDate: form.birthDate,
        gender: editingChildGender,
        notes: form.notes,
      });
      await loadRoster(activeSession);
      setEditingChildId('');
      setEditingChildName('');
      setEditingChildBirthDate('');
      setEditingChildGender('MALE');
      setEditingChildNotes('');
      setSuccessMessage('Data child berhasil diperbarui.');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Gagal memperbarui child.');
    } finally {
      setActionBusyId('');
    }
  }

  async function handleChildDeactivate(childId: string) {
    try {
      setActionBusyId(`child-${childId}`);
      setErrorMessage('');
      await deactivateDaycareChild(activeSession.token, childId);
      await loadRoster(activeSession);
      if (editingChildId === childId) {
        setEditingChildId('');
        setEditingChildName('');
        setEditingChildBirthDate('');
        setEditingChildGender('MALE');
        setEditingChildNotes('');
      }
      setSuccessMessage('Child dinonaktifkan.');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Gagal menonaktifkan child.');
    } finally {
      setActionBusyId('');
    }
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#FFF8F4' }} contentContainerStyle={{ padding: 16, gap: 14 }}>
      <Box gap="xs">
        <Text style={{ fontSize: 28, fontWeight: '700' }}>Operasional</Text>
      </Box>

      {loading ? (
        <Box backgroundColor="surface" borderRadius="xl" borderWidth={1} borderColor="border" padding="lg" gap="xs">
          <Text style={{ fontWeight: '700' }}>Memuat...</Text>
        </Box>
      ) : null}

      {!loading ? (
        <>
          <Pressable onPress={() => router.push('/(daycare)/daily-care')}>
            <Box backgroundColor="primary" borderRadius="lg" padding="lg" alignItems="center">
              <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Buka Hari Ini</Text>
            </Box>
          </Pressable>

          <Box flexDirection="row" gap="md">
            <SummaryCard label="Parent Aktif" value={parents.length} />
            <SummaryCard label="Child Aktif" value={children.length} />
          </Box>

          <Box backgroundColor="surface" borderRadius="xl" borderWidth={1} borderColor="border" padding="lg" gap="md">
            <Box flexDirection="row" justifyContent="space-between" alignItems="center">
              <Text style={{ fontSize: 20, fontWeight: '700' }}>Tambah Keluarga</Text>
              <Pressable onPress={() => setShowEnrollmentForm((current) => !current)}>
                <Box backgroundColor="background" borderRadius="lg" borderWidth={1} borderColor="border" paddingHorizontal="md" paddingVertical="sm">
                  <Text style={{ fontWeight: '700' }}>{showEnrollmentForm ? 'Tutup' : 'Buka'}</Text>
                </Box>
              </Pressable>
            </Box>

            {showEnrollmentForm ? (
              <>
                <Box gap="md">
                  <Text style={{ fontSize: 18, fontWeight: '700' }}>Data Parent</Text>
                  <DynamicForm<EnrollmentForm>
                    fields={enrollmentFields}
                    defaultValue={values}
                    schema={daycareEnrollmentSchema}
                    submitLabel={isSubmitting ? 'Menyimpan...' : 'Simpan'}
                    loading={isSubmitting}
                    onSubmit={handleSubmit}
                  />
                </Box>
                <Box gap="xs">
                  <Text style={{ fontWeight: '600' }}>Gender Child</Text>
                  <Box flexDirection="row" gap="sm">
                    {(['MALE', 'FEMALE'] as const).map((gender) => {
                      const active = values.childGender === gender;
                      return (
                        <Pressable
                          key={gender}
                          onPress={() => setValues((current) => ({ ...current, childGender: gender }))}
                          style={{ flex: 1 }}>
                          <Box
                            backgroundColor={active ? 'primary' : 'background'}
                            borderRadius="lg"
                            borderWidth={1}
                            borderColor={active ? 'primary' : 'border'}
                            padding="md"
                            alignItems="center">
                            <Text style={{ color: active ? '#FFFFFF' : '#3D2218', fontWeight: '700' }}>{gender === 'MALE' ? 'Laki-laki' : 'Perempuan'}</Text>
                          </Box>
                        </Pressable>
                      );
                    })}
                  </Box>
                </Box>
              </>
            ) : null}

            {errorMessage ? <HelperText type="error">{errorMessage}</HelperText> : null}
            {successMessage ? <HelperText type="info">{successMessage}</HelperText> : null}
          </Box>

          <Box gap="md">
            <Text style={{ fontSize: 20, fontWeight: '700' }}>Parent</Text>
            {parents.length === 0 ? (
              <Box backgroundColor="surface" borderRadius="lg" borderWidth={1} borderColor="border" padding="lg">
                <Text color="textSecondary">Belum ada parent aktif.</Text>
              </Box>
            ) : (
              parents.map((parent) => (
                <Box key={parent.id} gap="sm">
                  <ParentCard parent={parent} childCount={childCountByParentId.get(parent.id) ?? 0} />
                  <Box flexDirection="row" gap="sm">
                    <Pressable
                      onPress={() => {
                        setEditingParentId(parent.id);
                        setEditingParentNotes(parent.customData.notes || '');
                      }}
                      style={{ flex: 1 }}>
                      <Box backgroundColor="background" borderRadius="lg" borderWidth={1} borderColor="border" padding="md" alignItems="center">
                        <Text style={{ fontWeight: '700' }}>Ubah Catatan</Text>
                      </Box>
                    </Pressable>
                    <Pressable onPress={() => void handleParentDeactivate(parent.id)} style={{ flex: 1 }}>
                      <Box backgroundColor="surface" borderRadius="lg" borderWidth={1} borderColor="border" padding="md" alignItems="center">
                        <Text color="danger" style={{ fontWeight: '700' }}>
                          {actionBusyId === `parent-${parent.id}` ? 'Memproses...' : 'Nonaktifkan'}
                        </Text>
                      </Box>
                    </Pressable>
                  </Box>
                </Box>
              ))
            )}
          </Box>

          {editingParentId ? (
            <Box backgroundColor="surface" borderRadius="xl" borderWidth={1} borderColor="border" padding="lg" gap="md">
              <Text style={{ fontSize: 20, fontWeight: '700' }}>Ubah Parent</Text>
              <DynamicForm<ParentEditForm>
                fields={parentEditFields}
                defaultValue={{ notes: editingParentNotes }}
                schema={daycareParentNotesSchema}
                submitLabel={actionBusyId === `parent-${editingParentId}` ? 'Menyimpan...' : 'Simpan'}
                loading={actionBusyId === `parent-${editingParentId}`}
                onSubmit={handleParentSave}
              />
              <Box flexDirection="row" gap="sm">
                <Pressable
                  onPress={() => {
                    setEditingParentId('');
                    setEditingParentNotes('');
                  }}
                  style={{ flex: 1 }}>
                  <Box backgroundColor="background" borderRadius="lg" borderWidth={1} borderColor="border" padding="lg" alignItems="center">
                    <Text style={{ fontWeight: '700' }}>Batal</Text>
                  </Box>
                </Pressable>
              </Box>
            </Box>
          ) : null}

          <Box gap="md">
            <Text style={{ fontSize: 20, fontWeight: '700' }}>Child</Text>
            {children.length === 0 ? (
              <Box backgroundColor="surface" borderRadius="lg" borderWidth={1} borderColor="border" padding="lg">
                <Text color="textSecondary">Belum ada child aktif.</Text>
              </Box>
            ) : (
              children.map((child) => (
                <Box key={child.id} gap="sm">
                  <Pressable onPress={() => router.push({ pathname: '/(daycare)/children/[id]', params: { id: child.id } })}>
                    <ChildCard child={child} parentName={parentNameById.get(child.parentId) || 'Parent belum terhubung'} />
                  </Pressable>
                  <Box flexDirection="row" gap="sm">
                    <Pressable
                      onPress={() => {
                        setEditingChildId(child.id);
                        setEditingChildName(child.profile.name);
                        setEditingChildBirthDate(child.profile.birthDate.slice(0, 10));
                        setEditingChildGender(child.profile.gender);
                        setEditingChildNotes(child.customData.notes || '');
                      }}
                      style={{ flex: 1 }}>
                      <Box backgroundColor="background" borderRadius="lg" borderWidth={1} borderColor="border" padding="md" alignItems="center">
                        <Text style={{ fontWeight: '700' }}>Ubah Data</Text>
                      </Box>
                    </Pressable>
                    <Pressable onPress={() => void handleChildDeactivate(child.id)} style={{ flex: 1 }}>
                      <Box backgroundColor="surface" borderRadius="lg" borderWidth={1} borderColor="border" padding="md" alignItems="center">
                        <Text color="danger" style={{ fontWeight: '700' }}>
                          {actionBusyId === `child-${child.id}` ? 'Memproses...' : 'Nonaktifkan'}
                        </Text>
                      </Box>
                    </Pressable>
                  </Box>
                </Box>
              ))
            )}
          </Box>

          {editingChildId ? (
            <Box backgroundColor="surface" borderRadius="xl" borderWidth={1} borderColor="border" padding="lg" gap="md">
              <Text style={{ fontSize: 20, fontWeight: '700' }}>Ubah Child</Text>
              <DynamicForm<ChildEditForm>
                fields={childEditFields}
                defaultValue={{
                  name: editingChildName,
                  birthDate: editingChildBirthDate,
                  notes: editingChildNotes,
                }}
                schema={daycareChildEditSchema}
                submitLabel={actionBusyId === `child-${editingChildId}` ? 'Menyimpan...' : 'Simpan'}
                loading={actionBusyId === `child-${editingChildId}`}
                onSubmit={handleChildSave}
              />
              <Box gap="xs">
                <Text style={{ fontWeight: '600' }}>Gender</Text>
                <Box flexDirection="row" gap="sm">
                  {(['MALE', 'FEMALE'] as const).map((gender) => {
                    const active = editingChildGender === gender;
                    return (
                      <Pressable key={gender} onPress={() => setEditingChildGender(gender)} style={{ flex: 1 }}>
                        <Box
                          backgroundColor={active ? 'primary' : 'background'}
                          borderRadius="lg"
                          borderWidth={1}
                          borderColor={active ? 'primary' : 'border'}
                          padding="md"
                          alignItems="center">
                          <Text style={{ color: active ? '#FFFFFF' : '#3D2218', fontWeight: '700' }}>{gender === 'MALE' ? 'Laki-laki' : 'Perempuan'}</Text>
                        </Box>
                      </Pressable>
                    );
                  })}
                </Box>
              </Box>
              <Box flexDirection="row" gap="sm">
                <Pressable
                  onPress={() => {
                    setEditingChildId('');
                    setEditingChildName('');
                    setEditingChildBirthDate('');
                    setEditingChildGender('MALE');
                    setEditingChildNotes('');
                  }}
                  style={{ flex: 1 }}>
                  <Box backgroundColor="background" borderRadius="lg" borderWidth={1} borderColor="border" padding="lg" alignItems="center">
                    <Text style={{ fontWeight: '700' }}>Batal</Text>
                  </Box>
                </Pressable>
              </Box>
            </Box>
          ) : null}
        </>
      ) : null}

      <Box gap="sm">
        <Pressable onPress={() => router.push('/(daycare)/registration-status')}>
          <Box backgroundColor="surface" borderRadius="lg" borderWidth={1} borderColor="border" padding="lg" alignItems="center">
            <Text color="primary" style={{ fontWeight: '700' }}>Lihat Status</Text>
          </Box>
        </Pressable>
        <Pressable onPress={() => void signOut()}>
          <Box backgroundColor="surface" borderRadius="lg" borderWidth={1} borderColor="border" padding="lg" alignItems="center">
            <Text color="danger" style={{ fontWeight: '700' }}>Keluar</Text>
          </Box>
        </Pressable>
      </Box>
    </ScrollView>
  );
}
