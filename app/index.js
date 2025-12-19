import { useEffect, useState } from "react";
import { SplashScreen, useRouter } from "expo-router";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { checkSession } from "../services/auth.service";

SplashScreen.preventAutoHideAsync();

export default function IndexScreen() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadSession() {
            try {
                const hasSession = await checkSession();

                if (hasSession) {
                    router.replace("/(tabs)");
                } else {
                    router.replace("/(auth)/iniciarsesion");
                }
            } catch (error) {
                router.replace("/(auth)/iniciarsesion");
            } finally {
                setIsLoading(false);
                SplashScreen.hideAsync();
            }
        }

        loadSession();
    }, []);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#7c3aed" />
            </View>
        );
    }

    return null; 
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f3ff",
    },
});
