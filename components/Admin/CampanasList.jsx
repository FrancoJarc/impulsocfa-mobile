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

import Toast from "react-native-toast-message";
import AdminScreenWrapper from "./AdminScreenWrapper";

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
       <AdminScreenWrapper>
        <View style={styles.loadingWrapper}>
          <ActivityIndicator size="large" color="#6d28d9" />
          <Text style={styles.loadingText}>Cargando campañas...</Text>
        </View>
      </AdminScreenWrapper>
    );
  }

  return (
    <AdminScreenWrapper>
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
                Creado por{" "}
                {c.usuario?.nombre
                  ? `${c.usuario.nombre} ${c.usuario.apellido}`
                  : `Usuario ${c.id_usuario}`}
              </Text>

              <View style={styles.buttonsRow}>
                <TouchableOpacity
                  onPress={() => handleApprove(c.id_campana, true)}
                  style={[styles.button, styles.approveButton]}
                >
                  <Text style={styles.buttonText}>✓ Aprobar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleApprove(c.id_campana, false)}
                  style={[styles.button, styles.rejectButton]}
                >
                  <Text style={styles.buttonText}>✕ Rechazar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </AdminScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#6d28d9",
    marginBottom: 20,
    textAlign: "center",
  },

  loadingWrapper: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 10,
    color: "#4c1d95",
  },

  emptyText: {
    textAlign: "center",
    paddingVertical: 40,
    fontSize: 18,
    color: "#6b7280",
  },

  card: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e0e7ff",
    padding: 20,
    marginBottom: 24,

    shadowColor: "#8b5cf6",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },

  image: {
    width: "100%",
    height: 180,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e7ff",
    resizeMode: "cover",
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    color: "#4c1d95",
  },

  description: {
    color: "#4b5563",
    marginBottom: 12,
  },

  metaText: {
    color: "#4b5563",
    fontSize: 15,
    marginBottom: 6,
  },
  metaLabel: {
    color: "#6d28d9",
    fontWeight: "700",
  },

  userText: {
    color: "#6b7280",
    fontSize: 15,
    marginBottom: 16,
    fontWeight: "600",
  },

  buttonsRow: {
    flexDirection: "row",
    gap: 12,
  },

  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  approveButton: {
    backgroundColor: "#22c55e",
  },

  rejectButton: {
    backgroundColor: "#ef4444",
  },

  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});