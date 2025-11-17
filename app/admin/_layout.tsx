import { Stack } from "expo-router";

export default function AdminStack() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="AdminList" />
      <Stack.Screen name="UserList" />
      <Stack.Screen name="CategoryList" />
      <Stack.Screen name="CampanasList" />
      <Stack.Screen name="CreateAdminForm" />
    </Stack>
  );
}
