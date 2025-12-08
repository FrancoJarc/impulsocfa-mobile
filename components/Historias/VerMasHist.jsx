import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Modal } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { MotiView } from "moti";
import { ArrowLeft, Eye, Heart, MessageCircle } from "lucide-react-native";
import { Video } from "expo-av";
import { getHistoryById } from "../../services/history.service";
import Comments from "../Comentarios/Comments";

export default function VerMasHist() {
  const { id } = useLocalSearchParams();

  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMedia, setModalMedia] = useState(null);

  // Detectar si un archivo es video
  const isVideo = (url) =>
    url?.toLowerCase().endsWith(".mp4") ||
    url?.toLowerCase().endsWith(".mov") ||
    url?.toLowerCase().endsWith(".avi") ||
    url?.toLowerCase().endsWith(".mkv");

  useEffect(() => {
    async function loadStory() {
      try {
        const data = await getHistoryById(id);

        setStory({
          id_historia: data.id_historia,
          author: data.usuario?.nombre || "Usuario",
          authorImage: data.usuario?.nombre?.charAt(0).toUpperCase() || "U",
          authorBio: data.usuario?.descripcion || "",
          id_campana: data.campana?.id_campana,
          category: data.campana?.titulo || "Historia",
          title: data.titulo,
          fullContent: data.contenido,
          media: [data.archivo1, data.archivo2, data.archivo3].filter(Boolean),
          date: data.fecha_creacion ? new Date(data.fecha_creacion).toLocaleDateString("es-AR") : "",
          views: Math.floor(Math.random() * 4000) + 1000,
          likes: Math.floor(Math.random() * 500) + 50,
        });
      } catch (err) {
        console.log("Error cargando historia:", err);
      } finally {
        setLoading(false);
      }
    }

    loadStory();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#6b4eff" />
        <Text style={{ marginTop: 12, color: "#444" }}>Cargando historia...</Text>
      </View>
    );
  }

  if (!story) {
    return (
      <View style={styles.center}>
        <Text>No se encontró la historia.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={26} color="#6b4eff" />
        </TouchableOpacity>
      </View>

      {/* TITLE */}
      <View style={{ paddingHorizontal: 16, marginBottom: 10 }}>
        <Text style={styles.categoryTag}>{story.category}</Text>
        <Text style={[styles.titleText, { marginTop: 10 }]}>{story.title}</Text>
      </View>

      {/* AUTHOR */}
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 600, delay: 200 }}
        style={styles.authorCard}
      >
        <View style={styles.authorIcon}>
          <Text style={styles.authorLetter}>{story.authorImage}</Text>
        </View>

        <View>
          <Text style={styles.authorName}>{story.author}</Text>
          <Text style={styles.authorBio}>Participante de: {story.category}</Text>
          <Text style={styles.date}>{story.date}</Text>
        </View>
      </MotiView>

      {/* CONTENT */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 700, delay: 250 }}
        style={styles.contentBox}
      >
        {(story.fullContent || "").split("\n").map((p, i) => (
          <Text key={i} style={styles.paragraph}>{p}</Text>
        ))}
      </MotiView>

      {/* MEDIA (VIDEO O FOTO) */}
      {story.media.length > 0 && (
        <View style={styles.multiMediaContainer}>
          {story.media.map((file, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => { setModalMedia(file); setModalVisible(true); }}
              style={styles.mediaWrapper}
            >
              {isVideo(file) ? (
                <Video
                  source={{ uri: file }}
                  style={styles.media}
                  resizeMode="cover"
                  useNativeControls
                />
              ) : (
                <Image
                  source={{ uri: file }}
                  style={styles.media}
                  resizeMode="cover"
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* MODAL */}
      <Modal visible={modalVisible} transparent={true}>
        <TouchableOpacity style={styles.modalContainer} onPress={() => setModalVisible(false)}>
          {isVideo(modalMedia) ? (
            <Video
              source={{ uri: modalMedia }}
              style={styles.fullMedia}
              resizeMode="contain"
              useNativeControls
              shouldPlay
            />
          ) : (
            <Image source={{ uri: modalMedia }} style={styles.fullMedia} resizeMode="contain" />
          )}
        </TouchableOpacity>
      </Modal>

      {/* STATS */}
      <View style={styles.stats}>
        <View style={styles.statBox}>
          <Eye size={18} color="#6b4eff" />
          <Text style={styles.statNumber}>{(story.views / 1000).toFixed(1)}K</Text>
          <Text style={styles.statLabel}>Vistas</Text>
        </View>

        <View style={styles.statBox}>
          <Heart size={18} color="#d90429" />
          <Text style={styles.statNumber}>{story.likes}</Text>
          <Text style={styles.statLabel}>Me encanta</Text>
        </View>
      </View>

      {/* COMMENTS */}
      {story.id_campana ? <Comments id_campana={story.id_campana} /> : null}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f1ff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f1ff",
  },

  header: { flexDirection: "row", paddingHorizontal: 16, paddingVertical: 14 },
  backBtn: { backgroundColor: "#eee", padding: 8, borderRadius: 20 },

  categoryTag: { backgroundColor: "#6b4eff", color: "white", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, fontSize: 12 },

  titleText: { fontSize: 28, fontWeight: "700", color: "#333" },

  authorCard: { flexDirection: "row", backgroundColor: "white", marginHorizontal: 16, padding: 16, borderRadius: 16, elevation: 2, gap: 12 },

  authorIcon: { width: 50, height: 50, borderRadius: 50, backgroundColor: "#7c5cff", justifyContent: "center", alignItems: "center" },
  authorLetter: { fontSize: 22, color: "white", fontWeight: "bold" },

  authorName: { fontSize: 18, fontWeight: "bold" },
  authorBio: { fontSize: 12, color: "#666" },
  date: { fontSize: 10, color: "#999", marginTop: 4 },

  contentBox: { backgroundColor: "white", margin: 16, padding: 18, borderRadius: 16 },
  paragraph: { fontSize: 15, color: "#444", lineHeight: 22, marginBottom: 8 },

  multiMediaContainer: { width: "92%", alignSelf: "center", marginBottom: 25, gap: 12 },
  mediaWrapper: { borderRadius: 16, overflow: "hidden", elevation: 3, marginBottom: 12 },
  media: { width: "100%", height: 260 },

  modalContainer: { flex: 1, backgroundColor: "rgba(0,0,0,0.9)", justifyContent: "center", alignItems: "center" },
  fullMedia: { width: "100%", height: "80%" },

  stats: { flexDirection: "row", justifyContent: "space-around", marginHorizontal: 16, marginBottom: 20 },
  statBox: { backgroundColor: "white", paddingVertical: 14, paddingHorizontal: 20, borderRadius: 16, alignItems: "center", width: "30%" },
  statNumber: { fontSize: 18, fontWeight: "bold", color: "#6b4eff" },
  statLabel: { fontSize: 10, color: "#666" },
});
