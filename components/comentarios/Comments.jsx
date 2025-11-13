import { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import {
    MessageCircle,
    Send,
    Trash2,
    Edit3,
} from "lucide-react-native";
import { commentService } from "../../services/comment.service";

export default function Comments({ id_campana }) {
    const [comentarios, setComentarios] = useState([]);
    const [nuevoComentario, setNuevoComentario] = useState("");
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");
    const [user, setUser] = useState(null);

    useEffect(() => {
        loadUser();
        fetchComentarios();
    }, [id_campana]);

    async function loadUser() {
        const saved = await AsyncStorage.getItem("user");
        if (saved) setUser(JSON.parse(saved));
    }

    async function fetchComentarios() {
        try {
            const data = await commentService.getCommentsByCampaign(id_campana);
            setComentarios(data);
        } catch (err) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "No se pudieron cargar los comentarios",
            });
        }
    }

    const handleSubmit = async () => {
        if (!nuevoComentario.trim()) return;

        try {
            setLoading(true);
            await commentService.createComment({
                id_campana,
                contenido: nuevoComentario,
            });

            await fetchComentarios();
            setNuevoComentario("");

            Toast.show({
                type: "success",
                text1: "Comentario publicado",
            });
        } catch (err) {
            Toast.show({ type: "error", text1: err.message });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (c) => {
        setEditingId(c.id_comentario);
        setEditText(c.contenido);
    };

    const saveEdit = async (id_comentario) => {
        try {
            await commentService.updateComment({
                id_comentario,
                contenido: editText,
            });

            Toast.show({
                type: "success",
                text1: "Comentario actualizado",
            });

            setEditingId(null);
            setEditText("");
            fetchComentarios();
        } catch (err) {
            Toast.show({ type: "error", text1: err.message });
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
                            Toast.show({
                                type: "success",
                                text1: "Comentario eliminado",
                            });
                            fetchComentarios();
                        } catch (err) {
                            Toast.show({ type: "error", text1: err.message });
                        }
                    },
                },
            ]
        );
    };

    return (
        <ScrollView style={styles.container}>
            {/* Título */}
            <View style={styles.titleRow}>
                <MessageCircle size={28} color="#6D28D9" />
                <Text style={styles.title}>Comentarios</Text>
            </View>

            {/* Formulario */}
            <View style={styles.form}>
                <TextInput
                    value={nuevoComentario}
                    onChangeText={setNuevoComentario}
                    placeholder="Comparte tu opinión..."
                    style={styles.textarea}
                    multiline
                />

                <TouchableOpacity
                    disabled={loading || !nuevoComentario.trim()}
                    onPress={handleSubmit}
                    style={[
                        styles.submitBtn,
                        (loading || !nuevoComentario.trim()) && styles.disabledBtn,
                    ]}
                >
                    <Send size={16} color="#FFF" />
                    <Text style={styles.submitText}>
                        {loading ? "Publicando..." : "Comentar"}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Lista */}
            {comentarios.length === 0 ? (
                <View style={styles.emptyBox}>
                    <MessageCircle size={50} color="#C4B5FD" />
                    <Text style={styles.emptyText}>No hay comentarios aún</Text>
                </View>
            ) : (
                comentarios.map((c) => (
                    <View key={c.id_comentario} style={styles.commentCard}>
                        {/* Usuario */}
                        <View style={styles.userRow}>
                            {c.usuario?.foto_perfil && (
                                <Image
                                    source={{ uri: c.usuario.foto_perfil }}
                                    style={styles.avatar}
                                />
                            )}

                            <View style={{ flex: 1 }}>
                                <Text style={styles.userName}>
                                    {c.usuario?.nombre} {c.usuario?.apellido}
                                </Text>
                                <Text style={styles.date}>
                                    {new Date(c.fecha).toLocaleDateString("es-AR")}
                                </Text>
                            </View>

                            {/* Botones editar/eliminar */}
                            {user && c.id_usuario === user.id_usuario && (
                                <View style={styles.actions}>
                                    <TouchableOpacity onPress={() => handleEdit(c)}>
                                        <Edit3 color="#2563EB" size={20} />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => handleDelete(c.id_comentario)}
                                    >
                                        <Trash2 color="#DC2626" size={20} />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>

                        {/* Edición */}
                        {editingId === c.id_comentario ? (
                            <View style={styles.editBox}>
                                <TextInput
                                    value={editText}
                                    onChangeText={setEditText}
                                    multiline
                                    style={styles.editInput}
                                />

                                <View style={styles.editActions}>
                                    <TouchableOpacity
                                        onPress={() => saveEdit(c.id_comentario)}
                                        style={styles.saveBtn}
                                    >
                                        <Text style={styles.saveText}>Guardar</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => setEditingId(null)}
                                        style={styles.cancelBtn}
                                    >
                                        <Text style={styles.cancelText}>Cancelar</Text>
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
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
    },
    titleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#6D28D9",
    },
    form: {
        backgroundColor: "#F5F3FF",
        padding: 12,
        borderRadius: 12,
        marginBottom: 20,
    },
    textarea: {
        minHeight: 80,
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "#C4B5FD",
        borderRadius: 10,
        padding: 10,
        fontSize: 14,
        color: "#333",
    },
    submitBtn: {
        marginTop: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#7C3AED",
        padding: 10,
        borderRadius: 10,
        gap: 6,
    },
    disabledBtn: {
        opacity: 0.5,
    },
    submitText: {
        color: "white",
        fontWeight: "600",
    },
    emptyBox: {
        padding: 30,
        alignItems: "center",
        gap: 10,
    },
    emptyText: {
        color: "#6B7280",
    },
    commentCard: {
        backgroundColor: "white",
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#E9D5FF",
    },
    userRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    userName: {
        fontWeight: "600",
        color: "#111827",
    },
    date: {
        fontSize: 12,
        color: "#6B7280",
    },
    actions: {
        flexDirection: "row",
        gap: 10,
    },
    commentText: {
        color: "#374151",
        lineHeight: 20,
    },
    editBox: {
        marginTop: 10,
        backgroundColor: "#F5F3FF",
        borderRadius: 10,
        padding: 10,
    },
    editInput: {
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "#C4B5FD",
        borderRadius: 10,
        padding: 8,
        minHeight: 60,
    },
    editActions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 10,
        gap: 10,
    },
    saveBtn: {
        backgroundColor: "#7C3AED",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    saveText: { color: "white", fontWeight: "600" },
    cancelBtn: {
        backgroundColor: "#E5E7EB",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    cancelText: {
        color: "#374151",
        fontWeight: "500",
    },
});
