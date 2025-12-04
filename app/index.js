import { useEffect, useState } from "react";
import { Redirect, SplashScreen } from "expo-router";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { checkSession } from "../services/auth.service";

// Evita que el splash screen se oculte antes de cargar el estado de la sesión
SplashScreen.preventAutoHideAsync();

export default function IndexScreen() {
    const [isAuth, setIsAuth] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadSession() {
            try {
                const hasSession = await checkSession();
                setIsAuth(hasSession);
            } catch (error) {
                console.log("Error al cargar la sesión:", error);
                setIsAuth(false);
            } finally {
                setIsLoading(false);
                SplashScreen.hideAsync(); // Ocultar splash al tener el estado de sesión
            }
        }

        loadSession();
    }, []);

    // 1. Mostrar pantalla de carga mientras se verifica el estado de la sesión
    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#7c3aed" />
            </View>
        );
    }

    // 2. Redirección basada en el estado:
    if (isAuth) {
        // Si hay token, enviar a la ruta principal de la aplicación
        return <Redirect href="/(tabs)" />;
    } else {
        // Si NO hay token, forzar al login
        return <Redirect href="/(auth)/iniciarsesion" />;
    }
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f3ff'
    }
});