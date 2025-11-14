import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function CardCampana({ campana }) {
    const router = useRouter();

    const imagenes = [campana.foto1, campana.foto2, campana.foto3].filter(Boolean);
    const [currentIndex, setCurrentIndex] = useState(0);
    const intervalRef = useRef(null);

    const handlePressIn = () => {
        if (imagenes.length > 1 && !intervalRef.current) {
            intervalRef.current = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % imagenes.length);
            }, 2000);
        }
    };

    const handlePressOut = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setCurrentIndex(0);
    };

    const imagen =
        imagenes[currentIndex] ||
        "https://via.placeholder.com/400x300?text=Sin+imagen";

    return (
        <Pressable
            style={({ pressed }) => [
                styles.card,
                pressed && { transform: [{ scale: 1.03 }] },
            ]}
            onPress={() => router.push(`/(campanas)/DetalleCampana?id=${campana.id_campana}`)}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
        >
            {/* Imagen principal */}
            <View style={styles.imageContainer}>
                <Image source={{ uri: imagen }} style={styles.image} />

                {/* Dots */}
                {imagenes.length > 1 && (
                    <View style={styles.dots}>
                        {imagenes.map((_, i) => (
                            <View
                                key={i}
                                style={[
                                    styles.dot,
                                    currentIndex === i && styles.dotActive,
                                ]}
                            />
                        ))}
                    </View>
                )}
            </View>

            {/* Título */}
            <Text style={styles.title}>{campana.titulo}</Text>

            {/* Descripción */}
            <Text style={styles.description} numberOfLines={3}>
                {campana.descripcion}
            </Text>

            <Text style={styles.link}>Ver más →</Text>
        </Pressable>
    );
}

// 🔵 Estilos visualmente parecidos a Tailwind web
const styles = StyleSheet.create({
    card: {
        backgroundColor: "#f5f3ff",
        borderRadius: 20,
        padding: 16,
        shadowColor: "#7c3aed",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        borderWidth: 1,
        borderColor: "#ddd6fe",
        marginBottom: 20,
        transition: "all 0.2s",
    },
    imageContainer: {
        height: 180,
        width: "100%",
        borderRadius: 12,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#ddd6fe",
        marginBottom: 12,
    },
    image: {
        width: "100%",
        height: "100%",
    },
    dots: {
        position: "absolute",
        bottom: 8,
        left: "50%",
        transform: [{ translateX: -50 }],
        flexDirection: "row",
        gap: 6,
    },
    dot: {
        width: 8,
        height: 8,
        backgroundColor: "#ddd6fe",
        borderRadius: 50,
    },
    dotActive: {
        backgroundColor: "#7c3aed",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#4f46e5",
        marginBottom: 6,
    },
    description: {
        color: "#374151",
        marginBottom: 8,
    },
    link: {
        color: "#7c3aed",
        fontWeight: "bold",
    },
});
