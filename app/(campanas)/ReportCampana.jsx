import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import Toast from "react-native-toast-message";
import { createReporte } from "../../services/report.service"; // ajusta la ruta

export default function ReportCampana() {
  const { id } = useLocalSearchParams();
  const [motivo, setMotivo] = useState("");
  const [loading, setLoading] = useState(false);

  const charCount = motivo.trim().length;
  const isValid = charCount >= 10;

  const handleSubmit = async () => {
    if (!isValid) {
      Toast.show({ type: "error", text1: "Escribí un motivo más detallado." });
      return;
    }

    setLoading(true);
    try {
      await createReporte({ id_campana: id, motivo });
      Toast.show({ type: "success", text1: "Reporte enviado correctamente" });
      router.push(`/campanas/${id}`); // navegar de vuelta a la campaña
    } catch (err) {
      Toast.show({ type: "error", text1: err.message || "No se pudo enviar el reporte" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.backText}>← Volver</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Reportar campaña</Text>
      <Text style={styles.subtitle}>
        Compartí los detalles sobre por qué considerás que esta campaña debe ser revisada
      </Text>

      <View style={styles.alertBox}>
        <Text style={styles.alertText}>
          ⚠️ Los reportes falsos o inapropiados pueden resultar en restricciones a tu cuenta
        </Text>
      </View>

      <Text style={styles.label}>Motivo del reporte *</Text>
      <TextInput
        style={styles.textInput}
        multiline
        numberOfLines={6}
        value={motivo}
        onChangeText={setMotivo}
        placeholder="Describí detalladamente la razón por la que reportas esta campaña..."
      />
      <Text style={[styles.charCount, isValid ? styles.valid : styles.invalid]}>
        {charCount}/10
      </Text>

      <View style={styles.buttonsRow}>
        <TouchableOpacity style={styles.cancelBtn} onPress={() => router.push(`/campanas/${id}`)}>
          <Text style={styles.btnText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.submitBtn, !isValid && styles.disabled]}
          onPress={handleSubmit}
          disabled={!isValid || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Enviar reporte</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.footerText}>
        Tu reporte será revisado por nuestro equipo en las próximas 24 horas
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#F8F5FF", flexGrow: 1 },
  backText: { color: "#6d28d9", fontWeight: "600", marginBottom: 16 },
  title: { fontSize: 24, fontWeight: "700", color: "#b91c1c", marginBottom: 4 },
  subtitle: { fontSize: 16, color: "#444", marginBottom: 12 },
  alertBox: { backgroundColor: "#fee2e2", padding: 12, borderRadius: 12, marginBottom: 16 },
  alertText: { color: "#b91c1c", fontSize: 14 },
  label: { fontWeight: "600", fontSize: 16, marginBottom: 6 },
  textInput: { backgroundColor: "#fff", borderColor: "#fca5a5", borderWidth: 1, borderRadius: 12, padding: 10, textAlignVertical: "top" },
  charCount: { alignSelf: "flex-end", marginTop: 4, fontSize: 12 },
  valid: { color: "#16a34a" },
  invalid: { color: "#6b7280" },
  buttonsRow: { flexDirection: "row", marginTop: 16, gap: 8 },
  cancelBtn: { flex: 1, backgroundColor: "#e5e7eb", padding: 12, borderRadius: 12, alignItems: "center" },
  submitBtn: { flex: 1, backgroundColor: "#b91c1c", padding: 12, borderRadius: 12, alignItems: "center" },
  disabled: { opacity: 0.5 },
  btnText: { color: "#fff", fontWeight: "700" },
  footerText: { marginTop: 24, fontSize: 14, color: "#444", textAlign: "center" },
});
