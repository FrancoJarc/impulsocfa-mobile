import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { getCampaignById, suspendCampaign } from "../../services/campaign.service";
import Toast from "react-native-toast-message";
import Comments from "../Comentarios/Comments";
import UltimasDonaciones from "../Campanas/UltimasDonaciones";

export default function VerMasCampana() {
  const { id } = useLocalSearchParams();
  const campaignId = id;

  const [campana, setCampana] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const carouselRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getCampaignById(campaignId);
        if (!mounted) return;
        setCampana(data);
      } catch (e) {
        console.log(e);
        setErr(e.message || "Error al cargar la campaña");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    if (!campaignId) {
      setErr("ID de campaña faltante");
      setLoading(false);
    } else {
      fetchData();
    }

    return () => {
      mounted = false;
      if (carouselRef.current) {
        clearInterval(carouselRef.current);
      }
    };
  }, [campaignId]);

  // Carrusel automático
  useEffect(() => {
    if (!campana) return;
    const imagenes = [campana.foto1, campana.foto2, campana.foto3].filter(Boolean);
    if (imagenes.length <= 1) return;

    carouselRef.current = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % imagenes.length);
    }, 3000);

    return () => {
      if (carouselRef.current) clearInterval(carouselRef.current);
    };
  }, [campana]);

  const handlePrev = () => {
    const imagenes = [campana.foto1, campana.foto2, campana.foto3].filter(Boolean);
    if (!imagenes.length) return;
    setCurrentImage((prev) => (prev - 1 + imagenes.length) % imagenes.length);
  };

  const handleNext = () => {
    const imagenes = [campana.foto1, campana.foto2, campana.foto3].filter(Boolean);
    if (!imagenes.length) return;
    setCurrentImage((prev) => (prev + 1) % imagenes.length);
  };

  const handleEdit = () => {
    // Navegar a editar con query param id
    router.push(`/perfil/EditarCampana?id=${id}`)
  };

  const handleSuspend = () => {
    Alert.alert(
      "Suspender campaña",
      "¿Seguro que querés suspender esta campaña?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, suspender",
          style: "destructive",
          onPress: async () => {
            try {
              await suspendCampaign(campana.id_campana);
              Toast.show({ type: "success", text1: "Campaña suspendida" });
              router.replace("/perfil/MisCampanas");
            } catch (e) {
              console.log(e);
              Toast.show({ type: "error", text1: "Error al suspender campaña", text2: e.message });
            }
          },
        },
      ]
    );
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#7c3aed" />
      </View>
    );

  if (err)
    return (
      <View style={styles.center}>
        <Text style={{ color: "#b91c1c" }}>{err}</Text>
      </View>
    );

  if (!campana)
    return (
      <View style={styles.center}>
        <Text>No se encontró la campaña.</Text>
      </View>
    );

  const imagenes = [campana.foto1, campana.foto2, campana.foto3].filter(Boolean);
  const porcentaje =
    campana.monto_objetivo && campana.monto_actual
      ? Math.min((campana.monto_actual / campana.monto_objetivo) * 100, 100)
      : 0;

  const diasRestantes = Math.ceil((new Date(campana.tiempo_objetivo) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <ScrollView style={styles.page}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Text style={styles.backText}>← Volver</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        {/* Carrusel */}
        <View style={styles.carousel}>
          {imagenes.length === 0 ? (
            <Image
              source={{ uri: "https://via.placeholder.com/800x400?text=Sin+imagen" }}
              style={styles.mainImage}
              resizeMode="cover"
            />
          ) : (
            <Image source={{ uri: imagenes[currentImage] }} style={styles.mainImage} resizeMode="cover" />
          )}

          {imagenes.length > 1 && (
            <>
              <TouchableOpacity style={styles.leftArrow} onPress={handlePrev}>
                <Text style={styles.arrowText}>‹</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rightArrow} onPress={handleNext}>
                <Text style={styles.arrowText}>›</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Título y estado */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>{campana.titulo}</Text>
          <View style={[styles.statusPill, campana.campana_estado === "activa" ? styles.active : styles.inactive]}>
            <Text style={styles.statusText}>{campana.campana_estado}</Text>
          </View>
        </View>

        <Text style={styles.description}>{campana.descripcion}</Text>

        {/* Progreso */}
        <View style={{ marginTop: 14 }}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Progreso de financiamiento</Text>
            <Text style={styles.progressPercent}>{porcentaje.toFixed(1)}%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${porcentaje}%` }]} />
          </View>
        </View>

        {/* Estadísticas */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Meta</Text>
            <Text style={styles.statValue}>${Number(campana.monto_objetivo).toLocaleString("es-AR")}</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Recaudado</Text>
            <Text style={styles.statValue}>${Number(campana.monto_actual || 0).toLocaleString("es-AR")}</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Duración</Text>
            <Text style={styles.statValue}>
              {new Date(campana.tiempo_objetivo).toLocaleDateString("es-AR")}
              {"\n"}
              {diasRestantes > 0 ? `faltan ${diasRestantes} ${diasRestantes === 1 ? "día" : "días"}` : diasRestantes === 0 ? "finaliza hoy" : "ya finalizó"}
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Inicio</Text>
            <Text style={styles.statValue}>{new Date(campana.fecha_inicio).toLocaleDateString("es-AR")}</Text>
          </View>
        </View>

        {/* Acciones */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.editBtn} onPress={handleEdit}>
            <Text style={styles.actionText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.suspendBtn} onPress={handleSuspend}>
            <Text style={styles.actionText}>Suspender</Text>
          </TouchableOpacity>
        </View>
        <View style={{ padding: 13 }}>
          <Comments id_campana={campaignId} />

          <View style={{ height: 12 }} /> {/* separador */}

          <UltimasDonaciones id_campana={campaignId} />
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F8F5FF" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  backBtn: { padding: 12, marginLeft: 8, marginTop: 8 },
  backText: { color: "#6d28d9", fontWeight: "600" },
  card: {
    margin: 16,
    padding: 14,
    backgroundColor: "white",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e6e0ff",
    shadowColor: "#8b5cf6",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  carousel: { height: 220, borderRadius: 12, overflow: "hidden", backgroundColor: "#f3e8ff", marginBottom: 12 },
  mainImage: { width: "100%", height: "100%" },
  leftArrow: { position: "absolute", left: 8, top: "50%", padding: 8, backgroundColor: "rgba(255,255,255,0.7)", borderRadius: 20 },
  rightArrow: { position: "absolute", right: 8, top: "50%", padding: 8, backgroundColor: "rgba(255,255,255,0.7)", borderRadius: 20 },
  arrowText: { fontSize: 20, color: "#6d28d9", fontWeight: "700" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 },
  title: { fontSize: 20, fontWeight: "700", color: "#4c1d95", flex: 1, marginRight: 8 },
  statusPill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  statusText: { fontWeight: "700" },
  active: { backgroundColor: "#dcfce7", borderColor: "#bbf7d0" },
  inactive: { backgroundColor: "#f1f5f9", borderColor: "#e2e8f0" },
  description: { marginTop: 10, color: "#444" },
  progressRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  progressLabel: { color: "#444", fontWeight: "600" },
  progressPercent: { color: "#6d28d9", fontWeight: "700" },
  progressBarBg: { width: "100%", height: 10, backgroundColor: "#f3e8ff", borderRadius: 8, marginTop: 8, overflow: "hidden" },
  progressBarFill: { height: "100%", backgroundColor: "#7c3aed", borderRadius: 8 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginTop: 14 },
  statCard: { width: "48%", backgroundColor: "#f8f6ff", padding: 10, borderRadius: 10, marginBottom: 10 },
  statLabel: { fontSize: 12, color: "#6b7280" },
  statValue: { fontWeight: "700", marginTop: 6, color: "#4c1d95" },
  actionsRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
  editBtn: { flex: 1, backgroundColor: "#60a5fa", padding: 12, borderRadius: 10, marginRight: 8, alignItems: "center" },
  suspendBtn: { flex: 1, backgroundColor: "#fb7185", padding: 12, borderRadius: 10, marginLeft: 8, alignItems: "center" },
  actionText: { color: "#fff", fontWeight: "700" },
});
