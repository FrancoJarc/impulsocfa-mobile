import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import RegistrarseForm from "../../components/RegistrarseForm/RegistrarseForm";
import GoogleRegistrarseButton from "../../components/GoogleRegistrarseButton/GoogleRegistrarseButton";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar"; 

export default function Registrarse() {
    const router = useRouter();

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
        >
            {/* Fondo con degradado simulado */}
            <View style={styles.background} />

            <View style={styles.card}>
                <Text style={styles.title}>Crear Cuenta</Text>

                {/* Formulario de registro */}
                <RegistrarseForm />

                {/*
       
                <View style={styles.separatorContainer}>
                    <View style={styles.separatorLine} />
                    <Text style={styles.separatorText}>O continúa con</Text>
                    <View style={styles.separatorLine} />
                </View>


                <View style={{ marginTop: 16 }}>
                    <GoogleRegistrarseButton />
                </View>
                */}
            
                {/* Link a inicio de sesión */}
                <View style={styles.loginContainer}>
                    <Text style={styles.loginText}>¿Ya tenés cuenta? </Text>
                    <TouchableOpacity onPress={() => router.push("/(auth)/iniciarsesion")}>
                        <Text style={styles.loginLink}>Iniciá sesión</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f3ff", // violeta claro
        padding: 20,
    },
    background: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "#f0f4ff",
    },
    card: {
        width: "100%",
        maxWidth: 400,
        backgroundColor: "rgba(255,255,255,0.9)",
        borderRadius: 20,
        padding: 20,
        shadowColor: "#8b5cf6",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: "#6d28d9", // violeta
    },
    separatorContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20,
    },
    separatorLine: {
        flex: 1,
        height: 1,
        backgroundColor: "#ddd",
    },
    separatorText: {
        marginHorizontal: 10,
        color: "#666",
        fontSize: 14,
    },
    loginContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 16,
    },
    loginText: {
        color: "#555",
    },
    loginLink: {
        color: "#7c3aed",
        fontWeight: "bold",
    },
});
