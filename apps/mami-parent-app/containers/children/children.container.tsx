import { Screen, TextMuted } from '@mami/ui';
import { View } from 'react-native';

export function ChildrenContainer() {
  return (
    <Screen title="Anak" subtitle="Placeholder daftar anak untuk parent app.">
      <View style={{ gap: 12 }}>
        <TextMuted>- Aulia: Hadir hari ini</TextMuted>
        <TextMuted>- Fajar: Jadwal daycare besok 08:00 - 15:00</TextMuted>
      </View>
    </Screen>
  );
}
