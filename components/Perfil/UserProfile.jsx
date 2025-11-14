import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { Calendar, UserRound, Flag, Camera } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  updateUserProfile,
  disableUserAccount,
} from "../../services/user.service";

export default function UserProfileMobile({ navigation }) {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    fecha_nacimiento: "",
    nacionalidad: "",
    foto_perfil: null,
  });

  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // -------------------------------
  // 🔹 Cargar usuario desde AsyncStorage (igual que WEB)
  // -------------------------------
  useEffect(() => {
    async function loadUser() {
      try {
        const stored = await AsyncStorage.getItem("user");
        if (!stored) return;

        const user = JSON.parse(stored);

        setFormData({
          nombre: user.nombre || "",
          apellido: user.apellido || "",
          fecha_nacimiento: user.fecha_nacimiento || "",
          nacionalidad: user.nacionalidad || "",
          foto_perfil: null,
        });

        setPreview(
          user.foto_perfil
            ? `${API_URL}/${user.foto_perfil}`
            : null
        );
      } catch (err) {
        console.log("Error cargando usuario:", err);
      }
    }

    loadUser();
  }, []);

  // -------------------------------
  // 🔹 Elegir imagen desde la galería
  // -------------------------------
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      base64: false,
      quality: 0.7,
    });

    if (!result.canceled) {
      setPreview(result.assets[0].uri);
      setFormData({ ...formData, foto_perfil: result.assets[0] });
    }
  };

  // -------------------------------
  // 🔹 Guardar cambios del perfil
  // -------------------------------
  const updateProfile = async () => {
    try {
      setSaving(true);

      const data = { ...formData };
      if (!formData.foto_perfil) delete data.foto_perfil;

      const updatedUser = await updateUserProfile(data);

      // Guardar en AsyncStorage (igual a localStorage en web)
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));

      Alert.alert("✨ Éxito", "Perfil actualizado correctamente");
    } catch (err) {
      Alert.alert("Error", "No se pudo actualizar el perfil");
    } finally {
      setSaving(false);
    }
  };

  // Mostrar modal
  const confirmDisable = () => setModalVisible(true);

  // Deshabilitar cuenta
  const disableAccountMobile = async () => {
    try {
      await disableUserAccount();

      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("access_token");

      Alert.alert("Cuenta deshabilitada", "Tu cuenta fue desactivada");

      navigation.replace("Login");
    } catch (err) {
      Alert.alert("Error", "No se pudo deshabilitar la cuenta");
    } finally {
      setModalVisible(false);
    }
  };

  // -------------------------------
  // ⬇ UI — IGUAL A TU DISEÑO ORIGINAL
  // -------------------------------
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={["#ede9fe", "#e0f2fe", "#f5f3ff"]}
        style={{ flex: 1, padding: 20 }}
      >
        <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
          <Text
            style={{
              fontSize: 32,
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: 20,
              color: "#6d28d9",
            }}
          >
            Mi Perfil
          </Text>

          {/* FOTO DE PERFIL */}
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <TouchableOpacity onPress={pickImage} style={{ position: "relative" }}>
              <Image
                source={
                  preview
                    ? { uri: preview }
                    : require("../../assets/images/default-avatar.png")
                }
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 100,
                  borderWidth: 4,
                  borderColor: "#c4b5fd",
                }}
              />

              <View
                style={{
                  position: "absolute",
                  bottom: -5,
                  right: -5,
                  backgroundColor: "#ddd6fe",
                  padding: 8,
                  borderRadius: 30,
                }}
              >
                <Camera size={22} color="#6d28d9" />
              </View>
            </TouchableOpacity>
          </View>

          {/* INPUTS */}
          <Input
            label="Nombre"
            value={formData.nombre}
            onChange={(t) => setFormData({ ...formData, nombre: t })}
            icon={<UserRound size={20} color="#7c3aed" />}
          />

          <Input
            label="Apellido"
            value={formData.apellido}
            onChange={(t) => setFormData({ ...formData, apellido: t })}
            icon={<UserRound size={20} color="#7c3aed" />}
          />

          <Input
            label="Fecha de nacimiento"
            value={formData.fecha_nacimiento}
            onChange={(t) => setFormData({ ...formData, fecha_nacimiento: t })}
            icon={<Calendar size={20} color="#7c3aed" />}
          />

          <Input
            label="Nacionalidad"
            value={formData.nacionalidad}
            onChange={(t) => setFormData({ ...formData, nacionalidad: t })}
            icon={<Flag size={20} color="#7c3aed" />}
          />

          {/* GUARDAR */}
          <TouchableOpacity
            onPress={updateProfile}
            disabled={saving}
            style={{
              marginTop: 20,
              backgroundColor: "#8b5cf6",
              paddingVertical: 14,
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
                Actualizar perfil
              </Text>
            )}
          </TouchableOpacity>

          {/* DESHABILITAR */}
          <TouchableOpacity
            onPress={confirmDisable}
            style={{
              marginTop: 20,
              backgroundColor: "#f43f5e",
              paddingVertical: 14,
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
              Deshabilitar cuenta
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* MODAL */}
        <Modal transparent visible={modalVisible} animationType="fade">
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.4)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                padding: 20,
                borderRadius: 20,
                width: "80%",
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  textAlign: "center",
                  marginBottom: 10,
                }}
              >
                ¿Deshabilitar tu cuenta?
              </Text>

              <Text
                style={{ textAlign: "center", fontSize: 14, marginBottom: 20 }}
              >
                No podrás acceder hasta que un administrador la reactive.
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={{
                    padding: 12,
                    backgroundColor: "#e5e7eb",
                    borderRadius: 10,
                    width: "48%",
                    alignItems: "center",
                  }}
                >
                  <Text>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={disableAccountMobile}
                  style={{
                    padding: 12,
                    backgroundColor: "#f43f5e",
                    borderRadius: 10,
                    width: "48%",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "white" }}>Deshabilitar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </SafeAreaView>
  );
}

/* COMPONENTE INPUT REUTILIZABLE */
function Input({ label, value, onChange, icon }) {
  return (
    <View style={{ marginBottom: 15 }}>
      <Text
        style={{
          marginBottom: 6,
          fontWeight: "600",
          color: "#4b5563",
          fontSize: 14,
        }}
      >
        {label}
      </Text>

      <View
        style={{
          backgroundColor: "#ede9fe",
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: 10,
          borderColor: "#c4b5fd",
          borderWidth: 1,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {icon}
        <TextInput
          value={value}
          onChangeText={onChange}
          style={{
            marginLeft: 10,
            flex: 1,
            fontSize: 15,
            color: "#4b5563",
          }}
        />
      </View>
    </View>
  );
}
