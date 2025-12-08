import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../supabaseClient";

const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/user`;

//  Obtener usuario actual
export async function getCurrentUser() {
  const userJson = await AsyncStorage.getItem("user");

  if (!userJson) {
    throw new Error("No hay usuario guardado");
  }

  return JSON.parse(userJson); 
}

//  Actualizar perfil del usuario
export async function updateUserProfile(profileData) {
  const token = await AsyncStorage.getItem("access_token");
  if (!token) throw new Error("No estás autenticado");

  const formData = new FormData();

  for (const key in profileData) {
    if (key === "foto_perfil") {
      const foto = profileData[key];
      if (foto && typeof foto === "object" && foto.uri) {
        formData.append("foto_perfil", {
          uri: foto.uri,
          name: "perfil.jpg",
          type: "image/jpeg",
        });
      }
      continue;
    }

    if (profileData[key] !== null && profileData[key] !== undefined) {
      formData.append(key, profileData[key]);
    }
  }

  const res = await fetch(API_URL, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al actualizar perfil");

  return data;
}

//  Deshabilitar cuenta
export async function disableUserAccount() {
  const token = await AsyncStorage.getItem("access_token");
  if (!token) throw new Error("No estás autenticado");

  const res = await fetch(`${API_URL}/disable`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al deshabilitar la cuenta");

  return data;
}

//  Obtener total recibido por todas las campañas
export async function getUserTotal() {
  const token = await AsyncStorage.getItem("access_token");
  if (!token) throw new Error("No estás autenticado");

  const res = await fetch(`${API_URL}/total`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al obtener el total recibido");

  return data;
}

// Obtener total recibido por una campaña específica
export async function getUserTotalByCampaign(id_campana) {
  const token = await AsyncStorage.getItem("access_token");
  if (!token) throw new Error("No estás autenticado");

  const res = await fetch(`${API_URL}/total/${id_campana}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al obtener el total de la campaña");

  return data;
}
