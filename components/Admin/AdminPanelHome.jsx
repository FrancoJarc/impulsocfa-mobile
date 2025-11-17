import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function AdminPanelHome() {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.card}>
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
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F8F5FF",
  },

  card: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#8b5cf6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#e0e7ff",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
    color: "#6d28d9",
  },

  button: {
    backgroundColor: "#f5f3ff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#dcd4ff",
    shadowColor: "#8b5cf6",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },

  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4c1d95",
    textAlign: "center",
  },
});
