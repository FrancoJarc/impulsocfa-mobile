import React from "react";
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

export default function LeerHist() {
  const router = useRouter();

  const stories = [
    {
      author: "María García",
      title: "Cómo reconstruimos nuestro hogar",
      excerpt:
        "Después de las inundaciones, creíamos que todo estaba perdido. Gracias a esta comunidad, hoy mi familia tiene un nuevo comienzo.",
      image: require("../../assets/images/family-home-reconstruction.jpg"),
      date: "15 de noviembre, 2024",
      views: 2340,
      likes: 892,
      category: "Hogares",
    },
    {
      author: "Carlos Mendez",
      title: "La educación cambió la vida de mis hijos",
      excerpt:
        "Recibir útiles y apoyo educativo fue transformacional. Ahora mis hijos pueden seguir estudiando sin limitaciones.",
      image: require("../../assets/images/students-school-learning.jpg"),
      date: "10 de noviembre, 2024",
      views: 1856,
      likes: 745,
      category: "Educación",
    },
    {
      author: "Ana López",
      title: "Juntos restauramos nuestra comunidad",
      excerpt:
        "El espacio comunitario renovado se ha convertido en el corazón de nuestro barrio.",
      image: require("../../assets/images/community-center-people.jpg"),
      date: "05 de noviembre, 2024",
      views: 3120,
      likes: 1203,
      category: "Comunidad",
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 80 }}
    >
      {/* Hero */}
      <Animated.View entering={FadeInUp.duration(700)} style={styles.hero}>
        <Text style={styles.heroTitle}>Historias Reales</Text>
        <Text style={styles.heroSubtitle}>
          Conocé experiencias reales de personas que transformaron sus vidas
          gracias a tu apoyo.
        </Text>
      </Animated.View>

      {/* Grid-like list */}
      <View style={styles.cardsContainer}>
        {stories.map((story, i) => (
          <Animated.View
            entering={FadeInUp.delay(i * 120).duration(600)}
            key={i}
            style={styles.card}
          >
            {/* Image */}
            <View style={styles.imageWrapper}>
              <Image source={story.image} style={styles.image} />
              <View style={styles.categoryTag}>
                <Text style={styles.categoryText}>{story.category}</Text>
              </View>
              <View style={styles.overlay} />
            </View>

            {/* Content */}
            <View style={styles.cardContent}>
              <Text style={styles.date}>{story.date}</Text>
              <Text style={styles.title}>{story.title}</Text>
              <Text style={styles.excerpt}>{story.excerpt}</Text>

              {/* Author */}
              <View style={styles.authorRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {story.author.charAt(0)}
                  </Text>
                </View>
                <Text style={styles.authorName}>{story.author}</Text>
              </View>

              {/* Stats + Button */}
              <View style={styles.footer}>
                <View style={styles.statsRow}>
                  <View style={styles.stat}>
                    <Feather name="eye" size={16} color="#555" />
                    <Text style={styles.statText}>
                      {(story.views / 1000).toFixed(1)}K
                    </Text>
                  </View>

                  <View style={styles.stat}>
                    <Feather name="heart" size={16} color="#e11d48" />
                    <Text style={[styles.statText, { color: "#e11d48" }]}>
                      {story.likes}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => router.push("/historias/VerMasHist")}
                  style={styles.nextButton}
                >
                  <Feather name="arrow-right" size={20} color="#7c3aed" />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        ))}
      </View>

      {/* Button: Subir Historia */}
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
    backgroundColor: "white",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e9d5ff",
    shadowColor: "#7c3aed",
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },

  imageWrapper: {
    height: 160,
    overflow: "hidden",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#ddd",
  },

  image: {
    height: "100%",
    width: "100%",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
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
    fontSize: 10,
    fontWeight: "600",
  },

  cardContent: {
    padding: 15,
  },

  date: {
    fontSize: 11,
    color: "#6b7280",
    marginBottom: 6,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 6,
  },

  excerpt: {
    fontSize: 13,
    color: "#4b5563",
    marginBottom: 12,
  },

  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginBottom: 10,
    gap: 10,
  },

  avatar: {
    width: 36,
    height: 36,
    borderRadius: 20,
    backgroundColor: "#8b5cf6",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },

  authorName: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "600",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  statsRow: {
    flexDirection: "row",
    gap: 15,
  },

  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 13,
    color: "#444",
  },

  nextButton: {
    padding: 8,
    borderRadius: 50,
    backgroundColor: "#f5f3ff",
  },

  buttonWrapper: {
    marginTop: 30,
    alignItems: "center",
    paddingHorizontal: 20,
  },

  bigButton: {
    backgroundColor: "#7c3aed",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 20,
    shadowColor: "#7c3aed",
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },

  bigButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});
