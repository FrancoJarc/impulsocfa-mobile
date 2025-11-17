import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

import { createCampaign } from "../../services/campaign.service";
import { getCategories } from "../../services/category.service";
import Toast from "react-native-toast-message";
import { router } from "expo-router";

export default function CreateCampana() {
  const [formData, setFormData] = useState({
    id_categoria: "",
    alias: "",
    titulo: "",
    descripcion: "",
    monto_objetivo: "",
    tiempo_objetivo: "",
    fotos: [],
  });

  const [categorias, setCategorias] = useState([]);
  const [errors, setErrors] = useState({});
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [llaveMaestra, setLlaveMaestra] = useState("");

  /* 🔹 Obtener categorías */
  useEffect(() => {
    (async () => {
      try {
        const data = await getCategories();
        setCategorias(data);
      } catch (err) {
        Toast.show({ type: "error", text1: "Error cargando categorías" });
      }
    })();
  }, []);

  /* 🔹 Validación */
  const validate = () => {
    const newErrors = {};

    if (!formData.titulo.trim())
      newErrors.titulo = "El nombre es obligatorio.";

    if (!formData.alias.trim())
      newErrors.alias = "El alias es obligatorio.";

    if (!formData.descripcion.trim())
      newErrors.descripcion = "La descripción es obligatoria.";

    if (!formData.monto_objetivo || Number(formData.monto_objetivo) <= 0)
      newErrors.monto_objetivo = "El monto debe ser mayor que 0.";

    if (!formData.tiempo_objetivo)
      newErrors.tiempo_objetivo = "Seleccione una fecha.";

    if (!formData.id_categoria)
      newErrors.id_categoria = "Debe seleccionar una categoría.";

    return newErrors;
  };

  /* 🔹 Seleccionar imágenes */
  const pickImages = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      quality: 0.8,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      selectionLimit: 3,
    });

    if (!res.canceled) {
      const selected = res.assets.slice(0, 3);
      setFormData((prev) => ({ ...prev, fotos: selected }));
    }
  };

  /* 🔹 Enviar formulario */
  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      Toast.show({ type: "error", text1: "Corrige los errores." });
      return;
    }

    if (!llaveMaestra.trim()) {
      Toast.show({ type: "error", text1: "Ingresá tu llave maestra." });
      return;
    }

    setLoading(true);

    try {
      // Crear FormData
      const data = new FormData();
      data.append("id_categoria", formData.id_categoria);
      data.append("alias", formData.alias);
      data.append("titulo", formData.titulo);
      data.append("descripcion", formData.descripcion);
      data.append("monto_objetivo", formData.monto_objetivo.replace(/\./g, ""));
      data.append("tiempo_objetivo", formData.tiempo_objetivo);
      data.append("llave_maestra", llaveMaestra);

      formData.fotos.forEach((img, index) => {
        data.append(`foto${index + 1}`, {
          uri: img.uri,
          type: "image/jpeg",
          name: `foto${index + 1}.jpg`,
        });
      });

      await createCampaign(data);

      Toast.show({ type: "success", text1: "Campaña creada con éxito" });
      router.push("/perfil/MisCampanas");

    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error al crear campaña",
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.card}>
        <Text style={styles.title}>Crear campaña</Text>

        {/* 🔑 Llave maestra */}
        <Text style={styles.label}>Llave maestra</Text>
        <TextInput
          value={llaveMaestra}
          secureTextEntry
          placeholder="Tu llave maestra"
          onChangeText={setLlaveMaestra}
          style={styles.input}
        />

        {/* Categorías */}
        <Text style={styles.label}>Categoría</Text>
        <View style={styles.pickerBox}>
          <Picker
            selectedValue={formData.id_categoria}
            onValueChange={(value) =>
              setFormData({ ...formData, id_categoria: value })
            }
          >
            <Picker.Item label="Selecciona una categoría" value="" />
            {categorias.map((c) => (
              <Picker.Item
                key={c.id_categoria}
                label={c.nombre}
                value={c.id_categoria}
              />
            ))}
          </Picker>
        </View>
        {errors.id_categoria && <Text style={styles.error}>{errors.id_categoria}</Text>}

        {/* Nombre */}
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Ayuda a Bahía Blanca"
          onChangeText={(t) => setFormData({ ...formData, titulo: t })}
        />
        {errors.titulo && <Text style={styles.error}>{errors.titulo}</Text>}

        {/* Alias */}
        <Text style={styles.label}>Alias</Text>
        <TextInput
          style={styles.input}
          placeholder="ayuda-bahia"
          onChangeText={(t) => setFormData({ ...formData, alias: t })}
        />
        {errors.alias && <Text style={styles.error}>{errors.alias}</Text>}

        {/* Descripción */}
        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          multiline
          onChangeText={(t) => setFormData({ ...formData, descripcion: t })}
        />
        {errors.descripcion && <Text style={styles.error}>{errors.descripcion}</Text>}

        {/* Monto */}
        <Text style={styles.label}>Monto objetivo</Text>
        <TextInput
          keyboardType="numeric"
          style={styles.input}
          placeholder="Ej: 100000"
          value={formData.monto_objetivo}
          onChangeText={(t) => setFormData({ ...formData, monto_objetivo: t })}
        />
        {errors.monto_objetivo && <Text style={styles.error}>{errors.monto_objetivo}</Text>}

        {/* Fecha */}
        <Text style={styles.label}>Fecha de finalización</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setDatePickerVisible(true)}
        >
          <Text style={{ color: "#807d85ff", fontWeight: "400" }}>
            {formData.tiempo_objetivo || "Seleccionar fecha"}
          </Text>
        </TouchableOpacity>

        {datePickerVisible && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            onChange={(e, selected) => {
              setDatePickerVisible(false);
              if (selected) {
                setFormData({
                  ...formData,
                  tiempo_objetivo: selected.toISOString().split("T")[0],
                });
              }
            }}
          />
        )}

        {/* Imágenes */}
        <Text style={styles.label}>Imágenes (máximo 3)</Text>
        <TouchableOpacity style={styles.imageButton} onPress={pickImages}>
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Seleccionar imágenes
          </Text>
        </TouchableOpacity>

        <View style={styles.previewContainer}>
          {formData.fotos.map((foto, idx) => (
            <Image
              key={idx}
              source={{ uri: foto.uri }}
              style={styles.preview}
            />
          ))}
        </View>

        {/* Botón Crear */}
        <TouchableOpacity
          style={styles.submit}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitText}>
            {loading ? "Creando..." : "Crear campaña"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

/* 🟣 Estilos violetas */
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8F5FF",
  },
  card: {
    backgroundColor: "white",
    margin: 20,
    padding: 20,
    borderRadius: 20,
    shadowColor: "#8b5cf6",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#e0e7ff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#6d28d9",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4c1d95",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#f5f3ff",
    borderWidth: 1,
    borderColor: "#dcd4ff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    color: "#4c1d95",
  },
  error: { color: "#b91c1c", marginBottom: 10 },

  pickerBox: {
    backgroundColor: "#f5f3ff",
    borderWidth: 1,
    borderColor: "#dcd4ff",
    borderRadius: 12,
    marginBottom: 10,
  },

  dateButton: {
    backgroundColor: "#f5f3ff",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#dcd4ff",
    marginBottom: 10,
  },

  imageButton: {
    backgroundColor: "#8b5cf6",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: "center",
  },

  previewContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },

  preview: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },

  submit: {
    backgroundColor: "#7c3aed",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#8b5cf6",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
  },
  submitText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});