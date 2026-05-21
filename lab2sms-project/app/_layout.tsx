import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

if (__DEV__) {
  require('../ReactotronConfig');
}

import { NeonColors } from '@/constants/theme';
import { ContactsProvider } from '@/contexts/contacts-context';

const NeonTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: NeonColors.darkBg,
    text: '#fff',
    border: NeonColors.darkBorder,
    card: NeonColors.darkCard,
    primary: NeonColors.cyan,
  },
};

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <ThemeProvider value={NeonTheme}>
      <ContactsProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="contacts" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
      </ContactsProvider>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
