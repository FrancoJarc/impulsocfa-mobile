import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { Video } from "expo-av";
import {
  ActivityIndicator,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { getUserCampaigns } from "../../services/campaign.service";
import { createHistory } from "../../services/history.service";

export default function FormHistMobile({ onSuccess }) {
  const [form, setForm] = useState({
    titulo: "",
    contenido: "",
    id_campana: "",
  });

  const [campañas, setCampañas] = useState([]);

  const [files, setFiles] = useState({
    archivo1: null,
    archivo2: null,
    archivo3: null,
  });


  const [loadingFiles, setLoadingFiles] = useState({
    archivo1: false,
    archivo2: false,
    archivo3: false,
  });

  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);


  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (!userData) return;

        const parsed = JSON.parse(userData);
        const userId = parsed?.id_usuario;

        if (!userId) return;

        const data = await getUserCampaigns(userId);

        setCampañas(data || []);
      } catch (e) {
        console.log("Error cargando campañas:", e);
      }
    };

    loadCampaigns();
  }, []);

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };


  const pickFile = async (field) => {
    try {
      // Activar spinner
      setLoadingFiles((prev) => ({ ...prev, [field]: true }));

      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        alert("Necesitas permiso para acceder a la galería.");
        setLoadingFiles((prev) => ({ ...prev, [field]: false }));
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.assets || !result.assets.length) {
        setLoadingFiles((prev) => ({ ...prev, [field]: false }));
        return;
      }

      const asset = result.assets[0];
      const isImage = asset.type === "image";

      setFiles((prev) => ({
        ...prev,
        [field]: {
          uri: asset.uri,
          name: `${field}_${Date.now()}.${isImage ? "jpg" : "mp4"}`,
          type: isImage ? "image/jpeg" : "video/mp4",
          isImage,
        },
      }));
      setLoadingFiles((prev) => ({ ...prev, [field]: false }));
    } catch (error) {
      console.log("Error seleccionando archivo:", error);
    }
  };


  // 🚀 Enviar datos
  const handleSubmit = async () => {
    if (!form.titulo || !form.contenido || !form.id_campana) {
      Toast.show({
        type: "error",
        text1: "Campos incompletos",
        text2: "Completa todos los campos obligatorios.",
      });
      return;
    }

    if (!files.archivo1) {
      Toast.show({
        type: "error",
        text1: "Archivo requerido",
        text2: "Debes subir al menos una foto o video.",
      });
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("titulo", form.titulo);
      formData.append("contenido", form.contenido);
      formData.append("id_campana", form.id_campana);

      if (files.archivo1) formData.append("archivo1", files.archivo1);
      if (files.archivo2) formData.append("archivo2", files.archivo2);
      if (files.archivo3) formData.append("archivo3", files.archivo3);

      await createHistory(formData);

      setForm({ titulo: "", contenido: "", id_campana: "" });
      setFiles({ archivo1: null, archivo2: null, archivo3: null });

      if (onSuccess) onSuccess();

      Toast.show({
        type: "success",
        text1: "Historia subida",
        text2: "Tu historia se publicó correctamente",
      });

    } catch (e) {
      console.log("Error subiendo historia:", e);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Ocurrió un problema al subir la historia.",
      });
    }

    setLoading(false);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <ScrollView contentContainerStyle={styles.container}>

        {/* TÍTULO PRINCIPAL */}
        <Text style={styles.mainTitle}>Crear Historia</Text>
        <Text style={styles.subtitle}>
          Comparte tu historia de impacto con la comunidad de Impulso CFA
        </Text>

        {/* TÍTULO */}
        <View style={styles.block}>
          <Text style={styles.label}>Título *</Text>
          <TextInput
            style={styles.input}
            value={form.titulo}
            onChangeText={(t) => handleChange("titulo", t)}
            placeholder="Ej: Cómo reconstruimos nuestro hogar"
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* CONTENIDO */}
        <View style={styles.block}>
          <Text style={styles.label}>Contenido *</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            value={form.contenido}
            onChangeText={(t) => handleChange("contenido", t)}
            placeholder="Cuéntanos tu historia..."
            placeholderTextColor="#9ca3af"
            multiline
          />
        </View>

        {/* CAMPAÑA */}
        <View style={styles.block}>
          <Text style={styles.label}>Campaña *</Text>

          <TouchableOpacity
            style={styles.selectBox}
            onPress={() => setShowDropdown((prev) => !prev)}
          >
            <Text style={styles.selectText}>
              {form.id_campana
                ? campañas.find((c) => c.id_campana === form.id_campana)?.titulo
                : "Seleccionar campaña..."}
            </Text>
          </TouchableOpacity>

          {campañas.length === 0 && (
            <Text style={styles.emptyMsg}>Primero debes crear una campaña</Text>
          )}

          {showDropdown && campañas.length > 0 && (
            <View style={styles.dropdown}>
              {campañas.map((c) => (
                <TouchableOpacity
                  key={c.id_campana}
                  style={styles.optionBox}
                  onPress={() => {
                    handleChange("id_campana", c.id_campana);
                    setShowDropdown(false);
                  }}
                >
                  <Text style={styles.option}>{c.titulo}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* ARCHIVOS */}
        <View style={styles.fileContainer}>
          <Text style={styles.label}>Archivos Multimedia (1 foto obligatoria)</Text>

          <View style={styles.filesRow}>
            {[1, 2, 3].map((num) => {
              const key = `archivo${num}`;
              const file = files[key];

              return (
                <TouchableOpacity
                  key={num}
                  style={styles.fileBox}
                  onPress={() => pickFile(key)}
                >
                  {/* LOADER */}
                  {loadingFiles[key] && (
                    <ActivityIndicator
                      size="small"
                      color="#7c3aed"
                      style={{ position: "absolute", zIndex: 2 }}
                    />
                  )}

                  {/* PREVIEW */}
                  {file ? (
                    file.isImage ? (
                      // 🖼 PREVIEW IMAGEN
                      <Image
                        source={{ uri: file.uri }}
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: 14,
                          opacity: loadingFiles[key] ? 0.3 : 1,
                        }}
                        resizeMode="cover"
                        onLoadEnd={() =>
                          setLoadingFiles((prev) => ({ ...prev, [key]: false }))
                        }
                      />
                    ) : (
                      // 🎥 PREVIEW VIDEO
                      <>
                        {loadingFiles[key] ? null : (
                          <Video
                            source={{ uri: file.uri }}
                            style={{
                              width: "100%",
                              height: "100%",
                              borderRadius: 14,
                            }}
                            resizeMode="cover"
                            isMuted
                            shouldPlay={false}
                          />
                        )}
                      </>
                    )
                  ) : (
                    !loadingFiles[key] && (
                      <Text style={styles.fileText}>Archivo {num}</Text>
                    )
                  )}               
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* BOTÓN */}
        <TouchableOpacity
          style={styles.btn}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.btnText}>
            {loading ? "Subiendo..." : "Publicar Historia"}
          </Text>
        </TouchableOpacity>

        {/* FOOTER */}
        <Text style={styles.footerText}>
          Tu historia inspirará a otros. Comparte tu vivencia con empatía 💜
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
    flexGrow: 1,
    backgroundColor: "#f5f3ff",
  },

  mainTitle: {
    fontSize: 34,
    fontWeight: "800",
    color: "#6d28d9",
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 15,
    color: "#4b5563",
    marginBottom: 30,
  },

  block: {
    marginBottom: 25,
  },

  label: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 8,
  },

  input: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#ddd6fe",
    borderRadius: 16,
    padding: 14,
    fontSize: 15,
    color: "#374151",
  },

  textarea: {
    minHeight: 130,
    textAlignVertical: "top",
  },

  selectBox: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#ddd6fe",
    borderRadius: 16,
    padding: 14,
  },

  selectText: {
    fontSize: 15,
    color: "#374151",
  },

  option: {
    paddingVertical: 8,
    fontSize: 15,
    color: "#6b21a8",
  },

  fileContainer: {
    marginBottom: 25,
    backgroundColor: "#ede9fe",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#c4b5fd",
  },

  filesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },

  fileBox: {
    width: "30%",
    height: 90,
    backgroundColor: "white",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#ddd6fe",
    justifyContent: "center",
    alignItems: "center",
  },

  fileText: {
    fontSize: 13,
    textAlign: "center",
    color: "#6b7280",
  },

  btn: {
    backgroundColor: "#7c3aed",
    padding: 16,
    borderRadius: 18,
    marginTop: 10,
  },

  btnText: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
  },

  footerText: {
    textAlign: "center",
    fontSize: 13,
    color: "#6b7280",
    marginTop: 20,
    marginBottom: 60,
  },

  dropdown: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#ddd6fe",
    borderRadius: 16,
    marginTop: 6,
    paddingVertical: 4,
  },

  optionBox: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },

  emptyMsg: {
    marginTop: 6,
    fontSize: 14,
    color: "#9b2c2c",
    fontWeight: "600",
  },

});
