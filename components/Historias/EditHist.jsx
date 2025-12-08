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
      } catch (err) {
        console.log("Error cargando historia:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [id]);

  const pickImage = async (field) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 0.7,
    });

    if (!result.canceled) {
      setFiles((prev) => ({ ...prev, [field]: result.assets[0] }));
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
          const img = files[key];
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
              <Image
                source={{
                  uri: img
                    ? img.uri
                    : "https://via.placeholder.com/300x200?text=Sin+Imagen",
                }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
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
