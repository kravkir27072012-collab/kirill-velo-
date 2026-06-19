import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../src/theme';

export default function RootLayout() {
  const { colors, scheme } = useTheme();

  return (
    <>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="chat"
          options={{ headerShown: true, title: 'ИИ-помощник', presentation: 'modal' }}
        />
        <Stack.Screen
          name="spot/new"
          options={{ headerShown: true, title: 'Новое место', presentation: 'modal' }}
        />
        <Stack.Screen
          name="spot/[id]"
          options={{ headerShown: true, title: 'Место для катания' }}
        />
      </Stack>
    </>
  );
}
