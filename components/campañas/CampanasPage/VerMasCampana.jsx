// components/CampanasPage/VerMasCampana.js
import React, { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    Alert,
    Dimensions,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";

import { getCampaignById, suspendCampaign } from "../../services/campaign.service";
// IMPORTA/ADAPTA estos componentes a su versión RN
import Comments from "../comentarios/Comments";
import UltimasDonaciones from "../Campanas/UltimasDonaciones";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function VerMasCampana() {
    // Si usás expo-router en archivos non-page, podés leer params así:
    const params = useLocalSearchParams(); // { id: "..." }
    const id = params.id;
    const router = useRouter();

    const [campana, setCampana] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentImage, setCurrentImage] = useState(0);

    const carouselRef = useRef(null);

    useEffect(() => {
        const fetchCampana = async () => {
            try {
                const data = await getCampaignById(id);
                setCampana(data);
            } catch (err) {
                console.error(err);
                setError(err.message || "Error al cargar la campaña");
                Toast.show({
                    type: "error",
                    text1: "Error",
                    text2: err.message || "No se pudo cargar la campaña",
                    position: "top",
                    visibilityTime: 3000,
                });
            } finally {
                setLoading(false);
            }
        };
        fetchCampana();
    }, [id]);

    // Carrusel automático
    useEffect(() => {
        if (!campana) return;
        const imagenes = [campana.foto1, campana.foto2, campana.foto3].filter(Boolean);
        if (imagenes.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % imagenes.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [campana]);

    const handlePrev = () => {
        if (!campana) return;
        const imagenes = [campana.foto1, campana.foto2, campana.foto3].filter(Boolean);
        setCurrentImage((prev) => (prev - 1 + imagenes.length) % imagenes.length);
    };

    const handleNext = () => {
        if (!campana) return;
        const imagenes = [campana.foto1, campana.foto2, campana.foto3].filter(Boolean);
        setCurrentImage((prev) => (prev + 1) % imagenes.length);
    };

    const handleEdit = () => {
        if (!campana) return;
        router.push(`/editarcampana/${campana.id_campana}`);
    };

    const handleSuspend = () => {
        if (!campana) return;
        Alert.alert(
            "Confirmar",
            "¿Seguro que querés suspender esta campaña?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Sí, suspender",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await suspendCampaign(campana.id_campana);
                            Toast.show({
                                type: "success",
                                text1: "Campaña suspendida",
                                position: "top",
                                visibilityTime: 2500,
                            });
                            // volver al listado
                            router.push("/campanas");
                        } catch (err) {
                            console.error(err);
                            Toast.show({
                                type: "error",
                                text1: "Error",
                                text2: err.message || "No se pudo suspender la campaña",
                                position: "top",
                                visibilityTime: 3000,
                            });
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };

    if (loading)
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#7c3aed" />
                <Text style={{ marginTop: 12, color: "#475569" }}>Cargando campaña...</Text>
            </View>
        );

    if (error)
        return (
            <View style={styles.centered}>
                <Text style={{ color: "#dc2626", textAlign: "center" }}>{error}</Text>
            </View>
        );

    if (!campana)
        return (
            <View style={styles.centered}>
                <Text style={{ color: "#475569" }}>No se encontró la campaña.</Text>
            </View>
        );

    const imagenes = [campana.foto1, campana.foto2, campana.foto3].filter(Boolean);
    const porcentaje = Math.min(((campana.monto_actual || 0) / campana.monto_objetivo) * 100, 100);

    return (
        <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 40 }}>
            {/* fondo similar a web (degradados suaves) */}
            <LinearGradient
                colors={["#f5f3ff", "#eff6ff", "#fbefff"]}
                style={styles.backgroundGradient}
            />

            {/* Volver */}
            <View style={styles.topRow}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.push("/campanas")}>
                    <Feather name="arrow-left" size={18} color="#6d28d9" />
                    <Text style={styles.backText}>Volver</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.card}>
                {/* Carrusel */}
                <View style={styles.carouselContainer}>
                    {imagenes.length === 0 ? (
                        <Image
                            source={{ uri: "https://via.placeholder.com/800x400?text=Sin+imagen" }}
                            style={styles.carouselImage}
                            resizeMode="contain"
                        />
                    ) : (
                        <Image source={{ uri: imagenes[currentImage] }} style={styles.carouselImage} resizeMode="cover" />
                    )}

                    {imagenes.length > 1 && (
                        <>
                            <TouchableOpacity style={styles.prevBtn} onPress={handlePrev}>
                                <Feather name="chevron-left" size={22} color="#111827" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
                                <Feather name="chevron-right" size={22} color="#111827" />
                            </TouchableOpacity>
                        </>
                    )}
                </View>

                {/* Título y estado */}
                <View style={styles.titleRow}>
                    <Text style={styles.title}>{campana.titulo}</Text>
                    <View
                        style={[
                            styles.badge,
                            campana.campana_estado === "activa" ? styles.badgeActive : styles.badgeInactive,
                        ]}
                    >
                        <Text style={campana.campana_estado === "activa" ? styles.badgeTextActive : styles.badgeTextInactive}>
                            {campana.campana_estado}
                        </Text>
                    </View>
                </View>

                <Text style={styles.description}>{campana.descripcion}</Text>

                {/* Progreso */}
                <View style={{ marginVertical: 16 }}>
                    <View style={styles.progressHeader}>
                        <Text style={styles.progressLabel}>Progreso de financiamiento</Text>
                        <Text style={styles.progressPercent}>{porcentaje.toFixed(1)}%</Text>
                    </View>

                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${porcentaje}%` }]} />
                    </View>
                </View>

                {/* Estadísticas */}
                <View style={styles.statsRow}>
                    <View style={[styles.statBox, { backgroundColor: "#eef2ff" }]}>
                        <MaterialCommunityIcons name="target" size={20} color="#6d28d9" />
                        <Text style={styles.statLabelSmall}>Meta</Text>
                        <Text style={styles.statValue}>
                            ${Number(campana.monto_objetivo).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </Text>
                    </View>

                    <View style={[styles.statBox, { backgroundColor: "#f5f3ff" }]}>
                        <MaterialCommunityIcons name="trending-up" size={20} color="#6d28d9" />
                        <Text style={styles.statLabelSmall}>Recaudado</Text>
                        <Text style={styles.statValue}>
                            ${Number(campana.monto_actual || 0).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </Text>
                    </View>

                    <View style={[styles.statBox, { backgroundColor: "#faf0ff" }]}>
                        <MaterialCommunityIcons name="clock-outline" size={20} color="#6d28d9" />
                        <Text style={styles.statLabelSmall}>Duración</Text>
                        <Text style={styles.statValue}>
                            {new Date(campana.tiempo_objetivo).toLocaleDateString("es-AR")}{" "}
                            {(() => {
                                const diasRestantes = Math.ceil((new Date(campana.tiempo_objetivo) - new Date()) / (1000 * 60 * 60 * 24));
                                return diasRestantes > 0 ? ` (faltan ${diasRestantes} ${diasRestantes === 1 ? "día" : "días"})` : diasRestantes === 0 ? " (finaliza hoy)" : " (ya finalizó)";
                            })()}
                        </Text>
                    </View>

                    <View style={[styles.statBox, { backgroundColor: "#fff7ff" }]}>
                        <MaterialCommunityIcons name="calendar-outline" size={20} color="#6d28d9" />
                        <Text style={styles.statLabelSmall}>Inicio</Text>
                        <Text style={styles.statValue}>{new Date(campana.fecha_inicio).toLocaleDateString()}</Text>
                    </View>
                </View>

                {/* Acciones */}
                <View style={styles.actionsRow}>
                    <TouchableOpacity onPress={handleEdit} style={[styles.actionBtn, { backgroundColor: "#2563eb" }]}>
                        <Feather name="edit-3" size={16} color="#fff" />
                        <Text style={styles.actionText}>Editar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleSuspend} style={[styles.actionBtn, { backgroundColor: "#dc2626" }]}>
                        <Feather name="trash-2" size={16} color="#fff" />
                        <Text style={styles.actionText}>Suspender</Text>
                    </TouchableOpacity>
                </View>

                {/* Comentarios y últimas donaciones */}
                <View style={{ marginTop: 12 }}>
                    {/* Asegurate de tener estos componentes en su versión RN o crea placeholders */}
                    <Comments id_campana={id} />
                    <UltimasDonaciones id_campana={id} />
                </View>
            </View>

            {/* Toast (si no lo montaste global en app/_layout, descomenta esta línea) */}
            {/* <Toast /> */}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: "#f5f3ff" },
    backgroundGradient: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        height: 220,
    },
    topRow: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8 },
    backBtn: { flexDirection: "row", alignItems: "center", gap: 8 },
    backText: { color: "#6d28d9", fontWeight: "600", marginLeft: 8 },

    card: {
        marginHorizontal: 16,
        marginTop: 8,
        borderRadius: 16,
        backgroundColor: "rgba(255,255,255,0.95)",
        padding: 14,
        shadowColor: "#6d28d9",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: "#e9d5ff",
    },

    carouselContainer: {
        height: 260,
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: "#f3e8ff",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
    },
    carouselImage: { width: "100%", height: "100%" },
    prevBtn: {
        position: "absolute",
        left: 10,
        top: "50%",
        transform: [{ translateY: -22 }],
        backgroundColor: "rgba(255,255,255,0.85)",
        padding: 8,
        borderRadius: 30,
    },
    nextBtn: {
        position: "absolute",
        right: 10,
        top: "50%",
        transform: [{ translateY: -22 }],
        backgroundColor: "rgba(255,255,255,0.85)",
        padding: 8,
        borderRadius: 30,
    },

    titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
    title: { fontSize: 22, fontWeight: "800", color: "#111827", flex: 1 },
    badge: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 999 },
    badgeActive: { backgroundColor: "#dcfce7", borderWidth: 1, borderColor: "#bbf7d0" },
    badgeInactive: { backgroundColor: "#f1f5f9", borderWidth: 1, borderColor: "#e2e8f0" },
    badgeTextActive: { color: "#166534", fontWeight: "700" },
    badgeTextInactive: { color: "#374151", fontWeight: "700" },

    description: { color: "#334155", marginBottom: 8 },

    progressHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
    progressLabel: { color: "#475569", fontWeight: "600" },
    progressPercent: { color: "#6d28d9", fontWeight: "800" },

    progressBarBg: {
        height: 12,
        backgroundColor: "#f3e8ff",
        borderRadius: 999,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#e9d5ff",
    },
    progressBarFill: {
        height: "100%",
        backgroundColor: "#6d28d9",
    },

    statsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, justifyContent: "space-between", marginBottom: 12 },
    statBox: {
        width: (SCREEN_WIDTH - 64) / 2,
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
    },
    statLabelSmall: { color: "#475569", fontSize: 12, marginTop: 6 },
    statValue: { fontSize: 14, fontWeight: "700", color: "#6d28d9", marginTop: 6 },

    actionsRow: { flexDirection: "row", gap: 12, marginTop: 6 },
    actionBtn: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
    },
    actionText: { color: "#fff", fontWeight: "700", marginLeft: 8 },

    centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
});
