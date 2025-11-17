import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Toast from "react-native-toast-message";
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
    if (!formData.nombre.trim() ||
        !formData.apellido.trim() ||
        !formData.email.trim() ||
        !formData.password.trim() ||
        !formData.nacionalidad.trim()) {
      Toast.show({
        type: "error",
        text1: "Campos incompletos",
        text2: "Completá todos los datos antes de continuar.",
      });
      return;
    }

    setLoading(true);
    try {
      await createAdmin(formData);

      Toast.show({
        type: "success",
        text1: "Administrador creado",
        text2: "El administrador fue registrado exitosamente.",
      });

      setFormData({
        nombre: "",
        apellido: "",
        email: "",
        password: "",
        nacionalidad: "",
      });

    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error al crear administrador",
        text2: error.message || "Intentalo nuevamente",
      });
    } finally {
      setLoading(false);
    }
  }

  const inputStyle =
    "border-2 border-violet-200 bg-white p-3 rounded-xl shadow-sm";

  return (
    <ScrollView className="flex-1 p-4 bg-violet-50">
      <View className="bg-white/80 p-6 rounded-3xl shadow-xl border border-violet-200">
        
        <Text className="text-3xl font-bold text-violet-700 mb-6">
          ➕ Crear Administrador
        </Text>

        {/* Inputs */}
        <View className="flex-col gap-4 mb-6">
          <TextInput
            placeholder="Nombre"
            value={formData.nombre}
            onChangeText={(t) => handleChange("nombre", t)}
            className={inputStyle}
          />

          <TextInput
            placeholder="Apellido"
            value={formData.apellido}
            onChangeText={(t) => handleChange("apellido", t)}
            className={inputStyle}
          />

          <TextInput
            placeholder="Correo electrónico"
            value={formData.email}
            onChangeText={(t) => handleChange("email", t)}
            keyboardType="email-address"
            className={inputStyle}
          />

          <TextInput
            placeholder="Contraseña"
            secureTextEntry
            value={formData.password}
            onChangeText={(t) => handleChange("password", t)}
            className={inputStyle}
          />

          <TextInput
            placeholder="Nacionalidad"
            value={formData.nacionalidad}
            onChangeText={(t) => handleChange("nacionalidad", t)}
            className={inputStyle}
          />
        </View>

        {/* Botón */}
        <TouchableOpacity
          disabled={loading}
          onPress={handleSubmit}
          className="w-full bg-gradient-to-r from-violet-500 to-pink-500 py-3 rounded-xl shadow-md active:opacity-80"
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-center text-lg font-semibold">
              Crear Administrador
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
