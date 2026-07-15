import { Tabs } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Platform, Pressable } from 'react-native';

import { useDaycareLayoutMode } from '../../../services/desktop/layout';
import { useAppTheme } from '../../../theme/theme';

export default function TabsLayout() {
  const theme = useAppTheme();
  const layoutMode = useDaycareLayoutMode();
  const showMobileTabs = layoutMode === 'mobile';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? 32 : 12,
          paddingTop: 12,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          display: showMobileTabs ? 'flex' : 'none',
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        tabBarButton: ({ children, onPress, onLongPress, accessibilityState, accessibilityLabel, testID, style }) => (
          <Pressable
            accessibilityState={accessibilityState}
            accessibilityLabel={accessibilityLabel}
            testID={testID}
            onPress={onPress}
            onLongPress={onLongPress}
            hitSlop={10}
            style={[style, { justifyContent: 'center', alignItems: 'center' }]}
          >
            {children}
          </Pressable>
        ),
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '800',
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="dashboard" color={color} size={26} />,
        }}
      />
      <Tabs.Screen
        name="activities"
        options={{
          title: 'Aktivitas',
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="calendar-check" color={color} size={26} />,
        }}
      />
      <Tabs.Screen
        name="children"
        options={{
          title: 'Si Kecil',
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="baby-face-outline" color={color} size={28} />,
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          title: 'Tim',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="people" color={color} size={26} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Menu',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="menu" color={color} size={26} />,
        }}
      />
    </Tabs>
  );
}
