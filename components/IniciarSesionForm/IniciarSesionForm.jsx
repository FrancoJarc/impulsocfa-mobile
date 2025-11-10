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
import GoogleRegistrarseButton from "../GoogleRegistrarseButton/GoogleRegistrarseButton";

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


        const toastId = Toast.show({
            type: 'info', 
            text1: "Verificando credenciales...",
            text2: "Iniciando sesión.",
            position: 'top',
            autoHide: false, 
            visibilityTime: 99999, 
        });

        try {
            const data = await login(formData.email, formData.password);
            console.log("Usuario logueado:", data);

            Toast.hide(toastId);
            Toast.show({
                type: 'success',
                text1: "¡Inicio de sesión exitoso! 🚀",
                visibilityTime: 3000,
            });

            setTimeout(() => router.replace("/(tabs)"), 800);

        } catch (error) {
            console.error("Error al iniciar sesión:", error.message);

            Toast.hide(toastId);
            Toast.show({
                type: 'error',
                text1: "Error al iniciar sesión 😕",
                text2: "Verificá tus datos o la conexión.",
                visibilityTime: 4000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
            <View style={styles.card}>
                <Text style={styles.title}>Iniciar Sesión</Text>

                <View style={styles.form}>
                    <TextInput
                        required
                        keyboardType="email-address"
                        autoCapitalize="none"
                        name="email"
                        placeholder="E-mail"
                        value={formData.email}
                        onChangeText={(v) => handleChange("email", v)}
                        style={styles.input}
                    />


                    <TextInput
                        required
                        secureTextEntry
                        name="password"
                        placeholder="Contraseña"
                        value={formData.password}
                        onChangeText={(v) => handleChange("password", v)}
                        style={styles.input}
                    />

                    <View style={styles.forgotPasswordContainer}>

                        {/* Asumiendo que crearás app/(auth)/recuperar-contrasenia.jsx */}
                        <Link href="/(auth)/recuperar-contrasenia" style={styles.forgotPasswordLink}>
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </View>


                    <TouchableOpacity
                        onPress={handleSubmit}
                        style={[styles.button, loading && styles.buttonDisabled]}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Iniciar Sesión</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.separatorContainer}>
                    <View style={styles.separatorLine} />
                    <Text style={styles.separatorText}>O continúa con</Text>
                    <View style={styles.separatorLine} />
                </View>


                <View style={styles.googleButtonWrapper}>
                    <GoogleRegistrarseButton />
                </View>


                <View style={styles.registerContainer}>
                    <Text style={styles.registerText}>¿No tenés cuenta? </Text>
                    <Link href="/(auth)/registrarse" style={styles.registerLink}>
                        Registrate
                    </Link>
                </View>
            </View>
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f3ff',
        padding: 20,
    },
    card: {
        width: "100%",
        maxWidth: 400,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: 20,
        padding: 24,
        shadowColor: "#8b5cf6",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#e0e7ff',
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 30,
        color: "#6d28d9",
    },
    form: {
        gap: 20,
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
    },
    forgotPasswordContainer: {
        alignItems: 'flex-end',
        marginTop: -10,
    },
    forgotPasswordLink: {
        color: "#7c3aed",
        fontSize: 14,
        textDecorationLine: 'underline',
    },
    button: {
        marginTop: 10,
        backgroundColor: "#a78bfa",
        padding: 14,
        borderRadius: 10,
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
    separatorContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 25,
    },
    separatorLine: {
        flex: 1,
        height: 1,
        backgroundColor: "#e0e7ff",
    },
    separatorText: {
        marginHorizontal: 15,
        color: "#6b7280",
        fontSize: 14,
    },
    googleButtonWrapper: {
        marginBottom: 20,
    },
    registerContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
    },
    registerText: {
        color: "#555",
        fontSize: 14,
    },
    registerLink: {
        color: "#7c3aed",
        fontWeight: "bold",
        fontSize: 14,
    },
});