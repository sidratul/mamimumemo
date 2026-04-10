import { View } from 'react-native';
import { Appbar } from 'react-native-paper';

type DaycareDetailHeaderProps = {
  title: string;
  onBack: () => void;
};

export function DaycareDetailHeader({ title, onBack }: DaycareDetailHeaderProps) {
  return (
    <Appbar.Header
      style={{
        backgroundColor: '#F7F9FC',
        borderBottomWidth: 1,
        borderBottomColor: '#E8ECF4',
        elevation: 0,
        shadowOpacity: 0,
        height: 56,
      }}>
      <Appbar.BackAction onPress={onBack} color="#24324B" />
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
