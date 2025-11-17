import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
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
    <ScrollView className="flex-1 p-4 bg-violet-50">
      <Text className="text-3xl font-bold text-violet-700 mb-4 text-center">
        👥 Usuarios Registrados
      </Text>

      {/* BUSCADOR */}
      <View className="relative mb-4">
        <Search
          size={20}
          color="#7C3AED"
          className="absolute left-3 top-1/2 -translate-y-1/2"
        />
        <TextInput
          placeholder="Buscar por nombre, apellido o email..."
          value={search}
          onChangeText={handleSearch}
          className="bg-white border-2 border-violet-200 p-3 pl-10 rounded-xl shadow-sm"
        />
      </View>

      {/* LOADING */}
      {loading ? (
        <ActivityIndicator size="large" color="#7C3AED" className="mt-10" />
      ) : filtered.length === 0 ? (
        <Text className="text-center mt-10 text-gray-500 text-lg">
          No se encontraron usuarios.
        </Text>
      ) : (
        filtered.map((user) => {
          const colors = getStatus(user.estado_cuenta);

          return (
            <View
              key={user.id_usuario}
              className="bg-white p-5 rounded-2xl mb-4 shadow-md border border-violet-100"
            >
              {/* NOMBRE */}
              <Text className="text-xl font-bold text-gray-800">
                {user.nombre} {user.apellido}
              </Text>

              {/* EMAIL */}
              <Text className="text-gray-500 mb-2">{user.email}</Text>

              {/* BADGE DE ESTADO */}
              <View
                className={`self-start px-4 py-1 rounded-full mb-3 ${colors.bg}`}
              >
                <Text className={`font-semibold ${colors.text}`}>
                  {user.estado_cuenta}
                </Text>
              </View>

              {/* BOTONES */}
              <View className="flex-row justify-between mt-2">
                <TouchableOpacity
                  onPress={() => handleStateChange(user.id_usuario, "habilitada")}
                >
                  <Text className="text-green-600 font-bold underline">
                    ✓ Habilitar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    handleStateChange(user.id_usuario, "deshabilitada")
                  }
                >
                  <Text className="text-red-600 font-bold underline">
                    ✕ Deshabilitar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleStateChange(user.id_usuario, "suspendida")}
                >
                  <Text className="text-yellow-600 font-bold underline">
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
