import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { Video } from "expo-av";
import { getAllHistories } from "../../services/history.service";

export default function LeerHist() {
  const router = useRouter();

  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getAllHistories();
        setStories(data || []);
      } catch (err) {
        console.log("Error cargando historias:", err);
        setStories([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7c3aed" />
        <Text style={styles.loadingText}>Cargando historias...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 80 }}
    >
      {/* HERO */}
      <Animated.View entering={FadeInUp.duration(700)} style={styles.hero}>
        <Text style={styles.heroTitle}>Historias Reales</Text>
        <Text style={styles.heroSubtitle}>
          Conocé experiencias reales de personas que transformaron sus vidas
          gracias a tu apoyo.
        </Text>
      </Animated.View>

      {/* LISTA */}
      <View style={styles.cardsContainer}>
        {stories.map((story, i) => {
          const file = story.archivo1;

          const isVideo =
            file && (file.endsWith(".mp4") ||
              file.endsWith(".mov") ||
              file.endsWith(".avi") ||
              file.endsWith(".webm"));

          return (
            <Animated.View
              key={story.id_historia}
              entering={FadeInUp.delay(i * 120).duration(600)}
              style={styles.card}
            >
              <View style={styles.imageWrapper}>
                {isVideo ? (
                  <Video
                    source={{ uri: file }}
                    style={styles.image}
                    resizeMode="cover"
                    useNativeControls={false}
                    isLooping
                    shouldPlay
                    isMuted={true}
                  />
                ) : (
                  <Image
                    source={
                      file
                        ? { uri: file }
                        : {
                          uri: "https://via.placeholder.com/300x200?text=Sin+Imagen",
                        }
                    }
                    style={styles.image}
                  />
                )}

                <View style={styles.categoryTag}>
                  <Text style={styles.categoryText}>
                    {story.nombre_campana || "Historia"}
                  </Text>
                </View>

                <View style={styles.overlay} />
              </View>

              <View style={styles.cardContent}>
                <Text style={styles.date}>
                  {new Date(story.fecha_creacion).toLocaleDateString("es-AR")}
                </Text>

                <Text style={styles.title}>{story.titulo}</Text>

                <Text style={styles.excerpt}>
                  {story.contenido?.slice(0, 140)}...
                </Text>

                <View style={styles.footer}>
                  <View style={styles.statsRow}>
                    <View style={styles.stat}>
                      <Feather name="eye" size={16} color="#555" />
                      <Text style={styles.statText}>1.9K</Text>
                    </View>

                    <View style={styles.stat}>
                      <Feather name="heart" size={16} color="#e11d48" />
                      <Text style={[styles.statText, { color: "#e11d48" }]}>
                        100
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/historias/VerMasHist",
                        params: { id: story.id_historia },
                      })
                    }
                    style={styles.nextButton}
                  >
                    <Feather name="arrow-right" size={20} color="#7c3aed" />
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          );
        })}
      </View>

      {/* BOTÓN SUBIR */}
      <Animated.View entering={FadeInUp.delay(400)} style={styles.buttonWrapper}>
        <TouchableOpacity
          onPress={() => router.push("/historias/FormHist")}
          style={styles.bigButton}
        >
          <Text style={styles.bigButtonText}>Subí tu Historia</Text>
          <Feather name="arrow-right" size={22} color="#fff" />
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faf5ff",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#faf5ff",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#7c3aed",
    fontWeight: "600",
  },

  hero: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: "center",
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: "bold",
    textAlign: "center",
    color: "#6d28d9",
  },
  heroSubtitle: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
    color: "#444",
    maxWidth: 340,
  },

  cardsContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
    gap: 22,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#6d28d9",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },

  imageWrapper: {
    height: 180,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },

  categoryTag: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#7c3aed",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: "white",
    fontSize: 11,
    fontWeight: "bold",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },

  cardContent: {
    padding: 15,
  },

  date: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e1b4b",
    marginBottom: 6,
  },
  excerpt: {
    fontSize: 14,
    color: "#444",
    marginBottom: 12,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  statsRow: {
    flexDirection: "row",
    gap: 16,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 13,
    color: "#555",
  },

  nextButton: {
    padding: 8,
    borderRadius: 50,
    backgroundColor: "#ede9fe",
  },

  buttonWrapper: {
    marginTop: 30,
    alignItems: "center",
  },
  bigButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#7c3aed",
    paddingVertical: 14,
    paddingHorizontal: 26,
    borderRadius: 16,
    elevation: 3,
  },
  bigButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
