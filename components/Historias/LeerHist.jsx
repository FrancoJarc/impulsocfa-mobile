import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { getAllHistories } from "../../services/history.service";

export default function LeerHist() {
  const router = useRouter();
  const [stories, setStories] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await getAllHistories();
        setStories(data);
      } catch (err) {
        console.log("Error cargando historias:", err);
      }
    }
    load();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>

      {/* HERO */}
      <Animated.View entering={FadeInUp.duration(700)} style={styles.hero}>
        <Text style={styles.heroTitle}>Historias Reales</Text>
        <Text style={styles.heroSubtitle}>
          Conocé experiencias reales de personas que transformaron sus vidas gracias a tu apoyo.
        </Text>
      </Animated.View>

      {/* LISTA DE HISTORIAS */}
      <View style={styles.cardsContainer}>
        {stories.map((story, i) => {
          const image = story.archivo1
            ? { uri: story.archivo1 }
            : { uri: "https://via.placeholder.com/300x200?text=Sin+Imagen" };

          return (
            <Animated.View
              key={story.id_historia}
              entering={FadeInUp.delay(i * 120).duration(600)}
              style={styles.card}
            >
              {/* Imagen */}
              <View style={styles.imageWrapper}>
                <Image source={image} style={styles.image} />

                <View style={styles.categoryTag}>
                  <Text style={styles.categoryText}>
                    {story.nombre_campana || "Historia"}
                  </Text>
                </View>

                <View style={styles.overlay} />
              </View>

              {/* Content */}
              <View style={styles.cardContent}>
                <Text style={styles.date}>
                  {new Date(story.fecha_creacion).toLocaleDateString("es-AR")}
                </Text>

                <Text style={styles.title}>{story.titulo}</Text>

                <Text style={styles.excerpt}>
                  {story.contenido?.slice(0, 140)}...
                </Text>

                {/* Autor */}
                <View style={styles.authorRow}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {(story.nombre_autor?.charAt(0) || "?").toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.authorName}>
                    {story.nombre_autor || "Anónimo"}
                  </Text>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                  <View style={styles.statsRow}>
                    <View style={styles.stat}>
                      <Feather name="eye" size={16} color="#555" />
                      <Text style={styles.statText}>1.2K</Text>
                    </View>

                    <View style={styles.stat}>
                      <Feather name="heart" size={16} color="#e11d48" />
                      <Text style={[styles.statText, { color: "#e11d48" }]}>
                        120
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() =>
                      router.push(`/historias/VerMasHist/${story.id_historia}`)
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

      {/* BOTÓN SUBIR HISTORIA */}
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

  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e9d5ff",
    marginBottom: 10,
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 999,
    backgroundColor: "#8b5cf6",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "white",
    fontWeight: "bold",
  },
  authorName: {
    marginLeft: 10,
    fontWeight: "600",
    color: "#333",
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
