import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import { MessageCircle, Send, Trash2, Edit3 } from "lucide-react-native";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { commentService } from "../../services/comment.service";

export default function Comments({ id_campana }) {
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      const saved = await AsyncStorage.getItem("user");
      if (saved) setUser(JSON.parse(saved));
    }
    loadUser();
  }, []);

  async function fetchComentarios() {
    try {
      const data = await commentService.getCommentsByCampaign(id_campana);
      setComentarios(data);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    fetchComentarios();
  }, [id_campana]);

  const handleSubmit = async () => {
    if (!nuevoComentario.trim()) return;

    try {
      setLoading(true);
      await commentService.createComment({
        id_campana,
        contenido: nuevoComentario,
      });
      setNuevoComentario("");
      Toast.show({ type: "success", text1: "Comentario publicado" });
      fetchComentarios();
    } catch (e) {
      Toast.show({ type: "error", text1: "Error al comentar" });
    } finally {
      setLoading(false);
    }
  };

  const saveEdit = async (id_comentario) => {
    try {
      await commentService.updateComment({
        id_comentario,
        contenido: editText,
      });

      Toast.show({ type: "success", text1: "Comentario actualizado" });

      setEditingId(null);
      setEditText("");
      fetchComentarios();
    } catch (e) {
      Toast.show({ type: "error", text1: "Error al editar" });
    }
  };

  const handleDelete = (id_comentario) => {
    Alert.alert(
      "Eliminar comentario",
      "¿Seguro que querés eliminar este comentario?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await commentService.deleteComment(id_comentario);
              Toast.show({ type: "success", text1: "Comentario eliminado" });
              fetchComentarios();
            } catch (e) {
              Toast.show({ type: "error", text1: "Error al eliminar" });
            }
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Título */}
        <View style={styles.header}>
          <MessageCircle size={28} color="#7c3aed" />
          <Text style={styles.headerText}>Comentarios</Text>
        </View>

        {/* Nuevo comentario */}
        <View style={styles.newCommentBox}>
          <TextInput
            value={nuevoComentario}
            onChangeText={setNuevoComentario}
            placeholder="Comparte tu opinión..."
            multiline
            style={styles.textInput}
          />
          <View style={{ alignItems: "flex-end", marginTop: 8 }}>
            <TouchableOpacity
              disabled={loading || !nuevoComentario.trim()}
              onPress={handleSubmit}
              style={styles.sendButton}
            >
              <Send size={18} color="#fff" />
              <Text style={styles.sendButtonText}>
                {loading ? "Publicando..." : "Comentar"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Lista de comentarios */}
        {comentarios.length === 0 ? (
          <View style={styles.emptyBox}>
            <MessageCircle size={48} color="#c4b5fd" />
            <Text style={styles.emptyText}>No hay comentarios aún</Text>
            <Text style={styles.emptySubText}>Sé el primero en comentar</Text>
          </View>
        ) : (
          comentarios.map((c) => (
            <View key={c.id_comentario} style={styles.commentBox}>
              {/* Header */}
              <View style={styles.commentHeader}>
                <View style={styles.commentUser}>
                  <Image
                    source={{
                      uri:
                        c.usuario?.foto_perfil ||
                        "https://ui-avatars.com/api/?name=U&background=7c3aed&color=fff",
                    }}
                    style={styles.avatar}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.userName}>
                      {c.usuario?.nombre} {c.usuario?.apellido}
                    </Text>
                    <Text style={styles.userDate}>
                      {new Date(c.fecha).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </Text>
                  </View>
                </View>

                {user && c.id_usuario === user.id_usuario && (
                  <View style={styles.editDelete}>
                    <TouchableOpacity
                      onPress={() => {
                        setEditingId(c.id_comentario);
                        setEditText(c.contenido);
                      }}
                    >
                      <Edit3 size={20} color="#6366f1" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDelete(c.id_comentario)}
                    >
                      <Trash2 size={20} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* Body */}
              {editingId === c.id_comentario ? (
                <View style={styles.editBox}>
                  <TextInput
                    value={editText}
                    onChangeText={setEditText}
                    multiline
                    style={styles.textInput}
                  />
                  <View style={styles.editButtons}>
                    <TouchableOpacity
                      onPress={() => saveEdit(c.id_comentario)}
                      style={styles.saveButton}
                    >
                      <Text style={styles.saveButtonText}>Guardar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setEditingId(null)}
                      style={styles.cancelButton}
                    >
                      <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <Text style={styles.commentText}>{c.contenido}</Text>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { paddingBottom: 40, paddingHorizontal: 16 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 16, marginTop: 24 },
  headerText: { fontSize: 24, fontWeight: "bold", color: "#7c3aed" },

  newCommentBox: { backgroundColor: "#fff", borderRadius: 20, padding: 16, borderWidth: 1, borderColor: "#ddd", shadowColor: "#000", shadowOffset: {width:0,height:2}, shadowOpacity:0.1, shadowRadius:4, elevation:3 },
  textInput: { minHeight: 100, backgroundColor: "#f9f9f9", borderRadius: 16, padding: 12, borderWidth: 1, borderColor: "#ddd", textAlignVertical: "top" },

  sendButton: { backgroundColor: "#6366f1", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, flexDirection:'row', alignItems:'center' },
  sendButtonText: { color: "#fff", fontWeight: "bold", marginLeft: 6 },

  emptyBox: { alignItems: "center", padding: 40, backgroundColor: "#f3f0ff", borderRadius: 16, borderWidth: 1, borderColor: "#ddd" },
  emptyText: { color: "#888", fontSize: 16, marginTop: 8 },
  emptySubText: { color: "#aaa", fontSize: 14 },

  commentBox: { backgroundColor: "#fff", borderRadius: 20, padding: 16, marginBottom: 12, shadowColor: "#000", shadowOffset: {width:0,height:2}, shadowOpacity:0.05, shadowRadius:4, elevation:2 },
  commentHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8, alignItems: "flex-start" },
  commentUser: { flexDirection: "row", alignItems: "center", flex: 1, gap: 8 },
  avatar: { width: 48, height: 48, borderRadius: 24, borderWidth: 1, borderColor: "#ddd" },
  userName: { fontWeight: "bold", color: "#333" },
  userDate: { fontSize: 12, color: "#888" },
  editDelete: { flexDirection: "row", gap: 8, marginTop: 4 },

  editBox: { backgroundColor: "#f5f3ff", borderRadius: 16, padding: 12 },
  editButtons: { flexDirection: "row", justifyContent: "flex-end", gap: 8, marginTop: 8 },
  saveButton: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: "#6366f1", borderRadius: 16 },
  saveButtonText: { color: "#fff", fontWeight: "bold" },
  cancelButton: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: "#ddd", borderRadius: 16 },
  cancelButtonText: { color: "#333", fontWeight: "bold" },

  commentText: { color: "#333", marginTop: 4, lineHeight: 20 },
});
