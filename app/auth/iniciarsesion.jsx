// app/iniciarsesion.jsx
import React from "react";
import IniciarSesionForm from "../components/IniciarSesionForm/IniciarSesionForm";
import { ScrollView, StyleSheet } from "react-native";

export default function IniciarSesionScreen() {
    return (
        // Usamos ScrollView para manejar teclados y que el contenido sea responsive
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <IniciarSesionForm />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f3ff', // Debe coincidir con el color de fondo de tu formulario
        padding: 20,
    },
});