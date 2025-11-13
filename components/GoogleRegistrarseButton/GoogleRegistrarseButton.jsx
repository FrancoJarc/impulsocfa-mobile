import React, { useState } from "react";
import Toast from 'react-native-toast-message';
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator } from "react-native";
import { supabase } from "../../supabaseClient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as AuthSession from "expo-auth-session";
import Constants from "expo-constants";

export default function GoogleRegistrarseButton() {
    const [loading, setLoading] = useState(false);

    const loginWithGoogle = async () => {
        setLoading(true);

        Toast.show({
            type: 'info',
            text1: 'Redirigiendo...',
            text2: 'Abriendo Google para iniciar sesión.',
            position: 'top',
        });

        try {
            const redirectTo = AuthSession.makeRedirectUri({ useProxy: false })
            console.log("Redirect URL:", redirectTo);

            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: { redirectTo },
            });

            if (error) {
                console.log("Error en login con Google:", error.message);

                Toast.show({
                    type: 'error',
                    text1: 'Error de autenticación',
                    text2: error.message || "Error al iniciar sesión con Google 😕",
                    position: 'top',
                });
            }

        } catch (err) {
            Toast.show({
                type: 'error',
                text1: 'Error de red',
                text2: "No se pudo conectar con el servicio de Google.",
                position: 'top',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <TouchableOpacity
            onPress={loginWithGoogle}
            style={[styles.button, loading && { opacity: 0.7 }]}
            disabled={loading}
        >
            {loading ? (
                <ActivityIndicator color="#4285F4" />
            ) : (
                <>
                    <MaterialCommunityIcons name="google" size={24} color="#4285F4" />
                    <Text style={styles.buttonText}>
                        Continuar con <Text style={styles.googleText}>Google</Text>
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        padding: 14,
        backgroundColor: "#ffffff",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#e0e0e0",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    buttonText: {
        color: "#1e1e2f",
        fontSize: 16,
        fontWeight: "600",
    },
    googleText: {
        fontWeight: "bold",
        color: "#4285F4", 
    }
});