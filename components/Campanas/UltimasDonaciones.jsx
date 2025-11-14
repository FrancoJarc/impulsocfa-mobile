import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getLatestDonations } from "../../services/campaign.service";

export default function UltimasDonaciones({ id_campana }) {
  const [donaciones, setDonaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getLatestDonations(id_campana);
        setDonaciones(data);
      } catch (error) {
        alert("No se pudieron cargar las últimas donaciones");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id_campana]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#8b5cf6" />
        <Text style={{ marginTop: 10, color: "#7c3aed" }}>Cargando donaciones...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Últimas donaciones</Text>

      {donaciones.length === 0 ? (
        <Text style={styles.noDonations}>Aún no hay donaciones</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {donaciones.map((d) => (
            <View key={d.id_donacion} style={styles.item}>
              <View style={styles.user}>
                <Image
                  source={{
                    uri: d.usuario?.foto_perfil || "https://via.placeholder.com/100",
                  }}
                  style={styles.avatar}
                />
                <Text style={styles.name}>
                  {d.usuario?.nombre} {d.usuario?.apellido}
                </Text>
              </View>
              <Text style={styles.amount}>
                ${Number(d.monto).toLocaleString("es-AR")}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    margin: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4b5563",
    marginBottom: 12,
  },
  noDonations: {
    color: "#9ca3af",
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 20,
  },
  list: {
    gap: 12,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    paddingBottom: 8,
  },
  user: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  name: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
  },
  amount: {
    fontSize: 14,
    fontWeight: "700",
    color: "#10b981",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
