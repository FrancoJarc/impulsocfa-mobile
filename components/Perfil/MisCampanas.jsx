import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity
} from "react-native";
import {
  getCurrentUser,
  getUserCampaigns,
  getUserPendingCampaigns,
  getUserRejectedCampaigns,
} from "../../services/campaign.service";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MisCampanas() {
  const [user, setUser] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [pendingCampaigns, setPendingCampaigns] = useState([]);
  const [rejectedCampaigns, setRejectedCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const u = await getCurrentUser();
        setUser(u);

        const [ap, pe, re] = await Promise.all([
          getUserCampaigns(u.id),
          getUserPendingCampaigns(),
          getUserRejectedCampaigns(),
        ]);

        setCampaigns(ap);
        setPendingCampaigns(pe);
        setRejectedCampaigns(re);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const Card = ({ c, showButton }) => {
    const imagen =
      c.foto1 || c.foto2 || c.foto3 || "https://via.placeholder.com/400x300?text=Sin+imagen";

    return (
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 16,
          padding: 14,
          marginBottom: 18,
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 2,
        }}
      >
        <Image
          source={{ uri: imagen }}
          style={{ width: "100%", height: 160, borderRadius: 12 }}
        />

        <Text style={{ fontSize: 20, fontWeight: "700", marginTop: 12 }}>
          {c.titulo}
        </Text>

        <Text style={{ marginTop: 8, color: "#555", fontSize: 14 }}>
          {c.descripcion}
        </Text>

        <Text style={{ marginTop: 10 }}>🎯 Meta: ${c.monto_objetivo}</Text>
        <Text>💰 Recaudado: ${c.monto_actual || 0}</Text>

        <Text style={{ marginTop: 6 }}>
          📅 Finaliza: {new Date(c.tiempo_objetivo).toLocaleDateString()}
        </Text>

        {c.estado && (
          <Text style={{ marginTop: 10, fontWeight: "600" }}>
            Estado: {c.estado}
          </Text>
        )}

        {showButton && (
          <TouchableOpacity
            onPress={() => router.push(`/perfil/VerMasCampana?id=${c.id_campana}`)}
            style={{ marginTop: 12 }}
          >
            <Text style={{ color: "#6c47ff", fontWeight: "bold", fontSize: 16 }}>
              Ver más →
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6c47ff" />
      </View>
    );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f7f7fb" }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10 }}>
        
        {/* TITULO */}
        <Text
          style={{
            fontSize: 32,
            fontWeight: "800",
            marginBottom: 25,
            textAlign: "left",
            color: "#1a1a1a",
          }}
        >
          Mis campañas
        </Text>

        {/* Aprobadas */}
        <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 12, color: "green" }}>
          Aprobadas
        </Text>

        {campaigns.length
          ? campaigns.map((c) => <Card key={c.id_campana} c={c} showButton />)
          : <Text style={{ color: "#555", marginBottom: 20 }}>No hay campañas aprobadas.</Text>
        }

        {/* Línea suave */}
        <View
          style={{
            height: 1,
            backgroundColor: "#ddd",
            marginVertical: 25,
            opacity: 0.6,
          }}
        />

        {/* Pendientes */}
        <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 12, color: "orange" }}>
          Pendientes
        </Text>

        {pendingCampaigns.length
          ? pendingCampaigns.map((c) => <Card key={c.id_campana} c={c} />)
          : <Text style={{ color: "#555", marginBottom: 20 }}>No hay campañas pendientes.</Text>
        }

        <View
          style={{
            height: 1,
            backgroundColor: "#ddd",
            marginVertical: 25,
            opacity: 0.6,
          }}
        />

        {/* Rechazadas */}
        <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 12, color: "red" }}>
          Rechazadas
        </Text>

        {rejectedCampaigns.length
          ? rejectedCampaigns.map((c) => <Card key={c.id_campana} c={c} />)
          : <Text style={{ color: "#555", marginBottom: 30 }}>No hay campañas rechazadas.</Text>
        }
      </ScrollView>
    </SafeAreaView>
  );
}
