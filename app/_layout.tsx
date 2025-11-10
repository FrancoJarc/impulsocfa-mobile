import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};
export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Aquí puedes envolver tu ToastProvider si lo creaste
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        // 🚨 CLAVE: Aplica la opción de ocultar el header a *todas* las pantallas del stack por defecto
        screenOptions={{ headerShown: false }}
      >
        {/* 1. index.js: Punto de inicio. Debe ser el primero. */}
        <Stack.Screen name="index"/>

        {/* 2. Login y Registro (sin cabecera de la app principal) */}
        <Stack.Screen name="(auth)"/>

        {/* 3. Las Tabs (el contenido principal de la app) */}
        <Stack.Screen name="(tabs)"/>

        {/* 4. Pantallas Modales (u otras rutas que necesiten ser Stack Screens) */}
        <Stack.Screen name="modal" options={{ headerShown: true, presentation: 'modal', title: 'Modal' }} />


      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}




