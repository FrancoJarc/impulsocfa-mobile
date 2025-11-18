import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Toast from "react-native-toast-message";

import {
  getPendingCampaigns,
  approveCampaign,
  getCampaignById,
} from "../../services/admin.service";

export default function CampaignList() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCampaigns();
  }, []);

  async function loadCampaigns() {
    try {
      setLoading(true);
      const summary = await getPendingCampaigns();
      const detailed = await Promise.all(
        summary.map((c) => getCampaignById(c.id_campana))
      );

      setCampaigns(detailed);

      Toast.show({
        type: "success",
        text1: "Campañas cargadas",
        text2: "Pendientes cargadas correctamente",
      });
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudieron cargar las campañas",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(id, approved) {
    try {
      const estado = approved ? "aprobada" : "rechazada";
      await approveCampaign(id, estado);

      Toast.show({
        type: approved ? "success" : "error",
        text1: approved ? "Campaña aprobada" : "Campaña rechazada",
      });

      loadCampaigns();
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Error al actualizar la campaña",
      });
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7c3aed" />
        <Text style={styles.loadingText}>Cargando campañas...</Text>
      </View>
    );
  }

  return (
   <LinearGradient
      colors={["#f5f3ff", "#eff6ff", "#f3e8ff"]}
      style={styles.container}
    >
      <Text style={styles.headerTitle}>📢 Campañas Pendientes</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {campaigns.length === 0 ? (
          <Text style={styles.emptyText}>No hay campañas pendientes.</Text>
        ) : (
          campaigns.map((c) => (
            <View key={c.id_campana} style={styles.card}>
              {c.foto_principal && (
                <Image
                  source={{ uri: c.foto_principal }}
                  style={styles.image}
                />
              )}

              <Text style={styles.title}>{c.titulo}</Text>

              <Text style={styles.description} numberOfLines={3}>
                {c.descripcion}
              </Text>

              <Text style={styles.metaText}>
                <Text style={styles.metaLabel}>Meta:</Text> ${c.monto_objetivo}{" "}
                <Text style={styles.metaLabel}> | Duración:</Text>{" "}
                {c.tiempo_objetivo} días
              </Text>

              <Text style={styles.userText}>
                Usuario:{" "}
                {c.usuario?.nombre
                  ? `${c.usuario.nombre} ${c.usuario.apellido}`
                  : c.id_usuario}
              </Text>

              <View style={styles.buttonsRow}>
                <TouchableOpacity
                  onPress={() => handleApprove(c.id_campana, true)}
                  style={{ flex: 1 }}
                >
                  <LinearGradient
                    colors={["#4ade80", "#10b981"]}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>✓ Aprobar</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleApprove(c.id_campana, false)}
                  style={{ flex: 1 }}
                >
                  <LinearGradient
                    colors={["#f87171", "#ec4899"]}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>✕ Rechazar</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f3ff",
  },
  loadingText: {
    marginTop: 10,
    color: "#4b5563",
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#6d28d9",
    marginBottom: 20,
  },

  emptyText: {
    textAlign: "center",
    paddingVertical: 40,
    fontSize: 18,
    color: "#6b7280",
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd6fe",
    padding: 20,
    marginBottom: 24,

    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },

  image: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    resizeMode: "cover",
  },

  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },

  description: {
    color: "#334155",
    marginBottom: 12,
  },

  metaText: {
    color: "#475569",
    fontSize: 14,
    marginBottom: 4,
  },
  metaLabel: {
    color: "#7c3aed",
    fontWeight: "600",
  },

  userText: {
    color: "#6b7280",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 16,
  },

  buttonsRow: {
    flexDirection: "row",
    gap: 12,
  },

  button: {
    padding: 12,
    borderRadius: 10,
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
  },
});