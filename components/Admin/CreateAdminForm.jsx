import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { createAdmin } from "../../services/admin.service";

export default function CreateAdminForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    nacionalidad: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(name, value) {
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit() {
    setLoading(true);
    try {
      await createAdmin(formData);
      Alert.alert("✅ Administrador creado correctamente!");

      setFormData({
        nombre: "",
        apellido: "",
        email: "",
        password: "",
        nacionalidad: "",
      });
    } catch (error) {
      Alert.alert("❌ Error", "Error al crear administrador: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView className="flex-1 p-4 bg-violet-50">
      <View className="bg-white/80 p-6 rounded-2xl shadow-lg border border-violet-200">
        <Text className="text-2xl font-bold text-violet-700 mb-4 flex-row">
          ➕ Crear Nuevo Administrador
        </Text>

        {/* Inputs */}
        <View className="flex-col gap-4 mb-6">
          <TextInput
            placeholder="Nombre"
            value={formData.nombre}
            onChangeText={(text) => handleChange("nombre", text)}
            className="border-2 border-violet-200 p-3 rounded-lg"
          />

          <TextInput
            placeholder="Apellido"
            value={formData.apellido}
            onChangeText={(text) => handleChange("apellido", text)}
            className="border-2 border-violet-200 p-3 rounded-lg"
          />

          <TextInput
            placeholder="Correo electrónico"
            value={formData.email}
            onChangeText={(text) => handleChange("email", text)}
            keyboardType="email-address"
            className="border-2 border-violet-200 p-3 rounded-lg"
          />

          <TextInput
            placeholder="Contraseña"
            secureTextEntry
            value={formData.password}
            onChangeText={(text) => handleChange("password", text)}
            className="border-2 border-violet-200 p-3 rounded-lg"
          />

          <TextInput
            placeholder="Nacionalidad"
            value={formData.nacionalidad}
            onChangeText={(text) => handleChange("nacionalidad", text)}
            className="border-2 border-violet-200 p-3 rounded-lg"
          />
        </View>

        {/* Botón */}
        <TouchableOpacity
          disabled={loading}
          onPress={handleSubmit}
          className="w-full bg-gradient-to-r from-violet-500 to-pink-500 py-3 rounded-lg shadow-md"
        >
          <Text className="text-white text-center font-semibold">
            {loading ? "Creando..." : "Crear Administrador"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
