import { Screen } from '@mami/ui';

import { RegisterForm } from './RegisterForm';

export function RegisterContainer() {
  return (
    <Screen title="Daftar" subtitle="Buat akun owner dan daycare dalam satu alur.">
      <RegisterForm />
    </Screen>
  );
}
