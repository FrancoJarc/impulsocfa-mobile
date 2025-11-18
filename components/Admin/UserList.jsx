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

  // Cargar usuarios
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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>👥 Usuarios Registrados</Text>

      {/* BUSCADOR */}
      <View style={styles.searchWrapper}>
        <Search size={20} color="#7C3AED" style={styles.searchIcon} />
        <TextInput
          placeholder="Buscar por nombre, apellido o email..."
          value={search}
          onChangeText={handleSearch}
          style={styles.searchInput}
        />
      </View>

      {/* LOADING */}
      {loading ? (
        <ActivityIndicator size="large" color="#7C3AED" style={{ marginTop: 40 }} />
      ) : filtered.length === 0 ? (
        <Text style={styles.noResults}>No se encontraron usuarios.</Text>
      ) : (
        filtered.map((user) => {
          const colors = getStatus(user.estado_cuenta);

          return (
            <View key={user.id_usuario} style={styles.card}>
              <Text style={styles.name}>
                {user.nombre} {user.apellido}
              </Text>

              <Text style={styles.email}>{user.email}</Text>

              {/* BADGE */}
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

              {/* BOTONES */}
              <View style={styles.actions}>
                <TouchableOpacity
                  onPress={() => handleStateChange(user.id_usuario, "habilitada")}
                >
                  <Text style={[styles.actionText, { color: "#16A34A" }]}>
                    ✓ Habilitar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleStateChange(user.id_usuario, "deshabilitada")}
                >
                  <Text style={[styles.actionText, { color: "#DC2626" }]}>
                    ✕ Deshabilitar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleStateChange(user.id_usuario, "suspendida")}
                >
                  <Text style={[styles.actionText, { color: "#CA8A04" }]}>
                    ⏸ Suspender
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F3E8FF",
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#6D28D9",
    textAlign: "center",
    marginBottom: 16,
  },

  searchWrapper: {
    position: "relative",
    marginBottom: 16,
  },

  searchIcon: {
    position: "absolute",
    top: 14,
    left: 12,
  },

  searchInput: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#E9D5FF",
    padding: 12,
    paddingLeft: 40,
    borderRadius: 12,
    fontSize: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  noResults: {
    textAlign: "center",
    marginTop: 30,
    color: "#6B7280",
    fontSize: 16,
  },

  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E9D5FF",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
  },

  email: {
    color: "#6B7280",
    marginBottom: 6,
  },

  badge: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 999,
    marginBottom: 10,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },

  actionText: {
    fontWeight: "700",
    textDecorationLine: "underline",
    fontSize: 15,
  },
});