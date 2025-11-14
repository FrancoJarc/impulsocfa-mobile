import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

export default function HomeScreen() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Simular verificación de token almacenado
    // En producción, leer desde AsyncStorage o Supabase.auth.getSession()
    setIsLoggedIn(false);
  }, []);

  

  const completedCampaigns = [
    {
      title: "Reconstrucción de Hogares",
      description: "Ayudamos a 150 familias a reconstruir sus hogares después de las inundaciones",
      raised: "$2,500,000",
      image: require("@/assets/images/flooded-neighborhood-bahia-blanca-argentina.jpg"),
      impact: "150 familias",
      icon: "heart",
    },
    {
      title: "Apoyo Educativo",
      description: "Entregamos útiles escolares y mobiliario a 8 escuelas afectadas",
      raised: "$850,000",
      image: require("@/assets/images/school-supplies-children-argentina.jpg"),
      impact: "8 escuelas",
      icon: "users",
    },
    {
      title: "Rehabilitación Comunitaria",
      description: "Restauramos espacios comunitarios para 12 barrios de Bahía Blanca",
      raised: "$1,200,000",
      image: require("@/assets/images/house-reconstruction-argentina-community.jpg"),
      impact: "12 barrios",
      icon: "trending-up",
    },
  ];

  const stats = [
    { value: "500+", label: "Familias Ayudadas" },
    { value: "100%", label: "Transparencia" },
    { value: "3M+", label: "Recaudado" },
    { value: "20+", label: "Campañas Exitosas" },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* HERO */}
      <View style={styles.hero}>
        <Animated.Text entering={FadeInUp.duration(600)} style={styles.title}>
          Impulso <Text style={styles.highlight}>CFA</Text>
        </Animated.Text>

        <Animated.Text entering={FadeInUp.delay(200)} style={styles.subtitle}>
          Juntos reconstruimos vidas. Tu donación transforma proyectos que devuelven esperanza.
        </Animated.Text>

        <TouchableOpacity
          style={styles.donateButton}
          onPress={() => router.push("/Campanas")}
        >
          <Feather name="heart" size={22} color="#fff" />
          <Text style={styles.donateText}>Quiero donar ya!</Text>
        </TouchableOpacity>
      </View>

      {/* STATS */}
      <View style={styles.statsContainer}>
        {stats.map((item, i) => (
          <Animated.View key={i} entering={FadeInUp.delay(100 * i)} style={styles.statBox}>
            <Text style={styles.statValue}>{item.value}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </Animated.View>
        ))}
      </View>

      {/* FEATURES */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>¿Por qué elegirnos?</Text>
        <View style={styles.featuresContainer}>
          {[
            { icon: "shield", title: "100% Seguro", desc: "Encriptación de datos y transparencia total." },
            { icon: "users", title: "Impacto Real", desc: "Cada peso llega directamente a las familias." },
            { icon: "check-circle", title: "Transparencia Total", desc: "Seguimiento en tiempo real de donaciones." },
          ].map((f, i) => (
            <Animated.View key={i} entering={FadeInUp.delay(100 * i)} style={styles.featureBox}>
              <Feather name={f.icon as any} size={30} color="#7C3AED" />

              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </Animated.View>
          ))}
        </View>
      </View>

      {/* CAMPAIGNS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Campañas Finalizadas</Text>
        {completedCampaigns.map((c, i) => (
          <Animated.View key={i} entering={FadeInUp.delay(100 * i)} style={styles.campaignCard}>
            <Image source={c.image} style={styles.campaignImage} />
            <View style={styles.campaignContent}>
              <View style={styles.impactRow}>
                <Feather name={c.icon as any} size={16} color="#7C3AED" />
                <Text style={styles.impactText}>{c.impact}</Text>
              </View>
              <Text style={styles.campaignTitle}>{c.title}</Text>
              <Text style={styles.campaignDesc}>{c.description}</Text>
              <Text style={styles.raisedText}>Recaudado: {c.raised}</Text>
            </View>
          </Animated.View>
        ))}
      </View>

      {/* CTA */}
      <View style={styles.ctaSection}>
        <Text style={styles.ctaTitle}>Tu ayuda puede cambiar vidas hoy</Text>
        <Text style={styles.ctaSubtitle}>Cada donación cuenta. Sé parte del cambio que se necesita.</Text>
        <TouchableOpacity
          style={styles.donateButton}
          onPress={() => router.push("/Campanas")}
        >
          <Text style={styles.donateText}>Donar Ahora</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F5FF" },
  hero: { alignItems: "center", justifyContent: "center", paddingVertical: 60, paddingHorizontal: 20 },
  title: { fontSize: 42, fontWeight: "bold", color: "#6D28D9" },
  highlight: { color: "#3B82F6" },
  subtitle: { textAlign: "center", fontSize: 18, color: "#555", marginVertical: 20 },
  donateButton: {
    backgroundColor: "#8B5CF6",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 14,
    shadowColor: "#8B5CF6",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 3,
  },
  donateText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  statsContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginVertical: 20 },
  statBox: {
    backgroundColor: "white",
    borderRadius: 12,
    margin: 8,
    padding: 16,
    width: "40%",
    alignItems: "center",
    shadowColor: "#7C3AED",
    shadowOpacity: 0.1,
    elevation: 2,
  },
  statValue: { fontSize: 22, fontWeight: "700", color: "#6D28D9" },
  statLabel: { fontSize: 13, color: "#666", marginTop: 4 },
  section: { padding: 20 },
  sectionTitle: { fontSize: 26, fontWeight: "700", textAlign: "center", color: "#6D28D9", marginBottom: 20 },
  featuresContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 16 },
  featureBox: {
    backgroundColor: "white",
    width: "90%",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#7C3AED",
    shadowOpacity: 0.1,
    elevation: 2,
  },
  featureTitle: { fontSize: 18, fontWeight: "600", marginTop: 8, color: "#333" },
  featureDesc: { textAlign: "center", fontSize: 14, color: "#555", marginTop: 4 },
  campaignCard: {
    backgroundColor: "white",
    borderRadius: 16,
    marginVertical: 10,
    overflow: "hidden",
    shadowColor: "#7C3AED",
    shadowOpacity: 0.1,
    elevation: 3,
  },
  campaignImage: { width: "100%", height: 180 },
  campaignContent: { padding: 16 },
  impactRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  impactText: { color: "#6D28D9", fontSize: 13 },
  campaignTitle: { fontSize: 18, fontWeight: "700", color: "#111", marginTop: 8 },
  campaignDesc: { fontSize: 14, color: "#555", marginTop: 4 },
  raisedText: { fontSize: 14, color: "#6D28D9", fontWeight: "600", marginTop: 8 },
  ctaSection: { alignItems: "center", padding: 30, backgroundColor: "white", margin: 20, borderRadius: 20 },
  ctaTitle: { fontSize: 22, fontWeight: "700", color: "#222", textAlign: "center", marginBottom: 10 },
  ctaSubtitle: { fontSize: 16, color: "#666", textAlign: "center", marginBottom: 20 },
});
