import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import Toast from "react-native-toast-message";
import { createAdmin } from "../../services/admin.service";
import AdminScreenWrapper from "./AdminScreenWrapper";

export default function CreateAdminForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(name, value) {
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit() {
    if (
      !formData.nombre.trim() ||
      !formData.apellido.trim() ||
      !formData.email.trim() ||
      !formData.password.trim()
    ) {
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
        text2: "Accede a tu email para confirmar la cuenta.",
      });

      // Reset form
      setFormData({
        nombre: "",
        apellido: "",
        email: "",
        password: "",
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

  return (
    <AdminScreenWrapper title="Crear Administrador">
      <View style={styles.card}>
        <Text style={styles.title}>➕ Nuevo Administrador</Text>

        <View style={styles.inputsWrapper}>

          {/* Nombre */}
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            placeholder="Nombre"
            placeholderTextColor="#6b7280"
            value={formData.nombre}
            onChangeText={(t) => handleChange("nombre", t)}
            style={styles.input}
          />

          {/* Apellido */}
          <Text style={styles.label}>Apellido</Text>
          <TextInput
            placeholder="Apellido"
            placeholderTextColor="#6b7280"
            value={formData.apellido}
            onChangeText={(t) => handleChange("apellido", t)}
            style={styles.input}
          />

          {/* Email */}
          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            placeholder="Correo electrónico"
            placeholderTextColor="#6b7280"
            value={formData.email}
            onChangeText={(t) => handleChange("email", t)}
            keyboardType="email-address"
            style={styles.input}
          />

          {/* Password */}
          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            placeholder="Contraseña"
            placeholderTextColor="#6b7280"
            secureTextEntry
            value={formData.password}
            onChangeText={(t) => handleChange("password", t)}
            style={styles.input}
          />
        </View>

        <TouchableOpacity
          disabled={loading}
          onPress={handleSubmit}
          style={styles.button}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Crear Administrador</Text>
          )}
        </TouchableOpacity>
      </View>
    </AdminScreenWrapper>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#6D28D9",
    marginBottom: 10,
    textAlign: "center",
  },

  inputsWrapper: {
    gap: 16,
    marginBottom: 24,
  },

  input: {
    borderWidth: 2,
    borderColor: "#E9D5FF",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
  },

  label: {
    fontWeight: "600",
    marginBottom: -4,
    color: "#6D28D9",
    marginTop: 4,
  },

  button: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#A855F7",
    elevation: 3,
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "600",
  },
});
