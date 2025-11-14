import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from "react-native";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import {
    getCurrentUser,
    getUserCampaigns,
    getUserPendingCampaigns,
    getUserRejectedCampaigns,
} from "../../services/campaign.service";

export default function CampanasPage() {
    const [user, setUser] = useState(null);
    const [campaigns, setCampaigns] = useState([]);
    const [pendingCampaigns, setPendingCampaigns] = useState([]);
    const [rejectedCampaigns, setRejectedCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = await getCurrentUser();
                setUser(user);

                const [ap, pe, re] = await Promise.all([
                    getUserCampaigns(user.id),
                    getUserPendingCampaigns(user.id),
                    getUserRejectedCampaigns(user.id),
                ]);

                setCampaigns(ap);
                setPendingCampaigns(pe);
                setRejectedCampaigns(re);
            } catch (err) {
                console.error(err);
                Toast.show({
                    type: "error",
                    text1: "Error al obtener campañas 😕",
                    position: "top",
                });
                navigation.navigate("Login");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const Card = ({ c, showButton }) => {
        const imagenes = [c.foto1, c.foto2, c.foto3].filter(Boolean);
        const imagen =
            imagenes[0] || "https://via.placeholder.com/400x300?text=Sin+imagen";

        return (
            <View style={styles.card}>
                <Image source={{ uri: imagen }} style={styles.cardImage} />

                <Text style={styles.cardTitle}>{c.titulo}</Text>
                <Text numberOfLines={3} style={styles.cardDesc}>
                    {c.descripcion}
                </Text>

                <View style={styles.cardInfo}>
                    <View>
                        <Text style={styles.meta}>🎯 Meta: ${c.monto_objetivo}</Text>
                        <Text style={styles.recaudado}>
                            💰 Recaudado: ${c.monto_actual || 0}
                        </Text>
                    </View>
                    <View>
                        <Text style={styles.fecha}>📅 Finaliza:</Text>
                        <Text style={styles.fechaValor}>
                            {new Date(c.tiempo_objetivo).toLocaleDateString("es-AR")}
                        </Text>
                    </View>
                </View>

                {c.estado && (
                    <Text
                        style={[
                            styles.estado,
                            c.estado === "pendiente"
                                ? styles.estadoPendiente
                                : c.estado === "rechazada"
                                    ? styles.estadoRechazada
                                    : styles.estadoAprobada,
                        ]}
                    >
                        Estado: {c.estado}
                    </Text>
                )}

                {showButton && (
                    <TouchableOpacity
                        style={styles.verMasBtn}
                        onPress={() =>
                            navigation.navigate("VerMasCampana", { id: c.id_campana })
                        }
                    >
                        <Text style={styles.verMasText}>Ver más →</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    if (loading)
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#7c3aed" />
                <Text style={{ color: "#555", marginTop: 8 }}>
                    Cargando campañas...
                </Text>
            </View>
        );

    return (
        <ScrollView style={styles.container}>
            <Toast />
            <View style={styles.header}>
                <Text style={styles.title}>Mis Campañas</Text>
                <TouchableOpacity
                    style={styles.crearBtn}
                    onPress={() => navigation.navigate("CrearCampana")}
                >
                    <Text style={styles.crearText}>+ Crear Campaña</Text>
                </TouchableOpacity>
            </View>

            <Section title="Aprobadas" color="#22c55e" data={campaigns} showButton />
            <Section title="Pendientes" color="#eab308" data={pendingCampaigns} />
            <Section title="Rechazadas" color="#ef4444" data={rejectedCampaigns} />
        </ScrollView>
    );
}

function Section({ title, color, data, showButton }) {
    return (
        <View style={{ marginBottom: 20 }}>
            <Text style={[styles.sectionTitle, { color }]}>{title}</Text>
            {data.length > 0 ? (
                data.map((c) => (
                    <Card key={c.id_campana} c={c} showButton={showButton} />
                ))
            ) : (
                <Text style={styles.emptyText}>No hay campañas {title.toLowerCase()}.</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F8F5FF", padding: 16 },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    title: { fontSize: 26, fontWeight: "bold", color: "#7c3aed" },
    crearBtn: {
        backgroundColor: "#8b5cf6",
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 10,
    },
    crearText: { color: "#fff", fontWeight: "600" },
    sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 12,
        marginBottom: 12,
        elevation: 2,
    },
    cardImage: {
        width: "100%",
        height: 180,
        borderRadius: 10,
        marginBottom: 10,
    },
    cardTitle: { fontSize: 18, fontWeight: "bold", color: "#4f46e5" },
    cardDesc: { color: "#444", marginBottom: 10 },
    cardInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
    },
    meta: { color: "#7c3aed", fontWeight: "600" },
    recaudado: { color: "#059669", fontWeight: "600" },
    fecha: { color: "#7c3aed", fontWeight: "600" },
    fechaValor: { color: "#444" },
    estado: { fontWeight: "600", marginBottom: 6 },
    estadoPendiente: { color: "#eab308" },
    estadoRechazada: { color: "#ef4444" },
    estadoAprobada: { color: "#22c55e" },
    verMasBtn: { alignSelf: "flex-end" },
    verMasText: { color: "#7c3aed", fontWeight: "600" },
    emptyText: { color: "#555", textAlign: "center" },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F8F5FF",
    },
});
