import { Stack } from "expo-router";

export default function PerfilStack() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="UserProfile" />
      <Stack.Screen name="MisCampanas" />
      <Stack.Screen name="TodasDonaciones" />
      <Stack.Screen name="CreateCampanaForm" />
      <Stack.Screen name="VerMasCampana" />
      <Stack.Screen name="EditarCampana" />
    </Stack>
  );
}