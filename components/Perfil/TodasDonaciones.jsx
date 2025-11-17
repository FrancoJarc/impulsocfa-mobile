import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Image,
  StyleSheet,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Heart,
  Calendar,
  DollarSign,
  Trophy,
  Sparkles,
  Wallet,
} from "lucide-react-native";

import {
  getUserCampaigns,
  getDonationsByCampaignId,
  getCurrentUser,
} from "../../services/campaign.service";

import { getUserTotal } from "../../services/user.service";
import { SafeAreaView } from "react-native-safe-area-context";


export default function TodasDonaciones() {
  const [donaciones, setDonaciones] = useState([]);
  const [totalRecaudado, setTotalRecaudado] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDonaciones() {
      try {
        const user = await getCurrentUser();
        const userId = user.id;

        const totalData = await getUserTotal();
        setTotalRecaudado(totalData.total || 0);

        const campaigns = await getUserCampaigns(userId);

        let all = [];

        for (const campaign of campaigns) {
          const donations = await getDonationsByCampaignId(
            campaign.id_campana
          );

          const withInfo = donations.map((d) => ({
            ...d,
            titulo_campana: campaign.titulo,
          }));

          all = [...all, ...withInfo];
        }

        all.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

        setDonaciones(all);
      } catch (e) {
        alert(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDonaciones();
  }, []);

  // LOADING
  if (loading)
    return (
      <View style={[styles.fullCenter, { backgroundColor: "#f5f3ff" }]}>
        <ActivityIndicator size="large" color="#8b5cf6" />
        <Text style={styles.loadingText}>Cargando donaciones...</Text>
      </View>
    );

  // SIN DONACIONES
  if (donaciones.length === 0)
    return (
      <View style={[styles.fullCenter, { backgroundColor: "#f5f3ff" }]}>
        <Text style={styles.emptyEmoji}>🎁</Text>
        <Trophy size={80} color="#c084fc" opacity={0.5} />
        <Text style={styles.emptyTitle}>Aún no recibiste donaciones</Text>
        <Text style={styles.emptySub}>
          ¡Comparte tus campañas para comenzar a recibir apoyo!
        </Text>
      </View>
    );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={["#e0f2ff", "#f5e1ff", "#ffdfed"]}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* HEADER */}
          <View style={styles.header}>
            <View style={styles.headerRow}>
              <Sparkles size={32} color="#a855f7" style={{ marginRight: 4 }} />
              <Text style={styles.title}>Donaciones Recibidas</Text>
              <Sparkles size={32} color="#ec4899" />
            </View>

            <Text style={styles.subtitle}>
              Total de{" "}
              <Text style={styles.subtitleBold}>{donaciones.length}</Text>{" "}
              donaciones
            </Text>

            <View style={styles.moneyRow}>
              <Wallet size={24} color="#7c3aed" />
              <Text style={styles.moneyText}>
                Monto total recaudado:{" "}
                <Text style={styles.moneyValue}>
                  $
                  {Number(totalRecaudado).toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                  })}
                </Text>
              </Text>
            </View>
          </View>

          {/* DONACIÓN CARD */}
          {donaciones.map((don, index) => {
            const gradients = [
              ["#3b82f6", "#8b5cf6"],
              ["#a855f7", "#ec4899"],
              ["#ec4899", "#f97316"],
              ["#f97316", "#ef4444"],
              ["#22c55e", "#10b981"],
            ];

            const gradient = gradients[index % gradients.length];

            return (
              <Pressable key={don.id_donacion} style={({ pressed }) => [
                styles.cardContainer,
                pressed && { transform: [{ scale: 0.97 }] },
              ]}>
                <LinearGradient colors={["#ffffff", "#faf8ff"]} style={styles.card}>
                  {/* FOTO + INFO */}
                  <View style={styles.row}>
                    <View style={styles.avatarWrapper}>
                      <LinearGradient
                        colors={gradient}
                        style={styles.avatarGlow}
                      />
                      <Image
                        source={{
                          uri:
                            don.usuario?.foto_perfil ||
                            "https://via.placeholder.com/100",
                        }}
                        style={styles.avatar}
                      />
                      <Heart
                        size={20}
                        color={gradient[0]}
                        style={styles.heartBadge}
                      />
                    </View>

                    <View style={styles.info}>
                      <Text style={styles.name} numberOfLines={1}>
                        {don.usuario?.nombre} {don.usuario?.apellido}
                      </Text>

                      <View style={styles.badgeRow}>
                        <LinearGradient colors={gradient} style={styles.moneyBadge}>
                          <DollarSign size={16} color="white" />
                          <Text style={styles.moneyBadgeText}>${don.monto}</Text>
                        </LinearGradient>
                      </View>

                      <View style={styles.dateRow}>
                        <Calendar size={16} color="#8b5cf6" />
                        <Text style={styles.dateText}>
                          {new Date(don.fecha).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </Text>
                      </View>

                      <Text style={styles.campaign} numberOfLines={1}>
                        {don.titulo_campana}
                      </Text>
                    </View>

                    {/* RANK */}
                    <LinearGradient colors={gradient} style={styles.rankCircle}>
                      <Text style={styles.rankText}>#{index + 1}</Text>
                    </LinearGradient>
                  </View>
                </LinearGradient>
              </Pressable>
            );
          })}

          <View style={styles.footer}>
            <Text style={styles.footerTitle}>¡Falta poco para tu objetivo!</Text>
            <Text style={styles.footerSub}>
              Cada donación representa un acto de apoyo 💜
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fullCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "600",
    color: "#7e22ce",
  },
  emptyEmoji: { fontSize: 60, marginBottom: 10 },
  emptyTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#7c3aed",
    marginTop: 10,
  },
  emptySub: {
    marginTop: 6,
    textAlign: "center",
    color: "#555",
    maxWidth: 260,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: { alignItems: "center", marginBottom: 30 },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  title: {
    fontSize: 34,
    fontWeight: "800",
    backgroundColor: "transparent",
    color: "#9333ea",
  },
  subtitle: { fontSize: 16, color: "#555", marginTop: 4 },
  subtitleBold: { color: "#7c3aed", fontWeight: "800", fontSize: 22 },
  moneyRow: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
    gap: 8,
  },
  moneyText: { fontSize: 16, color: "#444" },
  moneyValue: { fontSize: 22, fontWeight: "800", color: "#7c3aed" },

  // CARD
  cardContainer: {
    marginBottom: 18,
  },
  card: {
    padding: 18,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#ede9fe",
    shadowColor: "#8b5cf6",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  row: { flexDirection: "row", alignItems: "center" },
  avatarWrapper: { position: "relative", width: 70, height: 70 },
  avatarGlow: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 100,
    opacity: 0.4,
    transform: [{ scale: 1.3 }],
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "#fff",
  },
  heartBadge: {
    position: "absolute",
    right: -4,
    bottom: -4,
  },

  info: { flex: 1, paddingLeft: 14 },
  name: { fontSize: 18, fontWeight: "700", color: "#111" },

  badgeRow: { marginTop: 6 },
  moneyBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 4,
  },
  moneyBadgeText: {
    color: "white",
    fontWeight: "700",
  },

  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 6,
  },
  dateText: { color: "#555", fontSize: 13 },

  campaign: {
    marginTop: 6,
    color: "#7c3aed",
    fontSize: 12,
    fontWeight: "700",
  },

  rankCircle: {
    width: 48,
    height: 48,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  rankText: { color: "white", fontWeight: "900", fontSize: 18 },

  footer: { marginTop: 40, alignItems: "center" },
  footerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#9333ea",
  },
  footerSub: {
    marginTop: 8,
    color: "#555",
    textAlign: "center",
  },
});
