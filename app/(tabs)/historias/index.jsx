import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function HistoriasScreen() {
  const router = useRouter();

  const featuredStories = [
    {
      author: "María García",
      title: "Cómo reconstruimos nuestro hogar",
      excerpt:
        "Después de las inundaciones, creíamos que todo estaba perdido. Gracias a esta comunidad, hoy mi familia tiene un nuevo comienzo.",
      image: require("@/assets/images/family-home-reconstruction.jpg"),
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
      image: require("@/assets/images/students-school-learning.jpg"),
      date: "10 de noviembre, 2024",
      views: 1856,
      likes: 745,
      category: "Educación",
    },
  ];

  const reasons = [
    {
      icon: "star",
      title: "Inspira a Otros",
      description:
        "Tu experiencia puede motivar a cientos de personas a tomar acción y hacer la diferencia.",
    },
    {
      icon: "users",
      title: "Crea Comunidad",
      description:
        "Conecta con otras personas que comparten experiencias similares y construye vínculos significativos.",
    },
    {
      icon: "heart",
      title: "Genera Impacto",
      description:
        "Tus palabras pueden motivar nuevas donaciones y expandir el alcance de las campañas.",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* HERO */}
      <View style={styles.hero}>
        <Animated.View entering={FadeInUp.duration(600)}
        style={{ width: "100%", alignItems: "center" }} 
        >
          <View style={styles.iconCircle}>
            <Feather name="heart" size={32} color="#8B5CF6" />
          </View>

          <Text style={styles.heroTitle}>Vidas Transformadas</Text>
          <Text style={styles.heroSubtitle}>
            Descubre historias inspiradoras de personas que recibieron apoyo y transformaron sus vidas. 
          </Text>
        </Animated.View>

        {/* BOTONES */}
        <View style={styles.ctaContainer}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => router.push("/(tabs)/historias/LeerHist")}
          >
            <Feather name="message-square" size={20} color="#fff" />
            <Text style={styles.primaryBtnText}>Leer Historias</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryBtn}>
            <Feather name="share-2" size={20} color="#8B5CF6" />
            <Text style={styles.secondaryBtnText}>Compartir mi Historia</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* HISTORIAS DESTACADAS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Historias Destacadas</Text>

        {featuredStories.map((story, i) => (
          <Animated.View
            key={i}
            entering={FadeInUp.delay(i * 150)}
            style={styles.storyCard}
          >
            <Image source={story.image} style={styles.storyImage} />

            <View style={styles.categoryPill}>
              <Text style={styles.categoryText}>{story.category}</Text>
            </View>

            <View style={styles.storyContent}>
              <Text style={styles.storyDate}>{story.date}</Text>
              <Text style={styles.storyTitle}>{story.title}</Text>
              <Text style={styles.storyExcerpt}>{story.excerpt}</Text>

              <View style={styles.authorRow}>
                <View style={styles.authorAvatar} />
                <Text style={styles.authorName}>{story.author}</Text>
              </View>

              <View style={styles.statsRow}>
                <Text style={styles.stat}>
                  👁 {(story.views / 1000).toFixed(1)}K
                </Text>
                <Text style={styles.stat}>❤️ {story.likes}</Text>
              </View>
            </View>
          </Animated.View>
        ))}
      </View>

      {/* REASONS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>¿Por qué compartir tu historia?</Text>

        {reasons.map((r, i) => (
          <Animated.View
            key={i}
            entering={FadeInUp.delay(i * 150)}
            style={styles.reasonCard}
          >
            <View style={styles.reasonIcon}>
              <Feather name={r.icon} size={26} color="#fff" />
            </View>

            <Text style={styles.reasonTitle}>{r.title}</Text>
            <Text style={styles.reasonDesc}>{r.description}</Text>
          </Animated.View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F5FF" },

  /* HERO */
  hero: {
    padding: 26,
    alignItems: "center",
    paddingTop: 60,
  },
  iconCircle: {
    width: 60,
    height: 60,
    backgroundColor: "#EDE9FE",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#6D28D9",
    textAlign: "center",
  },
  heroSubtitle: {
    color: "#555",
    textAlign: "center",
    fontSize: 16,
    marginTop: 10,
    paddingHorizontal: 10,
  },

  ctaContainer: { marginTop: 28, gap: 14, width: "100%" },
  primaryBtn: {
    flexDirection: "row",
    backgroundColor: "#8B5CF6",
    padding: 16,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  primaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },

  secondaryBtn: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#C4B5FD",
    padding: 16,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  secondaryBtnText: {
    color: "#8B5CF6",
    fontSize: 16,
    fontWeight: "600",
  },

  /* SECTIONS */
  section: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#6D28D9",
    marginBottom: 20,
  },

  /* STORY CARD */
  storyCard: {
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
    elevation: 3,
  },
  storyImage: {
    width: "100%",
    height: 180,
  },
  categoryPill: {
    position: "absolute",
    top: 14,
    right: 14,
    backgroundColor: "#8B5CF6",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  categoryText: { color: "white", fontSize: 12, fontWeight: "600" },

  storyContent: { padding: 16 },
  storyDate: { fontSize: 12, color: "#777" },
  storyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 6,
  },
  storyExcerpt: { fontSize: 14, color: "#555" },

  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  authorAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#C4B5FD",
    marginRight: 10,
  },
  authorName: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
    borderTopWidth: 1,
    borderColor: "#EEE",
    paddingTop: 10,
  },
  stat: { fontSize: 13, color: "#444" },

  /* REASONS */
  reasonCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 18,
    elevation: 3,
  },
  reasonIcon: {
    backgroundColor: "#8B5CF6",
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  reasonTitle: { fontSize: 20, fontWeight: "bold", color: "#333" },
  reasonDesc: { fontSize: 14, color: "#666", marginTop: 6 },
});
