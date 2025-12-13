import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getCampaignById, updateCampaign } from "../../services/campaign.service";
import { getCategories } from "../../services/category.service";
import { useLocalSearchParams, useRouter } from "expo-router";
import Toast from "react-native-toast-message";


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
      Toast.show({ type: "success", text1: "Campaña a estado pendiente", text2: "Un administrador debe confirmar los cambios" });
      router.back();
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#6c47ff" />
        <Text style={styles.loaderText}>Cargando campaña...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: "#f8f5ff" }}
      contentContainerStyle={styles.container}
    >

      <Text style={styles.title}>Editar campaña</Text>

      {hasDonations && (
        <View style={styles.warningBox}>
          <Text style={styles.warningTitle}>
            ⚠ Esta campaña tiene donaciones. Solo podés editar:
          </Text>
          <Text style={styles.warningText}>
            • Título{"\n"}• Alias{"\n"}• Descripción{"\n\n"}
            Cambios mayores pasarán a aprobación del administrador.
          </Text>
        </View>
      )}

      {(campaign.foto1 || campaign.foto2 || campaign.foto3) && (
        <>
          <Text style={styles.label}>Imagen actual</Text>
          <Image
            source={{ uri: campaign.foto1 || campaign.foto2 || campaign.foto3 }}
            style={styles.mainImage}
          />
        </>
      )}

      {!hasDonations && (
        <>
          <Text style={styles.label}>Categoría</Text>
          <View style={styles.categoryBox}>
            {categorias.map((c) => (
              <TouchableOpacity
                key={c.id_categoria}
                onPress={() =>
                  setForm({ ...form, id_categoria: String(c.id_categoria) })
                }
                style={[
                  styles.categoryItem,
                  form.id_categoria == c.id_categoria && styles.categorySelected,
                ]}
              >
                <Text>{c.nombre}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      <Text style={styles.label}>Título</Text>
      <TextInput
        value={form.titulo}
        onChangeText={(t) => setForm({ ...form, titulo: t })}
        style={styles.input}
      />

      <Text style={styles.label}>Alias</Text>
      <TextInput
        value={form.alias}
        onChangeText={(t) => setForm({ ...form, alias: t })}
        style={styles.input}
      />

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        multiline
        value={form.descripcion}
        onChangeText={(t) => setForm({ ...form, descripcion: t })}
        style={[styles.input, styles.textArea]}
      />

      {!hasDonations && (
        <>
          <Text style={styles.label}>Monto objetivo</Text>
          <TextInput
            keyboardType="numeric"
            value={form.monto_objetivo}
            onChangeText={(t) => setForm({ ...form, monto_objetivo: t })}
            style={styles.input}
          />

          <Text style={styles.label}>Fecha límite</Text>
          <TextInput
            value={form.tiempo_objetivo}
            onChangeText={(t) => setForm({ ...form, tiempo_objetivo: t })}
            placeholder="YYYY-MM-DD"
            style={styles.input}
          />

          <Text style={styles.label}>Cambiar fotos</Text>

          {["foto1", "foto2", "foto3"].map((f) => (
            <View key={f} style={{ marginBottom: 12 }}>
              <TouchableOpacity
                onPress={() => pickImage(f)}
                style={styles.uploadBtn}
              >
                <Text>Subir {f}</Text>
              </TouchableOpacity>

              {form[f]?.uri && (
                <Image source={{ uri: form[f].uri }} style={styles.preview} />
              )}
            </View>
          ))}
        </>
      )}

      <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
        <Text style={styles.saveText}>Guardar cambios</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: "#f8f5ff",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f5ff",
  },
  loaderText: {
    marginTop: 12,
    color: "#6c47ff",
    fontWeight: "600",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
    color: "#4c1d95",
  },
  warningBox: {
    backgroundColor: "#fef3c7",
    borderColor: "#fde68a",
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  warningTitle: {
    fontWeight: "700",
    color: "#92400e",
  },
  warningText: {
    marginTop: 4,
    color: "#92400e",
  },
  label: {
    fontWeight: "600",
    marginTop: 14,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
  },
  textArea: {
    height: 110,
    textAlignVertical: "top",
  },
  categoryBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 6,
  },
  categoryItem: {
    padding: 8,
    borderRadius: 6,
  },
  categorySelected: {
    backgroundColor: "#ddd6fe",
  },
  mainImage: {
    width: "100%",
    height: 190,
    borderRadius: 12,
    marginBottom: 12,
  },
  uploadBtn: {
    backgroundColor: "#ddd6fe",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  preview: {
    width: "100%",
    height: 160,
    borderRadius: 10,
    marginTop: 8,
  },
  saveBtn: {
    backgroundColor: "#6d28d9",
    padding: 14,
    borderRadius: 10,
    marginTop: 24,
  },
  saveText: {
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
  },
});
