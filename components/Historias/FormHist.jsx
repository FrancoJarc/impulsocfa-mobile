import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { createHistory } from "../../services/history.service";

export default function FormHistMobile({ campañas = [], onSuccess }) {
  const [form, setForm] = useState({
    titulo: "",
    contenido: "",
    id_campana: "",
  });

  const [files, setFiles] = useState({
    archivo1: null,
    archivo2: null,
    archivo3: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  // 📸 Seleccionar imagen
  const pickFile = async (field) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      const image = result.assets[0];

      setFiles({
        ...files,
        [field]: {
          uri: image.uri,
          name: `${field}_${Date.now()}.jpg`,
          type: "image/jpeg",
        },
      });
    }
  };

  // 🚀 Enviar datos (ya conectado al backend)
  const handleSubmit = async () => {
    if (!form.titulo || !form.contenido || !form.id_campana) {
      alert("Completa todos los campos obligatorios.");
      return;
    }

    if (!files.archivo1) {
      alert("Debes subir al menos una imagen.");
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

      // limpiar form
      setForm({ titulo: "", contenido: "", id_campana: "" });
      setFiles({ archivo1: null, archivo2: null, archivo3: null });

      if (onSuccess) onSuccess();
      alert("Historia subida con éxito 💜");

    } catch (e) {
      console.log("Error subiendo historia:", e);
      alert("Ocurrió un error al subir la historia.");
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
          Comparte tu historia de impacto con la comunidad de Impulso CFA :)
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

          <View style={styles.selectBox}>
            <Text style={styles.selectText}>
              {form.id_campana
                ? campañas.find((c) => c.id_campana === form.id_campana)?.titulo
                : "Seleccionar campaña..."}
            </Text>
          </View>

          <View style={{ marginTop: 6 }}>
            {campañas.map((c) => (
              <TouchableOpacity
                key={c.id_campana}
                onPress={() => handleChange("id_campana", c.id_campana)}
              >
                <Text style={styles.option}>{c.titulo}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ARCHIVOS */}
        <View style={styles.fileContainer}>
          <Text style={styles.label}>Archivos Multimedia (1 foto obligatoria)</Text>

          <View style={styles.filesRow}>
            {[1, 2, 3].map((num) => {
              const key = `archivo${num}`;
              return (
                <TouchableOpacity
                  key={num}
                  style={styles.fileBox}
                  onPress={() => pickFile(key)}
                >
                  <Text style={styles.fileText}>
                    {files[key]?.name || `Archivo ${num}`}
                  </Text>
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
});
