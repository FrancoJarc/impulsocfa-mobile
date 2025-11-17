import { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { getPendingCampaigns, approveCampaign, getCampaignById } from "../../services/admin.service";

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
      const detailedCampaigns = await Promise.all(summary.map(c => getCampaignById(c.id_campana)));
      setCampaigns(detailedCampaigns);
      Alert.alert("✅ Éxito", "Campañas pendientes cargadas correctamente");
    } catch (error) {
      console.error(error);
      Alert.alert("❌ Error", "Error al cargar las campañas pendientes");
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(campaignId, approved) {
    try {
      if (!campaignId) return;
      const estado = approved ? "aprobada" : "rechazada";
      await approveCampaign(campaignId, estado);
      Alert.alert(
        approved ? "✅ Aprobada" : "🚫 Rechazada",
        approved ? "Campaña aprobada correctamente" : "Campaña rechazada correctamente"
      );
      loadCampaigns();
    } catch (error) {
      console.error(error);
      Alert.alert("❌ Error", "Error al actualizar el estado de la campaña");
    }
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#7c3aed" />
        <Text className="mt-4 text-gray-700">Cargando campañas...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="p-4 bg-violet-50 flex-1">
      <Text className="text-2xl font-bold text-violet-700 mb-4">📢 Campañas Pendientes</Text>

      {campaigns.length === 0 ? (
        <Text className="text-gray-500 text-center py-8">No hay campañas pendientes.</Text>
      ) : (
        campaigns.map((c) => (
          <View
            key={c.id_campana}
            className="bg-white p-4 rounded-xl mb-4 shadow border border-violet-200"
          >
            {c.foto_principal && (
              <Image
                source={{ uri: c.foto_principal }}
                style={{ width: "100%", height: 180, borderRadius: 12, marginBottom: 8 }}
                resizeMode="cover"
              />
            )}
            <Text className="text-xl font-semibold mb-2">{c.titulo}</Text>
            <Text className="text-gray-700 mb-2" numberOfLines={3}>
              {c.descripcion}
            </Text>
            <Text className="text-gray-600 text-sm">
              <Text className="font-semibold text-violet-600">Meta: </Text>${c.monto_objetivo} |{" "}
              <Text className="font-semibold text-violet-600">Duración: </Text>{c.tiempo_objetivo} días
            </Text>
            <Text className="text-gray-500 text-sm font-semibold mt-1">
              Usuario: {c.usuario?.nombre ? `${c.usuario.nombre} ${c.usuario.apellido}` : c.id_usuario}
            </Text>

            <View className="flex-row gap-2 mt-4 flex-wrap">
              <TouchableOpacity
                onPress={() => handleApprove(c.id_campana, true)}
                className="flex-1 bg-green-400 px-4 py-2 rounded-lg mb-2"
              >
                <Text className="text-white font-semibold text-center">✓ Aprobar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleApprove(c.id_campana, false)}
                className="flex-1 bg-red-400 px-4 py-2 rounded-lg mb-2"
              >
                <Text className="text-white font-semibold text-center">✕ Rechazar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}
