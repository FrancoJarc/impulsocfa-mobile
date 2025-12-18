import React, { useEffect, useState } from "react";
import { TouchableOpacity, Text, View, StyleSheet, ActivityIndicator } from "react-native";
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

    const redirectUri = AuthSession.makeRedirectUri({
        scheme: "impulsocfamobile",
        path: "auth",
    });

    useEffect(() => {
        const { data: { subscription } } =
            supabase.auth.onAuthStateChange(async (event, session) => {
                if (event === "SIGNED_IN" && session) {
                    try {
                        const result = await googleCallbackMobile(session.access_token);

                        Toast.show({
                            type: "success",
                            text1: "Sesión iniciada con Google",
                        });

                        if (result.isNewUser) {
                            router.replace("/(auth)/MostrarLlaveMaestra");
                        } else {
                            router.replace("/(tabs)");
                        }
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

            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: redirectUri,
                    skipBrowserRedirect: true,
                },
            });

            if (error) throw error;

            await WebBrowser.openAuthSessionAsync(
                data.url,
                redirectUri
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
            <View style={[styles.content, loading && { opacity: 0 }]}>
                <MaterialCommunityIcons name="google" size={24} color="#4285F4" />
                <Text style={styles.text}>
                    Continuar con <Text style={styles.google}>Google</Text>
                </Text>
            </View>

            {loading && (
                <ActivityIndicator size="small" color="#4285F4" style={styles.spinner} />
            )}
        </TouchableOpacity>
    );
}
