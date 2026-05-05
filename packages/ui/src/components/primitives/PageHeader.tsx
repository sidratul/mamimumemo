import { View } from 'react-native';
import { Appbar } from 'react-native-paper';

export type PageHeaderProps = {
  title: string;
  onBack?: () => void;
  backgroundColor?: string;
  borderBottomColor?: string;
};

export function PageHeader({
  title,
  onBack,
  backgroundColor = '#FFFFFF',
  borderBottomColor = '#E8ECF4',
}: PageHeaderProps) {
  return (
    <Appbar.Header
      style={{
        backgroundColor,
        borderBottomWidth: 1,
        borderBottomColor,
        elevation: 0,
        shadowOpacity: 0,
        height: 56,
      }}>
      {onBack ? <Appbar.BackAction onPress={onBack} color="#24324B" /> : <View style={{ width: 48 }} />}
      <Appbar.Content
        title={title}
        titleStyle={{
          textAlign: 'center',
          fontSize: 18,
          fontWeight: '700',
          color: '#24324B',
        }}
      />
      <View style={{ width: 48 }} />
    </Appbar.Header>
  );
}
