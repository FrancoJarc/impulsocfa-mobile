import { useEffect, useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert } from "react-native";
import { getAdmins, disableAdmin, updateAdmin } from "../../services/admin.service";

export default function AdminList() {
  const [admins, setAdmins] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ nombre: "", apellido: "", email: "" });

  useEffect(() => {
    loadAdmins();
  }, []);

  async function loadAdmins() {
    try {
      const data = await getAdmins();
      setAdmins(data);
    } catch (error) {
      Alert.alert("Error", "❌ Error al cargar administradores");
      console.error(error);
    }
  }

  function handleDisable(id) {
    Alert.alert(
      "Confirmación",
      "¿Seguro que querés deshabilitar este administrador?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí",
          onPress: async () => {
            try {
              await disableAdmin(id);
              Alert.alert("Éxito", "Administrador deshabilitado ✅");
              loadAdmins();
            } catch (error) {
              Alert.alert("Error", "❌ Error al deshabilitar administrador");
              console.error(error);
            }
          },
        },
      ]
    );
  }

  function handleEditClick(admin) {
    setEditId(admin.id_usuario);
    setEditData({ nombre: admin.nombre, apellido: admin.apellido, email: admin.email });
  }

  async function handleSave(id) {
    try {
      await updateAdmin(id, editData);
      Alert.alert("Éxito", "Administrador actualizado ✅");
      setEditId(null);
      loadAdmins();
    } catch (error) {
      Alert.alert("Error", "❌ Error al actualizar administrador");
      console.error(error);
    }
  }

  return (
    <ScrollView className="p-4 bg-white">
      <Text className="text-2xl font-bold text-violet-700 mb-4">👤 Lista de Administradores</Text>

      {admins.length === 0 ? (
        <Text className="text-gray-500 text-center py-8">No hay administradores registrados.</Text>
      ) : (
        admins.map((admin) => (
          <View
            key={admin.id_usuario}
            className="bg-violet-50 p-4 rounded-xl mb-4 border border-violet-100"
          >
            <View className="flex flex-col gap-2">
              {editId === admin.id_usuario ? (
                <>
                  <TextInput
                    className="border border-violet-200 px-3 py-2 rounded-lg"
                    placeholder="Nombre"
                    value={editData.nombre}
                    onChangeText={(text) => setEditData({ ...editData, nombre: text })}
                  />
                  <TextInput
                    className="border border-violet-200 px-3 py-2 rounded-lg"
                    placeholder="Apellido"
                    value={editData.apellido}
                    onChangeText={(text) => setEditData({ ...editData, apellido: text })}
                  />
                  <TextInput
                    className="border border-violet-200 px-3 py-2 rounded-lg"
                    placeholder="Email"
                    value={editData.email}
                    onChangeText={(text) => setEditData({ ...editData, email: text })}
                  />
                </>
              ) : (
                <>
                  <Text className="font-semibold text-gray-800 text-lg">
                    {admin.nombre} {admin.apellido}
                  </Text>
                  <Text className="text-gray-600">{admin.email}</Text>
                </>
              )}

              <View className="flex flex-row gap-2 mt-2 flex-wrap">
                {editId === admin.id_usuario ? (
                  <>
                    <TouchableOpacity
                      onPress={() => handleSave(admin.id_usuario)}
                      className="bg-green-400 px-4 py-2 rounded-lg"
                    >
                      <Text className="text-white font-semibold text-center">✓ Guardar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setEditId(null)}
                      className="bg-gray-300 px-4 py-2 rounded-lg"
                    >
                      <Text className="text-gray-700 font-semibold text-center">✕ Cancelar</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <TouchableOpacity
                      onPress={() => handleEditClick(admin)}
                      className="bg-blue-400 px-4 py-2 rounded-lg"
                    >
                      <Text className="text-white font-semibold text-center">✏️ Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDisable(admin.id_usuario)}
                      className="bg-red-400 px-4 py-2 rounded-lg"
                    >
                      <Text className="text-white font-semibold text-center">🚫 Deshabilitar</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}
