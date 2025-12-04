import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Heart, Eye, MessageCircle, Trash2, Edit } from "lucide-react-native";
import { getHistoryById, deleteHistory } from "../../services/history.service";
import toast from "react-native-toast-message";
import Comments from "../Comentarios/Comments";

export default function VerMasHist() {
  const { id } = useLocalSearchParams();

  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Obtener userId del token para saber si puede editar/eliminar
  const token = null;
  let userId = null;

  try {
    const storedToken = globalThis.localStorage?.getItem("access_token");
    if (storedToken) {
      const payload = JSON.parse(atob(storedToken.split(".")[1]));
      userId = payload.id || payload.sub || payload.userId;
    }
  } catch (err) {
    console.log("Error leyendo token:", err);
  }

  const canEditOrDelete = userId === story?.id_usuario;

  useEffect(() => {
    async function loadStory() {
      try {
        const data = await getHistoryById(id);

        setStory({
          id_historia: data.id_historia,
          id_usuario: data.id_usuario,
          author: data.usuario?.nombre || "Usuario",
          authorImage: data.usuario?.nombre?.charAt(0).toUpperCase() || "U",
          authorBio: data.usuario?.descripcion || "",
          id_campana: data.campana?.id_campana,
          category: data.campana?.titulo || "Historia",
          title: data.titulo,
          fullContent: data.contenido,
          image: data.archivo1,
          date: new Date(data.fecha_creacion).toLocaleDateString("es-AR"),
          views: Math.floor(Math.random() * 4000) + 1000,
          likes: Math.floor(Math.random() * 500) + 50,
        });
      } catch (err) {
        console.log("Error", err);
      } finally {
        setLoading(false);
      }
    }

    loadStory();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Cargando historia...</Text>
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

  const handleDelete = () => {
    toast.show({
      type: "info",
      text1: "¿Eliminar historia?",
      text2: "Esta acción no se puede deshacer",
      onPress: async () => {
        try {
          await deleteHistory(story.id_historia);
          toast.show({ type: "success", text1: "Historia eliminada" });
          router.push("/tushist");
        } catch (err) {
          toast.show({ type: "error", text1: "Error eliminando historia" });
        }
      },
    });
  };

  return (
    <ScrollView style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={26} color="#6b4eff" />
        </TouchableOpacity>

        {canEditOrDelete && (
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={() => router.push(`/edithist/${story.id_historia}`)}
              style={styles.iconBtn}
            >
              <Edit size={22} color="#e0a300" />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleDelete} style={styles.iconBtn}>
              <Trash2 size={22} color="#c70000" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* HERO */}
      <MotiView
        from={{ opacity: 0, translateY: 30 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 600 }}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: story.image }} style={styles.image} />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.6)"]}
            style={styles.gradient}
          />
          <View style={styles.heroText}>
            <Text style={styles.category}>{story.category}</Text>
            <Text style={styles.title}>{story.title}</Text>
          </View>
        </View>
      </MotiView>

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

        <View style={styles.statBox}>
          <MessageCircle size={18} color="#6b4eff" />
          <Text style={styles.statNumber}>{Math.floor(story.likes / 10)}</Text>
          <Text style={styles.statLabel}>Comentarios</Text>
        </View>
      </View>

      {/* CONTENT */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 700, delay: 250 }}
        style={styles.contentBox}
      >
        {story.fullContent.split("\n").map((p, i) => (
          <Text key={i} style={styles.paragraph}>{p}</Text>
        ))}
      </MotiView>
               
<Comments id_campana={story.id_campana} />

                  
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f1ff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: "center",
  },

  backBtn: {
    backgroundColor: "#eee",
    padding: 8,
    borderRadius: 20,
  },

  actions: { flexDirection: "row", gap: 12 },
  iconBtn: { padding: 8, borderRadius: 20, backgroundColor: "#eee" },

  imageContainer: {
    width: "100%",
    height: 280,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
  },

  image: { width: "100%", height: "100%" },
  gradient: { position: "absolute", width: "100%", height: "100%" },

  heroText: {
    position: "absolute",
    bottom: 20,
    left: 20,
  },

  category: {
    backgroundColor: "#6b4eff",
    color: "white",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    fontSize: 12,
    marginBottom: 6,
  },

  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "700",
    width: "90%",
  },

  authorCard: {
    flexDirection: "row",
    backgroundColor: "white",
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    gap: 12,
  },

  authorIcon: {
    width: 50, height: 50, borderRadius: 50,
    backgroundColor: "#7c5cff",
    justifyContent: "center",
    alignItems: "center",
  },

  authorLetter: { fontSize: 22, color: "white", fontWeight: "bold" },
  authorName: { fontSize: 18, fontWeight: "bold" },
  authorBio: { fontSize: 12, color: "#666" },
  date: { fontSize: 10, color: "#999", marginTop: 4 },

  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginTop: 20,
  },

  statBox: {
    backgroundColor: "white",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: "center",
    width: "30%",
  },

  statNumber: { fontSize: 18, fontWeight: "bold", color: "#6b4eff" },
  statLabel: { fontSize: 10, color: "#666" },

  contentBox: {
    backgroundColor: "white",
    margin: 16,
    padding: 18,
    borderRadius: 16,
  },

  paragraph: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
    marginBottom: 8,
  },
});
