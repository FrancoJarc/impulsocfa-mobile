import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/categories`;

// Obtener todas las categorías
export async function getCategories() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Error al obtener las categorías");
    return data;
  } catch (error) {
    throw new Error(error.message || "Error de conexión");
  }
}

// Crear categoría (solo admin)
export async function createCategory(nombre) {
  try {
    if (typeof nombre !== "string" || !nombre.trim()) {
      throw new Error("Nombre inválido");
    }

    const token = await AsyncStorage.getItem("access_token");
    if (!token) throw new Error("No estás autenticado");

    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nombre }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al crear la categoría");

    return data;
  } catch (error) {
    throw new Error(error.message || "Error de conexión");
  }
}

// Editar categoría (solo admin)
export async function updateCategory(id, nombre) {
  try {
    const token = await AsyncStorage.getItem("access_token");
    if (!token) throw new Error("No estás autenticado");

    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nombre }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al editar la categoría");

    return data;
  } catch (error) {
    throw new Error(error.message || "Error de conexión");
  }
}

// Eliminar categoría (solo admin)
export async function deleteCategory(id) {
  try {
    const token = await AsyncStorage.getItem("access_token");
    if (!token) throw new Error("No estás autenticado");

    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al eliminar la categoría");

    return data;
  } catch (error) {
    throw new Error(error.message || "Error de conexión");
  }
}
