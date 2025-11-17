import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function AdminPanelHome() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Panel de Administración</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/app/admin/AdminList")}>
        <Text style={styles.buttonText}>👤 Administradores</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/app/admin/UserList")}>
        <Text style={styles.buttonText}>👥 Usuarios</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/app/admin/CategoryList")}>
        <Text style={styles.buttonText}>📂 Categorías</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/app/admin/CampanasList")}>
        <Text style={styles.buttonText}>📢 Campañas</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/app/admin/CreateAdminForm")}>
        <Text style={styles.buttonText}>➕ Crear Administrador</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F8F5FF",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#6d28d9",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#f5f3ff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4c1d95",
  },
});
