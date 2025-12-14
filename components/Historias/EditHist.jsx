import { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getHistoryById, updateHistory } from "../../services/history.service";
import Toast from "react-native-toast-message";


export default function EditHist() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [form, setForm] = useState({
    titulo: "",
    contenido: "",
  });

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

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const data = await getHistoryById(id);

        setForm({
          titulo: data.titulo || "",
          contenido: data.contenido || "",
        });

        setFiles({
          archivo1: data.archivo1
            ? {
              uri: data.archivo1.startsWith("http")
                ? data.archivo1
                : `${API_URL}/${data.archivo1}`,
              name: "archivo1.jpg",
              type: "image/jpeg",
              isImage: true,
            }
            : null,

          archivo2: data.archivo2
            ? {
              uri: data.archivo2.startsWith("http")
                ? data.archivo2
                : `${API_URL}/${data.archivo2}`,
              name: "archivo2.jpg",
              type: "image/jpeg",
              isImage: true,
            }
            : null,

          archivo3: data.archivo3
            ? {
              uri: data.archivo3.startsWith("http")
                ? data.archivo3
                : `${API_URL}/${data.archivo3}`,
              name: "archivo3.jpg",
              type: "image/jpeg",
              isImage: true,
            }
            : null,
        });
      } catch (err) {
        console.log("Error cargando historia:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [id]);

  const pickImage = async (field) => {
    try {
      setLoadingFiles((prev) => ({ ...prev, [field]: true }));

      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        alert("Necesitas permiso para acceder a la galería.");
        setLoadingFiles((prev) => ({ ...prev, [field]: false }));
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });

      if (!result.assets || !result.assets.length) {
        setLoadingFiles((prev) => ({ ...prev, [field]: false }));
        return;
      }

      const asset = result.assets[0];

      setFiles((prev) => ({
        ...prev,
        [field]: {
          uri: asset.uri,
          name: `${field}_${Date.now()}.jpg`,
          type: "image/jpeg",
          isImage: true,
        },
      }));
    } catch (e) {
      console.log("Error seleccionando imagen:", e);
      setLoadingFiles((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      await updateHistory(id, { ...form, ...files });
      Toast.show({
        type: 'success',
        text1: "Historia modificada con éxito",
        visibilityTime: 4000,
      });
      router.push("/(tabs)/perfilPanel/TusHist"); 
    } catch (err) {
      console.log("Error actualizando historia:", err);
      Alert.alert("Error", "No se pudo actualizar la historia.");
    } finally {
      setSubmitting(false);
    }
  };


  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f3f0ff",
        }}
      >
        <ActivityIndicator size="large" color="#6d28d9" />
      </View>
    );
  }

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#f3f0ff",
        paddingHorizontal: 16,
        paddingVertical: 24,
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          textAlign: "center",
          color: "#7c3aed",
          marginBottom: 24,
          marginTop: 15,
        }}
      >
        Editar Historia
      </Text>

      {/* TÍTULO */}
      <Text
        style={{
          fontSize: 18,
          fontWeight: "600",
          color: "#7c3aed",
          marginBottom: 8,
        }}
      >
        Título
      </Text>
      <TextInput
        value={form.titulo}
        onChangeText={(t) => setForm({ ...form, titulo: t })}
        placeholder="Ej: Cómo reconstruimos nuestro hogar"
        style={{
          backgroundColor: "#fff",
          padding: 20,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: "#c4b5fd",
          color: "#111",
          marginBottom: 24,
        }}
      />

      {/* CONTENIDO */}
      <Text
        style={{
          fontSize: 18,
          fontWeight: "600",
          color: "#7c3aed",
          marginBottom: 8,
        }}
      >
        Contenido
      </Text>
      <TextInput
        value={form.contenido}
        onChangeText={(t) => setForm({ ...form, contenido: t })}
        placeholder="Cuéntanos tu historia..."
        multiline
        numberOfLines={6}
        style={{
          backgroundColor: "#fff",
          padding: 20,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: "#c4b5fd",
          color: "#111",
          marginBottom: 24,
          textAlignVertical: "top",
        }}
      />

      {/* MULTIMEDIA */}
      <Text
        style={{
          fontSize: 18,
          fontWeight: "600",
          color: "#7c3aed",
          marginBottom: 12,
        }}
      >
        Actualizar Multimedia (Opcional)
      </Text>

      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 24 }}>
        {[1, 2, 3].map((num) => {
          const key = `archivo${num}`;
          const file = files[key];

          return (
            <TouchableOpacity
              key={num}
              onPress={() => pickImage(key)}
              style={{
                width: "30%",
                height: 120,
                backgroundColor: "#fff",
                borderRadius: 16,
                borderWidth: 1,
                borderColor: "#c4b5fd",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {/* SPINNER */}
              {loadingFiles[key] && (
                <ActivityIndicator
                  size="small"
                  color="#7c3aed"
                  style={{ position: "absolute", zIndex: 2 }}
                />
              )}

              {/* PREVIEW */}
              {file ? (
                <Image
                  source={{ uri: file.uri }}
                  style={{
                    width: "100%",
                    height: "100%",
                    opacity: loadingFiles[key] ? 0.3 : 1,
                  }}
                  resizeMode="cover"
                  onLoadEnd={() =>
                    setLoadingFiles((prev) => ({ ...prev, [key]: false }))
                  }
                />
              ) : (
                !loadingFiles[key] && (
                  <Text style={{ color: "#6b7280", fontSize: 13 }}>
                    Archivo {num}
                  </Text>
                )
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* BOTONES */}
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={submitting}
        style={{
          backgroundColor: "#7c3aed",
          paddingVertical: 16,
          borderRadius: 24,
          marginBottom: 16,
        }}
      >
        <Text
          style={{
            color: "#fff",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          {submitting ? "Actualizando..." : "Guardar Cambios"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/(tabs)/perfilPanel/TusHist")}
        style={{
          backgroundColor: "#d1d5db",
          paddingVertical: 16,
          borderRadius: 24,
        }}
      >
        <Text
          style={{
            color: "#374151",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          Cancelar
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
