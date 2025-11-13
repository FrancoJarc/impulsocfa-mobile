import React from "react";
import Contrasenia from "../../components/Contrasenia/Contrasenia";
import { ScrollView, StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function RecuperarContrasenia() {
    return (
        <>
            <StatusBar style="dark" />
            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.cardWrapper}>
                    <Contrasenia />
                </View>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f3ff",
        padding: 20,
    },
    cardWrapper: {
        width: "100%",
        maxWidth: 400,
    },
});