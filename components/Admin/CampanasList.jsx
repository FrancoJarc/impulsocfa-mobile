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
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";


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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f3ff" }}>
      <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Fondo con degradado */}
        <LinearGradient
          colors={["#f5f3ff", "#eff6ff", "#fbefff"]}
          style={styles.backgroundGradient}
        />

        {/* Título */}
        <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
          <Text style={styles.headerTitle}>📢 Campañas Pendientes</Text>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          {campaigns.length === 0 ? (
            <Text style={styles.emptyText}>No hay campañas pendientes.</Text>
          ) : (
            campaigns.map((c) => (
              <View key={c.id_campana} style={styles.card}>

                {/* Imagen principal */}
                <View style={styles.imageContainer}>
                  <Image
                    source={{
                      uri: c.foto1 || "https://via.placeholder.com/800x400?text=Sin+imagen",
                    }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                </View>

                {/* Título */}
                <Text style={styles.title}>{c.titulo}</Text>

                {/* Descripción */}
                <Text style={styles.description} numberOfLines={3}>
                  {c.descripcion}
                </Text>

                {/* Meta y duración */}
                <View style={styles.statsRow}>
                  <View style={styles.statBox}>
                    <MaterialCommunityIcons name="target" size={18} color="#6d28d9" />
                    <Text style={styles.statLabel}>Meta</Text>
                    <Text style={styles.statValue}>
                      ${Number(c.monto_objetivo).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                    </Text>
                  </View>

                  <View style={[styles.statBox, { backgroundColor: "#faf0ff" }]}>
                    <MaterialCommunityIcons name="clock-outline" size={20} color="#6d28d9" />
                    <Text style={styles.statLabelSmall}>Duración</Text>
                    <Text style={styles.statValue}>
                      {new Date(c.tiempo_objetivo).toLocaleDateString("es-AR")}{" "}
                      {(() => {
                        const diasRestantes = Math.ceil(
                          (new Date(c.tiempo_objetivo) - new Date()) /
                          (1000 * 60 * 60 * 24)
                        );
                        return diasRestantes > 0
                          ? ` (faltan ${diasRestantes} ${diasRestantes === 1 ? "día" : "días"})`
                          : diasRestantes === 0
                            ? " (finaliza hoy)"
                            : " (ya finalizó)";
                      })()}

                    </Text>
                  </View>
                </View>

                {/* Usuario */}
                <Text style={styles.userText}>
                  Creado por{" "}
                  {c.usuario?.nombre
                    ? `${c.usuario.nombre} ${c.usuario.apellido}`
                    : `Usuario ${c.id_usuario}`}
                </Text>

                {/* Botones */}
                <View style={styles.buttonsRow}>
                  <TouchableOpacity
                    onPress={() => handleApprove(c.id_campana, true)}
                    style={[styles.actionBtn, { backgroundColor: "#2563eb" }]}
                  >
                    <Feather name="check" size={16} color="#fff" />
                    <Text style={styles.actionText}>Aprobar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleApprove(c.id_campana, false)}
                    style={[styles.actionBtn, { backgroundColor: "#dc2626" }]}
                  >
                    <Feather name="x" size={16} color="#fff" />
                    <Text style={styles.actionText}>Rechazar</Text>
                  </TouchableOpacity>
                </View>

              </View>
            ))
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );

}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f5f3ff",
  },

  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#4c1d95",
    marginBottom: 16,
  },

  emptyText: {
    marginTop: 40,
    textAlign: "center",
    fontSize: 16,
    color: "#6b7280",
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.96)",
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,

    shadowColor: "#8b5cf6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },

  imageContainer: {
    width: "100%",
    height: 180,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 8,
  },

  description: {
    fontSize: 15,
    color: "#4b5563",
    marginBottom: 12,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  statBox: {
    flex: 1,
    backgroundColor: "#f3f0ff",
    borderRadius: 14,
    padding: 12,
    marginHorizontal: 4,
    alignItems: "center",
  },

  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },

  statValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
  },

  userText: {
    fontSize: 14,
    color: "#4c1d95",
    marginBottom: 16,
    marginTop: 8,
  },

  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },

  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
  },

  actionText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});
