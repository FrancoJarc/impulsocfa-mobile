import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import CountryPicker from "react-native-country-picker-modal";
import Toast from 'react-native-toast-message';
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
    const [showDatePicker, setShowDatePicker] = useState(false);


    const handleChange = (key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleImagePick = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Toast.show({
                type: 'info', 
                text1: 'Permiso requerido',
                text2: 'Necesitas permitir el acceso a tus fotos.',
                position: 'top',
            });
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
            Toast.show({
                type: 'error',
                text1: 'Campos incompletos',
                text2: 'Por favor completa todos los campos obligatorios.',
                position: 'top',
            });
            return;
        }

        setLoading(true);
        try {
            await registerUser(formData);

            Toast.show({
                type: 'success',
                text1: '¡Registro exitoso! 🎉',
                text2: 'Revisa tu correo para confirmar tu cuenta.',
                position: 'top',
                visibilityTime: 6000, // Lo muestro un poco más de tiempo.
            });

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
            console.log("No se pudo registrar", error);
            Toast.show({
                type: 'error',
                text1: 'Error al registrarse 😕',
                text2: error.message || "Error desconocido al registrarse.",
                position: 'top',
            });
        } finally {
            setLoading(false);
        }
    };

  
    return (
        <View style={styles.formContainer}>
            {/* ... JSX del formulario ... */}
            <View style={styles.row}>
                {/* ... Nombre ... */}
                <View style={styles.halfInput}>
                    <Text style={styles.label}>Nombre</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.nombre}
                        onChangeText={(v) => handleChange("nombre", v)}
                        placeholder="Tu nombre"
                    />
                </View>
                {/* ... Apellido ... */}
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
            
            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(v) => handleChange("email", v)}
                placeholder="Ingresa tu correo"
                keyboardType="email-address"
                autoCapitalize="none"
            />

            {/* Contraseña */}
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
                style={styles.input}
                value={formData.password}
                onChangeText={(v) => handleChange("password", v)}
                placeholder="Crea una contraseña"
                secureTextEntry
            />

            {/* Fecha de nacimiento */}
            <Text style={styles.label}>Fecha de nacimiento</Text>
            <TouchableOpacity
                style={styles.input}
                onPress={() => setShowDatePicker(true)}
            >
                <Text>
                    {formData.fecha_nacimiento
                        ? formData.fecha_nacimiento
                        : "Selecciona tu fecha de nacimiento"}
                </Text>
            </TouchableOpacity>

            {showDatePicker && (
                <DateTimePicker
                    value={
                        formData.fecha_nacimiento
                            ? new Date(formData.fecha_nacimiento)
                            : new Date()
                    }
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) {
                            const isoDate = selectedDate.toISOString().split("T")[0];
                            handleChange("fecha_nacimiento", isoDate);
                        }
                    }}
                    maximumDate={new Date()} 
                />
            )}


            {/* Nacionalidad - Country Picker */}
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
                withAlphaFilter
                withCountryNameButton={false}
                renderFlagButton={() => null} 
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
        color: "#374151",
        borderColor: "#c4b5fd",
        borderWidth: 1,
        borderRadius: 10,
        padding: 12,
    },
    row: {
        flexDirection: "row",
        gap: 10,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    halfInput: {
        flex: 1,
        marginRight: 5, // para espaciar
    },
    countryButton: {
        backgroundColor: "#ede9fe",
        borderColor: "#c4b5fd",
        borderWidth: 1,
        borderRadius: 10,
        padding: 12,
    },
    countryText: {
        color: "#374151",
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
