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
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },

  scrollContainer: {
    paddingBottom: 40,
    paddingHorizontal: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 28,
  },

  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#7c3aed",
    marginLeft: 8,
  },

  /* NUEVO comentario */
  newCommentBox: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e5e3ff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 22, // más aire bajo el form
  },

  textInput: {
    minHeight: 100,
    backgroundColor: "#f4f3ff",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#d8d6ff",
    textAlignVertical: "top",
    color: "#333",
  },

  sendButton: {
    backgroundColor: "#6366f1",
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  sendButtonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 6,
  },

  /* Cuando NO hay comentarios → una sola tarjeta */
  emptyBox: {
    backgroundColor: "#f7f3ff",
    borderRadius: 20,
    padding: 40,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e8e3ff",
    marginTop: 10,
  },

  emptyText: {
    color: "#7c3aed",
    fontSize: 17,
    fontWeight: "600",
    marginTop: 12,
  },

  emptySubText: {
    color: "#9a96c9",
    fontSize: 14,
    marginTop: 2,
  },

  /* Caja de cada comentario */
  commentBox: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    marginBottom: 16, // más espacio entre comentarios
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#eee",
  },

  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    alignItems: "flex-start",
  },

  commentUser: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 10,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  userName: {
    fontWeight: "600",
    color: "#333",
    fontSize: 15,
  },

  userDate: {
    fontSize: 12,
    color: "#888",
  },

  editDelete: {
    flexDirection: "row",
    gap: 12,
    paddingTop: 4,
  },

  /* Modo edición */
  editBox: {
    backgroundColor: "#f4f2ff",
    borderRadius: 16,
    padding: 14,
    marginTop: 6,
  },

  editButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 10,
  },

  saveButton: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    backgroundColor: "#6366f1",
    borderRadius: 16,
  },

  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
  },

  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#ddd",
    borderRadius: 16,
  },

  cancelButtonText: {
    color: "#333",
    fontWeight: "600",
  },

  commentText: {
    color: "#444",
    marginTop: 6,
    lineHeight: 20,
    fontSize: 15,
  },
});
