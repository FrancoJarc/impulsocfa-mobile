import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/admin`;
const CAMPAIGN_URL = `${process.env.EXPO_PUBLIC_API_URL}/campaigns`;

// Obtener todos los administradores
export async function getAdmins() {
  const token = await AsyncStorage.getItem("access_token");

  const res = await fetch(`${API_URL}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Error al obtener los administradores");
  return await res.json();
}

// Obtener todos los usuarios
export async function getUsers() {
  const token = await AsyncStorage.getItem("access_token");

  const res = await fetch(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Error al obtener los usuarios");
  return await res.json();
}

// Crear un nuevo administrador
export async function createAdmin(adminData) {
  const token = await AsyncStorage.getItem("access_token");

  const res = await fetch(`${API_URL}/create-admin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(adminData),
  });

  if (!res.ok) throw new Error("Error al crear el administrador");
  return await res.json();
}

// Actualizar administrador
export async function updateAdmin(id, updateData) {
  const token = await AsyncStorage.getItem("access_token");

  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updateData),
  });

  if (!res.ok) throw new Error("Error al actualizar el administrador");
  return await res.json();
}

//  Deshabilitar administrador
export async function disableAdmin(id) {
  const token = await AsyncStorage.getItem("access_token");

  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Error al deshabilitar el administrador");
  return await res.json();
}

//  Cambiar estado de un usuario
export async function changeUserState(id, newState) {
  const token = await AsyncStorage.getItem("access_token");

  const res = await fetch(`${API_URL}/user/${id}/state`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ estado_cuenta: newState }),
  });

  if (!res.ok) throw new Error("Error al cambiar el estado del usuario");
  return await res.json();
}

// Obtener campañas pendientes
export async function getPendingCampaigns() {
  const token = await AsyncStorage.getItem("access_token");

  const res = await fetch(`${CAMPAIGN_URL}/pending`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Error al obtener campañas pendientes");
  }

  return await res.json();
}

//  Aprobar o rechazar campaña
export async function approveCampaign(campaignId, estado) {
  if (!["aprobada", "rechazada"].includes(estado)) {
    throw new Error("Estado inválido");
  }

  const token = await AsyncStorage.getItem("access_token");

  const res = await fetch(`${CAMPAIGN_URL}/${campaignId}/approve`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ estado }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al actualizar estado de campaña");

  return data;
}

//  Obtener campaña por ID
export async function getCampaignById(id) {
  const token = await AsyncStorage.getItem("access_token");
  if (!token) throw new Error("No estás autenticado");

  const res = await fetch(`${CAMPAIGN_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al obtener campaña");

  return data;
}
