import { ScreenSection } from '@mami/ui';

import { PasswordField, TextField } from '../../components/input';
import { Text } from '../../theme/theme';

type DaycareCreateOwnerSectionProps = {
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  ownerPassword: string;
  onChangeOwnerName: (value: string) => void;
  onChangeOwnerEmail: (value: string) => void;
  onChangeOwnerPhone: (value: string) => void;
  onChangeOwnerPassword: (value: string) => void;
};

export function DaycareCreateOwnerSection({
  ownerName,
  ownerEmail,
  ownerPhone,
  ownerPassword,
  onChangeOwnerName,
  onChangeOwnerEmail,
  onChangeOwnerPhone,
  onChangeOwnerPassword,
}: DaycareCreateOwnerSectionProps) {
  return (
    <ScreenSection>
      <Text style={{ fontSize: 18, fontWeight: '700', color: '#24324B' }}>Data Owner</Text>
      <TextField value={ownerName} placeholder="Nama owner" onChange={onChangeOwnerName} />
      <TextField value={ownerEmail} placeholder="Email owner" onChange={onChangeOwnerEmail} keyboardType="email-address" />
      <TextField value={ownerPhone} placeholder="Nomor telepon owner" onChange={onChangeOwnerPhone} keyboardType="phone-pad" />
      <PasswordField value={ownerPassword} placeholder="Password owner" onChange={onChangeOwnerPassword} />
    </ScreenSection>
  );
}
