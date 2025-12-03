import { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getHistoryById, updateHistory } from "../../services/history.service";
import Animated from "react-native-reanimated";

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
      router.push(`/vermashist/${id}`);
    } catch (err) {
      console.log("Error actualizando historia:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#6d28d9" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-[#f3f0ff] px-4 py-6">

      <Text className="text-3xl font-bold text-center text-violet-700 mb-6">
        Editar Historia
      </Text>

      {/* TÍTULO */}
      <Text className="text-lg text-violet-700 font-semibold mb-2">Título</Text>
      <TextInput
        value={form.titulo}
        onChangeText={(t) => setForm({ ...form, titulo: t })}
        placeholder="Ej: Cómo reconstruimos nuestro hogar"
        className="bg-white p-4 rounded-xl border border-violet-300 text-gray-800 mb-6"
      />

      {/* CONTENIDO */}
      <Text className="text-lg text-violet-700 font-semibold mb-2">Contenido</Text>
      <TextInput
        value={form.contenido}
        onChangeText={(t) => setForm({ ...form, contenido: t })}
        placeholder="Cuéntanos tu historia..."
        multiline
        numberOfLines={6}
        className="bg-white p-4 rounded-xl border border-violet-300 text-gray-800 mb-6"
      />

      {/* MULTIMEDIA */}
      <Text className="text-lg text-violet-700 font-semibold mb-3">
        Actualizar Multimedia (Opcional)
      </Text>

      <View className="flex-row justify-between mb-6">
        {[1, 2, 3].map((num) => {
          const key = `archivo${num}`;
          const img = files[key];

          return (
            <TouchableOpacity
              key={num}
              onPress={() => pickImage(key)}
              className="w-[30%] h-28 bg-white rounded-xl border border-violet-300 items-center justify-center overflow-hidden"
            >
              <Image
                source={
                  img
                    ? { uri: img.uri }
                    : { uri: "https://via.placeholder.com/300x200?text=Sin+Imagen" }
                }
                className="w-full h-full"
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
        className="bg-violet-600 py-4 rounded-2xl mb-4"
      >
        <Text className="text-white text-center font-bold text-lg">
          {submitting ? "Actualizando..." : "Guardar Cambios"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push(`/vermashist/${id}`)}
        className="bg-gray-300 py-4 rounded-2xl"
      >
        <Text className="text-center text-gray-700 font-bold">Cancelar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
