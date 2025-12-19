import { Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { UserProvider } from "../context/UserContext";
import { checkSession } from "../../services/auth.service";

export default function TabsLayout() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    async function validateSession() {
      const hasSession = await checkSession();

      if (!hasSession) {
        router.replace("/(auth)/iniciarsesion");
      } else {
        setChecked(true);
      }
    }

    validateSession();
  }, []);

  if (!checked) {
    return null;
  }

  return (
    <UserProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#7c3aed",
          tabBarInactiveTintColor: "#888",
          tabBarStyle: {
            backgroundColor: "#fff",
            borderTopWidth: 0.5,
            borderTopColor: "#ccc",
            height: 60,
            paddingBottom: 8,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Inicio",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="Campanas"
          options={{
            title: "Campañas",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="heart-outline" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="historias"
          options={{
            title: "Historias",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="book-outline" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="perfil"
          options={{
            title: "Perfil",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" color={color} size={size} />
            ),
          }}
        />

        <Tabs.Screen name="adminPanel" options={{ href: null }} />
        <Tabs.Screen name="perfilPanel" options={{ href: null }} />
        <Tabs.Screen name="validadorPanel" options={{ href: null }} />
      </Tabs>
    </UserProvider>
  );
}
