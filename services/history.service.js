import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/history`;

// Obtener token
async function getToken() {
  return await AsyncStorage.getItem("access_token");
}

//1. Obtener TODAS las historias (NO requiere token)

export async function getAllHistories() {
  const res = await fetch(`${API_URL}/`);

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error obteniendo historias");

  return data;
}

//2. Obtener historia por ID (NO requiere token)

export async function getHistoryById(id_historia) {
  const res = await fetch(`${API_URL}/${id_historia}`);

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error obteniendo la historia");

  return data;
}

//3. Crear historia (token + archivos)
export async function createHistory(historyData) {
  const token = await getToken();
  if (!token) throw new Error("No autenticado");

  const formData = new FormData();

  // Campos comunes
  for (const key in historyData) {
    if (
      historyData[key] !== undefined &&
      historyData[key] !== null &&
      key !== "archivo1" &&
      key !== "archivo2" &&
      key !== "archivo3"
    ) {
      formData.append(key, historyData[key]);
    }
  }

  // Cargar archivos (si existen)
  ["archivo1", "archivo2", "archivo3"].forEach((fileKey) => {
    if (historyData[fileKey]) {
      formData.append(fileKey, {
        uri: historyData[fileKey].uri,
        name: historyData[fileKey].name || `${fileKey}.jpg`,
        type: historyData[fileKey].type || "image/jpeg",
      });
    }
  });

  const res = await fetch(`${API_URL}/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al crear historia");

  return data;
}

//4. Actualizar historia (token + archivos opcionales)

export async function updateHistory(id_historia, updateData) {
  const token = await getToken();
  if (!token) throw new Error("No autenticado");

  const formData = new FormData();

  for (const key in updateData) {
    if (
      updateData[key] !== undefined &&
      updateData[key] !== null &&
      key !== "archivo1" &&
      key !== "archivo2" &&
      key !== "archivo3"
    ) {
      formData.append(key, updateData[key]);
    }
  }

  // Archivos nuevos opcionales
  ["archivo1", "archivo2", "archivo3"].forEach((fileKey) => {
    if (updateData[fileKey]) {
      formData.append(fileKey, {
        uri: updateData[fileKey].uri,
        name: updateData[fileKey].name || `${fileKey}.jpg`,
        type: updateData[fileKey].type || "image/jpeg",
      });
    }
  });

  const res = await fetch(`${API_URL}/${id_historia}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al actualizar historia");

  return data;
}

//5. Eliminar historia (requiere token)

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