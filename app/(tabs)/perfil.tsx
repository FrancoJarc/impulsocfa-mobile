import { View, Text, StyleSheet, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { logout } from '../../services/auth.service';
import Toast from 'react-native-toast-message';


export default function Perfil() {
    const handleLogout = async () => {
        try {
            await logout();
            router.replace('/(auth)/iniciarsesion');

        } catch (error) {
            console.log("Error durante el logout:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Perfil del Usuario</Text>
            <Button title="Cerrar Sesión" onPress={handleLogout} color="#dc2626" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F8F5FF" },
    title: { fontSize: 24, fontWeight: "bold", color: "#7c3aed", marginBottom: 20 },
});
