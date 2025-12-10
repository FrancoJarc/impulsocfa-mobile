import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../supabaseClient';

const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/campaigns`;

// 🔹 Helper para obtener el token
async function getToken() {
    const token = await AsyncStorage.getItem('access_token');
    if (!token) throw new Error('No estás autenticado');
    return token;
}

// ✅ Obtener todas las campañas
export async function getAllCampaigns() {
    const token = await getToken();

    const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al obtener campañas');
    return data;
}

// ✅ Obtener campaña por id
export async function getCampaignById(id) {
    const token = await getToken();

    const res = await fetch(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al obtener campaña');
    return data;
}

// ✅ Obtener campañas filtradas por categoría
export async function getCampaignsByCategory(id_categoria, q) {
    const token = await getToken();
    const params = new URLSearchParams();

    if (id_categoria) params.append('id_categoria', id_categoria);
    if (q && q.length >= 3) params.append('q', q);

    const url = `${API_URL}?${params.toString()}`;

    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al obtener campañas');
    return data;
}

// ✅ Crear campaña
export async function createCampaign(campaignData) {
    const token = await getToken();
    const formData = new FormData();

    formData.append('id_categoria', campaignData.id_categoria);
    formData.append('titulo', campaignData.titulo);
    formData.append('descripcion', campaignData.descripcion);
    formData.append('monto_objetivo', campaignData.monto_objetivo);
    formData.append('tiempo_objetivo', campaignData.tiempo_objetivo);
    formData.append('alias', campaignData.alias);
    formData.append('llave_maestra', campaignData.llave_maestra);

    // 📸 Agregar fotos si existen (React Native usa { uri, type, name })
    ['foto1', 'foto2', 'foto3'].forEach((key) => {
        if (campaignData[key]) {
            formData.append(key, {
                uri: campaignData[key].uri,
                name: campaignData[key].name || `${key}.jpg`,
                type: campaignData[key].type || 'image/jpeg',
            });
        }
    });

    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al crear campaña');
    return data;
}

// ✅ Editar campaña
export async function updateCampaign(id, campaignData) {
    const token = await getToken();
    const campaign = await getCampaignById(id);

    const formData = new FormData();

    if (campaign.has_donations) {
        if (campaignData.titulo) formData.append('titulo', campaignData.titulo);
        if (campaignData.descripcion) formData.append('descripcion', campaignData.descripcion);
        if (campaignData.alias) formData.append('alias', campaignData.alias);
    } else {
        Object.entries(campaignData).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, value);
            }
        });
    }

    const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al editar campaña');
    return data;
}

// ✅ Obtener campañas del usuario logueado
export async function getUserCampaigns(userId) {
    const token = await AsyncStorage.getItem("access_token");
    

    const res = await fetch(`${API_URL}?id_usuario=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al obtener campañas');
    return data;
}

// ✅ Suspender campaña
export async function suspendCampaign(id) {
    const token = await getToken();

    const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al suspender campaña');
    return data;
}

// ✅ Obtener usuario actual
export async function getCurrentUser() {
    const token = await getToken();

    const { data, error } = await supabase.auth.getUser(token);
    if (error) throw new Error(error.message);
    return data.user;
}

// ✅ Campañas pendientes del usuario
export async function getUserPendingCampaigns() {
    const token = await getToken();

    const res = await fetch(`${API_URL}/pending/user`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al obtener campañas pendientes');
    return data;
}

// ✅ Campañas rechazadas del usuario
export async function getUserRejectedCampaigns() {
    const token = await getToken();

    const res = await fetch(`${API_URL}/rejected/user`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al obtener campañas rechazadas');
    return data;
}

// ✅ Últimas donaciones
export async function getLatestDonations(id) {
    const token = await getToken();

    const res = await fetch(`${API_URL}/latest/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok) throw new Error('Error al obtener las últimas donaciones');
    return data;
}

// ✅ Donaciones de una campaña específica
export async function getDonationsByCampaignId(id) {
    const token = await getToken();

    const res = await fetch(`${API_URL}/donation/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al obtener las donaciones');
    return data;
}
