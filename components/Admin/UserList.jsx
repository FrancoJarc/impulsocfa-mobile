import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from "react-native";
import Toast from "react-native-toast-message";
import { getUsers, changeUserState } from "../../services/admin.service";
import AdminScreenWrapper from "./AdminScreenWrapper";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar usuarios
  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error al cargar usuarios",
        text2: "Intentá nuevamente",
      });
    } finally {
      setLoading(false);
    }
  }

  // Cambiar estado
  async function handleStateChange(id, newState) {
    try {
      await changeUserState(id, newState);

      Toast.show({
        type: "success",
        text1: "Estado actualizado",
        text2: `El usuario ahora está: "${newState}".`,
      });

      loadUsers();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "No se pudo actualizar",
      });
    }
  }

  // Buscar usuario
  function handleSearch(value) {
    setSearch(value);

    if (!value.trim()) {
      setFiltered(users);
      return;
    }

    const lower = value.toLowerCase();

    setFiltered(
      users.filter(
        (u) =>
          u.nombre.toLowerCase().includes(lower) ||
          u.apellido.toLowerCase().includes(lower) ||
          u.email.toLowerCase().includes(lower)
      )
    );
  }

  // Colores para estado
  function getStatus(status) {
    switch (status) {
      case "habilitada":
        return { bg: "bg-green-100", text: "text-green-700" };
      case "deshabilitada":
        return { bg: "bg-red-100", text: "text-red-700" };
      default:
        return { bg: "bg-yellow-100", text: "text-yellow-700" };
    }
  }

  return (
    <AdminScreenWrapper>

      <Text style={styles.title}>👥 Lista de Usuarios</Text>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#7C3AED"
          style={{ marginTop: 40 }}
        />
      ) : users.length === 0 ? (
        <Text style={styles.noResults}>No se encontraron usuarios.</Text>
      ) : (
        users.map((user) => {
          const colors = getStatus(user.estado_cuenta);

          return (
            <View key={user.id_usuario} style={styles.card}>
              <Text style={styles.name}>
                {user.nombre} {user.apellido}
              </Text>

              <Text style={styles.email}>{user.email}</Text>

              <View
                style={[
                  styles.badge,
                  { backgroundColor: colors.bg },
                ]}
              >
                <Text style={{ color: colors.text, fontWeight: "600" }}>
                  {user.estado_cuenta}
                </Text>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.greenButton]}
                  onPress={() => handleStateChange(user.id_usuario, "habilitada")}
                >
                  <Text style={styles.actionButtonText}>✓ Habilitar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.redButton]}
                  onPress={() => handleStateChange(user.id_usuario, "deshabilitada")}
                >
                  <Text style={styles.actionButtonText}>✕ Deshabilitar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.yellowButton]}
                  onPress={() => handleStateChange(user.id_usuario, "suspendida")}
                >
                  <Text style={styles.actionButtonText}>⏸ Suspender</Text>
                </TouchableOpacity>
              </View>


            </View>
          );
        })
      )}
    </AdminScreenWrapper>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
    color: "#6d28d9",
  },

  noResults: {
    textAlign: "center",
    fontSize: 16,
    color: "#6b7280",
    marginTop: 40,
  },

  card: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: 18,
    borderRadius: 16,
    marginBottom: 20,

    borderWidth: 1,
    borderColor: "#e0e7ff",

    shadowColor: "#8b5cf6",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },

  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4c1d95",
  },

  email: {
    fontSize: 16,
    color: "#6d28d9",
    marginBottom: 8,
  },

  badge: {
    alignSelf: "flex-start",
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 999,
    marginTop: 6,
    marginBottom: 10,
  },

actionButton: {
  paddingVertical: 12,
  borderRadius: 12,
  alignItems: "center",
  width: "31%",
},
actions: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 15,
},
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },

  greenButton: {
    backgroundColor: "#22c55e",
  },

  redButton: {
    backgroundColor: "#ef4444",
  },

  yellowButton: {
    backgroundColor: "#eab308",
  },
});
