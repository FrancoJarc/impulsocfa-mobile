import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Animated,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { getAllHistories } from "../../services/history.service";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function TusHist() {
  const router = useRouter();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Obtener userId del token
  const token = globalThis.localStorage?.getItem("access_token");
  let userId = null;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      userId = payload.id || payload.sub || payload.userId;
    } catch (err) {
      console.error("Error leyendo token:", err);
    }
  }

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const allStories = await getAllHistories();
        const userStories = allStories.filter(
          (story) => story.id_usuario == userId
        );
        setStories(userStories);

        // Animación al cargar
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      } catch (err) {
        console.error("Error cargando historias:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchStories();
    else setLoading(false);
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // NO HAY HISTORIAS
  if (!stories.length) {
    return (
      <LinearGradient
        colors={["#ede9fe", "#e0e7ff", "#f5f3ff"]}
        style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}
      >
        <Feather name="book-open" size={64} color="#7c3aed" />
        <Text style={{ fontSize: 20, color: "#374151", marginTop: 16, textAlign: "center" }}>
          No tenés historias aún.
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/historias/FormHist")}
          style={{
            marginTop: 24,
            backgroundColor: "#7c3aed",
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 20,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>Crear historia</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  const screenWidth = Dimensions.get("window").width;
  const cardWidth = screenWidth - 32; // margen de 16 a cada lado

  return (
    <LinearGradient
      colors={["#ede9fe", "#e0e7ff", "#f5f3ff"]}
      style={{ flex: 1, paddingTop: 40 }}
    >
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}>
        <Text style={{ fontSize: 28, fontWeight: "700", color: "#7c3aed", marginBottom: 16 }}>
          Tus historias
        </Text>

        {stories.map((story, index) => (
          <Animated.View
            key={story.id_historia}
            style={{
              opacity: fadeAnim,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
              marginBottom: 20,
            }}
          >
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/historias/VerMasHist",
                  params: { id: story.id_historia },
                })
              }
              style={{
                width: cardWidth,
                backgroundColor: "rgba(255,255,255,0.9)",
                borderRadius: 24,
                padding: 16,
                shadowColor: "#7c3aed",
                shadowOpacity: 0.15,
                shadowOffset: { width: 0, height: 4 },
                shadowRadius: 10,
                elevation: 5,
              }}
            >
              <Image
                source={{
                  uri: story.archivo1 || "https://via.placeholder.com/400x300?text=Sin+imagen",
                }}
                style={{ width: "100%", height: 180, borderRadius: 16, marginBottom: 12 }}
                resizeMode="cover"
              />

              <Text style={{ fontSize: 20, fontWeight: "600", color: "#4f46e5", marginBottom: 6 }}>
                {story.titulo}
              </Text>

              <Text style={{ color: "#374151", marginBottom: 8 }} numberOfLines={3}>
                {story.contenido}
              </Text>

              <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                <Text style={{ color: "#7c3aed", fontWeight: "600" }}>Ver más →</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}
