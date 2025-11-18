import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import Toast from "react-native-toast-message";
import { createAdmin } from "../../services/admin.service";
import CountryPicker from "react-native-country-picker-modal";
import AdminScreenWrapper from "./AdminScreenWrapper";

export default function CreateAdminForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    nacionalidad: "",
  });

  const [loading, setLoading] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);


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

  return (
 <AdminScreenWrapper title="Crear Administrador">
      
        <View style={styles.card}>
          <Text style={styles.title}>➕ Nuevo Administrador</Text>

          <View style={styles.inputsWrapper}>
            <TextInput
              placeholder="Nombre"
              value={formData.nombre}
              onChangeText={(t) => handleChange("nombre", t)}
              style={styles.input}
            />

            <TextInput
              placeholder="Apellido"
              value={formData.apellido}
              onChangeText={(t) => handleChange("apellido", t)}
              style={styles.input}
            />

            <TextInput
              placeholder="Correo electrónico"
              value={formData.email}
              onChangeText={(t) => handleChange("email", t)}
              keyboardType="email-address"
              style={styles.input}
            />

            <TextInput
              placeholder="Contraseña"
              secureTextEntry
              value={formData.password}
              onChangeText={(t) => handleChange("password", t)}
              style={styles.input}
            />

            {/* Nacionalidad */}
            <Text style={styles.label}>Nacionalidad</Text>

            <TouchableOpacity
              style={styles.countryButton}
              onPress={() => setShowCountryPicker(true)}
            >
              <Text style={styles.countryText}>
                {formData.nacionalidad || "Selecciona tu país"}
              </Text>
            </TouchableOpacity>

            <CountryPicker
              visible={showCountryPicker}
              withFilter
              withFlag
              withAlphaFilter
              renderFlagButton={() => null}
              onSelect={(country) => {
                handleChange("nacionalidad", country.name);
                setShowCountryPicker(false);
              }}
              onClose={() => setShowCountryPicker(false)}
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
    marginBottom: 24,
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

  countryButton: {
    borderWidth: 2,
    borderColor: "#E9D5FF",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
  },

  countryText: {
    color: "#4B5563",
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