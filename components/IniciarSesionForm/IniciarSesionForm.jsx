import React, { useState } from "react";
import { Link, useRouter } from "expo-router";
import Toast from 'react-native-toast-message';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
} from "react-native";
import { login } from "../../services/auth.service";

export default function IniciarSesionForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (key, value) => {
        setFormData({ ...formData, [key]: value });
    };

    const handleSubmit = async () => {
        setLoading(true);

        if (!formData.email || !formData.password) {
            setLoading(false);
            Toast.show({
                type: 'error',
                text1: 'Campos incompletos',
                text2: 'Por favor, ingresa tu email y contraseña.',
            });
            return;
        }

        try {
            await login(formData.email, formData.password);
            router.replace("/(tabs)");
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: "Error al iniciar sesión",
                text2: "Verificá tus datos.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
            <View style={styles.card}>
                <Text style={styles.title}>Iniciar Sesión</Text>

                <View style={styles.form}>
                    <TextInput
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholder="E-mail"
                        multiline={false}
                        numberOfLines={1}
                        scrollEnabled={true}
                        placeholderTextColor="#6b7280"
                        value={formData.email}
                        onChangeText={(v) => handleChange("email", v)}
                        style={styles.input}
                    />

                    <TextInput
                        secureTextEntry
                        multiline={false}
                        numberOfLines={1}
                        scrollEnabled={true}
                        placeholder="Contraseña"
                        placeholderTextColor="#6b7280"
                        value={formData.password}
                        onChangeText={(v) => handleChange("password", v)}
                        style={styles.input}
                    />

                    <View style={styles.forgotPasswordContainer}>
                        <Link
                            href="/(auth)/recuperarcontrasenia"
                            style={styles.forgotPasswordLink}
                        >
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </View>

                    <TouchableOpacity
                        onPress={handleSubmit}
                        style={[styles.button, loading && styles.buttonDisabled]}
                        disabled={loading}
                        activeOpacity={0.85}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Iniciar Sesión</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.registerContainer}>
                    <Text style={styles.registerText}>¿No tenés cuenta? </Text>
                    <Link href="/(auth)/registrarse" style={styles.registerLink}>
                        Registrate
                    </Link>
                </View>
            </View>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        width: "100%",
        alignItems: "center",
    },

    // ⬅️ MÁS GRANDE
    card: {
        width: "100%",
        maxWidth: 460,
        alignSelf: "center",
        backgroundColor: "rgba(255,255,255,0.95)",
        borderRadius: 24,
        padding: 40,
        shadowColor: "#8b5cf6",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 6,
        borderWidth: 1,
        borderColor: "#e0e7ff",
    },

    title: {
        fontSize: 30,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 32,
        color: "#6d28d9",
    },

    form: {
        gap: 24,
    },

    input: {
        width: "100%",
        maxWidth: "100%",
        backgroundColor: "#f5f3ff",
        borderColor: "#c4b5fd",
        borderWidth: 1,
        borderRadius: 14,
        paddingVertical: 16,
        paddingHorizontal: 18,
        color: "#1e1e2f",
        fontSize: 17,
    },

    forgotPasswordContainer: {
        alignItems: "center",
        marginTop: 6,
    },

    forgotPasswordLink: {
        color: "#7c3aed",
        fontSize: 15,
        textDecorationLine: "underline",
    },

    button: {
        marginTop: 12,
        backgroundColor: "#7c3aed",
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: "center",
        shadowColor: "#8b5cf6",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 6,
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

    registerContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 22,
    },

    registerText: {
        color: "#555",
        fontSize: 15,
    },

    registerLink: {
        color: "#7c3aed",
        fontWeight: "bold",
        fontSize: 15,
    },
});
