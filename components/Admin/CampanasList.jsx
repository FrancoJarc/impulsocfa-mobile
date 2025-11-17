import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
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
      <View className="flex-1 justify-center items-center bg-violet-50">
        <ActivityIndicator size="large" color="#7c3aed" />
        <Text className="mt-4 text-gray-700">Cargando campañas...</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={["#f5f3ff", "#eff6ff", "#f3e8ff"]}
      className="flex-1 p-5"
    >
      <Text className="text-3xl font-bold text-violet-700 mb-6 flex-row">
        📢 Campañas Pendientes
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {campaigns.length === 0 ? (
          <Text className="text-gray-500 text-center py-10 text-lg">
            No hay campañas pendientes.
          </Text>
        ) : (
          campaigns.map((c) => (
            <View
              key={c.id_campana}
              className="bg-white/80 rounded-2xl border border-violet-200 p-5 mb-6"
              style={{
                shadowColor: "#000",
                shadowOpacity: 0.15,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 4 },
                elevation: 5,
              }}
            >
              {c.foto_principal && (
                <Image
                  source={{ uri: c.foto_principal }}
                  style={{
                    width: "100%",
                    height: 180,
                    borderRadius: 12,
                    marginBottom: 12,
                    borderWidth: 1,
                    borderColor: "#ddd",
                    objectFit: "cover",
                  }}
                />
              )}

              <Text className="text-xl font-semibold mb-2">{c.titulo}</Text>

              <Text className="text-slate-700 mb-3" numberOfLines={3}>
                {c.descripcion}
              </Text>

              <Text className="text-slate-600 text-sm mb-1">
                <Text className="text-violet-600 font-semibold">Meta:</Text> $
                {c.monto_objetivo}{" "}
                <Text className="text-violet-600 font-semibold"> | Duración:</Text>{" "}
                {c.tiempo_objetivo} días
              </Text>

              <Text className="text-gray-500 text-sm font-semibold mb-4">
                Usuario:{" "}
                {c.usuario?.nombre
                  ? `${c.usuario.nombre} ${c.usuario.apellido}`
                  : c.id_usuario}
              </Text>

              <View className="flex-row gap-3">
                {/* Botón aprobar */}
                <TouchableOpacity
                  onPress={() => handleApprove(c.id_campana, true)}
                  style={{ flex: 1 }}
                >
                  <LinearGradient
                    colors={["#4ade80", "#10b981"]}
                    className="p-3 rounded-lg"
                  >
                    <Text className="text-white text-center font-semibold">
                      ✓ Aprobar
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* Botón rechazar */}
                <TouchableOpacity
                  onPress={() => handleApprove(c.id_campana, false)}
                  style={{ flex: 1 }}
                >
                  <LinearGradient
                    colors={["#f87171", "#ec4899"]}
                    className="p-3 rounded-lg"
                  >
                    <Text className="text-white text-center font-semibold">
                      ✕ Rechazar
                    </Text>
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
