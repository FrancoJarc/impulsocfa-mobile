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
import { Search } from "lucide-react-native";

import { getUsers, changeUserState } from "../../services/admin.service";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
      setFiltered(data);
    } catch (error) {
      console.error("❌ Error al cargar usuarios:", error);
      Toast.show({
        type: "error",
        text1: "Error al cargar usuarios",
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleStateChange(id, newState) {
    try {
      await changeUserState(id, newState);

      Toast.show({
        type: "success",
        text1: `Estado actualizado a "${newState}"`,
        position: "top",
      });

      loadUsers();
    } catch (error) {
      console.error("❌ Error al cambiar estado:", error);

      Toast.show({
        type: "error",
        text1: "No se pudo cambiar el estado",
        position: "top",
      });
    }
  }

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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>👥 Lista de Usuarios</Text>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <Search size={20} color="#6D28D9" style={styles.searchIcon} />
        <TextInput
          placeholder="Buscar por nombre, apellido o email..."
          value={search}
          onChangeText={handleSearch}
          style={styles.searchInput}
        />
      </View>

      {/* Loader */}
      {loading ? (
        <ActivityIndicator size="large" color="#6D28D9" style={{ marginTop: 40 }} />
      ) : filtered.length === 0 ? (
        <Text style={styles.noResults}>No se encontraron usuarios.</Text>
      ) : (
        filtered.map((user) => (
          <View key={user.id_usuario} style={styles.card}>
            <Text style={styles.name}>
              {user.nombre} {user.apellido}
            </Text>
            <Text style={styles.email}>{user.email}</Text>

            {/* Estado */}
            <View style={[styles.statusBadge, getStatusColor(user.estado_cuenta)]}>
              <Text style={styles.statusText}>{user.estado_cuenta}</Text>
            </View>

            {/* Botones */}
            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() => handleStateChange(user.id_usuario, "habilitada")}
              >
                <Text style={[styles.actionBtn, styles.green]}>✓ Habilitar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleStateChange(user.id_usuario, "deshabilitada")}
              >
                <Text style={[styles.actionBtn, styles.red]}>✕ Deshabilitar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleStateChange(user.id_usuario, "suspendida")}
              >
                <Text style={[styles.actionBtn, styles.yellow]}>⏸ Suspender</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

function getStatusColor(status) {
  switch (status) {
    case "habilitada":
      return { backgroundColor: "#D1FAE5" };
    case "deshabilitada":
      return { backgroundColor: "#FECACA" };
    default:
      return { backgroundColor: "#FEF3C7" };
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F8F5FF",
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#6D28D9",
    marginBottom: 20,
    textAlign: "center",
  },

  searchContainer: {
    position: "relative",
    marginBottom: 20,
  },

  searchIcon: {
    position: "absolute",
    left: 12,
    top: 14,
  },

  searchInput: {
    backgroundColor: "#f5f3ff",
    borderWidth: 1,
    borderColor: "#c4b5fd",
    borderRadius: 10,
    padding: 12,
    paddingLeft: 42,
    fontSize: 16,
  },

  noResults: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 50,
    fontSize: 16,
  },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#374151",
  },

  email: {
    color: "#6B7280",
    marginBottom: 8,
  },

  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 12,
  },

  statusText: {
    fontWeight: "bold",
    color: "#374151",
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  actionBtn: {
    fontSize: 14,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },

  green: { color: "#059669" },
  red: { color: "#DC2626" },
  yellow: { color: "#CA8A04" },
});
