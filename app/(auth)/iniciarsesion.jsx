// app/iniciarsesion.jsx
import React from "react";
import IniciarSesionForm from "../../components/IniciarSesionForm/IniciarSesionForm";
import { ScrollView, StyleSheet, View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function IniciarSesionScreen() {
    return (
        <>
            <StatusBar style="dark" />
            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.cardWrapper} />
                <IniciarSesionForm />

            </ScrollView>
        </>
    );
}


const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f3ff', 
        padding: 20,
    },
    cardWrapper: {
        width: "100%",
        maxWidth: 400,
    },
});