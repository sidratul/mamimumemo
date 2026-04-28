import { AppPageHeader } from '../../components/common/AppPageHeader';

type UserDetailHeaderProps = {
  title: string;
  onBack: () => void;
};

export function UserDetailHeader({ title, onBack }: UserDetailHeaderProps) {
  return <AppPageHeader title={title} onBack={onBack} />;
}
