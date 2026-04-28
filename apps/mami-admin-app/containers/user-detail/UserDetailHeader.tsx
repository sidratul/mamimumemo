import { ScreenHeader } from '@mami/ui';

type UserDetailHeaderProps = {
  title: string;
  onBack: () => void;
};

export function UserDetailHeader({ title, onBack }: UserDetailHeaderProps) {
  return <ScreenHeader title={title} subtitle="Detail akun dan persona user" onBack={onBack} />;
}
