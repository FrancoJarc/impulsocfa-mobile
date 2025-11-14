import React, { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    Image,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    TextInput,
    Alert,
    Modal,
    Pressable,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getCampaignById } from "../../services/campaign.service"; 
import { createPreference } from "../../services/payment.service"; // debe devolver { init_point, preference_id }
import Toast from "react-native-toast-message";
import * as WebBrowser from "expo-web-browser";
import { Ionicons } from "@expo/vector-icons";
import Comments from "../../components/comentarios/Comments";
import UltimasDonaciones from "./UltimasDonaciones"; 


export default function DetalleCampana() {
    const router = useRouter();
    const params = useLocalSearchParams(); // expo-router: recibe params de la ruta
    const id = params.id || params?.[0]; // dependiendo de la ruta que uses

    const [campana, setCampana] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [amount, setAmount] = useState(""); 
    const [llaveMaestra, setLlaveMaestra] = useState("");
    const [preferenceId, setPreferenceId] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Carrusel
    const [currentImage, setCurrentImage] = useState(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        const fetchCampana = async () => {
            try {
                const data = await getCampaignById(id);
                setCampana(data);
            } catch (err) {
                console.error("Error al obtener campaña", err);
                setError(err.message || "Error al obtener la campaña");
            } finally {
                setLoading(false);
            }
        };
        fetchCampana();
    }, [id]);

    // Auto-carrusel
    useEffect(() => {
        if (!campana) return;
        const imagenes = [campana.foto1, campana.foto2, campana.foto3].filter(Boolean);
        if (imagenes.length <= 1) return;
        intervalRef.current = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % imagenes.length);
        }, 5000);
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [campana]);

    const handlePrev = () => {
        const imagenes = [campana.foto1, campana.foto2, campana.foto3].filter(Boolean);
        setCurrentImage((prev) => (prev - 1 + imagenes.length) % imagenes.length);
    };

    const handleNext = () => {
        const imagenes = [campana.foto1, campana.foto2, campana.foto3].filter(Boolean);
        setCurrentImage((prev) => (prev + 1) % imagenes.length);
    };


    const formatAmount = (raw) => {

        const onlyNums = raw.replace(/[^\d,]/g, "");
        const [intPart, decPart] = onlyNums.split(",");
        const intClean = (intPart || "").replace(/^0+(?!$)/, "");
        const withDots = intClean.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return decPart !== undefined ? `${withDots},${decPart.slice(0, 2)}` : withDots;
    };

    const parseAmountToNumber = (formatted) => {
        if (!formatted) return 0;
        const num = formatted.replace(/\./g, "").replace(",", ".");
        const parsed = parseFloat(num);
        return isNaN(parsed) ? 0 : parsed;
    };

    const handleAmountChange = (text) => {
        const formatted = formatAmount(text);
        setAmount(formatted);
    };

    const handleDonate = async () => {
        const montoNum = parseAmountToNumber(amount);
        if (!montoNum || montoNum <= 0) {
            Toast.show({ type: "error", text1: "Ingresá un monto válido" });
            return;
        }
        if (!llaveMaestra.trim()) {
            Toast.show({ type: "error", text1: "Ingresá tu llave maestra" });
            return;
        }

        setIsProcessing(true);

        try {

            const comisionMP = montoNum * 0.03;
            const plataforma = montoNum * 0.02;
            const donacion = montoNum * 0.95;

            // Llamada al backend: createPreference debe devolver init_point
            const res = await createPreference({
                amount: donacion,
                campaignTitle: campana.titulo,
                campaignId: campana.id_campana,
                llave_maestra: llaveMaestra,
            });

            // Respuesta esperada: { init_point, preference_id }
            if (!res || (!res.init_point && !res.preference_id)) {
                throw new Error("Respuesta inválida del servidor");
            }

            setPreferenceId(res.preference_id || res.preferenceId || null);

            Toast.show({ type: "success", text1: "Llave verificada, abriendo checkout..." });

            // Abrir checkout en navegador in-app
            const url = res.init_point || res.initPoint || res.initUrl;
            if (!url) {
                throw new Error("No se recibió init_point para abrir el checkout");
            }

            // Abre navegador embebido
            await WebBrowser.openBrowserAsync(url);

            // Opcional: podes esperar una confirmación desde el backend (webhook) y refrescar la campaña
            // refrescar datos
            const fresh = await getCampaignById(id);
            setCampana(fresh);

        } catch (err) {
            console.error("Error createPreference:", err);
            Toast.show({ type: "error", text1: err.message || "Error al procesar pago" });
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#7c3aed" />
                <Text style={{ marginTop: 12, color: "#374151" }}>Cargando campaña...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={{ color: "red" }}>Error: {error}</Text>
            </View>
        );
    }

    if (!campana) {
        return (
            <View style={styles.center}>
                <Text style={{ color: "#374151" }}>No se encontró la campaña.</Text>
            </View>
        );
    }

    const imagenes = [campana.foto1, campana.foto2, campana.foto3].filter(Boolean);
    const porcentaje = Math.min((campana.monto_actual / campana.monto_objetivo) * 100, 100);

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
            {/* Volver */}
            <View style={styles.topBar}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.push("/campanas")}
                >
                    <Ionicons name="chevron-back" size={20} color="#7c3aed" />
                    <Text style={styles.backText}>Volver a campañas</Text>
                </TouchableOpacity>
            </View>

            {/* Card principal */}
            <View style={styles.card}>
                {/* Carrusel */}
                <View style={styles.carousel}>
                    {imagenes.length === 0 ? (
                        <Image
                            source={{ uri: "https://via.placeholder.com/800x400?text=Sin+imagen" }}
                            style={styles.carouselImage}
                            resizeMode="contain"
                        />
                    ) : (
                        <Image
                            source={{ uri: imagenes[currentImage] }}
                            style={styles.carouselImage}
                            resizeMode="cover"
                        />
                    )}

                    {imagenes.length > 1 && (
                        <>
                            <TouchableOpacity style={styles.carouselBtnLeft} onPress={handlePrev}>
                                <Ionicons name="chevron-back" size={22} color="#111" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.carouselBtnRight} onPress={handleNext}>
                                <Ionicons name="chevron-forward" size={22} color="#111" />
                            </TouchableOpacity>
                        </>
                    )}
                </View>

                <View style={styles.cardBody}>
                    <View style={styles.titleRow}>
                        <Text style={styles.title}>{campana.titulo}</Text>
                        <View
                            style={[
                                styles.badge,
                                campana.campana_estado === "activa" ? styles.badgeActive : styles.badgeInactive,
                            ]}
                        >
                            <Text style={styles.badgeText}>{campana.campana_estado}</Text>
                        </View>
                    </View>

                    <Text style={styles.description}>{campana.descripcion}</Text>

                    {/* Progress bar */}
                    <View style={{ marginTop: 18 }}>
                        <View style={styles.progressHeader}>
                            <Text style={styles.progressLabel}>Progreso de financiamiento</Text>
                            <Text style={styles.progressPercent}>{porcentaje.toFixed(1)}%</Text>
                        </View>
                        <View style={styles.progressBarBg}>
                            <View style={[styles.progressBarFill, { width: `${porcentaje}%` }]} />
                        </View>

                        <View style={styles.progressMeta}>
                            <Text style={styles.metaText}>
                                <Text style={styles.metaBold}>${Number(campana.monto_actual).toLocaleString()}</Text> recaudados
                            </Text>
                            <Text style={styles.metaText}>
                                Meta: <Text style={styles.metaBold}>${Number(campana.monto_objetivo).toLocaleString()}</Text>
                            </Text>
                        </View>
                    </View>

                    {/* Estadísticas (4 cards) */}
                    <View style={styles.statsGrid}>
                        <View style={styles.statBox}>
                            <Text style={styles.statLabel}>Meta</Text>
                            <Text style={styles.statValue}>${Number(campana.monto_objetivo).toLocaleString()}</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={styles.statLabel}>Recaudado</Text>
                            <Text style={styles.statValue}>${Number(campana.monto_actual).toLocaleString()}</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={styles.statLabel}>Duración</Text>
                            <Text style={styles.statValue}>
                                {new Date(campana.tiempo_objetivo).toLocaleDateString()}
                            </Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={styles.statLabel}>Inicio</Text>
                            <Text style={styles.statValue}>
                                {new Date(campana.fecha_inicio).toLocaleDateString()}
                            </Text>
                        </View>
                    </View>

                    {/* Formulario de donación */}
                    <View style={{ marginTop: 16 }}>
                        <Text style={styles.formLabel}>Monto a donar 💵</Text>

                        <View style={styles.amountRow}>
                            <Text style={styles.currency}>$</Text>
                            <TextInput
                                value={amount}
                                onChangeText={handleAmountChange}
                                placeholder="Ingresá el monto a donar"
                                keyboardType="numeric"
                                style={styles.amountInput}
                            />
                        </View>

                        {/* Desglose */}
                        {amount ? (
                            <View style={styles.breakdown}>
                                {(() => {
                                    const monto = parseAmountToNumber(amount) || 0;
                                    const mp = monto * 0.03;
                                    const nosotros = monto * 0.02;
                                    const donacion = monto * 0.95;
                                    return (
                                        <>
                                            <Text style={styles.breakText}>
                                                💜 <Text style={styles.metaBold}>${donacion.toFixed(2)}</Text> → campaña
                                            </Text>
                                            <Text style={styles.breakText}>
                                                💳 <Text style={styles.metaBold}>${mp.toFixed(2)}</Text> → tarifas Mercado Pago
                                            </Text>
                                            <Text style={styles.breakText}>
                                                ⚙️ <Text style={styles.metaBold}>${nosotros.toFixed(2)}</Text> → plataforma
                                            </Text>
                                            <Text style={styles.hintText}>Los porcentajes se calculan automáticamente.</Text>
                                        </>
                                    );
                                })()}
                            </View>
                        ) : null}

                        <Text style={[styles.formLabel, { marginTop: 12 }]}>Llave maestra 🔑</Text>
                        <TextInput
                            value={llaveMaestra}
                            onChangeText={setLlaveMaestra}
                            placeholder="Ingresá tu llave maestra"
                            secureTextEntry
                            style={styles.generalInput}
                        />
                        <Text style={styles.hintText}>
                            🔒 Pedimos tu llave maestra para confirmar que sos el titular de la cuenta.
                        </Text>

                        <TouchableOpacity
                            style={[styles.payButton, isProcessing && { opacity: 0.6 }]}
                            onPress={handleDonate}
                            disabled={isProcessing}
                        >
                            {isProcessing ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.payButtonText}>Donar con Mercado Pago</Text>
                            )}
                        </TouchableOpacity>

                        {preferenceId && (
                            <View style={{ marginTop: 10 }}>
                                <Text style={{ color: "#374151" }}>Preference ID: {preferenceId}</Text>
                            </View>
                        )}
                    </View>

                    {/* Comentarios y últimas donaciones (componentes) */}
                    <View style={{ marginTop: 18 }}>
                        {/* Si no tenés estos componentes en RN, reemplazalos por placeholders */}
                        {typeof Comments !== "undefined" ? (
                            <Comments id_campana={id} />
                        ) : (
                            <Text style={{ color: "#6b7280" }}>Comentarios (componente no encontrado)</Text>
                        )}
                        {typeof UltimasDonaciones !== "undefined" ? (
                            <UltimasDonaciones id_campana={id} token={null} />
                        ) : (
                            <Text style={{ color: "#6b7280", marginTop: 8 }}>Últimas donaciones (componente no encontrado)</Text>
                        )}
                    </View>
                </View>
            </View>

            <Toast />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f5f3ff" },
    topBar: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8 },
    backButton: { flexDirection: "row", alignItems: "center", gap: 8 },
    backText: { color: "#7c3aed", fontWeight: "600" },

    card: {
        margin: 16,
        borderRadius: 16,
        overflow: "hidden",
        backgroundColor: "rgba(255,255,255,0.95)",
        borderWidth: 1,
        borderColor: "#e9d5ff",
        shadowColor: "#7c3aed",
        shadowOpacity: 0.12,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 18,
        elevation: 6,
    },

    carousel: {
        height: 260,
        backgroundColor: "#f0efff",
        justifyContent: "center",
        alignItems: "center",
    },
    carouselImage: { width: "100%", height: "100%" },
    carouselBtnLeft: {
        position: "absolute",
        left: 10,
        top: "50%",
        transform: [{ translateY: -22 }],
        backgroundColor: "rgba(255,255,255,0.85)",
        padding: 8,
        borderRadius: 24,
    },
    carouselBtnRight: {
        position: "absolute",
        right: 10,
        top: "50%",
        transform: [{ translateY: -22 }],
        backgroundColor: "rgba(255,255,255,0.85)",
        padding: 8,
        borderRadius: 24,
    },

    cardBody: { padding: 16 },
    titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    title: { fontSize: 22, fontWeight: "700", color: "#4f46e5", flex: 1 },
    badge: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 999 },
    badgeActive: { backgroundColor: "#ecfdf5" },
    badgeInactive: { backgroundColor: "#f3f4f6" },
    badgeText: { color: "#065f46", fontWeight: "700" },

    description: { marginTop: 12, color: "#374151", fontSize: 16, lineHeight: 22 },

    progressHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    progressLabel: { color: "#374151", fontWeight: "600" },
    progressPercent: { color: "#6d28d9", fontWeight: "700" },
    progressBarBg: { height: 12, backgroundColor: "#f3e8ff", borderRadius: 10, marginTop: 8, overflow: "hidden" },
    progressBarFill: { height: "100%", backgroundColor: "#7c3aed" },
    progressMeta: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
    metaText: { color: "#374151" },
    metaBold: { color: "#6d28d9", fontWeight: "700" },

    statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 16 },
    statBox: {
        width: "48%",
        backgroundColor: "white",
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: "#efe6ff",
        shadowColor: "#7c3aed",
        shadowOpacity: 0.04,
        elevation: 2,
    },
    statLabel: { color: "#6b7280", fontSize: 13 },
    statValue: { color: "#6d28d9", fontWeight: "700", marginTop: 6 },

    formLabel: { color: "#374151", fontWeight: "700", marginBottom: 6 },

    amountRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
    currency: { marginLeft: 4, marginRight: 8, color: "#374151", fontSize: 18 },
    amountInput: {
        flex: 1,
        backgroundColor: "#f5f3ff",
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: "#e6e0ff",
    },

    breakdown: {
        marginTop: 8,
        backgroundColor: "#faf5ff",
        borderRadius: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: "#efe6ff",
    },
    breakText: { color: "#475569", marginBottom: 4 },
    hintText: { color: "#6b7280", fontSize: 12, marginTop: 6 },

    generalInput: {
        marginTop: 6,
        backgroundColor: "#f5f3ff",
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: "#e6e0ff",
    },

    payButton: {
        marginTop: 14,
        backgroundColor: "#7c3aed",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
    },
    payButtonText: { color: "white", fontWeight: "700" },
});
