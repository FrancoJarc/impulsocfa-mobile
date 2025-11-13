import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/comments`;

// Función para obtener el token del almacenamiento local
async function getToken() {
  const token = await AsyncStorage.getItem("access_token");
  console.log("TOKEN MOBILE:", token);
  return token;
}

export const commentService = {
  // Crear un comentario
  async createComment({ id_campana, contenido }) {
    try {
      const token = await getToken();
      if (!token) throw new Error("No estás autenticado");

      const res = await fetch(`${API_URL}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id_campana, contenido }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al crear comentario");

      return data;
    } catch (error) {
      throw new Error(error.message || "Error de conexión");
    }
  },

  // Obtener comentarios por campaña
  async getCommentsByCampaign(id_campana) {
    try {
      const res = await fetch(`${API_URL}/campana/${id_campana}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Error al obtener comentarios");
      return data;
    } catch (error) {
      throw new Error(error.message || "Error de conexión");
    }
  },

  // Actualizar un comentario
  async updateComment({ id_comentario, contenido }) {
    try {
      const token = await getToken();
      if (!token) throw new Error("No estás autenticado");

      const res = await fetch(`${API_URL}/${id_comentario}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ contenido }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al actualizar comentario");

      return data;
    } catch (error) {
      throw new Error(error.message || "Error de conexión");
    }
  },

  // Eliminar un comentario
  async deleteComment(id_comentario) {
    try {
      const token = await getToken();
      if (!token) throw new Error("No estás autenticado");

      const res = await fetch(`${API_URL}/${id_comentario}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al eliminar comentario");

      return data;
    } catch (error) {
      throw new Error(error.message || "Error de conexión");
    }
  },
};
