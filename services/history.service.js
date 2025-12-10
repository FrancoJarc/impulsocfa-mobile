import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/history`;

// Obtener token
async function getToken() {
  return await AsyncStorage.getItem("access_token");
}

export async function getAllHistories() {
  const res = await fetch(`${API_URL}/`);

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error obteniendo historias");

  return data;
}

export async function getHistoryById(id_historia) {
  const res = await fetch(`${API_URL}/${id_historia}`);

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error obteniendo la historia");

  return data;
}


export async function createHistory(formData) {
  const token = await getToken();
  if (!token) throw new Error("No autenticado");

  const res = await fetch(`${API_URL}/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al crear historia");

  return data;
}


export async function updateHistory(id, data) {
  const token = await AsyncStorage.getItem("access_token");
  if (!token) throw new Error("No autenticado");

  const formData = new FormData();

  // Campos de texto
  formData.append("titulo", data.titulo);
  formData.append("contenido", data.contenido);

  // Archivos opcionales
  ["archivo1", "archivo2", "archivo3"].forEach((key) => {
    const file = data[key];
    if (file && file.uri) {
      formData.append(key, {
        uri: file.uri,
        name: file.fileName || `${key}.jpg`,
        type: file.mimeType || "image/jpeg",
      });
    }
  });

  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    body: formData,
  });

  const json = await res.json();

  if (!res.ok) {
    console.log("Error en updateHistory:", json);
    throw new Error(json.error || "Error al actualizar historia");
  }

  return json;
}



export async function deleteHistory(id_historia) {
  const token = await getToken();
  if (!token) throw new Error("No autenticado");

  const res = await fetch(`${API_URL}/${id_historia}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al eliminar historia");

  return data;
}
export async function getHistoriesByCampaign(id_campana) {
  try {
    const res = await fetch(`${API_URL}/campaign/${id_campana}`);
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Error obteniendo historias de la campaña");

    return data;
  } catch (err) {
    console.error(err);
    return [];
  }
}