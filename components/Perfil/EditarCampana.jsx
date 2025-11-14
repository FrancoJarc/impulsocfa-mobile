import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getCampaignById, updateCampaign } from "../../services/campaign.service";
import { getCategories } from "../../services/category.service";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function EditarCampana() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [campaign, setCampaign] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [hasDonations, setHasDonations] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    id_categoria: "",
    titulo: "",
    descripcion: "",
    alias: "",
    monto_objetivo: "",
    tiempo_objetivo: "",
    foto1: null,
    foto2: null,
    foto3: null,
  });

  const pickImage = async (field) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setForm({
        ...form,
        [field]: {
          uri: result.assets[0].uri,
          name: `${field}.jpg`,
          type: "image/jpeg",
        },
      });
    }
  };

  useEffect(() => {
    async function load() {
      try {
        const [campData, catData] = await Promise.all([
          getCampaignById(id),
          getCategories(),
        ]);

        setCampaign(campData);
        setCategorias(catData);
        setHasDonations(campData.hasDonations || campData.has_donations);

        setForm({
          id_categoria: String(campData.id_categoria),
          titulo: campData.titulo,
          descripcion: campData.descripcion,
          alias: campData.alias,
          monto_objetivo: String(campData.monto_objetivo),
          tiempo_objetivo: campData.tiempo_objetivo?.split("T")[0],
          foto1: null,
          foto2: null,
          foto3: null,
        });
      } catch (err) {
        console.log(err);
        alert("Error al cargar la campaña");
      }
      setLoading(false);
    }

    load();
  }, [id]);

  const handleSave = async () => {
    try {
      let dataToSend;

      if (hasDonations) {
        dataToSend = {
          titulo: form.titulo,
          descripcion: form.descripcion,
          alias: form.alias,
        };
      } else {
        dataToSend = { ...form };

        ["foto1", "foto2", "foto3"].forEach((f) => {
          if (!form[f]) delete dataToSend[f];
        });
      }

      await updateCampaign(id, dataToSend);
      alert("Cambios guardados con éxito 😄");
      router.back();
    } catch (err) {
      console.log(err);
      alert("Error al guardar los cambios");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView className="p-5">

      <Text className="text-2xl font-bold mb-4">Editar campaña</Text>

      {hasDonations && (
        <View className="bg-yellow-100 border border-yellow-300 p-3 rounded-xl mb-4">
          <Text className="text-yellow-800 font-semibold">
            ⚠ Esta campaña tiene donaciones. Solo podés editar:
          </Text>
          <Text className="text-yellow-800 mt-1">
            • Título{"\n"}• Alias{"\n"}• Descripción{"\n\n"}
            Cambios mayores pasarán a aprobación del admin.
          </Text>
        </View>
      )}

      {/* IMAGEN ACTUAL */}
      {(campaign.foto1 || campaign.foto2 || campaign.foto3) && (
        <>
          <Text className="font-semibold mb-1">Imagen actual</Text>
          <Image
            source={{ uri: campaign.foto1 || campaign.foto2 || campaign.foto3 }}
            className="w-full h-48 rounded-xl mb-4"
          />
        </>
      )}

      {/* CATEGORÍA (solo si NO tiene donaciones) */}
      {!hasDonations && (
        <>
          <Text className="font-semibold mt-2">Categoría</Text>
          <View className="border rounded p-2 mt-1">
            {categorias.map((c) => (
              <TouchableOpacity
                key={c.id_categoria}
                onPress={() => setForm({ ...form, id_categoria: String(c.id_categoria) })}
                className={`p-2 rounded ${
                  form.id_categoria == c.id_categoria ? "bg-violet-200" : ""
                }`}
              >
                <Text>{c.nombre}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {/* TITULO */}
      <Text className="font-semibold mt-4">Título</Text>
      <TextInput
        value={form.titulo}
        onChangeText={(t) => setForm({ ...form, titulo: t })}
        className="border p-2 rounded"
      />

      {/* ALIAS */}
      <Text className="font-semibold mt-4">Alias</Text>
      <TextInput
        value={form.alias}
        onChangeText={(t) => setForm({ ...form, alias: t })}
        className="border p-2 rounded"
      />

      {/* DESCRIPCION */}
      <Text className="font-semibold mt-4">Descripción</Text>
      <TextInput
        multiline
        value={form.descripcion}
        onChangeText={(t) => setForm({ ...form, descripcion: t })}
        className="border p-2 rounded h-28"
      />

      {/* Monto + Fecha (solo si NO tiene donaciones) */}
      {!hasDonations && (
        <>
          <Text className="font-semibold mt-4">Monto objetivo</Text>
          <TextInput
            keyboardType="numeric"
            value={form.monto_objetivo}
            onChangeText={(t) => setForm({ ...form, monto_objetivo: t })}
            className="border p-2 rounded"
          />

          <Text className="font-semibold mt-4">Fecha límite</Text>
          <TextInput
            value={form.tiempo_objetivo}
            onChangeText={(t) => setForm({ ...form, tiempo_objetivo: t })}
            placeholder="YYYY-MM-DD"
            className="border p-2 rounded"
          />

          {/* FOTOS */}
          <Text className="font-semibold mt-4">Cambiar fotos</Text>

          {["foto1", "foto2", "foto3"].map((f) => (
            <View key={f} className="mb-3">
              <TouchableOpacity
                onPress={() => pickImage(f)}
                className="bg-violet-200 p-2 rounded"
              >
                <Text>Subir {f}</Text>
              </TouchableOpacity>

              {form[f]?.uri && (
                <Image
                  source={{ uri: form[f].uri }}
                  className="w-full h-40 mt-2 rounded"
                />
              )}
            </View>
          ))}
        </>
      )}

      <TouchableOpacity
        onPress={handleSave}
        className="bg-violet-600 p-3 rounded mt-6"
      >
        <Text className="text-white text-center font-bold">Guardar cambios</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
