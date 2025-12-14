import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
  Platform,
  SafeAreaView,
  StatusBar,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
// El Picker de react-native-picker ya no se usará.

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
  });

  const [files, setFiles] = useState({
    foto1: null,
    foto2: null,
    foto3: null,
  });

  const [loadingFiles, setLoadingFiles] = useState({
    foto1: false,
    foto2: false,
    foto3: false,
  });
  const [categorias, setCategorias] = useState([]);
  const [errors, setErrors] = useState({});
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [llaveMaestra, setLlaveMaestra] = useState("");
  const [showDropdown, setShowDropdown] = useState(false); // Estado para el dropdown de categorías

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategorias(data || []);
      } catch (err) {
        console.log("Error cargando categorías:", err);
      }
    };
    loadCategories();
  }, []);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.titulo.trim())
      newErrors.titulo = "El título es obligatorio.";

    if (!formData.alias.trim())
      newErrors.alias = "El alias es obligatorio.";

    if (!formData.descripcion.trim())
      newErrors.descripcion = "La descripción es obligatoria.";

    const monto = Number(formData.monto_objetivo.replace(/[^0-9]/g, ""));
    if (isNaN(monto) || monto <= 0)
      newErrors.monto_objetivo = "El monto debe ser numérico y mayor que 0.";

    if (!formData.tiempo_objetivo)
      newErrors.tiempo_objetivo = "Seleccione una fecha.";

    if (!formData.id_categoria)
      newErrors.id_categoria = "Debe seleccionar una categoría.";

    if (!files.foto1)
      newErrors.fotos = "Debes subir al menos una foto.";

    return newErrors;
  };

  const pickImage = async (field) => {
    try {
      setLoadingFiles((prev) => ({ ...prev, [field]: true }));

      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Toast.show({ type: "error", text1: "Permiso denegado" });
        setLoadingFiles((prev) => ({ ...prev, [field]: false }));
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Solo imágenes
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
        },
      }));
      setLoadingFiles((prev) => ({ ...prev, [field]: false }));

    } catch (error) {
      console.log("Error seleccionando imagen:", error);
      setLoadingFiles((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleDateChange = (event, selected) => {
    setDatePickerVisible(false);
    if (selected) {
      handleChange("tiempo_objetivo", selected.toISOString().split("T")[0]);
    }
  };

  /* 🔹 Enviar formulario */
  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      Toast.show({ type: "error", text1: "Completa todos los campos obligatorios." });
      return;
    }

    if (!llaveMaestra.trim()) {
      Toast.show({ type: "error", text1: "Ingresá tu llave maestra." });
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("id_categoria", formData.id_categoria);
      data.append("alias", formData.alias);
      data.append("titulo", formData.titulo);
      data.append("descripcion", formData.descripcion);
      const montoSinFormato = formData.monto_objetivo.replace(/[^0-9]/g, "");
      data.append("monto_objetivo", montoSinFormato);
      data.append("tiempo_objetivo", formData.tiempo_objetivo);
      data.append("llave_maestra", llaveMaestra);

      // Adjuntar archivos de fotos
      Object.entries(files).forEach(([key, file]) => {
        if (file) {
          data.append(key, file);
        }
      });

      await createCampaign(data);

      Toast.show({ type: "success", text1: "Campaña creada con éxito", text2: "La campaña será visible cuando un administrador la acepte." });
      router.replace("/perfilPanel/MisCampanas");

    } catch (error) {
      console.log("Error al crear campaña:", error);
      Toast.show({
        type: "error",
        text1: "Error al crear campaña",
        text2: error.message || "Ocurrió un problema.",
      });
    } finally {
      setLoading(false);
    }
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
        <Text style={styles.mainTitle}>Crear Campaña</Text>
        <Text style={styles.subtitle}>
          Inicia tu campaña para recaudar fondos y hacer un cambio.
        </Text>

        {/* 🔑 Llave maestra */}
        <View style={styles.block}>
          <Text style={styles.label}>Llave maestra *</Text>
          <TextInput
            value={llaveMaestra}
            secureTextEntry
            placeholder="Tu llave maestra"
            onChangeText={setLlaveMaestra}
            style={styles.input}
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Categorías (Dropdown) */}
        <View style={styles.block}>
          <Text style={styles.label}>Categoría *</Text>
          <TouchableOpacity
            style={styles.selectBox}
            onPress={() => setShowDropdown((prev) => !prev)}
          >
            <Text style={styles.selectText}>
              {formData.id_categoria
                ? categorias.find((c) => c.id_categoria === formData.id_categoria)?.nombre
                : "Seleccionar categoría..."}
            </Text>
          </TouchableOpacity>

          {showDropdown && categorias.length > 0 && (
            <View style={styles.dropdown}>
              {categorias.map((c) => (
                <TouchableOpacity
                  key={c.id_categoria}
                  style={styles.optionBox}
                  onPress={() => {
                    handleChange("id_categoria", c.id_categoria);
                    setShowDropdown(false);
                  }}
                >
                  <Text style={styles.option}>{c.nombre}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {errors.id_categoria && <Text style={styles.error}>{errors.id_categoria}</Text>}
        </View>

        {/* Título */}
        <View style={styles.block}>
          <Text style={styles.label}>Título *</Text>
          <TextInput
            style={styles.input}
            value={formData.titulo}
            placeholder="Ej: Ayuda a Bahía Blanca"
            onChangeText={(t) => handleChange("titulo", t)}
            placeholderTextColor="#9ca3af"
          />
          {errors.titulo && <Text style={styles.error}>{errors.titulo}</Text>}
        </View>

        {/* Alias */}
        <View style={styles.block}>
          <Text style={styles.label}>Alias *</Text>
          <TextInput
            style={styles.input}
            value={formData.alias}
            placeholder="ayuda-bahia (sin espacios)"
            onChangeText={(t) => handleChange("alias", t)}
            placeholderTextColor="#9ca3af"
          />
          {errors.alias && <Text style={styles.error}>{errors.alias}</Text>}
        </View>

        {/* Descripción */}
        <View style={styles.block}>
          <Text style={styles.label}>Descripción *</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            value={formData.descripcion}
            multiline
            onChangeText={(t) => handleChange("descripcion", t)}
            placeholder="Describe tu campaña y la necesidad..."
            placeholderTextColor="#9ca3af"
          />
          {errors.descripcion && <Text style={styles.error}>{errors.descripcion}</Text>}
        </View>

        {/* Monto */}
        <View style={styles.block}>
          <Text style={styles.label}>Monto objetivo *</Text>
          <TextInput
            keyboardType="numeric"
            style={styles.input}
            value={formData.monto_objetivo}
            placeholder="Ej: 100000"
            onChangeText={(t) => handleChange("monto_objetivo", t)}
            placeholderTextColor="#9ca3af"
          />
          {errors.monto_objetivo && <Text style={styles.error}>{errors.monto_objetivo}</Text>}
        </View>

        {/* Fecha */}
        <View style={styles.block}>
          <Text style={styles.label}>Fecha de finalización *</Text>
          <TouchableOpacity
            style={styles.selectBox}
            onPress={() => setDatePickerVisible(true)}
          >
            <Text style={styles.selectText}>
              {formData.tiempo_objetivo || "Seleccionar fecha"}
            </Text>
          </TouchableOpacity>

          {datePickerVisible && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              minimumDate={new Date()}
              onChange={handleDateChange}
            />
          )}
          {errors.tiempo_objetivo && <Text style={styles.error}>{errors.tiempo_objetivo}</Text>}
        </View>

        {/* IMÁGENES */}
        <View style={styles.fileContainer}>
          <Text style={styles.label}>Imágenes (Mínimo 1 foto)</Text>

          <View style={styles.filesRow}>
            {[1, 2, 3].map((num) => {
              const key = `foto${num}`;
              const file = files[key];

              return (
                <TouchableOpacity
                  key={num}
                  style={styles.fileBox}
                  onPress={() => pickImage(key)}
                  disabled={loadingFiles[key]}
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
                    <Image
                      source={{ uri: file.uri }}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 14,
                        opacity: loadingFiles[key] ? 0.3 : 1,
                      }}
                      resizeMode="cover"
                      onLoadStart={() => setLoadingFiles((prev) => ({ ...prev, [key]: true }))}
                      onLoadEnd={() => setLoadingFiles((prev) => ({ ...prev, [key]: false }))}
                    />
                  ) : (
                    !loadingFiles[key] && (
                      <Text style={styles.fileText}>Foto {num}</Text>
                    )
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
          {errors.fotos && <Text style={styles.error}>{errors.fotos}</Text>}
        </View>

        {/* Botón Crear */}
        <TouchableOpacity
          style={styles.btn}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.btnText}>
            {loading ? "Creando..." : "Crear campaña"}
          </Text>
        </TouchableOpacity>

        {/* FOOTER */}
        <Text style={styles.footerText}>
          Asegúrate de que la información sea correcta antes de publicar.
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
    backgroundColor: "#f5f3ff", // Color de fondo consistente
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
    backgroundColor: "#ede9fe", // Fondo más claro para la sección de archivos
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
    // Eliminado shadow para consistencia con FormHistMobile
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
    position: "absolute", // Posicionar sobre el contenido
    top: "100%", // Debajo del selectBox
    width: "100%",
    zIndex: 10, // Asegurar que esté por encima de otros elementos
  },

  optionBox: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },

  error: {
    marginTop: 4,
    fontSize: 13,
    color: "#b91c1c", // Color de error rojo fuerte
    fontWeight: "500",
  },
});