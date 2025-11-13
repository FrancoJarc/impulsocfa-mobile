import { useEffect, useState } from "react";
import {
    View,
    Text,
    Image,
    FlatList,
    StyleSheet,
} from "react-native";
import Toast from "react-native-toast-message";
import { getLatestDonations } from "../../services/campaign.service";

export default function UltimasDonaciones({ id_campana }) {
    const [donaciones, setDonaciones] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getLatestDonations(id_campana);
                setDonaciones(data);
            } catch (error) {
                Toast.show({
                    type: "error",
                    text1: "Error",
                    text2: "No se pudieron cargar las últimas donaciones",
                });
            }
        };

        fetchData();
    }, [id_campana]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Últimas donaciones</Text>

            {donaciones.length === 0 ? (
                <Text style={styles.emptyText}>Aún no hay donaciones</Text>
            ) : (
                <FlatList
                    data={donaciones}
                    keyExtractor={(item) => item.id_donacion.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <View style={styles.userRow}>
                                <Image
                                    source={{
                                        uri:
                                            item.usuario?.foto_perfil ||
                                            "https://via.placeholder.com/150",
                                    }}
                                    style={styles.avatar}
                                />
                                <Text style={styles.userName}>
                                    {item.usuario?.nombre} {item.usuario?.apellido}
                                </Text>
                            </View>

                            <Text style={styles.amount}>
                                $
                                {item.monto.toLocaleString("es-AR", {
                                    minimumFractionDigits: 0,
                                })}
                            </Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        marginTop: 16,
        elevation: 3,
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        color: "#444",
        marginBottom: 12,
    },
    emptyText: {
        color: "#777",
        fontSize: 14,
    },
    item: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: "#eee",
    },
    userRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
    userName: {
        fontSize: 14,
        fontWeight: "500",
        color: "#333",
    },
    amount: {
        fontSize: 15,
        fontWeight: "700",
        color: "green",
    },
});
