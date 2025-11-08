import React, { useState } from "react";
import Toast from 'react-native-toast-message';
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator } from "react-native";
import { supabase } from "../../supabaseClient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function GoogleRegistrarseButton() {
    const [loading, setLoading] = useState(false);

    const loginWithGoogle = async () => {
        setLoading(true);

        // 2. Mostrar toast de carga (Reemplaza toast.loading de react-hot-toast)
        Toast.show({
            type: 'info',
            text1: 'Redirigiendo...',
            text2: 'Abriendo Google para iniciar sesión.',
            position: 'top',
            // Usamos un ID único para poder ocultarlo después si es necesario
            // Aunque en móvil, la app se suspende al abrir el navegador.
        });

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    // 3. CAMBIO CLAVE: Usar el esquema de redirección móvil
                    // Debe coincidir con lo que registraste en Supabase
                    redirectTo: "impulsocfamobile://google-callback",
                },
            });

            if (error) {
                // 4. Reemplazar console.error y toast.error por Toast.show()
                console.error("Error en login con Google:", error.message);

                // Mostrar error si la llamada falla antes de salir de la app
                Toast.show({
                    type: 'error',
                    text1: 'Error de autenticación',
                    text2: error.message || "Error al iniciar sesión con Google 😕",
                    position: 'top',
                });
            }

            // Si tiene éxito, la app se suspende y el usuario se redirige al navegador.
            // La notificación de éxito se mostrará al regresar (en tu componente de manejo de callback).

        } catch (err) {
            Toast.show({
                type: 'error',
                text1: 'Error de red',
                text2: "No se pudo conectar con el servicio de Google.",
                position: 'top',
            });
        } finally {
            setLoading(false);
            // Normalmente no se oculta el toast aquí, ya que la navegación a Google ocurre
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