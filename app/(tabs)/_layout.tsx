import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useTheme } from '../../src/theme';

export default function TabsLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.tertiaryLabel,
        tabBarStyle: {
          backgroundColor: colors.secondaryBackground,
          borderTopColor: colors.separator,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Запчасти',
          tabBarIcon: ({ color, size }) => <Ionicons name="construct" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="bikes"
        options={{
          title: 'Велосипеды',
          tabBarIcon: ({ color, size }) => <Ionicons name="bicycle" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="spots"
        options={{
          title: 'Места',
          tabBarIcon: ({ color, size }) => <Ionicons name="map" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
