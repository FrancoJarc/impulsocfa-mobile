import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Heart, Share2, MessageCircle, Eye } from "lucide-react-native";

export default function VerMasHist() {
  const story = {
    author: "María García",
    title: "Cómo reconstruimos nuestro hogar",
    date: "15 de noviembre, 2024",
    category: "Hogares",
    views: 2340,
    likes: 892,
    image: "https://picsum.photos/900/600",
    fullContent: `Después de vivir la peor noche de nuestras vidas...`,
    authorImage: "M",
    authorBio: "Profesional en recursos humanos, voluntaria y madre de dos hijos.",
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f3e8ff" }}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.push("/historias/LeerHist")}>
          <ArrowLeft color="#7c3aed" size={22} />
          <Text style={styles.backText}>Volver a historias</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: "row", gap: 12 }}>
          <TouchableOpacity style={styles.iconBtn}>
            <Share2 color="#7c3aed" size={22} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconBtn, { backgroundColor: "#ffe5e5" }]}>
            <Heart color="#ff4b4b" size={22} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Imagen grande Hero */}
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 800 }}
          style={styles.heroContainer}
        >
          <Image source={{ uri: story.image }} style={styles.heroImage} />
          <LinearGradient
            colors={["rgba(0,0,0,0.6)", "transparent"]}
            style={styles.gradientOverlay}
          />

          <View style={styles.heroTextContent}>
            <View style={styles.category}>
              <Text style={styles.categoryText}>{story.category}</Text>
            </View>
            <Text style={styles.heroTitle}>{story.title}</Text>
          </View>
        </MotiView>

        {/* Contenido */}
        <View style={styles.contentWrap}>

          {/* Author */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 800 }}
            style={styles.authorCard}
          >
            <View style={styles.authorAvatar}>
              <Text style={styles.avatarLetter}>{story.authorImage}</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.authorName}>{story.author}</Text>
              <Text style={styles.authorBio}>{story.authorBio}</Text>
              <Text style={styles.authorDate}>{story.date}</Text>
            </View>
          </MotiView>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Eye color="#7c3aed" size={20} />
              <Text style={styles.statNumber}>{(story.views / 1000).toFixed(1)}K</Text>
              <Text style={styles.statLabel}>Visualizaciones</Text>
            </View>

            <View style={styles.statCard}>
              <Heart color="#ff4b4b" size={20} />
              <Text style={[styles.statNumber, { color: "#ff4b4b" }]}>{story.likes}</Text>
              <Text style={styles.statLabel}>Me encanta</Text>
            </View>

            <View style={styles.statCard}>
              <MessageCircle color="#7c3aed" size={20} />
              <Text style={styles.statNumber}>{Math.floor(story.likes / 10)}</Text>
              <Text style={styles.statLabel}>Comentarios</Text>
            </View>
          </View>

          {/* Texto largo */}
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 800 }}
            style={styles.storyCard}
          >
            {story.fullContent.split("\n\n").map((p, i) => (
              <Text key={i} style={styles.storyParagraph}>{p}</Text>
            ))}
          </MotiView>

          {/* Botones */}
          <View style={{ marginTop: 20, gap: 12 }}>
            <TouchableOpacity style={styles.likeButton}>
              <Heart size={20} color="white" />
              <Text style={styles.likeButtonText}>Me encanta esta historia</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shareButton}>
              <Share2 size={20} color="#7c3aed" />
              <Text style={styles.shareButtonText}>Compartir</Text>
            </TouchableOpacity>
          </View>

          {/* Volver */}
          <TouchableOpacity
            style={styles.backBottom}
            onPress={() => router.push("/historias/LeerHist")}
          >
            <ArrowLeft color="#7c3aed" size={20} />
            <Text style={styles.backBottomText}>Volver a todas las historias</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 18,
    backgroundColor: "rgba(255,255,255,0.6)",
    borderBottomWidth: 1,
    borderColor: "#e9d5ff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backdropFilter: "blur(20px)",
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  backText: {
    fontSize: 16,
    color: "#7c3aed",
    fontWeight: "600",
  },
  iconBtn: {
    padding: 8,
    backgroundColor: "#f4f0ff",
    borderRadius: 50,
  },
  heroContainer: {
    marginTop: 10,
    borderRadius: 24,
    overflow: "hidden",
    marginHorizontal: 16,
  },
  heroImage: {
    width: "100%",
    height: 250,
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    height: 120,
    width: "100%",
  },
  heroTextContent: {
    position: "absolute",
    bottom: 16,
    left: 16,
  },
  category: {
    backgroundColor: "rgba(124, 58, 237, 0.9)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 6,
  },
  categoryText: {
    color: "white",
    fontWeight: "700",
    fontSize: 12,
  },
  heroTitle: {
    color: "white",
    fontSize: 26,
    fontWeight: "800",
    maxWidth: "90%",
  },
  contentWrap: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 80,
    gap: 20,
  },
  authorCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 20,
    flexDirection: "row",
    gap: 12,
    borderColor: "#e9d5ff",
    borderWidth: 1,
  },
  authorAvatar: {
    width: 60,
    height: 60,
    borderRadius: 100,
    backgroundColor: "#a78bfa",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLetter: {
    color: "white",
    fontSize: 26,
    fontWeight: "700",
  },
  authorName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4b5563",
  },
  authorBio: {
    fontSize: 14,
    color: "#6b7280",
  },
  authorDate: {
    fontSize: 12,
    color: "#9ca3af",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 20,
    alignItems: "center",
    gap: 4,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#e9d5ff",
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "800",
    color: "#7c3aed",
  },
  statLabel: {
    color: "#6b7280",
    fontSize: 12,
  },
  storyCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e9d5ff",
  },
  storyParagraph: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 24,
    marginBottom: 14,
  },
  likeButton: {
    backgroundColor: "#ff4b4b",
    padding: 16,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  likeButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  shareButton: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#7c3aed",
    padding: 16,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  shareButtonText: {
    color: "#7c3aed",
    fontWeight: "700",
    fontSize: 16,
  },
  backBottom: {
    marginTop: 20,
    alignSelf: "center",
    flexDirection: "row",
    gap: 8,
    padding: 14,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#e9d5ff",
  },
  backBottomText: {
    color: "#7c3aed",
    fontWeight: "700",
    fontSize: 16,
  },
});
