import React, { useEffect, useState } from "react";
import { TouchableOpacity, Text, View,StyleSheet, ActivityIndicator } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { supabase } from "../../supabaseClient";
import { googleCallbackMobile } from "../../services/auth.service";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

export default function GoogleRegistrarseButton() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const { data: { subscription } } =
            supabase.auth.onAuthStateChange(async (event, session) => {
                if (event === "SIGNED_IN" && session) {
                    try {
                        await googleCallbackMobile(session.access_token);

                        Toast.show({
                            type: "success",
                            text1: "Sesión iniciada con Google",
                        });

                        router.replace("/(tabs)");
                    } catch (err) {
                        setLoading(false);
                        Toast.show({
                            type: "error",
                            text1: "Error al validar usuario",
                            text2: err.message,
                        });
                    }
                }
            });

        return () => subscription.unsubscribe();
    }, []);

    const loginWithGoogle = async () => {
        try {
            setLoading(true);

            const redirectTo = AuthSession.makeRedirectUri({
                scheme: "impulsocfamobile",
                path: "auth",
            });

            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo,
                    skipBrowserRedirect: true,
                },
            });

            if (error) throw error;

            // 🔥 ACÁ estaba el problema: data ahora sí existe
            await WebBrowser.openAuthSessionAsync(
                data.url,
                redirectTo
            );

        } catch (err) {
            console.log(err);
            setLoading(false);
            Toast.show({
                type: "error",
                text1: "Error con Google",
            });
        }
    };

    return (
        <TouchableOpacity
            onPress={loginWithGoogle}
            style={[styles.button, loading && { opacity: 0.7 }]}
            disabled={loading}
            activeOpacity={0.8}
        >
            <View
                style={[
                    styles.content,
                    loading && { opacity: 0 }
                ]}
            >
                <MaterialCommunityIcons name="google" size={24} color="#4285F4" />
                <Text style={styles.text}>
                    Continuar con <Text style={styles.google}>Google</Text>
                </Text>
            </View>

            {loading && (
                <ActivityIndicator
                    size="small"
                    color="#4285F4"
                    style={styles.spinner}
                />
            )}
        </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    button: {
        flexDirection: "row",
        padding: 14,
        borderRadius: 10,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#e0e0e0",
        position: "relative", // 👈 CLAVE
    },
    content: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    spinner: {
        position: "absolute",
    },
    text: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1e1e2f",
    },
    google: {
        color: "#4285F4",
        fontWeight: "bold",
    },
});