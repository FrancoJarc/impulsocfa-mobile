import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { logout } from "../../services/auth.service";

export default function PerfilPanelHome() {
    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.card}>
                <Text style={styles.title}>Mi Perfil</Text>

                <TouchableOpacity
                    onPress={() => router.push("/(tabs)/perfilPanel/MisCampanas")}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}> Mis campañas</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.push("/(tabs)/perfilPanel/TodasDonaciones")}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Donaciones recibidas</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.push("/(tabs)/perfilPanel/CreateCampanaForm")}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Crear campaña</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.push("/(tabs)/perfilPanel/UserProfile")}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Editar mi perfil</Text>
                </TouchableOpacity>
                {/* Mis historias */}
                <TouchableOpacity
                    onPress={() => router.push("/(tabs)/perfilPanel/TusHist")}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Tus Historias</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={async () => {
                        await logout();
                        router.replace("/(auth)/iniciarsesion");
                    }}
                    style={[styles.button, styles.logoutButton]}
                >
                    <Text style={[styles.buttonText, styles.logoutText]}>Cerrar sesión</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#F8F5FF" },
    card: { width: "100%", backgroundColor: "rgba(255, 255, 255, 0.95)", borderRadius: 20, padding: 24, shadowColor: "#8b5cf6", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 5, borderWidth: 1, borderColor: "#e0e7ff" },
    title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 25, color: "#6d28d9" },
    button: { backgroundColor: "#f5f3ff", padding: 16, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: "#dcd4ff", shadowColor: "#8b5cf6", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.12, shadowRadius: 6, elevation: 3 },
    buttonText: { fontSize: 18, fontWeight: "600", color: "#4c1d95", textAlign: "center" },
    logoutButton: { backgroundColor: "#fee2e2", borderColor: "#fecaca" },
    logoutText: { color: "#b91c1c" },
});
