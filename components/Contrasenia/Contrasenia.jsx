import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    ScrollView,
} from "react-native";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { changePassword } from "../../services/auth.service";

export default function Contrasenia() {
    const [formData, setFormData] = useState({
        llave_maestra: "",
        newPassword: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        if (!formData.llave_maestra || !formData.newPassword) {
            Toast.show({
                type: "error",
                text1: "Campos incompletos",
                text2: "Completá todos los campos antes de continuar.",
                position: "top",
            });
            return;
        }

        setLoading(true);
        try {
            const res = await changePassword(
                formData.llave_maestra,
                formData.newPassword
            );

            Toast.show({
                type: "success",
                text1: "Contraseña actualizada ✅",
                text2: "Tu contraseña fue cambiada correctamente.",
                position: "top",
            });

            setTimeout(() => router.replace("/(auth)/iniciarsesion"), 1500);
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Error al cambiar la contraseña",
                text2: error.message || "Intentá nuevamente.",
                position: "top",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                <View style={styles.card}>
                    <Text style={styles.title}>Cambiar contraseña</Text>

                    <Text style={styles.label}>Llave maestra</Text>
                    <TextInput
                        placeholder="Llave maestra"
                        value={formData.llave_maestra}
                        onChangeText={(text) => handleChange("llave_maestra", text)}
                        style={styles.input}
                        autoCapitalize="none"
                    />

                    <Text style={styles.label}>Nueva contraseña</Text>
                    <TextInput
                        placeholder="Nueva contraseña"
                        secureTextEntry
                        value={formData.newPassword}
                        onChangeText={(text) => handleChange("newPassword", text)}
                        style={styles.input}
                    />

                    <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={loading}
                        style={[styles.button, loading && styles.buttonDisabled]}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Cambiar contraseña</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.replace("/(auth)/iniciarsesion")}
                        style={{ marginTop: 20 }}
                    >
                        <Text style={styles.link}>¿Ya tenés cuenta? Iniciá sesión</Text>
                    </TouchableOpacity>


                </View>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f3ff",
        padding: 20,
    },
    card: {
        width: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: 20,
        padding: 24,
        shadowColor: "#8b5cf6",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
        borderWidth: 1,
        borderColor: "#e0e7ff",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 30,
        color: "#6d28d9",
    },
    input: {
        width: "100%",
        backgroundColor: "#f5f3ff",
        borderColor: "#c4b5fd",
        borderWidth: 1,
        borderRadius: 10,
        padding: 14,
        color: "#1e1e2f",
        fontSize: 16,
        marginBottom: 15,
    },
    button: {
        backgroundColor: "#7c3aed",
        paddingVertical: 14,
        borderRadius: 10,
        marginTop: 10,
        alignItems: "center",
        shadowColor: "#8b5cf6",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 5,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 18,
    },
    link: {
        color: "#7c3aed",
        fontWeight: "bold",
        textDecorationLine: "underline",
        textAlign: "center",
    },
    label: {
        color: "#374151",
        fontWeight: "600",
        marginBottom: 6,
        marginTop: 10,
    },
});
