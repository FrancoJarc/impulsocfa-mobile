import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import CountryPicker from "react-native-country-picker-modal";
import { registerUser } from "../../services/auth.service";

export default function RegistrarseForm() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        nombre: "",
        apellido: "",
        fecha_nacimiento: "",
        foto_perfil: null,
        nacionalidad: "",
    });
    const [loading, setLoading] = useState(false);
    const [showCountryPicker, setShowCountryPicker] = useState(false);

    const handleChange = (key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleImagePick = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert("Permiso requerido", "Necesitas permitir el acceso a tus fotos.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 0.7,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });

        if (!result.canceled) {
            handleChange("foto_perfil", result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {
        if (!formData.email || !formData.password || !formData.nombre || !formData.apellido) {
            Alert.alert("Campos incompletos", "Por favor completa todos los campos obligatorios.");
            return;
        }

        setLoading(true);
        try {
            await registerUser(formData);
            Alert.alert("Éxito", "¡Registro exitoso! 🎉 Revisa tu correo para confirmar tu cuenta.");

            // Limpiar formulario
            setFormData({
                email: "",
                password: "",
                nombre: "",
                apellido: "",
                fecha_nacimiento: "",
                foto_perfil: null,
                nacionalidad: "",
            });
        } catch (error) {
            Alert.alert("Error", error.message || "Error al registrarse 😕");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.formContainer}>
            {/* Nombre y Apellido */}
            <View style={styles.row}>
                <View style={styles.halfInput}>
                    <Text style={styles.label}>Nombre</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.nombre}
                        onChangeText={(v) => handleChange("nombre", v)}
                        placeholder="Tu nombre"
                    />
                </View>
                <View style={styles.halfInput}>
                    <Text style={styles.label}>Apellido</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.apellido}
                        onChangeText={(v) => handleChange("apellido", v)}
                        placeholder="Tu apellido"
                    />
                </View>
            </View>

            {/* Email */}
            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput
                style={styles.input}
                keyboardType="email-address"
                value={formData.email}
                onChangeText={(v) => handleChange("email", v)}
                placeholder="tuemail@ejemplo.com"
                autoCapitalize="none"
            />

            {/* Contraseña */}
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
                style={styles.input}
                secureTextEntry
                value={formData.password}
                onChangeText={(v) => handleChange("password", v)}
                placeholder="Crea una contraseña"
            />

            {/* Fecha nacimiento */}
            <Text style={styles.label}>Fecha de nacimiento</Text>
            <TextInput
                style={styles.input}
                placeholder="AAAA-MM-DD"
                value={formData.fecha_nacimiento}
                onChangeText={(v) => handleChange("fecha_nacimiento", v)}
            />

            {/* Nacionalidad */}
            <Text style={styles.label}>Nacionalidad</Text>
            <TouchableOpacity
                style={styles.countryButton}
                onPress={() => setShowCountryPicker(true)}
            >
                <Text style={styles.countryText}>
                    {formData.nacionalidad ? formData.nacionalidad : "Selecciona tu país"}
                </Text>
            </TouchableOpacity>

            <CountryPicker
                visible={showCountryPicker}
                withFilter
                withFlag
                withCountryNameButton
                withAlphaFilter
                onSelect={(country) => {
                    handleChange("nacionalidad", country.name);
                    setShowCountryPicker(false);
                }}
                onClose={() => setShowCountryPicker(false)}
            />

            {/* Foto perfil */}
            <Text style={styles.label}>Foto de perfil</Text>
            <TouchableOpacity style={styles.imagePicker} onPress={handleImagePick}>
                {formData.foto_perfil ? (
                    <Image source={{ uri: formData.foto_perfil }} style={styles.profileImage} />
                ) : (
                    <Text style={styles.imageText}>Seleccionar imagen</Text>
                )}
            </TouchableOpacity>

            {/* Botón enviar */}
            <TouchableOpacity
                style={[styles.button, loading && { opacity: 0.6 }]}
                onPress={handleSubmit}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Registrarse</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    formContainer: {
        width: "100%",
        marginTop: 10,
    },
    label: {
        color: "#374151",
        fontWeight: "600",
        marginBottom: 6,
        marginTop: 10,
    },
    input: {
        backgroundColor: "#ede9fe",
        borderColor: "#c4b5fd",
        borderWidth: 1,
        borderRadius: 10,
        padding: 12,
    },
    row: {
        flexDirection: "row",
        gap: 10,
    },
    halfInput: {
        flex: 1,
    },
    countryButton: {
        backgroundColor: "#ede9fe",
        borderColor: "#c4b5fd",
        borderWidth: 1,
        borderRadius: 10,
        padding: 12,
    },
    countryText: {
        color: "#1e1e2f",
    },
    imagePicker: {
        backgroundColor: "#ede9fe",
        borderStyle: "dashed",
        borderWidth: 1,
        borderColor: "#c4b5fd",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
    },
    imageText: {
        color: "#7c3aed",
        fontWeight: "600",
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    button: {
        backgroundColor: "#8b5cf6",
        padding: 14,
        borderRadius: 10,
        marginTop: 20,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
});
